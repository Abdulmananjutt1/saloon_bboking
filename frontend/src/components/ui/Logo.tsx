import Image from "next/image";
import { APP_NAME, LOGO_SRC } from "@/constants";

interface LogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Logo({ size = 54, className, style }: LogoProps) {
  return (
    <Image
      src={LOGO_SRC}
      alt={`${APP_NAME} logo`}
      width={size}
      height={size}
      className={className}
      style={{
        borderRadius: size * 0.2,
        objectFit: "contain",
        flexShrink: 0,
        ...style,
      }}
      priority
    />
  );
}
