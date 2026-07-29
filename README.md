# The Suites at Adair

Cloudflare Pages-ready website for The Suites at Adair.

## Cloudflare Pages build settings

- Framework preset: None
- Production branch: main
- Build command: leave blank
- Build output directory: `/`

## Inquiry form setup

The form posts to the Cloudflare Pages Function at `/api/inquiry`.

In Cloudflare Pages, open **Settings → Variables and Secrets** and add:

- `RESEND_API_KEY` — API key from Resend
- `INQUIRY_TO_EMAIL` — email address that should receive inquiries
- `INQUIRY_FROM_EMAIL` — optional verified sender, such as `The Suites at Adair <inquiries@thesuitesatadair.com>`

After adding variables, redeploy the project.

## Project structure

- `index.html`
- `css/style.css`
- `js/app.js`
- `images/`
- `functions/api/inquiry.js`
- `_headers`
