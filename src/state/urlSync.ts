const hasBrowserApi = (): boolean => {
  return typeof window !== "undefined" && typeof window.location !== "undefined";
};

export const readSelectionFromUrl = (paramName: string): string | undefined => {
  if (!hasBrowserApi()) {
    return undefined;
  }

  const value = new URLSearchParams(window.location.search).get(paramName);
  return value && value.length > 0 ? value : undefined;
};

export const writeSelectionsToUrl = (
  selections: Record<string, string>,
  resolveParamName: (groupId: string) => string
): void => {
  if (!hasBrowserApi() || typeof history === "undefined" || typeof history.replaceState !== "function") {
    return;
  }

  const params = new URLSearchParams(window.location.search);

  Object.entries(selections).forEach(([groupId, optionId]) => {
    params.set(resolveParamName(groupId), optionId);
  });

  const nextQuery = params.toString();
  const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash}`;
  history.replaceState(null, "", nextUrl);
};
