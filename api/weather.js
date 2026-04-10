module.exports = async function handler(req, res) {
  try {
    const apiKey = process.env.OPENWEATHER_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Variável OPENWEATHER_KEY não configurada"
      });
    }

    const lat = -22.7392;
    const lon = -47.3313;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Falha ao consultar clima: ${errorText}`
      });
    }

    const data = await response.json();

    return res.status(200).json({
      temp: Math.round(data.main?.temp ?? 0),
      description: data.weather?.[0]?.description ?? "Sem descrição",
      city: data.name ?? "Americana",
      cityLabel: "Americana/SP"
    });
  } catch (error) {
    return res.status(500).json({
      error: `Erro interno ao consultar clima: ${error.message}`
    });
  }
};