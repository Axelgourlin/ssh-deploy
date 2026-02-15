import type { SVGProps } from "react";

export function CheckIcon({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className,
  ...props
}: SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ opacity: 1 }}
      {...props}
    >
      <path fill="none" d="m5 12l5 5L20 7" />
    </svg>
  );
}
