import { type CSSProperties, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { NavArrowDown, NavArrowLeftSolid, NavArrowRightSolid } from "iconoir-react";
import { useVariantContext } from "../provider/VariantProvider";

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
      className={
        "inline-flex h-fit w-fit shrink-0 items-center justify-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-900 p-1 font-sans text-white shadow-xl backdrop-blur-md" +
        (className ? ` ${className}` : "")
      }
      style={style}
      role="region"
      aria-label="Variant switcher"
    >
      <button
        type="button"
        aria-label="Previous variant"
        className="inline-flex size-7 cursor-pointer appearance-none items-center justify-center rounded-full border-0 bg-transparent leading-none text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
        onClick={() => previousOption(activeGroup.id)}
      >
        <NavArrowLeftSolid className="size-4" />
      </button>
  
      <div className="h-4 w-px -ml-1 mr-1 bg-zinc-800" />

      {enabledGroupOrder.length > 1 ? (
        <label className="group relative inline-flex items-center">
          <select
            className="appearance-none rounded-full bg-white/5 py-0.5 pl-2.5 pr-6 text-xs text-zinc-300 transition-colors focus-visible:outline-0 field-sizing-content"
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
          <NavArrowDown className="pointer-events-none absolute right-2 size-3 text-zinc-400 transition-colors group-hover:text-zinc-200" />
        </label>
      ) : null}
  
      {activeGroup.options.length > 1 ? (
        <label className="group relative inline-flex items-center">
          <span className="absolute left-2 text-[10px] font-mono font-normal text-zinc-400">
            {activeOptionIndex}/{optionsCount}
          </span>
          <select
            className="appearance-none rounded-full bg-white/5 py-0.5 pr-6 pl-8 text-xs text-zinc-400 transition-colors group-hover:text-zinc-200 focus-visible:outline-0 field-sizing-content"
            value={activeOption.id}
            onChange={(event) => {
              setActive(activeGroup.id, event.target.value);
              event.target.blur();
            }}
          >
            {activeGroup.options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <NavArrowDown className="pointer-events-none absolute right-2 size-3 text-zinc-400 transition-colors group-hover:text-zinc-200" />
        </label>
      ) : (
        <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-normal tracking-normal text-zinc-400">
          {activeOption.label}
        </span>
      )}
  
      <div className="h-4 w-px ml-1 -mr-1 bg-zinc-800" />
  
      <button
        type="button"
        aria-label="Next variant"
        className="inline-flex size-7 cursor-pointer appearance-none items-center justify-center rounded-full border-0 bg-transparent leading-none text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
        onClick={() => nextOption(activeGroup.id)}
      >
        <NavArrowRightSolid className="size-4" />
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
