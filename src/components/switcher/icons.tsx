const size = { width: 16, height: 16 };

export function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} style={size} className={className}>
      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowLeftSolid() {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={size}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.287 18.6929C15.5673 18.5768 15.75 18.3033 15.75 18V5.99998C15.75 5.69663 15.5673 5.42315 15.287 5.30707C15.0068 5.19098 14.6842 5.25515 14.4697 5.46965L8.46967 11.4696C8.17678 11.7625 8.17678 12.2374 8.46967 12.5303L14.4697 18.5303C14.6842 18.7448 15.0068 18.809 15.287 18.6929Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ArrowRightSolid() {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={size}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.71299 18.6929C8.43273 18.5768 8.25 18.3033 8.25 18V5.99998C8.25 5.69663 8.43273 5.42315 8.71299 5.30707C8.99324 5.19098 9.31583 5.25515 9.53033 5.46965L15.5303 11.4696C15.8232 11.7625 15.8232 12.2374 15.5303 12.5303L9.53033 18.5303C9.31583 18.7448 8.99324 18.809 8.71299 18.6929Z"
        fill="currentColor"
      />
    </svg>
  );
}
