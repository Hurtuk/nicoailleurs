export default {
  async fetch(request: Request, env: { ASSETS: { fetch: typeof fetch } }) {
    const url = new URL(request.url);
    const ua = request.headers.get('user-agent') || '';

    const isCrawler = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|Slackbot|Discordbot/i.test(ua);
    const match = url.pathname.match(/^\/(?:en\/)?(trips|voyages|guides|villes|cities|pays|countries)\/([^/]+)/);

    // =========================
    // 1. OG DYNAMIQUE (crawlers)
    // =========================
    if (isCrawler && match) {
      const lang = url.pathname.startsWith('/en/') ? 'en' : 'fr';
      const seg = match[1];
      const type =
        seg === 'guides' ? 'guide' :
        (seg === 'villes' || seg === 'cities') ? 'city' :
        (seg === 'pays' || seg === 'countries') ? 'country' :
        'trip';
      const slug = match[2];

      try {
        const metaRes = await fetch(
          `https://louiecinephile.fr/nicoailleurs/api/meta.php?type=${type}&slug=${slug}&lang=${lang}`,
          { cf: { cacheTtl: 300 } } as any // cache API 5 min
        );

        const meta = await metaRes.json() as any;

        if (meta && !meta.error) {
          return new Response(buildHtml(meta), {
            headers: {
              'Content-Type': 'text/html;charset=UTF-8',
              'Cache-Control': 'public, max-age=300',
            }
          });
        }
      } catch (e) {
        // fallback SPA
      }
    }

    // =========================
    // 2. ASSETS (SPA)
    // =========================
    let response = await env.ASSETS.fetch(request);

    // =========================
    // 3. FALLBACK SPA
    // =========================
    if (response.status === 404) {
      const indexRequest = new Request(new URL('/', request.url).toString(), request);
      response = await env.ASSETS.fetch(indexRequest);
    }

    // =========================
    // 4. CACHE INTELLIGENT
    // =========================
    const contentType = response.headers.get('Content-Type') || '';

    // Assets statiques (JS, CSS, images)
    if (
      contentType.includes('javascript') ||
      contentType.includes('css') ||
      contentType.includes('image') ||
      contentType.includes('font')
    ) {
      return new Response(response.body, {
        ...response,
        headers: {
          ...response.headers,
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    }

    // HTML (SPA)
    if (contentType.includes('text/html')) {
      return new Response(response.body, {
        ...response,
        headers: {
          ...response.headers,
          'Cache-Control': 'no-cache',
        }
      });
    }

    return response;
  }
};

// =========================
// HTML OG
// =========================
function buildHtml({ title, description, image, url }: any) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">

  <title>${escape(title)}</title>
  <meta name="description" content="${escape(description)}">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:image" content="${image}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="Nico Ailleurs">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escape(title)}">
  <meta name="twitter:description" content="${escape(description)}">
  <meta name="twitter:image" content="${image}">

  <link rel="canonical" href="${url}">
</head>
<body></body>
</html>`;
}

// =========================
// Sécurité HTML
// =========================
function escape(str: string) {
  return str
    ?.replace(/&/g, "&amp;")
    ?.replace(/</g, "&lt;")
    ?.replace(/>/g, "&gt;")
    ?.replace(/"/g, "&quot;")
    ?.replace(/'/g, "&#039;");
}