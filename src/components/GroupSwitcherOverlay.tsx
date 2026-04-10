import { createPortal } from "react-dom";
import { useVariantContext } from "../provider/VariantProvider";

export function GroupSwitcherOverlay() {
  const { groups, groupOrder, groupSwitcherOpen, previewGroupId, activeGroupId } =
    useVariantContext();

  if (!groupSwitcherOpen || groupOrder.length < 2) {
    return null;
  }

  const overlay = (
    <div
      className="flex flex-col gap-1 p-2 rounded-xl border border-white/15 bg-[rgba(30,31,35,0.85)] backdrop-blur-xl shadow-2xl font-[Inter,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] min-w-[180px]"
      role="listbox"
      aria-label="Switch group"
    >
      {groupOrder.map((groupId) => {
        const group = groups[groupId];
        if (!group) return null;

        const isPreview = groupId === previewGroupId;
        const isCurrent = groupId === activeGroupId;

        return (
          <div
            key={groupId}
            role="option"
            aria-selected={isPreview}
            className={
              "px-3.5 py-2 rounded-lg text-sm font-medium transition-[background,color] duration-100" +
              (isPreview
                ? " bg-white/15 text-white"
                : isCurrent
                  ? " text-white/85"
                  : " text-white/60")
            }
          >
            {group.title ?? group.name}
          </div>
        );
      })}
    </div>
  );

  if (typeof document === "undefined" || !document.body) {
    return overlay;
  }

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-[10000] pointer-events-none">
      {overlay}
    </div>,
    document.body
  );
}
