# Iteration 2

## Goal

Improve reliability of image handling and make replay easier.

## Scope

|  ID | Title                                             | Type     | Priority | Notes                                |
| --: | ------------------------------------------------- | -------- | -------- | ------------------------------------ |
| === | ================================================= | ======== | ======== | ==================================== |
|   1 | Add shuffle button (restart with same image)      | Value    | High     | Recreate puzzle using current image  |
|  11 | Add proper favicon                                | Quality  | Medium   | Replace default                      |
|  30 | Compress and resize images before storing         | Quality  | High     | Fit into localStorage                |
|  31 | Show error message on upload failure              | Quality  | High     | Avoid silent fallback                |
|  32 | Handle storage overflow gracefully                | Quality  | High     | Fallback without image + notify user |

## Key Decision

Adopt image handling model:

```text
1. Reject: >10MB or >8000px
2. Normalize: 1024px + jpeg 0.75
3. Fit: ≤2MB (else 800px → retry)
4. Fallback: play without persistence
```
