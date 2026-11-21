# Animeverse — automated catalogue starter

This project upgrades a static Vercel site with a live anime catalogue using the public AniList GraphQL API.

## What is automated
- Search anime by title
- Browse trending, popular, top-rated, and current-season lists
- Automatically fetch posters, synopsis, genres, ratings, episode counts, and official AniList pages
- Save a personal watchlist in the current browser

## What is not automated
AniList supplies metadata, not licensed episode video streams. This project does **not** scrape streaming sites or provide copyrighted episodes. To offer playback, you must own or license the video files/streams and add a secure backend/catalogue for those authorized URLs. A production streaming service also needs user accounts, a database, storage/CDN, moderation, and rights clearance.

## Deploy to your existing Vercel project

1. Download and unzip this project.
2. In your GitHub `animeverse` repository, choose **Add file → Upload files**.
3. Upload `index.html` and the `api` folder (including `api/anime.js`) to the repository root. If the repository already has `index.html`, replace it with this version.
4. Commit the changes.
5. Vercel should automatically redeploy from the connected GitHub repository. If it does not, open Vercel → your project → Deployments → Redeploy.
6. Open your Vercel domain and test search, category tabs, Details, and Save.

No build command or environment variables are required for this starter. The `/api/anime` endpoint is a Vercel Node serverless function.

## Local preview (optional)

You need Node.js installed. From this folder run:

```bash
npx vercel dev
```

Then open the local URL shown by Vercel CLI. Opening `index.html` directly as a file will not run the `/api/anime` serverless endpoint.

## Notes
- The API endpoint caches responses briefly to reduce upstream requests.
- AniList API policies and availability can change; review https://anilist.gitbook.io/anilist-apiv2-docs/ before production use.
- This is a starter, not a complete commercial streaming backend.
