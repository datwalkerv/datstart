"use client";

import { useCallback, useRef, useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/useHydrated";
import { useClickOutside } from "@/lib/useClickOutside";
import { faviconUrl, normalizeUrl } from "@/lib/favicon";
import { SEARCH_ENGINES, buildSearchUrl, getEngine } from "./engines";

const LOOKS_LIKE_URL = /^(https?:\/\/\S+|[\w-]+(\.[\w-]+)+(\/\S*)?)$/i;

function EngineIcon({ domain, name }: { domain: string; name: string }) {
  const src = domain ? faviconUrl(domain, 64) : null;
  if (!src) {
    return (
      <span className="grid size-5 place-items-center rounded-md bg-accent text-[0.6rem] font-black text-black">
        {name.slice(0, 1)}
      </span>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" width={20} height={20} className="size-5 rounded-md" />;
}

export function SearchBar() {
  const hydrated = useHydrated();
  const search = useStore((s) => s.search);
  const setSearch = useStore((s) => s.setSearch);

  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useClickOutside(menuRef, menuOpen, closeMenu);

  const engine = getEngine(search.engineId);
  const template =
    engine.id === "custom" ? search.customTemplate : engine.template;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;

    const target = LOOKS_LIKE_URL.test(value)
      ? normalizeUrl(value)
      : buildSearchUrl(template, value);

    if (search.openInNewTab) {
      window.open(target, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = target;
    }
    setQuery("");
  };

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className="glass glass-hover flex w-full max-w-2xl items-center gap-2 rounded-full py-2 pl-2 pr-4 transition focus-within:ring-1 focus-within:ring-white/20"
    >
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-haspopup="listbox"
          aria-expanded={menuOpen}
          aria-label={`Search engine: ${engine.name}`}
          className="focus-ring glass-hover flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm text-fg-dim"
        >
          <EngineIcon domain={engine.domain} name={engine.name} />
          <svg viewBox="0 0 10 6" className="size-2.5" aria-hidden="true">
            <path
              d="M1 1l4 4 4-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {menuOpen ? (
          <ul
            role="listbox"
            className="glass-strong absolute left-0 top-[calc(100%+0.6rem)] z-30 w-52 overflow-hidden rounded-2xl p-1.5"
          >
            {SEARCH_ENGINES.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={item.id === engine.id}
                  onClick={() => {
                    setSearch({ engineId: item.id });
                    setMenuOpen(false);
                  }}
                  className={`focus-ring glass-hover flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm ${
                    item.id === engine.id ? "text-accent" : "text-fg"
                  }`}
                >
                  <EngineIcon domain={item.domain} name={item.name} />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={hydrated ? `Search with ${engine.name}` : "Search"}
        aria-label="Search query"
        autoComplete="off"
        spellCheck={false}
        className="min-w-0 flex-1 bg-transparent py-1.5 text-base text-fg outline-none placeholder:text-fg-faint"
      />

      <button
        type="submit"
        aria-label="Search"
        className="focus-ring grid size-8 shrink-0 place-items-center rounded-full text-fg-dim transition hover:bg-white/10 hover:text-accent"
      >
        <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
          <circle
            cx="8.5"
            cy="8.5"
            r="5.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <line
            x1="12.8"
            y1="12.8"
            x2="17"
            y2="17"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </form>
  );
}
