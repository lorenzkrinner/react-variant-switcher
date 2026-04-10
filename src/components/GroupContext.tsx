import { createContext, useContext } from "react";

interface GroupContextValue {
  groupId: string;
  groupName: string;
  groupDisabled: boolean;
}

const GroupContext = createContext<GroupContextValue | null>(null);

export const GroupProvider = GroupContext.Provider;

export const useCurrentGroup = (): GroupContextValue => {
  const groupValue = useContext(GroupContext);
  if (!groupValue) {
    throw new Error("<Option /> must be rendered inside a <VariantGroup />.");
  }
  return groupValue;
};
