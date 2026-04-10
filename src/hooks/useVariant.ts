import { useMemo } from "react";
import { useVariantContext } from "../provider/VariantProvider";

export function useVariant(groupName: string) {
  const { groups, setActive, nextOption, previousOption, setActiveGroup } = useVariantContext();

  const group = useMemo(
    () => Object.values(groups).find((g) => g.name === groupName),
    [groups, groupName]
  );

  return useMemo(() => {
    if (!group) {
      return {
        groupName,
        groupId: undefined,
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
      groupName: group.name,
      groupId: group.id,
      options: group.options,
      activeOptionId: group.activeOptionId,
      activeOption: group.options.find((option) => option.id === group.activeOptionId),
      setActive: (optionId: string) => setActive(group.id, optionId),
      next: () => nextOption(group.id),
      previous: () => previousOption(group.id),
      focus: () => setActiveGroup(group.id)
    };
  }, [group, groupName, nextOption, previousOption, setActive, setActiveGroup]);
}
