import { useMemo } from "react";
import { useVariantContext } from "../provider/VariantProvider";

export function useVariant(groupId: string) {
  const { groups, setActive, nextOption, previousOption, setActiveGroup } = useVariantContext();
  const group = groups[groupId];

  return useMemo(() => {
    if (!group) {
      return {
        groupId,
        title: undefined,
        options: [],
        activeOptionId: undefined,
        activeOption: undefined,
        setActive: () => undefined,
        next: () => undefined,
        previous: () => undefined,
        focus: () => undefined
      };
    }

    return {
      groupId: group.id,
      title: group.title,
      options: group.options,
      activeOptionId: group.activeOptionId,
      activeOption: group.options.find((option) => option.id === group.activeOptionId),
      setActive: (optionId: string) => setActive(groupId, optionId),
      next: () => nextOption(groupId),
      previous: () => previousOption(groupId),
      focus: () => setActiveGroup(groupId)
    };
  }, [group, groupId, nextOption, previousOption, setActive, setActiveGroup]);
}
