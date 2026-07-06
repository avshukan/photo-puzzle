# Process

We follow **Incremental Delivery**.

## Terms

- **Iteration**: a short time-box (for this project: 1–2 weeks) with a fixed scope.
- **Vertical slice**: one end-to-end feature that touches all needed layers and is usable by the user.
- **Release**: an explicit decision to publish a specific state of `main` with a git tag (SemVer).
- **Deploy**: production rollout triggered by pushing a release tag.

## How we work

1. Maintain a single **Backlog** (`docs/backlog.md`).
2. Before starting work, create an iteration plan in `docs/iterations/iter-XX.md`.
3. Pick a small set of items (3–7) for `Current Iteration` and keep that scope stable unless it is explicitly re-planned.
4. Implement as vertical slices:
   - domain changes (if needed)
   - use cases
   - UI
   - tests
5. Merge to `main` via PR.
6. Treat merge to `main` as **integration**, not as production deploy.
7. Create a release tag when a specific state of `main` should go to production.
8. Finish an iteration when its full planned scope is complete; that milestone usually gets its own release.

## Definition of Done (DoD)

An iteration is "done" when:

- All planned items are merged to `main`.
- `npm run lint`, `npm test`, `npm run build` are green.
- Demo is deployed from the intended release tag and works.
- `CHANGELOG.md` is updated for the new version.
- A git tag exists for the release.

## CI/CD

- Merge to `main` triggers CI/integration, not production deploy.
- Production deploy happens on push of a release tag `vX.Y.Z`.
- There is no separate "release branch".
- Each merge is production-ready.
- Version tags may be created during an active iteration when a safe partial release is needed.

## Release flow

### Versioning

SemVer: `v0.x.y`

- `v0.(x+1).0` — milestone release / noticeable product increment
- `v0.x.(y+1)` — interim release, fix, polish, or safe partial release within an active iteration

`package.json` uses the same version without `v` (example: `0.2.0`).

### Iteration vs release

- Iteration = planning container for a fixed scope.
- Release = explicit publication of some already-merged state from `main`.
- Deploy = production rollout from a release tag.

An iteration may have zero, one, or multiple releases. A mid-iteration release
does not complete the iteration by itself.

### Commands (recommended)

```bash
npm version minor
git push --follow-tags
```
