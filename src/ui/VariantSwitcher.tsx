import { useMemo } from "react";
import { useVariantContext } from "../provider/VariantProvider";

export function VariantSwitcher() {
  const { groups, groupOrder, activeGroupId, setActiveGroup, previousOption, nextOption } =
    useVariantContext();

  const resolvedGroupId = activeGroupId ?? groupOrder[0];
  const activeGroup = resolvedGroupId ? groups[resolvedGroupId] : undefined;

  const activeOptionIndex = useMemo(() => {
    if (!activeGroup || !activeGroup.activeOptionId) {
      return 0;
    }
    const index = activeGroup.options.findIndex((option) => option.id === activeGroup.activeOptionId);
    return index >= 0 ? index + 1 : 0;
  }, [activeGroup]);

  if (!activeGroup || activeGroup.options.length === 0) {
    return null;
  }

  const activeOption =
    activeGroup.options.find((option) => option.id === activeGroup.activeOptionId) ?? activeGroup.options[0];
  if (!activeOption) {
    return null;
  }
  const optionsCount = activeGroup.options.length;

  return (
    <div className="rvs-switcher" role="region" aria-label="Variant switcher">
      {groupOrder.length > 1 ? (
        <label className="rvs-group-select-wrapper">
          <span className="rvs-visually-hidden">Active group</span>
          <select
            className="rvs-group-select"
            value={activeGroup.id}
            onChange={(event) => setActiveGroup(event.target.value)}
          >
            {groupOrder.map((groupId) => {
              const group = groups[groupId];
              return (
                <option key={groupId} value={groupId}>
                  {group?.title ?? group?.name ?? groupId}
                </option>
              );
            })}
          </select>
        </label>
      ) : null}

      <button
        type="button"
        aria-label="Previous variant"
        className="rvs-nav-button"
        onClick={() => previousOption(activeGroup.id)}
      >
        {"<"}
      </button>

      <div className="rvs-label">
        <strong className="rvs-counter">
          {activeOptionIndex}/{optionsCount}
        </strong>
        <span className="rvs-option-name">{activeOption.label}</span>
      </div>

      <button
        type="button"
        aria-label="Next variant"
        className="rvs-nav-button"
        onClick={() => nextOption(activeGroup.id)}
      >
        {">"}
      </button>
    </div>
  );
}
