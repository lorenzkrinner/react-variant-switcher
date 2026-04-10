import { type ReactNode, useEffect, useRef, useState } from "react";
import { ChevronDown } from "./icons";

interface AutoWidthSelectProps {
  value: string;
  displayText: string;
  onChange: (value: string) => void;
  children: ReactNode;
  hasPrefix?: boolean;
  prefix?: ReactNode;
}

export function AutoWidthSelect({
  value,
  displayText,
  onChange,
  children,
  hasPrefix,
  prefix,
}: AutoWidthSelectProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (spanRef.current) {
      setWidth(spanRef.current.offsetWidth);
    }
  }, [displayText]);

  const selectClassName = hasPrefix
    ? "rvs-select rvs-select-with-prefix"
    : "rvs-select";

  return (
    <label className="rvs-select-label">
      <span ref={spanRef} className="rvs-select-measure" aria-hidden>
        {displayText}
      </span>
      {prefix}
      <select
        className={selectClassName}
        style={width > 0 ? { width: width + (hasPrefix ? 52 : 36) } : undefined}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          event.target.blur();
        }}
      >
        {children}
      </select>
      <ChevronDown className="rvs-select-chevron" />
    </label>
  );
}
