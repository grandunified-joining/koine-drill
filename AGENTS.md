# Instructions for coding agents

Before making changes, read [notes.md](notes.md) in full, then inspect the current code in `koine-drill.html`. The notes capture past bugs and behavior that must be preserved; verify implementation claims against the code, especially hosting and sync.

- Keep this a self-contained HTML app unless the requested change requires otherwise.
- Preserve progress IDs, saved progress, archive state, Greek accents, and the distinction between controls that rebuild the queue and those that only update presentation.
- For filter changes, verify the actual queue at the relevant selection scope. For UI changes, test behavior and check for browser errors. Follow the data and language checks in `notes.md` when editing forms or sentences.
- Before changing persistence or sync, identify its current storage, authentication, and conflict behavior. Preserve existing data and document any migration; do not claim cross-device sync works without verifying it.
- Keep `notes.md` concise and update it when a confirmed behavior or important pitfall changes. Its ideas section is context, not a task list to implement automatically.
- Keep credentials and personal progress exports out of the repository. These Markdown files are maintainer documentation, not public website assets.
- Explain what changed, how it was verified, and any remaining limitations. Do not report a deployment or sync migration as complete without evidence.
