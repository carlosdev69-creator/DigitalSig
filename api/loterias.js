module.exports = async function handler(req, res) {
  try {
    const baseUrl = "https://loteriascaixa-api.herokuapp.com/api";

    const [megaResponse, lotoResponse] = await Promise.all([
      fetch(`${baseUrl}/megasena/latest`),
      fetch(`${baseUrl}/lotofacil/latest`)
    ]);

    if (!megaResponse.ok || !lotoResponse.ok) {
      const megaError = megaResponse.ok ? "" : await megaResponse.text();
      const lotoError = lotoResponse.ok ? "" : await lotoResponse.text();

      return res.status(502).json({
        error: `Falha ao consultar loterias. Mega: ${megaError} | Lotofácil: ${lotoError}`
      });
    }

    const [mega, loto] = await Promise.all([
      megaResponse.json(),
      lotoResponse.json()
    ]);

    return res.status(200).json({
      mega: {
        concurso: mega.concurso,
        dezenas: Array.isArray(mega.dezenas) ? mega.dezenas : []
      },
      lotofacil: {
        concurso: loto.concurso,
        dezenas: Array.isArray(loto.dezenas) ? loto.dezenas : []
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: `Erro interno ao consultar loterias: ${error.message}`
    });
  }
};