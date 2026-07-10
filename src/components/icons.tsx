import { memo } from 'react';

/**
 * Lightweight inline SVG icons. These are tree-shaken and only the
 * icons actually used in the bundle are included in the final build.
 */

type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

const baseProps = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className,
  'aria-hidden': true,
});

export const GridIcon = memo(function GridIcon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...rest}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
});

export const SearchIcon = memo(function SearchIcon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...rest}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
});

export const HeartIcon = memo(function HeartIcon({
  size = 24,
  className,
  filled,
  ...rest
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      {...baseProps(size, className)}
      fill={filled ? 'currentColor' : 'none'}
      {...rest}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
});

export const PlusIcon = memo(function PlusIcon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...rest}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
});

export const CloseIcon = memo(function CloseIcon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...rest}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
});

export const CopyIcon = memo(function CopyIcon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...rest}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
});

export const CheckIcon = memo(function CheckIcon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...rest}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
});

export const DownloadIcon = memo(function DownloadIcon({ size = 24, className, ...rest }: IconProps) {
  return (
    <svg {...baseProps(size, className)} {...rest}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
});
