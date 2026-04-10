import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import { loadSelectionsFromStorage, saveSelectionsToStorage } from "../state/persistence";
import { readSelectionFromUrl, writeSelectionsToUrl } from "../state/urlSync";
import { VariantSwitcher } from "../components/VariantSwitcher";
import { GroupSwitcherOverlay } from "../components/GroupSwitcherOverlay";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

export interface VariantOptionDefinition {
  id: string;
  label: string;
  order: number;
  isDefault: boolean;
}

export interface VariantGroupDefinition {
  id: string;
  name: string;
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
  groupName: string;
  option: VariantOptionDefinition;
}

interface VariantContextValue {
  groups: Record<string, VariantGroupDefinition>;
  groupOrder: string[];
  activeGroupId?: string;
  isSwitcherVisible: boolean;
  isDisabled: boolean;
  registerGroup: (groupId: string, name: string, title?: string) => void;
  unregisterGroup: (groupId: string) => void;
  registerOption: (input: RegisterOptionInput) => void;
  unregisterOption: (groupId: string, optionId: string) => void;
  setActive: (groupId: string, optionId: string) => void;
  nextOption: (groupId: string) => void;
  previousOption: (groupId: string) => void;
  setActiveGroup: (groupId: string) => void;
  setSwitcherVisible: (visible: boolean) => void;
  groupSwitcherOpen: boolean;
  previewGroupId: string | undefined;
}

export interface VariantProviderProps {
  children: ReactNode;
  disabled?: boolean;
  defaultGroupId?: string;
  showSwitcher?: boolean;
  enablePersistence?: boolean;
  storageKey?: string;
  syncWithUrl?: boolean;
  urlParamNames?: Record<string, string>;
  enableKeyboardShortcuts?: boolean;
}

const VariantContext = createContext<VariantContextValue | null>(null);

const DEFAULT_STORAGE_KEY = "react_variant_switcher_config";

const getDefaultSwitcherVisibility = (): boolean => {
  const maybeNodeProcess = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process;
  return maybeNodeProcess?.env?.NODE_ENV !== "production";
};

