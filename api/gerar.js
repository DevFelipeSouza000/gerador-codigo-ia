export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: "Gere apenas HTML simples com um botão azul animado"
          }
        ]
      })
    })

    const data = await response.json()

    console.log("🔥 RESPOSTA COMPLETA GROQ:", JSON.stringify(data, null, 2))

    // 🔥 MOSTRAR ERRO REAL se existir
    if (data.error) {
      return res.status(500).json({
        erro: "Groq retornou erro",
        detalhe: data.error
      })
    }

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({
        erro: "Resposta inválida da IA",
        raw: data
      })
    }

    return res.status(200).json({
      codigo: data.choices[0].message.content
    })

  } catch (err) {
    console.error("ERRO BACKEND:", err)

    return res.status(500).json({
      erro: "Erro interno",
      detalhe: err.message
    })
  }
}
