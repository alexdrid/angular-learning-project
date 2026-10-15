# CI/CD Workflows

This folder holds two GitHub Actions workflows:

| Workflow                   | File                       | Purpose                                      |
| -------------------------- | -------------------------- | -------------------------------------------- |
| **Quality**                | [quality.yml](quality.yml) | Lints, checks formatting and builds the app  |
| **Deploy to GitHub Pages** | [deploy.yml](deploy.yml)   | Publishes the app, only after Quality passes |

## When each workflow runs

| Event                           | What runs                        |
| ------------------------------- | -------------------------------- |
| Pull request targeting `main`   | Quality only                     |
| Push (or merge) to `main`       | Deploy, which runs Quality first |
| Manual run from the Actions tab | Deploy, which runs Quality first |

## Quality

Quality runs three independent jobs in parallel. Each one checks out the code, sets up Node.js 24 with npm caching and runs `npm install`, then runs its own check:

| Job            | Command                | Fails when                                |
| -------------- | ---------------------- | ----------------------------------------- |
| `lint`         | `npm run lint`         | ESLint reports errors                     |
| `check-format` | `npm run check-format` | Files don't match the Prettier formatting |
| `build`        | `npm run build`        | The Angular app doesn't compile           |

Quality has two triggers:

- `pull_request` on `main`, so every PR shows the checks before it is merged.
- `workflow_call`, which lets Deploy run it as a step. Quality has no `push` trigger of its own, because Deploy already runs it on every push to `main`; adding one would run the checks twice.

To fix a failing check locally, run the same command, for example `npm run lint`. For formatting, run Prettier on the files it lists.

## Deploy to GitHub Pages

Deploy runs three jobs in a chain. Each job starts only if the one before it succeeded:

```
quality ──▶ build ──▶ deploy
```

1. **`quality`** runs the whole Quality workflow (`uses: ./.github/workflows/quality.yml`). If lint, the format check or the build fails, nothing is deployed.
2. **`build`** builds the production app and prepares it for GitHub Pages:
   - `ng build --base-href /angular-learning-project/`. The site is served from `https://alexdrid.github.io/angular-learning-project/`, not from the domain root, so the base href makes scripts, assets and routes resolve inside that folder.
   - Copies `index.html` to `404.html`. GitHub Pages has no server-side routing, so a direct visit to a deep link such as `/about` would return a 404. Serving the app as the 404 page lets the Angular router handle that URL instead.
   - `configure-pages` and `upload-pages-artifact` package `dist/angular-learning-project/browser` as the site artifact.
3. **`deploy`** publishes the artifact with `deploy-pages` to the `github-pages` environment. The environment's `url` is set from the step's `page_url` output, so every run links to the live site.

### Other settings in deploy.yml

- **`permissions`**: `pages: write` and `id-token: write` let `deploy-pages` publish the site. `contents: read` lets the jobs check out the code.
- **`concurrency`**: every run joins the `pages` group, so only one deploy runs at a time. With `cancel-in-progress: true`, a new push to `main` cancels a run that is still in progress, and only the newest commit is deployed.

## Writing paths in the app

Because of the base href, write asset paths in templates and styles without a leading slash, for example `images/logo.png`. A path like `/images/logo.png` points at the domain root and returns a 404 on GitHub Pages.

## Redeploying by hand

To redeploy without pushing a commit, open **Actions → Deploy to GitHub Pages → Run workflow** on GitHub, or run:

```sh
gh workflow run deploy.yml
```

Manual runs also go through Quality first.
