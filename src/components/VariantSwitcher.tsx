import { type CSSProperties, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useVariantContext } from "../provider/VariantProvider";
import { ArrowLeftSolid, ArrowRightSolid } from "./switcher/icons";
import { AutoWidthSelect } from "./switcher/AutoWidthSelect";

export interface VariantSwitcherProps {
  className?: string;
  style?: CSSProperties;
}

function SwitcherContent({ className, style }: VariantSwitcherProps) {
  const { groups, groupOrder, activeGroupId, setActive, setActiveGroup, previousOption, nextOption } =
    useVariantContext();

  const enabledGroupOrder = useMemo(
    () => groupOrder.filter((id) => !groups[id]?.disabled),
    [groupOrder, groups]
  );

  const resolvedGroupId = activeGroupId ?? enabledGroupOrder[0];
  const activeGroup = resolvedGroupId ? groups[resolvedGroupId] : undefined;

  const activeOptionIndex = useMemo(() => {
    if (!activeGroup || !activeGroup.activeOptionId) return 0;
    const index = activeGroup.options.findIndex((o) => o.id === activeGroup.activeOptionId);
    return index >= 0 ? index + 1 : 0;
  }, [activeGroup]);

  if (!activeGroup || activeGroup.options.length === 0) return null;

  const activeOption =
    activeGroup.options.find((o) => o.id === activeGroup.activeOptionId) ?? activeGroup.options[0];
  if (!activeOption) return null;
  const optionsCount = activeGroup.options.length;

  const rootClassName = className ? `rvs-root ${className}` : "rvs-root";

  const switcherNode = (
    <div className={rootClassName} style={style} role="region" aria-label="Variant switcher">
      <button
        type="button"
        aria-label="Previous variant"
        className="rvs-nav-btn"
        onClick={() => previousOption(activeGroup.id)}
      >
        <ArrowLeftSolid />
      </button>

      <div className="rvs-divider rvs-divider-left" />

      {enabledGroupOrder.length > 1 ? (
        <AutoWidthSelect
          value={activeGroup.id}
          displayText={activeGroup.name ?? activeGroup.id}
          onChange={setActiveGroup}
        >
          {enabledGroupOrder.map((groupId) => {
            const group = groups[groupId];
            return (
              <option key={groupId} value={groupId}>
                {group?.name ?? groupId}
              </option>
            );
          })}
        </AutoWidthSelect>
      ) : null}

      {activeGroup.options.length > 1 ? (
        <AutoWidthSelect
          value={activeOption.id}
          displayText={activeOption.label}
          onChange={(val) => setActive(activeGroup.id, val)}
          hasPrefix
          prefix={
            <span className="rvs-counter">
              {activeOptionIndex}/{optionsCount}
            </span>
          }
        >
          {activeGroup.options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </AutoWidthSelect>
      ) : (
        <span className="rvs-badge">{activeOption.label}</span>
      )}

      <div className="rvs-divider rvs-divider-right" />

      <button
        type="button"
        aria-label="Next variant"
        className="rvs-nav-btn"
        onClick={() => nextOption(activeGroup.id)}
      >
        <ArrowRightSolid />
      </button>
    </div>
  );

  if (typeof document === "undefined" || !document.body) return switcherNode;

  return createPortal(<div className="rvs-portal">{switcherNode}</div>, document.body);
}

export function VariantSwitcher({ className, style }: VariantSwitcherProps) {
  const { registerSwitcher, unregisterSwitcher } = useVariantContext();

  useEffect(() => {
    registerSwitcher();
    return unregisterSwitcher;
  }, [registerSwitcher, unregisterSwitcher]);

  return <SwitcherContent className={className} style={style} />;
}

export function AutoSwitcher() {
  const { hasCustomSwitcher } = useVariantContext();
  if (hasCustomSwitcher) return null;
  return <SwitcherContent />;
}
