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
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: `
Você é um gerador de código HTML e CSS.
Responda APENAS com código.
Não escreva explicações.
Crie algo visual e, se possível, animado.
`
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    })

    const data = await response.json()

    const codigo = data?.choices?.[0]?.message?.content

    if (!codigo) {
      throw new Error("Resposta vazia da IA")
    }

    return res.status(200).json({ codigo })

  } catch (erro) {
    console.error(erro)

    return res.status(500).json({
      codigo: `<p style="color:red;">Erro ao gerar código 😢</p>`
    })
  }
}