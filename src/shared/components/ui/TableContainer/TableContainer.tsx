import { ReactNode } from "react";

interface TableContainerProps {
  children: ReactNode;
  className?: string;
  maxHeightClassName?: string;
  maxHeight?: number | string;
}

export function TableContainer({
  children,
  className = "",
  maxHeightClassName = "max-h-[60vh]",
  maxHeight = "60vh",
}: TableContainerProps) {
  return (
    <div
      className={`w-full max-w-full overflow-x-scroll overflow-y-auto ${maxHeightClassName} ${className}`}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
}
