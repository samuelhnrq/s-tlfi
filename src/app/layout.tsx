import type { Metadata } from "next";
import { IBM_Plex_Serif, Modern_Antiqua } from "next/font/google";
import "./globals.css";

const modernAntiqua = Modern_Antiqua({
  weight: "400",
  subsets: ["latin"],
});

const blexSerif = IBM_Plex_Serif({
  weight: "500",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "S / TFLi",
  description: "Dictionaire de la langue française",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${modernAntiqua.className} ${blexSerif.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
