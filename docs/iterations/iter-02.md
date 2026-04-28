# Iteration 2

## Goal

Improve reliability of image handling and make replay easier.

## Scope

|  ID | Title                                             | Type     | Priority | Notes                                |
| --: | ------------------------------------------------- | -------- | -------- | ------------------------------------ |
| === | ================================================= | ======== | ======== | ==================================== |
|   1 | Add shuffle button (restart with same image)      | Value    | High     | Recreate puzzle using current image  |
|  11 | Add proper favicon                                | Quality  | Medium   | Replace default                      |
|  19 | Reject extremely large files (safety limit)       | Quality  | Medium   | Guard on input (>5–10MB, resolution) |
|  30 | Compress and resize images before storing         | Quality  | High     | Fit into localStorage                |
|  31 | Show error message on upload failure              | Quality  | High     | Avoid silent fallback                |
|  32 | Handle storage overflow gracefully                | Quality  | High     | Fallback without image + notify user |
|  37 | Use `browser-image-validator` for upload checks   | Refactor | High     | Replace custom validation service    |

## Key Decisions

Adopt image handling model:

```text
1. Reject: >10MB or >8000px
2. Normalize: 1024px + jpeg 0.75
3. Fit: ≤2MB (else 800px → retry)
4. Fallback: play without persistence
```

Use [`browser-image-validator`](https://www.npmjs.com/package/browser-image-validator)
for upload validation instead of maintaining custom file type, size, dimension, and
image load checks inside the app.

---

## Problem (Current Limitations)

Current system has several issues:

### Upload

- Max file size: **2MB**
- Files >2MB are silently ignored
- No user-visible error feedback

---

### Images

- No compression or resizing
- Large images significantly increase storage usage
- Base64 adds ~30–40% overhead

---

### Storage

- localStorage limit ~5MB
- Storage overflow may clear previous state
- No controlled fallback behavior

---

## Target Behavior

We introduce a 3-step model: **reject → normalize → fit**

---

### 1. Input validation (Reject)

- Max file size: **10MB**
- Max resolution: **8000px**

If exceeded:

- Reject upload
- Show error message

---

### 2. Processing (Normalize)

For all accepted images:

- Resize to **max 1024px**
- Format: **JPEG**
- Quality: **0.75**

---

### 3. Storage (Fit)

Target:

- Final size ≤ **2MB (base64)**

Algorithm:

1. Process image (1024px)
2. If >2MB → resize to **800px**
3. If still >2MB → skip persistence

---

### 4. Fallback behavior

If storage fails:

- Do not save to localStorage
- Use image only in memory

User sees:

- "Image is too large to save. It will not persist after reload."

---

## Implementation Order

1. Input validation (ID 19)
2. Image processing (ID 30)
3. Favicon (ID 11)
4. Replace custom validation with `browser-image-validator` (ID 37)
5. Storage handling (ID 32)
6. Error UX (ID 31)
7. UX improvements (ID 1)

---

## Risks

- Image quality degradation
- Increased complexity in image pipeline
- Browser-specific storage behavior

---

## Definition of Done

- All scope items are implemented and merged
- Invalid files are rejected with clear errors
- Upload validation uses `browser-image-validator`
- Images are resized and compressed correctly
- Storage overflow does not break the game
- Fallback behavior works (no persistence)
- Errors are visible to the user
- Shuffle button works correctly
