import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lời Mời Tốt Nghiệp",
  description:
    "Hệ thống lời mời lễ tốt nghiệp đẹp mắt với RSVP thời gian thực và theo dõi sự kiện",
  keywords: ["tốt nghiệp", "lời mời", "rsvp", "sự kiện", "lễ"],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "Lời Mời Tốt Nghiệp",
    description:
      "Kỷ niệm tốt nghiệp với lời mời tương tác và theo dõi sự kiện thời gian thực",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Italianno&family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
