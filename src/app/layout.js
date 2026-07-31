import { Inter } from "next/font/google";
import "../index.css"; // Import global styles (Tailwind)
import "overlayscrollbars/styles/overlayscrollbars.css"; // Import OverlayScrollbars styles
import "../App.css"; // Import custom styles (Fonts, Scrollbar)
import { TodoProvider } from "../context/TodoContext";
import { SessionProvider } from "next-auth/react";
import PwaRegister from "../components/PwaRegister";
import OfflineBanner from "../components/OfflineBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Todo App",
    description: "A simple todo app with Next.js and MongoDB",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Todo App",
    },
};

export const viewport = {
    themeColor: "#4f46e5",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SessionProvider>
                    <TodoProvider>
                        {children}
                    </TodoProvider>
                </SessionProvider>
                <PwaRegister />
                <OfflineBanner />
            </body>
        </html>
    );
}
