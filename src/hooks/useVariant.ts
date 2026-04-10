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
        activeOptionName: undefined,
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
      activeOptionName: group.activeOptionName,
      activeOption: group.options.find((option) => option.name === group.activeOptionName),
      setActive: (optionName: string) => setActive(group.id, optionName),
      next: () => nextOption(group.id),
      previous: () => previousOption(group.id),
      focus: () => setActiveGroup(group.id)
    };
  }, [group, groupName, nextOption, previousOption, setActive, setActiveGroup]);
}
