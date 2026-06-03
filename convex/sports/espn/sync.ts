import type { UpcomingGame } from "../types";

/**
 * Marks the first two scheduled/live games in a batch as prime time.
 * Keeps the Live Games carousel populated (ported from admin-dashboard sync).
 */
export function applyPrimeTimeFlags(games: UpcomingGame[]): UpcomingGame[] {
  let primeCount = 0;

  return games.map((game) => {
    const eligible =
      (game.status === "scheduled" || game.status === "inprogress") && primeCount < 2;

    if (eligible) {
      primeCount += 1;
      return { ...game, isPrimeTime: true };
    }

    return game;
  });
}

/**
 * Marks the nearest upcoming UFC fight night as featured + prime time.
 */
export function applyUfcFeaturedFlags(games: UpcomingGame[]): UpcomingGame[] {
  const eligible = games
    .filter(
      (g) =>
        g.sport === "UFC" &&
        (g.status === "scheduled" || g.status === "inprogress"),
    )
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  if (eligible.length === 0) return games;

  const featuredExternalId = eligible[0].externalId;
  return games.map((g) =>
    g.externalId === featuredExternalId
      ? { ...g, isFeatured: true, isPrimeTime: true }
      : g,
  );
}
