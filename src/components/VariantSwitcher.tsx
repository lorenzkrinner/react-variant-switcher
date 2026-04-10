import { type CSSProperties, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useVariantContext } from "../provider/VariantProvider";

export interface VariantSwitcherProps {
  className?: string;
  style?: CSSProperties;
}

function SwitcherContent({ className, style }: VariantSwitcherProps) {
  const { groups, groupOrder, activeGroupId, setActiveGroup, previousOption, nextOption } =
    useVariantContext();

  const enabledGroupOrder = useMemo(
    () => groupOrder.filter((id) => !groups[id]?.disabled),
    [groupOrder, groups]
  );

  const resolvedGroupId = activeGroupId ?? enabledGroupOrder[0];
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
    <div
      className={"inline-flex items-center gap-2.5 px-3 py-2 rounded-full border border-white/20 bg-black/80 text-white backdrop-blur-md shadow-xl font-[Inter,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]" + (className ? ` ${className}` : "")}
      style={style}
      role="region"
      aria-label="Variant switcher"
    >
      {enabledGroupOrder.length > 1 ? (
        <label className="inline-flex">
          <span className="sr-only">Active group</span>
          <select
            className="appearance-none border border-white/20 rounded-full bg-white/5 text-white px-2.5 py-0.5 text-xs"
            value={activeGroup.id}
            onChange={(event) => {
              setActiveGroup(event.target.value);
              event.target.blur();
            }}
          >
            {enabledGroupOrder.map((groupId) => {
              const group = groups[groupId];
              return (
                <option key={groupId} value={groupId}>
                  {group?.name ?? groupId}
                </option>
              );
            })}
          </select>
        </label>
      ) : null}

      <button
        type="button"
        aria-label="Previous variant"
        className="appearance-none border-0 rounded-full w-6 h-6 cursor-pointer text-neutral-100 bg-transparent text-[13px] leading-none hover:bg-white/15"
        onClick={() => previousOption(activeGroup.id)}
      >
        {"<"}
      </button>

      <div className="inline-flex items-center gap-3 whitespace-nowrap">
        <strong className="text-sm opacity-90">
          {activeOptionIndex}/{optionsCount}
        </strong>
        <span className="text-sm leading-tight font-medium">
          {activeOption.label}
        </span>
      </div>

      <button
        type="button"
        aria-label="Next variant"
        className="appearance-none border-0 rounded-full w-6 h-6 cursor-pointer text-neutral-100 bg-transparent text-[13px] leading-none hover:bg-white/15"
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
    <div className="fixed left-1/2 bottom-5 -translate-x-1/2 z-10000">
      {switcherNode}
    </div>,
    document.body
  );
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
