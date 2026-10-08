import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { WebMcpTools } from "@/components/webmcp";

export const metadata: Metadata = {
  title: { default: "Project-B2", template: "%s · Project-B2" },
  description: "Ein unabhängiger, prüfungsnaher Lernpfad für telc Deutsch B2.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/project-b2-mark.png",
    shortcut: "/project-b2-mark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body><AppShell>{children}</AppShell><WebMcpTools /></body>
    </html>
  );
}
