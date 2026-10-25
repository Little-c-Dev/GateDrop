# GateDrop event feed

This project publishes `data/events.json`, the small schedule feed used by the GateDrop Android app.

## Publishing updates

1. Enable GitHub Pages for this repository's `main` branch.
2. Publish changes to `data/events.json`.

The app first requests the published feed. It uses its installed copy if the device is offline or the feed cannot be reached.

The included GitHub Actions workflow refreshes the EnduroCross portion of the feed every six hours after the repository is on GitHub.
