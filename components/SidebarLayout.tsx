"use client";

import Link from "next/link";
import { useState } from "react";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex min-h-screen flex-col bg-[rgb(22,29,38)] text-white">
      <header className="sticky top-0 z-40 h-16 border-b border-white/10 bg-[rgb(22,29,38)]/95 backdrop-blur">
        <div className="mx-auto flex h-full w-full max-w-[1800px] items-center gap-4 px-4 md:px-6">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-md text-white/50 transition hover:bg-white/8 hover:text-white"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="3" width="14" height="1.5" rx="0.75" fill="currentColor"/>
                <rect x="1" y="7.25" width="14" height="1.5" rx="0.75" fill="currentColor"/>
                <rect x="1" y="11.5" width="14" height="1.5" rx="0.75" fill="currentColor"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="3" width="14" height="1.5" rx="0.75" fill="currentColor"/>
                <rect x="1" y="7.25" width="14" height="1.5" rx="0.75" fill="currentColor"/>
                <rect x="1" y="11.5" width="14" height="1.5" rx="0.75" fill="currentColor"/>
              </svg>
            )}
          </button>

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
        <aside
          className={`
            hidden lg:flex flex-col shrink-0 border-r border-white/10 bg-[rgb(22,29,38)]/92
            overflow-hidden transition-all duration-300 ease-in-out
            ${collapsed ? "w-14" : "w-64"}
          `}
        >
          {collapsed ? (
            <nav className="flex flex-col items-center gap-1 px-2 py-6">
              {/* Home icon */}
              <Link
                href="/"
                title="Home"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-[rgb(191,128,255)] text-[rgb(22,29,38)]"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M7.5 1L1 6.5V14h4.5v-4h4v4H14V6.5L7.5 1Z" fill="currentColor"/>
                </svg>
              </Link>
              <Link
                href="/leaderboard"
                title="Leaderboard"
                className="flex h-9 w-9 items-center justify-center rounded-md text-white/60 transition hover:bg-white/8 hover:text-white"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <rect x="1" y="8" width="3" height="6" rx="1" fill="currentColor"/>
                  <rect x="6" y="5" width="3" height="9" rx="1" fill="currentColor"/>
                  <rect x="11" y="2" width="3" height="12" rx="1" fill="currentColor"/>
                </svg>
              </Link>
            </nav>
          ) : (
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
          )}
        </aside>

        <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}