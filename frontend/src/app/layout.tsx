import type { Metadata } from "next";
import { Cormorant_Garamond, Raleway } from "next/font/google";
import ThemeProvider from "@/components/layout/ThemeProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const raleway = Raleway({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Glamour Studio — Premium Salon & Spa",
  description:
    "Book haircut, beard, facial, color, massage & more at Glamour Studio. Islamabad's top-rated salon.",
  icons: {
    icon: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${raleway.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
