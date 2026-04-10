const hasBrowserApi = (): boolean => {
  return typeof window !== "undefined" && typeof window.location !== "undefined";
};

export const readSelectionsFromUrl = (prefix: string): Record<string, string> => {
  if (!hasBrowserApi()) {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const entries = [...params.entries()].filter(([key, value]) => {
    return key.startsWith(prefix) && value.length > 0;
  });

  return Object.fromEntries(entries.map(([key, value]) => [key.slice(prefix.length), value]));
};

export const writeSelectionsToUrl = (prefix: string, selections: Record<string, string>): void => {
  if (!hasBrowserApi() || typeof history === "undefined" || typeof history.replaceState !== "function") {
    return;
  }

  const params = new URLSearchParams(window.location.search);

  for (const key of [...params.keys()]) {
    if (key.startsWith(prefix)) {
      params.delete(key);
    }
  }

  Object.entries(selections).forEach(([groupId, optionId]) => {
    params.set(`${prefix}${groupId}`, optionId);
  });

  const nextQuery = params.toString();
  const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash}`;
  history.replaceState(null, "", nextUrl);
};
