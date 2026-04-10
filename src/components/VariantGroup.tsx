import { useEffect, useId, useRef, type ReactNode } from "react";
import { GroupProvider } from "./GroupContext";
import { useVariantContext } from "../provider/VariantProvider";

export interface VariantGroupProps {
  name: string;
  title?: string;
  disabled?: boolean;
  children: ReactNode;
}

const toSlug = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
};

export function VariantGroup({ name, title, disabled = false, children }: VariantGroupProps) {
  const { registerGroup, unregisterGroup, isDisabled: providerDisabled } = useVariantContext();
  const reactId = useId();
  const internalIdRef = useRef(`${toSlug(name) || "variant-group"}-${reactId.replace(/[:]/g, "")}`);

  useEffect(() => {
    if (providerDisabled || disabled) {
      return;
    }
    const internalId = internalIdRef.current;
    registerGroup(internalId, name, title);
    return () => unregisterGroup(internalId);
  }, [disabled, name, providerDisabled, registerGroup, title, unregisterGroup]);

  return (
    <GroupProvider value={{ groupId: internalIdRef.current, groupName: name, groupDisabled: disabled }}>
      {children}
    </GroupProvider>
  );
}
