const { XMLParser } = require("fast-xml-parser");

module.exports = async function handler(req, res) {
  try {
    const rssUrl = "https://g1.globo.com/rss/g1/sp/campinas-regiao/";
    const response = await fetch(rssUrl);

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(502).json({
        error: `Falha ao consultar RSS: ${errorText}`
      });
    }

    const xml = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      trimValues: true
    });

    const parsed = parser.parse(xml);
    const rawItems = parsed?.rss?.channel?.item ?? [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];

    const normalizedItems = items
      .filter((item) => item && item.title)
      .slice(0, 4)
      .map((item) => ({
        title: item.title,
        link: item.link || ""
      }));

    return res.status(200).json({
      items: normalizedItems
    });
  } catch (error) {
    return res.status(500).json({
      error: `Erro interno ao consultar notícias: ${error.message}`
    });
  }
};