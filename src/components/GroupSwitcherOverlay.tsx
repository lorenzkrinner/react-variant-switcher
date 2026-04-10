import { createPortal } from "react-dom";
import { useVariantContext } from "../provider/VariantProvider";

export function GroupSwitcherOverlay() {
  const { groups, groupOrder, groupSwitcherOpen, previewGroupId, activeGroupId } =
    useVariantContext();

  const enabledGroupOrder = groupOrder.filter((id) => !groups[id]?.disabled);

  if (!groupSwitcherOpen || enabledGroupOrder.length < 2) {
    return null;
  }

  const overlay = (
    <div className="rvs-overlay" role="listbox" aria-label="Switch group">
      {enabledGroupOrder.map((groupId) => {
        const group = groups[groupId];
        if (!group) return null;

        const isPreview = groupId === previewGroupId;
        const isCurrent = groupId === activeGroupId;

        const className =
          isCurrent && !isPreview
            ? "rvs-overlay-option rvs-overlay-option-current"
            : "rvs-overlay-option";

        return (
          <div key={groupId} role="option" aria-selected={isPreview} className={className}>
            {group.name}
          </div>
        );
      })}
    </div>
  );

  if (typeof document === "undefined" || !document.body) {
    return overlay;
  }

  return createPortal(
    <div className="rvs-overlay-portal">{overlay}</div>,
    document.body
  );
}
