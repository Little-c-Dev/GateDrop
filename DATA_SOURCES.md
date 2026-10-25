# GateDrop schedule data

The app loads the published `events.json` feed. The app also keeps `data/events.json` inside the APK as an offline fallback.

## Sources

| Series | Calendar and event details | Watch destination | Update method |
| --- | --- | --- | --- |
| Hard Enduro | [FIM Hard Enduro calendar](https://fim-hardenduro.com/calendar) | Official event or YouTube link | Official calendar scan |
| EnduroCross | [EnduroCross schedule](https://endurocross.com/2026-schedule/) | [EnduroCross TV](https://endurocross.com/tv/) | Structured-event scan |
| AMA Supercross | [SuperMotocross schedule](https://www.supermotocross.com/schedule/) | [Peacock](https://www.peacocktv.com/sports/supermotocross) | Official schedule scan |
| Pro Motocross | [SuperMotocross schedule](https://www.supermotocross.com/schedule/) | [Peacock](https://promotocross.com/watch) | Official schedule scan |
| SMX Playoffs | [SuperMotocross schedule](https://www.supermotocross.com/schedule/) | [Peacock](https://www.peacocktv.com/sports/supermotocross) | Official schedule scan |

The updater runs every six hours on GitHub. It scans each series' official calendar and writes a new feed when it finds changes. Times remain provisional when an official calendar has not published a first-gate time; the feed updates when the source adds it.

## Updating an event manually

Add or change an object in both `events.json` and `data/events.json`. Every event needs a stable `id`, ISO 8601 `date` and `firstGate` values with an offset, a `series`, coverage links, and a `sourceUrl`. Add `liveStart` and `liveEnd` when official coverage is known; the app switches to its red live-event theme inside that window. Add `imageUrl` when an organizer provides approved event imagery. The phone uses the ISO offset to display the time in the viewer's device time zone.

## Serving the app

The live endpoint is [https://little-c-dev.github.io/GateDrop/events.json](https://little-c-dev.github.io/GateDrop/events.json). When opened as a local `file:` preview, the app keeps the embedded fallback schedule because browsers restrict local file requests.
