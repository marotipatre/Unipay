"use client"

import Footer from "@/components/_navbar/Footer";
import Navbar from "@/components/_navbar/NavbarHunter";

// export const metadata: Metadata = {
//   title: 'GitFund: Eth Denver 2024',
//   description: 'Generated by create next app',
// };

// Updated RootLayout to handle session being undefined
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <Navbar />
            {children}
        <Footer />
    </>
  );
}