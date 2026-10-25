# GateDrop event feed

This project publishes `data/events.json`, the small schedule feed used by the GateDrop Android app.

## Publishing updates

1. Create a public GitHub repository and upload this project.
2. Enable GitHub Pages for the repository's default branch.
3. Set the published `events.json` address in `mobile.html`, `desktop.html`, and the Android wrapper before building the release APK.

The app first requests the published feed. It uses its installed copy if the device is offline or the feed cannot be reached.

The included GitHub Actions workflow refreshes the EnduroCross portion of the feed every six hours after the repository is on GitHub.
