import { useEffect, useId, useRef, type ReactNode } from "react";
import { GroupProvider } from "./GroupContext";
import { useVariantContext } from "../provider/VariantProvider";

export interface VariantGroupProps {
  name: string;
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

export function VariantGroup({ name, disabled = false, children }: VariantGroupProps) {
  const { registerGroup, unregisterGroup } = useVariantContext();
  const reactId = useId();
  const internalIdRef = useRef(`${toSlug(name) || "variant-group"}-${reactId.replace(/[:]/g, "")}`);

  useEffect(() => {
    const internalId = internalIdRef.current;
    registerGroup(internalId, name, disabled);
    return () => unregisterGroup(internalId);
  }, [disabled, name, registerGroup, unregisterGroup]);

  return (
    <GroupProvider value={{ groupId: internalIdRef.current, groupName: name }}>
      {children}
    </GroupProvider>
  );
}
