import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useCurrentGroup } from "./GroupContext";
import { useVariantContext } from "../provider/VariantProvider";

let optionOrderCounter = 0;

export interface VariantOptionProps {
  name: string;
  label?: string;
  default?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

export function VariantOption({
  name,
  label,
  default: isDefault = false,
  disabled = false,
  children
}: VariantOptionProps) {
  const { groupId, groupName } = useCurrentGroup();
  const { groups, registerOption, unregisterOption } = useVariantContext();
  const orderRef = useRef<number>(optionOrderCounter++);

  const normalizedLabel = useMemo(() => label ?? name, [name, label]);

  useEffect(() => {
    if (disabled) {
      return;
    }
    registerOption({
      groupId,
      groupName,
      option: {
        name,
        label: normalizedLabel,
        order: orderRef.current,
        isDefault
      }
    });

    return () => unregisterOption(groupId, name);
  }, [
    disabled,
    groupId,
    groupName,
    name,
    isDefault,
    normalizedLabel,
    registerOption,
    unregisterOption
  ]);

  if (disabled) {
    return null;
  }

  const group = groups[groupId];
  const isVisible = group?.activeOptionName === name;

  if (!isVisible) {
    return null;
  }

  return <>{children}</>;
}
