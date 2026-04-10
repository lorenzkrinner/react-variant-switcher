import { useMemo, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useVariantContext } from "../provider/VariantProvider";

const FALLBACK_FIXED_STYLE: CSSProperties = {
  position: "fixed",
  left: "50%",
  bottom: "20px",
  transform: "translateX(-50%)",
  zIndex: 9999
};

const FALLBACK_SWITCHER_STYLE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  padding: "8px 12px",
  borderRadius: "9999px",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  background: "rgba(30, 31, 35, 0.65)",
  color: "#ffffff",
  backdropFilter: "blur(16px)",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.32)",
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
};

const FALLBACK_BUTTON_STYLE: CSSProperties = {
  appearance: "none",
  border: 0,
  borderRadius: "9999px",
  width: "24px",
  height: "24px",
  cursor: "pointer",
  color: "#f6f6f6",
  background: "transparent",
  fontSize: "13px",
  lineHeight: 1
};

const FALLBACK_LABEL_STYLE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "12px",
  whiteSpace: "nowrap"
};

const FALLBACK_COUNTER_STYLE: CSSProperties = {
  fontSize: "14px",
  opacity: 0.9
};

const FALLBACK_OPTION_NAME_STYLE: CSSProperties = {
  fontSize: "14px",
  lineHeight: 1.2,
  fontWeight: 500
};

const FALLBACK_SELECT_STYLE: CSSProperties = {
  appearance: "none",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "9999px",
  background: "rgba(255, 255, 255, 0.06)",
  color: "#fff",
  padding: "3px 10px",
  fontSize: "12px"
};

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

  const switcherNode = (
    <div className="rvs-switcher" style={FALLBACK_SWITCHER_STYLE} role="region" aria-label="Variant switcher">
      {groupOrder.length > 1 ? (
        <label className="rvs-group-select-wrapper">
          <span className="rvs-visually-hidden">Active group</span>
          <select
            className="rvs-group-select"
            style={FALLBACK_SELECT_STYLE}
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
        style={FALLBACK_BUTTON_STYLE}
        onClick={() => previousOption(activeGroup.id)}
      >
        {"<"}
      </button>

      <div className="rvs-label" style={FALLBACK_LABEL_STYLE}>
        <strong className="rvs-counter" style={FALLBACK_COUNTER_STYLE}>
          {activeOptionIndex}/{optionsCount}
        </strong>
        <span className="rvs-option-name" style={FALLBACK_OPTION_NAME_STYLE}>
          {activeOption.label}
        </span>
      </div>

      <button
        type="button"
        aria-label="Next variant"
        className="rvs-nav-button"
        style={FALLBACK_BUTTON_STYLE}
        onClick={() => nextOption(activeGroup.id)}
      >
        {">"}
      </button>
    </div>
  );

  if (typeof document === "undefined" || !document.body) {
    return switcherNode;
  }

  return createPortal(
    <div style={FALLBACK_FIXED_STYLE}>
      {switcherNode}
    </div>,
    document.body
  );
}
