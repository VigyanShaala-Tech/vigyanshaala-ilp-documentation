# vigyanshaala-ilp-documentation

Documentation site for the **VigyanShaala ILP Student Guide**, built with [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) and published to GitHub Pages.

All content is under `docs/` — **Web** and **Android** student guides only (no admin or Studio content).

## Local preview

```bash
pip install -r requirements.txt
mkdocs serve -a 127.0.0.1:2060
```

Then open <http://127.0.0.1:2060>.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site with MkDocs and publishes it to GitHub Pages.

For this to work, GitHub Pages must be enabled for this repo: **Settings → Pages → Source: GitHub Actions**.

Once enabled, the site is live at **https://help.vigyanshaala.com/**.
