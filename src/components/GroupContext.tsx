import { createContext, useContext } from "react";

const GroupContext = createContext<string | null>(null);

export const GroupProvider = GroupContext.Provider;

export const useCurrentGroupId = (): string => {
  const groupId = useContext(GroupContext);
  if (!groupId) {
    throw new Error("<Option /> must be rendered inside a <VariantGroup />.");
  }
  return groupId;
};
