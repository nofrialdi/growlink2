import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeRegistry from "@/Theme/themeRegistry";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Growink App",
	description: "Growink App",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<ThemeRegistry>
				<body className={inter.className}>{children}</body>
			</ThemeRegistry>
		</html>
	);
}
