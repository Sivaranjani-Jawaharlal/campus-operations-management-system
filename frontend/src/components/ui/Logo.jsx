// Concentric arches: a doorway / colonnade motif that is the product's mark.
export function LogoMark({ size = 30 }) {
  return (
    <svg className="brand__mark" width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M4.5 27V15C4.5 9 9.6 4.5 16 4.5S27.5 9 27.5 15v12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10.5 27v-9.2c0-3 2.5-5.1 5.5-5.1s5.5 2.1 5.5 5.1V27" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M2 27.5h28" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ as: Tag = "span", className = "brand", ...rest }) {
  return (
    <Tag className={className} {...rest}>
      <LogoMark />
      <span className="brand__text">
        <span className="brand__name">Campus Operations</span>
        <span className="brand__sub">Management System</span>
      </span>
    </Tag>
  );
}
