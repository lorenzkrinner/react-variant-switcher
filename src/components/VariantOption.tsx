import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useCurrentGroup } from "./GroupContext";
import { useVariantContext } from "../provider/VariantProvider";

let optionOrderCounter = 0;

export interface VariantOptionProps {
  id: string;
  label?: string;
  default?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

export function VariantOption({
  id,
  label,
  default: isDefault = false,
  disabled = false,
  children
}: VariantOptionProps) {
  const { groupId, groupName } = useCurrentGroup();
  const { groups, registerOption, unregisterOption } = useVariantContext();
  const orderRef = useRef<number>(optionOrderCounter++);

  const normalizedLabel = useMemo(() => label ?? id, [id, label]);

  useEffect(() => {
    if (disabled) {
      return;
    }
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
  }, [
    disabled,
    groupId,
    groupName,
    id,
    isDefault,
    normalizedLabel,
    registerOption,
    unregisterOption
  ]);

  if (disabled) {
    return null;
  }

  const group = groups[groupId];
  const isVisible = group?.activeOptionId === id;

  if (!isVisible) {
    return null;
  }

  return <>{children}</>;
}
