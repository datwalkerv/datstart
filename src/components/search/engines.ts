import type { SearchEngineId } from "@/lib/types";

export type SearchEngine = {
  id: SearchEngineId;
  name: string;
  /** Query template with a {q} placeholder. */
  template: string;
  /** Domain used to resolve the engine's icon. */
  domain: string;
};

export const SEARCH_ENGINES: SearchEngine[] = [
  {
    id: "google",
    name: "Google",
    template: "https://www.google.com/search?q={q}",
    domain: "google.com",
  },
  {
    id: "duckduckgo",
    name: "DuckDuckGo",
    template: "https://duckduckgo.com/?q={q}",
    domain: "duckduckgo.com",
  },
  {
    id: "bing",
    name: "Bing",
    template: "https://www.bing.com/search?q={q}",
    domain: "bing.com",
  },
  {
    id: "brave",
    name: "Brave",
    template: "https://search.brave.com/search?q={q}",
    domain: "search.brave.com",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    template: "https://www.perplexity.ai/search?q={q}",
    domain: "perplexity.ai",
  },
  {
    id: "youtube",
    name: "YouTube",
    template: "https://www.youtube.com/results?search_query={q}",
    domain: "youtube.com",
  },
  {
    id: "custom",
    name: "Custom",
    template: "",
    domain: "",
  },
];

export function getEngine(id: SearchEngineId): SearchEngine {
  return SEARCH_ENGINES.find((e) => e.id === id) ?? SEARCH_ENGINES[0];
}

export function buildSearchUrl(template: string, query: string): string {
  return template.includes("{q}")
    ? template.replace("{q}", encodeURIComponent(query))
    : `${template}${encodeURIComponent(query)}`;
}
