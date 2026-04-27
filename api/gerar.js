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
            content: `
Você é um gerador de interfaces web.

REGRAS OBRIGATÓRIAS:
- Gere APENAS HTML + CSS
- NÃO escreva explicações
- NÃO use markdown
- NÃO use texto fora do código

FOCO PRINCIPAL:
- SEMPRE use animações com @keyframes
- Crie interfaces modernas e visuais
- Use animações como: pulse, float, rotate, glow, slide
- Use transform, opacity, scale, translate
- Tudo deve ser visual e animado
- O resultado deve parecer um site moderno em movimento
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

    // 🔥 erro vindo da IA
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

    // 🧼 limpeza leve (caso venha markdown)
    const codigoLimpo = codigo
      .replace(/```html|```/g, "")
      .trim()

    return res.status(200).json({
      codigo: codigoLimpo
    })

  } catch (err) {
    console.error(err)

    return res.status(500).json({
      erro: "Erro interno no servidor",
      detalhe: err.message
    })
  }
}
