import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode
} from "react";
import { loadSelectionsFromStorage, saveSelectionsToStorage } from "../state/persistence";
import { readSelectionsFromUrl, writeSelectionsToUrl } from "../state/urlSync";
import { VariantSwitcher } from "../ui/VariantSwitcher";

export interface VariantOptionDefinition {
  id: string;
  label: string;
  order: number;
}

export interface VariantGroupDefinition {
  id: string;
  title?: string;
  options: VariantOptionDefinition[];
  activeOptionId?: string;
}

interface VariantStore {
  groups: Record<string, VariantGroupDefinition>;
  groupOrder: string[];
  activeGroupId?: string;
}

interface RegisterOptionInput {
  groupId: string;
  option: VariantOptionDefinition;
}

interface VariantContextValue {
  groups: Record<string, VariantGroupDefinition>;
  groupOrder: string[];
  activeGroupId?: string;
  isSwitcherVisible: boolean;
  registerGroup: (groupId: string, title?: string) => void;
  unregisterGroup: (groupId: string) => void;
  registerOption: (input: RegisterOptionInput) => void;
  unregisterOption: (groupId: string, optionId: string) => void;
  setActive: (groupId: string, optionId: string) => void;
  nextOption: (groupId: string) => void;
  previousOption: (groupId: string) => void;
  setActiveGroup: (groupId: string) => void;
  setSwitcherVisible: (visible: boolean) => void;
}

export interface VariantProviderProps {
  children: ReactNode;
  defaultGroupId?: string;
  showSwitcher?: boolean;
  enablePersistence?: boolean;
  storageKey?: string;
  syncWithUrl?: boolean;
  urlParamPrefix?: string;
  enableKeyboardShortcuts?: boolean;
  keyboardToggleKey?: string;
}

const VariantContext = createContext<VariantContextValue | null>(null);

const DEFAULT_STORAGE_KEY = "react-variant-switcher:selections";
const DEFAULT_URL_PREFIX = "rvs_";
const DEFAULT_KEYBOARD_TOGGLE_KEY = "v";

const isInputLikeElement = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable
  );
};

const getDefaultSwitcherVisibility = (): boolean => {
  const maybeNodeProcess = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process;
  return maybeNodeProcess?.env?.NODE_ENV !== "production";
};

const resolveActiveOption = (
  options: VariantOptionDefinition[],
  currentActiveOptionId: string | undefined
): string | undefined => {
  if (options.length === 0) {
    return undefined;
  }

  if (currentActiveOptionId && options.some((option) => option.id === currentActiveOptionId)) {
    return currentActiveOptionId;
  }

  return options[0]?.id;
};

const sortOptionsByOrder = (options: VariantOptionDefinition[]): VariantOptionDefinition[] => {
  return [...options].sort((left, right) => left.order - right.order);
};

const upsertGroup = (
  store: VariantStore,
  groupId: string,
  title: string | undefined
): VariantStore => {
  const existingGroup = store.groups[groupId];
  const nextGroup: VariantGroupDefinition = existingGroup
    ? { ...existingGroup, title: title ?? existingGroup.title }
    : { id: groupId, title, options: [] };

  const nextGroups = {
    ...store.groups,
    [groupId]: nextGroup
  };
  const hasGroupInOrder = store.groupOrder.includes(groupId);
  const nextGroupOrder = hasGroupInOrder ? store.groupOrder : [...store.groupOrder, groupId];
  const nextActiveGroupId =
    store.activeGroupId ??
    (store.groupOrder.length === 0 ? groupId : store.groupOrder[0]) ??
    groupId;

  return {
    ...store,
    groups: nextGroups,
    groupOrder: nextGroupOrder,
    activeGroupId: nextActiveGroupId
  };
};

