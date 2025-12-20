# Finexo

AI-Powered Financial Assistant.

## Deployment

This project is configured for automated deployment to **Cloudflare Workers (Static Assets)** via GitHub Actions.

### Automation Setup

1.  **Cloudflare**: Obtain your `ACCOUNT_ID` and a `Workers API Token`.
2.  **GitHub Secrets**: Add the following secrets to your repository:
    - `CLOUDFLARE_ACCOUNT_ID`
    - `CLOUDFLARE_API_TOKEN`
    - `VITE_GOOGLE_API_KEY` (Required for AI features)

Any push to the `main` branch will automatically build and deploy the application.

## Development

```bash
npm install
npm run dev
```

Ensure you have a `.env` file with `VITE_GOOGLE_API_KEY`.

