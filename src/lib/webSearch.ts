/**
 * Web Search Grounding Utility for Agent One (New Chat Mode)
 * Provides live web search retrieval to power closed, authoritative answers with citations.
 */

export interface WebSearchResult {
  title: string;
  snippet: string;
  url: string;
}

/**
 * Decode common HTML entities in title and snippet strings
 */
function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Perform live web search for a user query across DuckDuckGo and Wikipedia
 */
export async function searchWeb(query: string, maxResults = 5): Promise<WebSearchResult[]> {
  const cleanQuery = (query || '').trim();
  if (!cleanQuery) return [];

  const results: WebSearchResult[] = [];
  const seenUrls = new Set<string>();

  // 1. DuckDuckGo Instant Answer API (fast structured knowledge)
  try {
    const instantUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(cleanQuery)}&format=json&no_html=1&skip_disambig=1`;
    const instantRes = await fetch(instantUrl, { signal: AbortSignal.timeout(3000) });
    if (instantRes.ok) {
      const data = await instantRes.json();
      if (data.AbstractText && data.AbstractURL && !seenUrls.has(data.AbstractURL)) {
        results.push({
          title: decodeHtmlEntities(data.Heading || cleanQuery),
          snippet: decodeHtmlEntities(data.AbstractText),
          url: data.AbstractURL
        });
        seenUrls.add(data.AbstractURL);
      }

      if (Array.isArray(data.RelatedTopics)) {
        for (const topic of data.RelatedTopics) {
          if (topic.Text && topic.FirstURL && !seenUrls.has(topic.FirstURL)) {
            results.push({
              title: decodeHtmlEntities(topic.Text.slice(0, 60)),
              snippet: decodeHtmlEntities(topic.Text),
              url: topic.FirstURL
            });
            seenUrls.add(topic.FirstURL);
            if (results.length >= 2) break;
          }
        }
      }
    }
  } catch {
    // Non-blocking timeout/network fallback
  }

  // 2. DuckDuckGo HTML Web Search (Live web indexing)
  try {
    const htmlUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(cleanQuery)}`;
    const htmlRes = await fetch(htmlUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(3500)
    });

    if (htmlRes.ok) {
      const html = await htmlRes.text();
      const blocks = html.split('<div class="result results_links');

      for (let i = 1; i < blocks.length && results.length < maxResults + 2; i++) {
        const block = blocks[i];
        const titleMatch = block.match(/<a[^>]*class="result__a"[^>]*>([\s\S]*?)<\/a>/);
        const snippetMatch = block.match(/<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);
        const urlMatch = block.match(/class="result__url"[^>]*>([\s\S]*?)<\/a>/);

        if (titleMatch && snippetMatch) {
          const rawTitle = titleMatch[1];
          const rawSnippet = snippetMatch[1];
          const rawUrl = urlMatch ? urlMatch[1] : '';

          let link = rawUrl.replace(/<[^>]+>/g, '').trim();
          if (link.includes('uddg=')) {
            const m = link.match(/uddg=([^&]+)/);
            if (m) link = decodeURIComponent(m[1]);
          }
          if (link && !link.startsWith('http')) {
            link = 'https://' + link;
          }

          const title = decodeHtmlEntities(rawTitle);
          const snippet = decodeHtmlEntities(rawSnippet);

          if (title && snippet && link && !seenUrls.has(link)) {
            seenUrls.add(link);
            results.push({ title, snippet, url: link });
          }
        }
      }
    }
  } catch {
    // Non-blocking timeout/network fallback
  }

  // 3. Fallback: Wikipedia REST API if results are sparse
  if (results.length < 2) {
    try {
      const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery.replace(/\s+/g, '_'))}`;
      const wikiRes = await fetch(wikiUrl, { signal: AbortSignal.timeout(2500) });
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        if (wikiData.extract && wikiData.content_urls?.desktop?.page && !seenUrls.has(wikiData.content_urls.desktop.page)) {
          results.unshift({
            title: decodeHtmlEntities(wikiData.title || cleanQuery),
            snippet: decodeHtmlEntities(wikiData.extract),
            url: wikiData.content_urls.desktop.page
          });
          seenUrls.add(wikiData.content_urls.desktop.page);
        }
      }
    } catch {
      // Non-blocking
    }
  }

  return results.slice(0, maxResults);
}