const cycleOption = (group: VariantGroupDefinition, direction: 1 | -1): string | undefined => {
  const optionCount = group.options.length;
  if (optionCount === 0) {
    return group.activeOptionId;
  }

  const currentIndex = group.options.findIndex((option) => option.id === group.activeOptionId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextIndex = (safeIndex + direction + optionCount) % optionCount;
  return group.options[nextIndex]?.id;
};

export function VariantProvider({
  children,
  defaultGroupId,
  showSwitcher,
  enablePersistence = true,
  storageKey = DEFAULT_STORAGE_KEY,
  syncWithUrl = false,
  urlParamPrefix = DEFAULT_URL_PREFIX,
  enableKeyboardShortcuts = true,
  keyboardToggleKey = DEFAULT_KEYBOARD_TOGGLE_KEY
}: VariantProviderProps) {
  const [store, setStore] = useState<VariantStore>({
    groups: {},
    groupOrder: [],
    activeGroupId: defaultGroupId
  });
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSwitcherVisible, setSwitcherVisible] = useState(showSwitcher ?? getDefaultSwitcherVisibility());

  useEffect(() => {
    if (showSwitcher !== undefined) {
      setSwitcherVisible(showSwitcher);
    }
  }, [showSwitcher]);

  useEffect(() => {
    const selections = {
      ...(enablePersistence ? loadSelectionsFromStorage(storageKey) : {}),
      ...(syncWithUrl ? readSelectionsFromUrl(urlParamPrefix) : {})
    };

    if (Object.keys(selections).length > 0) {
      setStore((currentStore) => {
        const nextGroups = Object.fromEntries(
          Object.entries(currentStore.groups).map(([groupId, group]) => {
            return [
              groupId,
              {
                ...group,
                activeOptionId: selections[groupId] ?? group.activeOptionId
              }
            ];
          })
        );

        return {
          ...currentStore,
          groups: nextGroups
        };
      });
    }

    setIsHydrated(true);
  }, [enablePersistence, storageKey, syncWithUrl, urlParamPrefix]);

  const registerGroup = useCallback((groupId: string, title?: string) => {
    setStore((currentStore) => {
      const updatedStore = upsertGroup(currentStore, groupId, title);

      if (defaultGroupId && updatedStore.groupOrder.includes(defaultGroupId)) {
        return {
          ...updatedStore,
          activeGroupId: defaultGroupId
        };
      }

      return updatedStore;
    });
  }, [defaultGroupId]);

  const unregisterGroup = useCallback((groupId: string) => {
    setStore((currentStore) => {
      if (!currentStore.groups[groupId]) {
        return currentStore;
      }

      const nextGroups = { ...currentStore.groups };
      delete nextGroups[groupId];

      const nextGroupOrder = currentStore.groupOrder.filter((id) => id !== groupId);
      const fallbackGroupId = defaultGroupId && nextGroupOrder.includes(defaultGroupId)
        ? defaultGroupId
        : nextGroupOrder[0];

      return {
        ...currentStore,
        groups: nextGroups,
        groupOrder: nextGroupOrder,
        activeGroupId:
          currentStore.activeGroupId === groupId ? fallbackGroupId : currentStore.activeGroupId
      };
    });
  }, [defaultGroupId]);

  const registerOption = useCallback(({ groupId, option }: RegisterOptionInput) => {
    setStore((currentStore) => {
      const storeWithGroup = upsertGroup(currentStore, groupId, undefined);
      const group = storeWithGroup.groups[groupId];
      if (!group) {
        return storeWithGroup;
      }

      const nextOptions = sortOptionsByOrder(
        group.options.some((candidate) => candidate.id === option.id)
          ? group.options.map((candidate) => (candidate.id === option.id ? option : candidate))
          : [...group.options, option]
      );

      const nextGroup: VariantGroupDefinition = {
        ...group,
        options: nextOptions,
        activeOptionId: resolveActiveOption(nextOptions, group.activeOptionId)
      };

      return {
        ...storeWithGroup,
        groups: {
          ...storeWithGroup.groups,
          [groupId]: nextGroup
        }
      };
    });
  }, []);

  const unregisterOption = useCallback((groupId: string, optionId: string) => {
    setStore((currentStore) => {
      const group = currentStore.groups[groupId];
      if (!group) {
        return currentStore;
      }

      const nextOptions = group.options.filter((option) => option.id !== optionId);
      const nextGroup: VariantGroupDefinition = {
        ...group,
        options: nextOptions,
        activeOptionId: resolveActiveOption(nextOptions, group.activeOptionId)
      };

      return {
        ...currentStore,
        groups: {
          ...currentStore.groups,
          [groupId]: nextGroup
        }
      };
    });
  }, []);

  const setActive = useCallback((groupId: string, optionId: string) => {
    setStore((currentStore) => {
      const group = currentStore.groups[groupId];
      if (!group) {
        return currentStore;
      }

      if (!group.options.some((option) => option.id === optionId)) {
        return currentStore;
      }

      return {
        ...currentStore,
        groups: {
          ...currentStore.groups,
          [groupId]: {
            ...group,
            activeOptionId: optionId
          }
        }
      };
    });
  }, []);

  const nextOption = useCallback((groupId: string) => {
    setStore((currentStore) => {
      const group = currentStore.groups[groupId];
      if (!group) {
        return currentStore;
      }

      const nextOptionId = cycleOption(group, 1);
      if (!nextOptionId || nextOptionId === group.activeOptionId) {
        return currentStore;
      }

      return {
        ...currentStore,
        groups: {
          ...currentStore.groups,
          [groupId]: {
            ...group,
            activeOptionId: nextOptionId
          }
        }
      };
    });
  }, []);

  const previousOption = useCallback((groupId: string) => {
    setStore((currentStore) => {
      const group = currentStore.groups[groupId];
      if (!group) {
        return currentStore;
      }

      const nextOptionId = cycleOption(group, -1);
      if (!nextOptionId || nextOptionId === group.activeOptionId) {
        return currentStore;
      }

      return {
        ...currentStore,
        groups: {
          ...currentStore.groups,
          [groupId]: {
            ...group,
            activeOptionId: nextOptionId
          }
        }
      };
    });
  }, []);

  const setActiveGroup = useCallback((groupId: string) => {
    setStore((currentStore) => {
      if (!currentStore.groups[groupId]) {
        return currentStore;
      }

      return {
        ...currentStore,
        activeGroupId: groupId
      };
    });
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const selections = Object.fromEntries(
      Object.entries(store.groups)
        .map(([groupId, group]) => [groupId, group.activeOptionId] as const)
        .filter((entry): entry is [string, string] => typeof entry[1] === "string")
    );

    if (enablePersistence) {
      saveSelectionsToStorage(storageKey, selections);
    }

    if (syncWithUrl) {
      writeSelectionsToUrl(urlParamPrefix, selections);
    }
  }, [enablePersistence, isHydrated, storageKey, store.groups, syncWithUrl, urlParamPrefix]);

  useEffect(() => {
    if (!enableKeyboardShortcuts) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (isInputLikeElement(event.target)) {
        return;
      }

      const activeGroupId = store.activeGroupId;
      if (!activeGroupId) {
        return;
      }

      if (event.shiftKey && event.key.toLowerCase() === keyboardToggleKey.toLowerCase()) {
        event.preventDefault();
        setSwitcherVisible((currentValue) => !currentValue);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousOption(activeGroupId);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        nextOption(activeGroupId);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enableKeyboardShortcuts, keyboardToggleKey, nextOption, previousOption, store.activeGroupId]);

  const contextValue = useMemo<VariantContextValue>(() => {
    return {
      groups: store.groups,
      groupOrder: store.groupOrder,
      activeGroupId: store.activeGroupId,
      isSwitcherVisible,
      registerGroup,
      unregisterGroup,
      registerOption,
      unregisterOption,
      setActive,
      nextOption,
      previousOption,
      setActiveGroup,
      setSwitcherVisible
    };
  }, [
    isSwitcherVisible,
    nextOption,
    previousOption,
    registerGroup,
    registerOption,
    setActive,
    setActiveGroup,
    store.activeGroupId,
    store.groupOrder,
    store.groups,
    unregisterGroup,
    unregisterOption
  ]);

  return (
    <VariantContext.Provider value={contextValue}>
      {children}
      {isSwitcherVisible ? <VariantSwitcher /> : null}
    </VariantContext.Provider>
  );
}

export const useVariantContext = (): VariantContextValue => {
  const context = useContext(VariantContext);
  if (!context) {
    throw new Error("react-variant-switcher components must be used inside VariantProvider.");
  }
  return context;
};

export const onVariantSwitcherKeyDown = (
  event: ReactKeyboardEvent<HTMLDivElement>,
  groupId: string,
  nextOption: (id: string) => void,
  previousOption: (id: string) => void
) => {
  if (event.key === "ArrowLeft") {
    previousOption(groupId);
  } else if (event.key === "ArrowRight") {
    nextOption(groupId);
  }
};
