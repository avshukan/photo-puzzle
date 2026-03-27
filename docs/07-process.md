# Process

We follow **Incremental Delivery**.

## Terms

- **Iteration**: a short time-box (for this project: 1–2 weeks) with a fixed scope.
- **Vertical slice**: one end-to-end feature that touches all needed layers and is usable by the user.
- **Release**: a deployed increment with a git tag (SemVer).

## How we work

1. Maintain a single **Backlog** (`docs/08-backlog.md`).
2. Before starting work, create an iteration plan in `docs/iterations/iter-XX.md`.
3. Pick a small set of items (3–7) and keep scope stable until release.
4. Implement as vertical slices:
   - domain changes (if needed)
   - use cases
   - UI
   - tests
5. Merge to `main` via PR.
6. Each merge triggers **automatic deploy**.
7. Finish iteration with a release (tag + changelog).

## Definition of Done (DoD)

An iteration is "done" when:

- All planned items are merged to `main`.
- `npm run lint`, `npm test`, `npm run build` are green.
- Demo is deployed and works.
- `CHANGELOG.md` is updated for the new version.
- A git tag exists for the release.

## CI/CD

- Merge to `main` triggers automatic deploy.
- There is no separate "release branch".
- Each merge is production-ready.
- Version is tagged manually after iteration completion.

## Release flow

### Versioning

SemVer: `v0.x.y`

- `v0.(x+1).0` — new features / noticeable increment
- `v0.x.(y+1)` — fixes / small improvements

`package.json` uses the same version without `v` (example: `0.2.0`).

### Commands (recommended)

```bash
npm version minor
git push --follow-tags
```
