import type { Metadata } from "next";
import { Space_Grotesk, Fira_Code } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BuilderType",
  description: "A 45-second typing game in just 1 hour using Kiro featuring a real-time typing speed test, live leaderboard, and top 10 player highlights, all wrapped in an AWS Builder Center inspired theme.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${firaCode.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="flex min-h-screen flex-col bg-[rgb(22,29,38)] text-white">
          <header className="sticky top-0 z-40 h-16 border-b border-white/10 bg-[rgb(22,29,38)]/95 backdrop-blur">
            <div className="mx-auto flex h-full w-full max-w-[1800px] items-center gap-4 px-4 md:px-6">
              <Link href="/" className="text-lg font-semibold tracking-wide text-white">
                Builder Center
              </Link>

              <div className="hidden flex-1 md:flex">
                <input
                  type="search"
                  placeholder="Search"
                  className="h-10 w-full max-w-md rounded-lg border border-white/15 bg-[rgb(22,29,38)] px-4 text-sm text-white outline-none placeholder:text-white/50 focus:border-[rgb(191,128,255)]"
                  aria-label="Search"
                />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  className="hidden h-9 rounded-md border border-white/15 px-3 text-sm text-white/80 transition hover:border-[rgb(191,128,255)] hover:text-white sm:inline-flex sm:items-center"
                >
                  +
                </button>
                <button
                  type="button"
                  className="h-9 rounded-md bg-white px-4 text-sm font-semibold text-[rgb(22,29,38)] transition hover:opacity-90"
                >
                  Sign in
                </button>
              </div>
            </div>
          </header>

          <div className="flex min-h-0 flex-1">
            <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[rgb(22,29,38)]/92 lg:block">
              <nav className="h-full space-y-8 overflow-y-auto px-4 py-6">
                <section className="space-y-3">
                  <p className="px-2 text-xs uppercase tracking-[0.2em] text-white/50">Main</p>
                  <Link
                    href="/"
                    className="block rounded-md bg-[rgb(191,128,255)] px-3 py-2 text-sm font-semibold text-[rgb(22,29,38)]"
                  >
                    Home
                  </Link>
                  <Link
                    href="/leaderboard"
                    className="block rounded-md px-3 py-2 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                  >
                    Leaderboard
                  </Link>
                </section>

                <section className="space-y-3">
                  <p className="px-2 text-xs uppercase tracking-[0.2em] text-white/50">Build</p>
                  <p className="px-3 text-sm text-white/70">Typing Arena</p>
                  <p className="px-3 text-sm text-white/70">Capabilities</p>
                  <p className="px-3 text-sm text-white/70">Workshops</p>
                </section>

                <section className="space-y-3">
                  <p className="px-2 text-xs uppercase tracking-[0.2em] text-white/50">Community</p>
                  <p className="px-3 text-sm text-white/70">Events</p>
                  <p className="px-3 text-sm text-white/70">Spaces</p>
                  <p className="px-3 text-sm text-white/70">Builders</p>
                </section>
              </nav>
            </aside>

            <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
