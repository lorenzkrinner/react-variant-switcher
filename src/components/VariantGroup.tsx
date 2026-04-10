import { useEffect, type ReactNode } from "react";
import { GroupProvider } from "./GroupContext";
import { useVariantContext } from "../provider/VariantProvider";

export interface VariantGroupProps {
  id: string;
  title?: string;
  children: ReactNode;
}

export function VariantGroup({ id, title, children }: VariantGroupProps) {
  const { registerGroup, unregisterGroup } = useVariantContext();

  useEffect(() => {
    registerGroup(id, title);
    return () => unregisterGroup(id);
  }, [id, registerGroup, title, unregisterGroup]);

  return <GroupProvider value={id}>{children}</GroupProvider>;
}
