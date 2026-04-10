import { useEffect, useRef } from "react";

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

interface UseKeyboardShortcutsOptions {
  enabled: boolean;
  activeGroupId: string | undefined;
  groupOrder: string[];
  previousOption: (groupId: string) => void;
  nextOption: (groupId: string) => void;
  setSwitcherVisible: (updater: (current: boolean) => boolean) => void;
  setActiveGroup: (groupId: string) => void;
  setGroupSwitcherOpen: (open: boolean) => void;
  setPreviewGroupId: (groupId: string) => void;
}

export function useKeyboardShortcuts({
  enabled,
  activeGroupId,
  groupOrder,
  previousOption,
  nextOption,
  setSwitcherVisible,
  setActiveGroup,
  setGroupSwitcherOpen,
  setPreviewGroupId,
}: UseKeyboardShortcutsOptions) {
  const isSwitchingGroupsRef = useRef(false);
  const previewGroupIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (isInputLikeElement(event.target)) {
        return;
      }

      // ⌘H — toggle switcher visibility
      if (event.metaKey && event.code === "KeyH") {
        event.preventDefault();
        setSwitcherVisible((current) => !current);
        return;
      }

      if (!activeGroupId || groupOrder.length === 0) {
        return;
      }

      // ⌥S — open group switcher and cycle
      if (event.altKey && event.code === "KeyS") {
        event.preventDefault();

        const startId = previewGroupIdRef.current ?? activeGroupId;
        const currentIndex = groupOrder.indexOf(startId);
        const nextIndex = (currentIndex + 1) % groupOrder.length;
        const nextGroupId = groupOrder[nextIndex];
        if (!nextGroupId) return;

        previewGroupIdRef.current = nextGroupId;
        isSwitchingGroupsRef.current = true;
        setPreviewGroupId(nextGroupId);
        setGroupSwitcherOpen(true);
        return;
      }

      // ⌥← / ⌥→ — switch variant
      if (event.altKey && event.key === "ArrowLeft") {
        event.preventDefault();
        previousOption(activeGroupId);
      } else if (event.altKey && event.key === "ArrowRight") {
        event.preventDefault();
        nextOption(activeGroupId);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      // Alt released — confirm group selection
      if (event.key === "Alt" && isSwitchingGroupsRef.current) {
        isSwitchingGroupsRef.current = false;
        const confirmedGroupId = previewGroupIdRef.current;
        previewGroupIdRef.current = undefined;
        setGroupSwitcherOpen(false);
        if (confirmedGroupId) {
          setActiveGroup(confirmedGroupId);
        }
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [
    enabled,
    activeGroupId,
    groupOrder,
    previousOption,
    nextOption,
    setSwitcherVisible,
    setActiveGroup,
    setGroupSwitcherOpen,
    setPreviewGroupId,
  ]);
}
