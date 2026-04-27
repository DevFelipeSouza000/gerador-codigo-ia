export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" })
  }

  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ erro: "Prompt vazio" })
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "Você gera apenas HTML e CSS. Não explique nada. Apenas código."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    })

    const data = await response.json()

    // 🔥 tratamento de erro da IA
    if (data.error) {
      return res.status(500).json({
        erro: "Erro da IA",
        detalhe: data.error
      })
    }

    const codigo = data?.choices?.[0]?.message?.content

    if (!codigo) {
      return res.status(500).json({
        erro: "IA não retornou código",
        raw: data
      })
    }

    return res.status(200).json({
      codigo
    })

  } catch (err) {
    console.error(err)

    return res.status(500).json({
      erro: "Erro interno no servidor",
      detalhe: err.message
    })
  }
}
