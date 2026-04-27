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
            content: "Gere apenas um HTML simples com botão azul"
          }
        ]
      })
    })

    const text = await response.text()

    console.log("🔥 RESPOSTA BRUTA DA GROQ:", text)

    return res.status(200).json({
      debug: text
    })

  } catch (err) {
    return res.status(500).json({
      erro: err.message
    })
  }
}
