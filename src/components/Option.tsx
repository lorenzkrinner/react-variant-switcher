import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useCurrentGroup } from "./GroupContext";
import { useVariantContext } from "../provider/VariantProvider";

let optionOrderCounter = 0;

export interface OptionProps {
  id: string;
  label?: string;
  default?: boolean;
  children: ReactNode;
}

export function Option({ id, label, default: isDefault = false, children }: OptionProps) {
  const { groupId, groupName } = useCurrentGroup();
  const { groups, registerOption, unregisterOption } = useVariantContext();
  const orderRef = useRef<number>(optionOrderCounter++);

  const normalizedLabel = useMemo(() => label ?? id, [id, label]);

  useEffect(() => {
    registerOption({
      groupId,
      groupName,
      option: {
        id,
        label: normalizedLabel,
        order: orderRef.current,
        isDefault
      }
    });

    return () => unregisterOption(groupId, id);
  }, [groupId, groupName, id, isDefault, normalizedLabel, registerOption, unregisterOption]);

  const group = groups[groupId];
  const isVisible = group?.activeOptionId === id;

  if (!isVisible) {
    return null;
  }

  return <>{children}</>;
}
