# Aayusha Chakraborty Portfolio

React 19 + Vite single-page portfolio for AI/ML, data science, forecasting, supply chain analytics, RL pricing, and marketing analytics work.

## Stack

- React 19
- Vite
- Manual router via `window.location.pathname`
- JSON-driven content in `src/data/*.json`
- Optional API override via `VITE_API_URL`

## Run Locally

```bash
npm install
npm run dev
```

## Content

- Person, stats, contact, and resume path: `src/data/person.json`
- Projects and project images: `src/data/projects.json`
- Skills, awards, experience, manifesto, ticker, video, and SEO meta all live in `src/data/*.json`

To swap a project image, edit `projects.json[].image`.

## Optional Environment Variables

- `VITE_API_URL`: optional backend base URL used for `/api/profile` and `/api/contact`

If it is not set, the app runs entirely from local JSON.

## Deploy

Vercel and Netlify defaults work:

- Build command: `npm run build`
- Output directory: `dist`

## Notes

- Resume download is served from `public/Aayusha_Chakraborty_Data_Scientist.pdf`
- OG image path is `public/og-image.png`
- Sitemap and robots are in `public/`
