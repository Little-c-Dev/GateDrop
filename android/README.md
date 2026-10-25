# GateDrop Android package

This native Android wrapper loads the mobile GateDrop layout from bundled app assets. During each build, Gradle copies the shared mobile page, event client, and event feed from the repository root, so the web and Android versions use the same schedule content.

Build the debug APK with:

```powershell
./gradlew :app:assembleDebug
```

The generated file is `app/build/outputs/apk/debug/app-debug.apk`.
