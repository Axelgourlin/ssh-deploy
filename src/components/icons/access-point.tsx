import type { SVGProps } from "react";

export function AccessPointIcon({
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
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12l0 .01" />
      <path d="M14.828 9.172a4 4 0 0 1 0 5.656" />
      <path d="M17.657 6.343a8 8 0 0 1 0 11.314" />
      <path d="M9.168 14.828a4 4 0 0 1 0 -5.656" />
      <path d="M6.337 17.657a8 8 0 0 1 0 -11.314" />
    </svg>
  );
}
