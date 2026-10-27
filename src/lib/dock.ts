import type { DockItem } from "./types";

/**
 * The dock shows the newest GitHub repos of `GITHUB_USER` whose name starts
 * with "dat" and that have topics and a homepage set:
 *
 *   url      the repo's homepage
 *   iconUrl  the first image in the repo's README (its logo)
 *   label    the repo name
 *
 * Results are cached for an hour. If GitHub can't be reached (e.g. the
 * 60 req/h unauthenticated rate limit), the hourly refresh throws so Next keeps
 * serving the last good page and retries on the next request. Only at build
 * time and in dev, with nothing cached yet, the static `DOCK_ITEMS` below are
 * shown instead. Set `GITHUB_TOKEN` to lift the rate limit.
 *
 * `monogramIcon` renders the placeholder shape: a rounded light square with a
 * dark monogram.
 */
export function monogramIcon(text: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="22" fill="#f1f1ef"/><text x="50" y="67" text-anchor="middle" font-family="'Inter', system-ui, sans-serif" font-weight="900" font-size="38" letter-spacing="-2" fill="#080808">${text}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const GITHUB_USER = "datwalkerv";
const DOCK_SIZE = 8;
const REVALIDATE = { next: { revalidate: 3600 } };

export const DOCK_ITEMS: DockItem[] = [
  {
    id: "datclean",
    label: "datclean",
    url: "https://datclean.vercel.app/",
    iconUrl:
      monogramIcon("dc"),
  },
  { id: "datmotions", label: "datmotions", url: "https://datmotions.vercel.app/", iconUrl: monogramIcon("dm") },
  { id: "datnotes", label: "datnotes", url: "https://datnotes.vercel.app/", iconUrl: monogramIcon("dn") },
  { id: "datsounds", label: "datsounds", url: "https://datsounds.vercel.app/", iconUrl: monogramIcon("ds") },
];

type Repo = {
  name: string;
  homepage: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  default_branch: string;
};

/** The first image in a README — an HTML <img> or a markdown image — resolved against the repo. */
export function readmeLogo(readme: string, base: string): string | null {
  const src =
    readme.match(/<img[^>]*\ssrc=["']([^"']+)["']/i)?.[1] ??
    readme.match(/!\[[^\]]*\]\(\s*<?([^)\s>]+)/)?.[1];
  if (!src) return null;
  try {
    return new URL(src, base).href;
  } catch {
    return null;
  }
}

async function repoIcon(repo: Repo): Promise<string> {
  const base = `https://raw.githubusercontent.com/${GITHUB_USER}/${repo.name}/${repo.default_branch}/`;
  try {
    const res = await fetch(`${base}README.md`, REVALIDATE);
    const logo = res.ok ? readmeLogo(await res.text(), base) : null;
    if (logo) return logo;
  } catch {}
  return monogramIcon(repo.name.slice(0, 2));
}

// Outside these, a throw leaves the last good ISR page in place.
const canFallback =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PHASE === "phase-production-build";

export async function getDockItems(): Promise<DockItem[]> {
  try {
    const token = process.env.GITHUB_TOKEN;
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=created`,
      {
        ...REVALIDATE,
        headers: {
          Accept: "application/vnd.github+json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      },
    );
    if (!res.ok) throw new Error(`GitHub repos: ${res.status}`);

    // The API returns the newest-created repos first.
    const repos = ((await res.json()) as Repo[])
      .filter(
        (repo) =>
          repo.name.startsWith("dat") &&
          repo.topics?.length &&
          repo.homepage &&
          !repo.fork &&
          !repo.archived,
      )
      .slice(0, DOCK_SIZE);
    if (repos.length === 0) return DOCK_ITEMS;

    return Promise.all(
      repos.map(async (repo) => ({
        id: repo.name,
        label: repo.name,
        url: repo.homepage!,
        iconUrl: await repoIcon(repo),
      })),
    );
  } catch (error) {
    if (canFallback) return DOCK_ITEMS;
    throw error;
  }
}
