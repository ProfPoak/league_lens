# League Lens

A React app for browsing major sports leagues, teams, and players using [TheSportsDB](https://www.thesportsdb.com/) free-tier API. Pick a league, browse its teams, drill into a team's roster and recent/upcoming games, and view individual player bios and stats.

League Lens keeps things simple by design — a curated set of leagues, click-through navigation instead of search, and details that matter. Whether you're getting into a new sport or already know it inside and out, it's built to get you from "which team?" to "who's on it?" in a couple of clicks.

---

## Features

- **Home (`/`)** — Accordion of curated leagues (NFL, NBA, MLB, NHL, WNBA, MLS, NCAA Football, NCAA Basketball). Expanding a league loads its teams and next league-wide event, with a client-side filter to narrow the team list.
- **Team (`/team/:id`)** — Tabbed team page: Overview (badge, stadium, founded year, description, next/last game) and Roster (players grouped by position).
- **Player (`/player/:id`)** — Player header, bio, and a stats table (when available).

---

## Tech Stack

- React + Vite
- React Router
- Vitest + React Testing Library (unit/component tests)
- Plain CSS with a custom-property design token system

---

## Setup Instructions

1. Clone the repo:
   ```bash
   git clone <repo link>
   cd league_lens
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Run the test suite:
   ```bash
   npm test
   ```

---

## API Used

**TheSportsDB** — free tier, API key `123`.

| Purpose | Endpoint |
|---|---|
| Teams by league | `search_all_teams.php?l=<league name>` |
| League-wide upcoming schedule | `eventsnextleague.php?id=<league id>` |
| Team lookup | `lookupteam.php?id=<team id>` |
| Team roster | `lookup_all_players.php?id=<team id>` |
| Team's next event | `eventsnext.php?id=<team id>` |
| Team's last event | `eventslast.php?id=<team id>` |
| Player lookup | `lookupplayer.php?id=<player id>` |
| Player stats | `lookupplayerstats.php?id=<player id>` |

Base URL: `https://www.thesportsdb.com/api/v1/json/123`

---

## Known Limitations (Free Tier)

TheSportsDB's free tier imposes constraints that shaped this app's design rather than being "bugs" to fix:

- **No working free-text search.** `searchteams.php?t=` is hardcoded to always return "Arsenal" on the free tier. Because of this, the app never uses server-side search — navigation is entirely browse/click-based, and the only "search" is a client-side filter over teams already fetched.
- **`lookup_all_teams.php?id=` is unreliable.** The ID-based teams-by-league endpoint returns empty/incorrect results on the free tier, so the app uses `search_all_teams.php?l=<league name>` instead, with the league name hardcoded per league (never user input).
- **10-item result caps.** Team lists and rosters are capped at the first 10 results returned by the API.
- **Single-result schedule endpoints.** `eventsnext.php` and `eventslast.php` each return at most one event, so "Schedule" isn't a full calendar.
- **Empty results return `null`, not an HTTP error.** E.g. `{ teams: null }` on a league with no matching data. Components null-guard (`data?.teams ?? []`) rather than relying on `status === "error"`.
- **Inconsistent player stats coverage.** `lookupplayerstats.php` doesn't return data for every player; the Stats section is treated as a bonus, shown only when data exists.
- **Occasional 503s.** Free-tier responses can fail transiently; treated as a normal error state, not a crash.

---

## Challenges / Known Bugs

- Without direct player search, finding a specific player requires navigating through league → team → roster rather than searching directly. 
- Limitations to the number of returned players and teams from the API prevent the app from being a full scale production and more of a proof of concept.
- The navigation from Team back to League requires reselecting the League from the home page.
- The navigation from Player back to Roster requires passing through the defaulted Overview page.
- Color and theming are minimal, since visual/styling design isn't yet a strength.

---

## Project Structure

```
src/
  api/          # endpoint URL builders
  components/   # fetcher + presentational components, grouped by route
  hooks/        # useSportsDbFetch data-fetching hook
  pages/        # HomePage, TeamPage, PlayerPage
  styles/       # per-page CSS + shared design tokens
  utils/        # roster grouping, stat pivoting, match results, formatters
  tests/        # Vitest + RTL test suites, mirroring component structure
```