const resolveActiveOption = (
  options: VariantOptionDefinition[],
  currentActiveOptionId: string | undefined,
  preferredOptionId?: string,
  preferPreferredOverCurrent = false
): string | undefined => {
  if (options.length === 0) {
    return undefined;
  }

  const hasCurrentActiveOption =
    !!currentActiveOptionId && options.some((option) => option.id === currentActiveOptionId);

  if (!preferPreferredOverCurrent && hasCurrentActiveOption) {
    return currentActiveOptionId;
  }

  if (preferredOptionId && options.some((option) => option.id === preferredOptionId)) {
    return preferredOptionId;
  }

  const explicitDefaultOption = options.find((option) => option.isDefault);
  if (explicitDefaultOption) {
    return explicitDefaultOption.id;
  }

  if (preferPreferredOverCurrent && hasCurrentActiveOption) {
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
  name: string,
  title: string | undefined
): VariantStore => {
  const existingGroup = store.groups[groupId];
  const nextGroup: VariantGroupDefinition = existingGroup
    ? { ...existingGroup, name, title: title ?? existingGroup.title }
    : { id: groupId, name, title, options: [] };

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
  disabled = false,
  defaultGroupId,
  showSwitcher,
  enablePersistence = true,
  storageKey = DEFAULT_STORAGE_KEY,
  syncWithUrl = false,
  urlParamNames,
  enableKeyboardShortcuts = true
}: VariantProviderProps) {
  const [store, setStore] = useState<VariantStore>({
    groups: {},
    groupOrder: [],
    activeGroupId: defaultGroupId
  });
  const [hasUserChangedSelection, setHasUserChangedSelection] = useState(false);
  const hasUserChangedSelectionRef = useRef(false);
  const [isSwitcherVisible, setSwitcherVisible] = useState(showSwitcher ?? getDefaultSwitcherVisibility());
  const [groupSwitcherOpen, setGroupSwitcherOpen] = useState(false);
  const [previewGroupId, setPreviewGroupId] = useState<string | undefined>(undefined);

  const resolveUrlParamName = useCallback((groupName: string) => {
    return urlParamNames?.[groupName] ?? groupName;
  }, [urlParamNames]);

  const getInitialSelectionForGroup = useCallback((groupId: string, groupName: string): string | undefined => {
    if (syncWithUrl) {
      const selectionFromUrl = readSelectionFromUrl(resolveUrlParamName(groupName));
      if (selectionFromUrl) {
        return selectionFromUrl;
      }
    }

    if (enablePersistence) {
      const persistedSelections = loadSelectionsFromStorage(storageKey);
      return persistedSelections[groupId];
    }

    return undefined;
  }, [enablePersistence, resolveUrlParamName, storageKey, syncWithUrl]);

  useEffect(() => {
    if (showSwitcher !== undefined) {
      setSwitcherVisible(showSwitcher);
    }
  }, [showSwitcher]);

  const registerGroup = useCallback((groupId: string, name: string, title?: string) => {
    setStore((currentStore) => {
      const updatedStore = upsertGroup(currentStore, groupId, name, title);

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

  const registerOption = useCallback(({ groupId, groupName, option }: RegisterOptionInput) => {
    setStore((currentStore) => {
      const storeWithGroup = upsertGroup(currentStore, groupId, groupName, undefined);
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
        activeOptionId: resolveActiveOption(
          nextOptions,
          group.activeOptionId,
          getInitialSelectionForGroup(groupId, group.name),
          !hasUserChangedSelectionRef.current
        )
      };

      return {
        ...storeWithGroup,
        groups: {
          ...storeWithGroup.groups,
          [groupId]: nextGroup
        }
      };
    });
  }, [getInitialSelectionForGroup]);

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
        activeOptionId: resolveActiveOption(
          nextOptions,
          group.activeOptionId,
          getInitialSelectionForGroup(groupId, group.name),
          !hasUserChangedSelectionRef.current
        )
      };

      return {
        ...currentStore,
        groups: {
          ...currentStore.groups,
          [groupId]: nextGroup
        }
      };
    });
  }, [getInitialSelectionForGroup]);

  const setActive = useCallback((groupId: string, optionId: string) => {
    hasUserChangedSelectionRef.current = true;
    setHasUserChangedSelection(true);
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
    hasUserChangedSelectionRef.current = true;
    setHasUserChangedSelection(true);
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
    hasUserChangedSelectionRef.current = true;
    setHasUserChangedSelection(true);
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
    const selections = Object.fromEntries(
      Object.entries(store.groups)
        .map(([groupId, group]) => [groupId, group.activeOptionId] as const)
        .filter((entry): entry is [string, string] => typeof entry[1] === "string")
    );

    if (enablePersistence && hasUserChangedSelection) {
      saveSelectionsToStorage(storageKey, selections);
    }

    if (syncWithUrl && hasUserChangedSelection) {
      const urlSelections = Object.fromEntries(
        Object.values(store.groups)
          .map((group) => {
            const activeOptionId = selections[group.id];
            if (!activeOptionId) {
              return undefined;
            }

            return [group.name, activeOptionId] as const;
          })
          .filter((entry): entry is [string, string] => Array.isArray(entry))
      );
      writeSelectionsToUrl(urlSelections, resolveUrlParamName);
    }
  }, [
    enablePersistence,
    hasUserChangedSelection,
    resolveUrlParamName,
    storageKey,
    store.groups,
    syncWithUrl
  ]);

  useKeyboardShortcuts({
    enabled: enableKeyboardShortcuts && !disabled,
    activeGroupId: store.activeGroupId,
    groupOrder: store.groupOrder,
    previousOption,
    nextOption,
    setSwitcherVisible,
    setActiveGroup,
    setGroupSwitcherOpen,
    setPreviewGroupId,
  });

  const contextValue = useMemo<VariantContextValue>(() => {
    return {
      groups: store.groups,
      groupOrder: store.groupOrder,
      activeGroupId: store.activeGroupId,
      isSwitcherVisible,
      isDisabled: disabled,
      registerGroup,
      unregisterGroup,
      registerOption,
      unregisterOption,
      setActive,
      nextOption,
      previousOption,
      setActiveGroup,
      setSwitcherVisible,
      groupSwitcherOpen,
      previewGroupId,
    };
  }, [
    isSwitcherVisible,
    disabled,
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
    unregisterOption,
    groupSwitcherOpen,
    previewGroupId,
  ]);

  return (
    <VariantContext.Provider value={contextValue}>
      {children}
      {!disabled && isSwitcherVisible ? <VariantSwitcher /> : null}
      {!disabled && <GroupSwitcherOverlay />}
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
