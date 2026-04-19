/**
 * Sportradar / Imagn Images API Helper
 * 
 * Used for fetching team logos and player headshots.
 */

const IMAGES_API_KEY = process.env.SPORTRADAR_API_KEY; // Using the provided universal key

/**
 * Builds a URL for a team logo.
 * Note: Sportradar Images API typically follows a specific asset mapping.
 * This is a placeholder for the logic required to fetch or build those URLs.
 */
export function getTeamLogoUrl(teamId: string, league: string): string {
  // Example pattern for Imagn/Sportradar Images
  // In a real implementation, you might fetch the asset list first
  // or use a CDN pattern if available.
  return `https://api.sportradar.com/images/v3/en/teams/${teamId}/logo.json?api_key=${IMAGES_API_KEY}`;
}

/**
 * Standard headshot fetcher
 */
export function getPlayerHeadshotUrl(playerId: string): string {
  return `https://api.sportradar.com/images/v3/en/players/${playerId}/headshot.json?api_key=${IMAGES_API_KEY}`;
}
