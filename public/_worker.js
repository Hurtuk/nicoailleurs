export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const ua = request.headers.get('user-agent') || '';
    const isCrawler = /facebookexternalhit|meta-externalagent|Twitterbot|LinkedInBot|WhatsApp/i.test(ua);
    const match = url.pathname.match(/^\/(?:en\/)?(trips|voyages)\/([^/]+)/);

    if (isCrawler && match) {
      const lang = url.pathname.startsWith('/en/') ? 'en' : 'fr';
      const slug = match[2];

      try {
        const metaRes = await fetch(
          `https://louiecinephile.fr/nicoailleurs/api/meta.php?slug=${slug}&lang=${lang}`,
          { redirect: 'follow' }
        );
        const meta = await metaRes.json();
        if (meta && !meta.error) {
          return new Response(buildHtml(meta), {
            headers: { 'Content-Type': 'text/html;charset=UTF-8' }
          });
        }
      } catch(e) {
        // En cas d'erreur, on laisse passer vers la SPA
      }
    }

    // Pour tout le reste : sert les assets statiques normalement
    return env.ASSETS.fetch(request);
  }
};

function buildHtml({ title, description, image, url }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="Nico Ailleurs">
</head>
<body></body>
</html>`;
}