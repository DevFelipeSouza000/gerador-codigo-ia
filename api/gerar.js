export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" })
  }

  try {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ erro: "Prompt vazio" })
    }

    // 🔍 DEBUG: ver se a chave existe
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        erro: "API KEY não encontrada"
      })
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: `
Gere apenas HTML + CSS.
Não escreva explicações.
Não use markdown.
Crie algo visual e animado.
`
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    })

    // 🔍 DEBUG: ver resposta bruta
    const text = await response.text()
    console.log("Resposta bruta:", text)

    let data

    try {
      data = JSON.parse(text)
    } catch {
      return res.status(500).json({
        erro: "Resposta inválida da IA",
        raw: text
      })
    }

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({
        erro: "IA não retornou código",
        data
      })
    }

    const codigo = data.choices[0].message.content

    return res.status(200).json({ codigo })

  } catch (erro) {
    console.error("ERRO NO BACKEND:", erro)

    return res.status(500).json({
      erro: "Erro interno no servidor",
      detalhes: erro.message
    })
  }
}
