// Vercel serverless function: proxies AniList GraphQL so the browser does not call it directly.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const page = Math.max(1, Math.min(100, Number.parseInt(req.query.page || '1', 10) || 1));
  const perPage = Math.max(1, Math.min(50, Number.parseInt(req.query.perPage || '24', 10) || 24));
  const search = String(req.query.search || '').slice(0, 100);
  const requestedSort = String(req.query.sort || 'TRENDING_DESC');
  const allowedSorts = new Set(['TRENDING_DESC', 'POPULARITY_DESC', 'SCORE_DESC', 'START_DATE_DESC']);
  const sort = allowedSorts.has(requestedSort) ? requestedSort : 'TRENDING_DESC';

  const query = `
    query ($page: Int, $perPage: Int, $search: String, $sort: [MediaSort]) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { total currentPage lastPage hasNextPage }
        media(type: ANIME, search: $search, sort: $sort, isAdult: false) {
          id
          title { romaji english native }
          description(asHtml: false)
          coverImage { large medium }
          genres
          averageScore
          format
          episodes
          status
          seasonYear
          startDate { year }
          siteUrl
        }
      }
    }`;
  try {
    const upstream = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query, variables: { page, perPage, search: search || null, sort: [sort] } })
    });
    const body = await upstream.json();
    if (!upstream.ok || body.errors) {
      return res.status(upstream.status || 502).json({ error: 'AniList catalogue is temporarily unavailable.' });
    }
    return res.status(200).json(body.data.Page);
  } catch (error) {
    return res.status(502).json({ error: 'Could not reach the anime catalogue service.' });
  }
}
