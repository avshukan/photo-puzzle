# Iteration 1

## Goal

Improve UX and add persistence.

## Scope

|  ID | Title                                             | Type     | Priority | Notes                                |
| --: | ------------------------------------------------- | -------- | -------- | ------------------------------------ |
| === | ================================================= | ======== | ======== | ==================================== |
|  23 | Restore image after reload                        | Value    | High     | Uploaded image survives reload       |
|   8 | Persist puzzle state (tiles, status)              | Value    | High     | Save/restore state                   |
|   9 | Improve file upload UI                            | Value    | High     | Custom button, layout                |
|  10 | Add preview original image                        | Value    | High     | Overlay preview                      |
|   4 | Add close button to victory modal                 | Value    | High     | Allow continue viewing               |
|  24 | Fix double file selection (opens twice) on upload | Quality  | High     | User must pick 2 times               |
|   7 | Fix board overflow on mobile                      | Value    | High     | Responsive tile size                 |

## Result

All planned items were completed and merged to `main`.

- Game state persists across reloads
- Uploaded image is restored
- Upload UX improved
- Preview overlay added
- Victory modal improved
- Mobile layout fixed
- Upload bug fixed

## Release

- Version: v0.2.0
- Status: Deployed
