import { getImageProps } from "next/image";

export function BrandLogo({ className = "" }: { className?: string }) {
  const shared = { alt: "Plei", width: 5578, height: 2745, sizes: "96px" };
  const { props: primary } = getImageProps({ ...shared, src: "/brand/plei-primary-horizontal.png" });
  const { props: white } = getImageProps({ ...shared, src: "/brand/plei-white-horizontal.png" });

  return (
    <picture className={`brand-logo ${className}`.trim()}>
      <source media="(prefers-color-scheme: dark)" srcSet={white.srcSet}/>
      <img {...primary} alt="Plei"/>
    </picture>
  );
}
