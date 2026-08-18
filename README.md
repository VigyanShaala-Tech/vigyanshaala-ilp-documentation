# vigyanshaala-ilp-documentation

Student user guide for the [VigyanShaala International Learning Platform](https://mycommunity.vigyanshaala.com/), built with [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) and published to GitHub Pages.

This guide covers **student / learner activities only** — no Studio, Control Hub, or admin content.

## Local preview

```bash
pip install -r requirements.txt
mkdocs serve -a 127.0.0.1:2060
```

Then open <http://127.0.0.1:2060>.

## Build

```bash
mkdocs build --strict
```

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.

For this to work, GitHub Pages must be enabled: **Settings → Pages → Source: GitHub Actions**.
