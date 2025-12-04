import { Inter } from "next/font/google";
import "../index.css"; // Import global styles (Tailwind)
import "overlayscrollbars/styles/overlayscrollbars.css"; // Import OverlayScrollbars styles
import "../App.css"; // Import custom styles (Fonts, Scrollbar)
import { TodoProvider } from "../context/TodoContext";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Todo App",
    description: "A simple todo app with Next.js and MongoDB",
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
            </body>
        </html>
    );
}
