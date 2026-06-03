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
