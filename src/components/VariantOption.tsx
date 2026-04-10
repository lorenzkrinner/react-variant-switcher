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
  const { groupId, groupName, groupDisabled } = useCurrentGroup();
  const { groups, registerOption, unregisterOption, isDisabled: providerDisabled } = useVariantContext();
  const orderRef = useRef<number>(optionOrderCounter++);
  const effectiveDisabled = providerDisabled || groupDisabled || disabled;

  const normalizedLabel = useMemo(() => label ?? id, [id, label]);

  useEffect(() => {
    if (effectiveDisabled) {
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
    effectiveDisabled,
    groupId,
    groupName,
    id,
    isDefault,
    normalizedLabel,
    registerOption,
    unregisterOption
  ]);

  const group = groups[groupId];
  const isVisible = effectiveDisabled || group?.activeOptionId === id;

  if (!isVisible) {
    return null;
  }

  return <>{children}</>;
}

export type OptionProps = VariantOptionProps;
export const Option = VariantOption;
