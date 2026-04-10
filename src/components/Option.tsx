import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useCurrentGroupId } from "./GroupContext";
import { useVariantContext } from "../provider/VariantProvider";

let optionOrderCounter = 0;

export interface OptionProps {
  id: string;
  label?: string;
  children: ReactNode;
}

export function Option({ id, label, children }: OptionProps) {
  const groupId = useCurrentGroupId();
  const { groups, registerOption, unregisterOption } = useVariantContext();
  const orderRef = useRef<number>(optionOrderCounter++);

  const normalizedLabel = useMemo(() => label ?? id, [id, label]);

  useEffect(() => {
    registerOption({
      groupId,
      option: {
        id,
        label: normalizedLabel,
        order: orderRef.current
      }
    });

    return () => unregisterOption(groupId, id);
  }, [groupId, id, normalizedLabel, registerOption, unregisterOption]);

  const group = groups[groupId];
  const isVisible = group?.activeOptionId === id;

  if (!isVisible) {
    return null;
  }

  return <>{children}</>;
}
