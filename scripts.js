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

    status.innerText = "Versão demo (API não disponível online) ⚠️"

    const codigoGerado = `
    <div style="padding:20px;background:#222;color:white;border-radius:10px">
        <h2>Exemplo gerado</h2>
        <button style="background:#05beec;color:black;padding:10px;border:none;border-radius:8px">
            Botão exemplo
        </button>
    </div>
    `

    codigoParaCopiar = codigoGerado

    iframeCodigo.srcdoc = `
        <body style="background:#1e1e1e;color:#fff;font-family:monospace;padding:20px;">
            <pre>${codigoGerado
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')}
            </pre>
        </body>
    `

    resultadoCodigo.srcdoc = codigoGerado
} catch (erro) {
        console.error(erro)
        status.innerText = "Erro ao gerar código 😢"
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