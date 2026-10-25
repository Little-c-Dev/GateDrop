# GateDrop schedule data

The app loads `data/events.json`. It is the only schedule endpoint the mobile UI needs.

## Sources

| Series | Calendar and event details | Watch destination | Update method |
| --- | --- | --- | --- |
| Hard Enduro | [FIM Hard Enduro](https://fim-hardenduro.com/) | Official event or YouTube link | Manual review |
| EnduroCross | [EnduroCross schedule](https://endurocross.com/2026-schedule/) | [EnduroCross TV](https://endurocross.com/tv/) | JSON-LD updater |
| AMA Supercross | [SuperMotocross](https://www.supermotocross.com/) | [Peacock](https://www.peacocktv.com/sports/supermotocross) | Manual review |
| Pro Motocross | [Pro Motocross](https://promotocross.com/) | [Peacock](https://promotocross.com/watch) | Manual review |
| SMX Playoffs | [SuperMotocross](https://www.supermotocross.com/) | [Peacock](https://www.peacocktv.com/sports/supermotocross) | Manual review |

The updater runs every six hours after the project is hosted on GitHub. It reads only the structured event data exposed by EnduroCross, validates it, and writes a new feed when it finds changes. The other sources are intentionally reviewed before publishing because their official calendar and broadcast pages can change format, and first-gate and coverage times often arrive separately.

## Updating an event manually

Add or change an object in `data/events.json`. Every event needs a stable `id`, ISO 8601 `date` and `firstGate` values with an offset, a `series`, coverage links, and a `sourceUrl`. Add `liveStart` and `liveEnd` when official coverage is known; the app switches to its red live-event theme inside that window. Add `imageUrl` when an organizer provides approved event imagery. The phone uses the ISO offset to display the time in the viewer's device time zone.

## Serving the app

Use any static host, including GitHub Pages, Netlify, or Vercel. The app requests `data/events.json` at startup. When opened as a local `file:` preview it keeps the embedded fallback schedule, because browsers restrict local file requests.
