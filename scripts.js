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

        const dados = await resposta.json()

        if (!dados.codigo) {
            throw new Error("Resposta inválida da API")
        }

        let codigoGerado = dados.codigo
            .replace(/```html|```/g, "") // limpa markdown
            .trim()

        codigoParaCopiar = codigoGerado

        status.innerText = "Código gerado com sucesso 🚀"

        // Mostrar código (escapado)
        iframeCodigo.srcdoc = `
        <!DOCTYPE html>
        <html>
        <body style="background:#1e1e1e;color:#fff;font-family:monospace;padding:20px;">
        <pre>${codigoGerado
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')}
        </pre>
        </body>
        </html>
        `

        // Mostrar resultado funcionando
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
        console.error(erro)

        status.innerText = "Erro ao gerar código 😢"

        // fallback visual (muito importante pro portfólio)
        resultadoCodigo.srcdoc = `
        <html>
        <body style="font-family:sans-serif;color:red;">
        <h3>Erro ao gerar com IA</h3>
        <p>Tente novamente</p>
        </body>
        </html>
        `
    } finally {
        button.disabled = false
    }
}

// Copiar código
botaoCopiar.addEventListener('click', () => {
    if (!codigoParaCopiar) {
        alert("Nada para copiar ainda 😅")
        return
    }

    navigator.clipboard.writeText(codigoParaCopiar)
    alert("Código copiado! 🎉")
})

// Evento botão
button.addEventListener('click', gerarCodigo)
