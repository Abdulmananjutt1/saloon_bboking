import type { SVGProps } from "react";

type SocialIconProps = SVGProps<SVGSVGElement>;

export function FacebookIcon(props: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        fill="currentColor"
        d="M14.2 8.6V6.8c0-.8.5-1 1-1h2.2V2.1L14.3 2C11 2 9.2 4 9.2 7.5v1.1H6v3.8h3.2V22h4.1v-9.6h3.2l.5-3.8h-3.7Z"
      />
    </svg>
  );
}

export function LinkedinIcon(props: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        fill="currentColor"
        d="M6.5 8.9H2.8V21h3.7V8.9ZM4.7 3C3.5 3 2.5 4 2.5 5.1s1 2.1 2.2 2.1 2.2-.9 2.2-2.1S5.9 3 4.7 3Zm16.8 11.3c0-3.6-1.9-5.7-4.7-5.7-2.1 0-3.1 1.2-3.6 2V8.9H9.6V21h3.7v-6c0-1.6.3-3.2 2.3-3.2s2 1.9 2 3.3V21h3.7v-6.7Z"
      />
    </svg>
  );
}

export function YoutubeIcon(props: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        fill="currentColor"
        d="M21.6 7.2s-.2-1.5-.9-2.2c-.9-.9-1.8-.9-2.3-1C15.2 3.8 12 3.8 12 3.8s-3.2 0-6.4.2c-.5.1-1.4.1-2.3 1-.7.7-.9 2.2-.9 2.2S2.2 9 2.2 10.8v1.7c0 1.8.2 3.6.2 3.6s.2 1.5.9 2.2c.9.9 2.1.9 2.6 1 1.9.2 6.1.2 6.1.2s3.2 0 6.4-.2c.5-.1 1.4-.1 2.3-1 .7-.7.9-2.2.9-2.2s.2-1.8.2-3.6v-1.7c0-1.8-.2-3.6-.2-3.6ZM10.1 14.6V8.4l5.5 3.1-5.5 3.1Z"
      />
    </svg>
  );
}

export function TwitterIcon(props: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
      <path
        fill="currentColor"
        d="M14.1 10.2 22 1h-1.9l-6.8 8L7.8 1H1.5l8.3 12.1L1.5 23h1.9l7.3-8.5 5.8 8.5h6.3l-8.7-12.8Zm-2.6 3-1-.1L3.8 2.4h3.1l5.4 8.7 1 .1 7 10.5h-3.1l-5.7-8.5Z"
      />
    </svg>
  );
}

