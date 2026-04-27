const button = document.querySelector('.botao-gerar')
const textarea = document.querySelector('.caixa-texto')
const status = document.querySelector('.status')

const iframeCodigo = document.querySelector('.iframe-codigo')
const resultadoCodigo = document.querySelector('.resultado-codigo')
const botaoCopiar = document.querySelector('.botao-copiar')

let codigoParaCopiar = ""

async function gerarCodigo() {
    const textoUsuario = textarea.value.trim()

    if (!textoUsuario) {
        status.innerText = "Digite algo primeiro 😅"
        return
    }

    button.disabled = true
    status.innerText = "Gerando com IA..."

    try {
        const resposta = await fetch("/api/gerar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt: textoUsuario })
        })

        // 🔥 tratamento mais seguro
        const dados = await resposta.json()

        if (!resposta.ok) {
            throw new Error(dados?.erro || "Erro na API")
        }

        if (!dados.codigo) {
            throw new Error("IA não retornou código")
        }

        let codigoGerado = dados.codigo
            .replace(/```html|```/g, "")
            .trim()

        codigoParaCopiar = codigoGerado

        status.innerText = "Código gerado com sucesso 🚀"

        // 📄 preview do código
        iframeCodigo.srcdoc = `
<!DOCTYPE html>
<html>
<body style="background:#1e1e1e;color:#fff;font-family:monospace;padding:20px;">
<pre>${escapeHtml(codigoGerado)}</pre>
</body>
</html>
        `

        // 👀 preview executando
        resultadoCodigo.srcdoc = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body>
${codigoGerado}
</body>
</html>
        `

    } catch (erro) {
        console.error("ERRO:", erro)

        status.innerText = erro.message || "Erro ao gerar código 😢"

        resultadoCodigo.srcdoc = `
        <html>
        <body style="font-family:sans-serif;color:red;">
        <h3>Erro ao gerar com IA</h3>
        <p>${erro.message}</p>
        </body>
        </html>
        `
    } finally {
        button.disabled = false
    }
}

// 🔐 função de segurança (evita quebrar HTML no preview)
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
}

// 📋 copiar código
botaoCopiar.addEventListener('click', () => {
    if (!codigoParaCopiar) {
        alert("Nada para copiar ainda 😅")
        return
    }

    navigator.clipboard.writeText(codigoParaCopiar)
    alert("Código copiado! 🎉")
})

// 🚀 evento principal
button.addEventListener('click', gerarCodigo)
