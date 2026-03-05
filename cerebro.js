/**
 * LUMI BRAIN 2.0 🧠 - O Fatiador de Markdown
 * Desenvolvido para: LUMI Rocket (QA Canaveral)
 */

const LUMI_BRAIN = {
    memoria: {},
    fontes: [
        'https://raw.githubusercontent.com/eduberbet/Lumi/main/ReadMe.md',
        // 'https://raw.githubusercontent.com/eduberbet/Lumi/main/docs/visao_geral.md' // Exemplo de docs extras
    ],

    // Mapa de Sinônimos: Aponta palavras-chave para o Título da Seção no MD
    mapaSinonimos: {
        "tecnologias": ["stack", "linguagem", "feito com", "js", "html", "css", "tecnologia"],
        "instalacao": ["como usar", "rodar", "baixar", "instalar", "configurar", "setup"],
        "arquitetura": ["como funciona", "estrutura", "cerebro", "pinky", "core", "funcionamento"],
        "objetivo": ["proposito", "missao", "porque", "sobre", "projeto"]
    },

    async init() {
        console.log("🧠 Cérebro: Iniciando ingestão de dados...");
        for (const url of this.fontes) {
            try {
                const response = await fetch(url);
                const text = await response.text();
                this.fatiarMarkdown(text);
            } catch (e) {
                console.error("❌ Erro ao carregar fonte:", url);
            }
        }
    },

    fatiarMarkdown(texto) {
        // Divide o MD em seções baseadas no título de segundo nível "## "
        const secoes = texto.split(/^##\s+/m);
        
        secoes.forEach(secao => {
            const linhas = secao.split('\n');
            const titulo = linhas[0].toLowerCase().trim();
            const conteudo = linhas.slice(1).join('\n').trim();
            
            if (titulo && conteudo) {
                this.memoria[titulo] = conteudo;
            }
        });
    },

    limparMarkdown(texto) {
        return texto
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links mantendo o texto: [texto](url) -> texto
            .replace(/[*_~`]/g, '')                   // Remove formatação: **, _, ~~, `
            .replace(/!\[.*\]\(.*\)/g, '')             // Remove imagens
            .replace(/\n{2,}/g, '\n')                  // Remove quebras de linha excessivas
            .trim();
    },

    async enviar(pergunta, historico, callback) {
        const raw = pergunta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        let respostaEncontrada = null;

        // 1. Busca via Mapa de Sinônimos
        for (const [secao, palavras] of Object.entries(this.mapaSinonimos)) {
            if (palavras.some(p => raw.includes(p))) {
                if (this.memoria[secao]) {
                    respostaEncontrada = this.memoria[secao];
                    break;
                }
            }
        }

        // 2. Busca direta por título (caso não tenha no mapa)
        if (!respostaEncontrada) {
            for (const titulo in this.memoria) {
                if (raw.includes(titulo)) {
                    respostaEncontrada = this.memoria[titulo];
                    break;
                }
            }
        }

        // 3. Resposta Final
        if (respostaEncontrada) {
            const textoLimpo = this.limparMarkdown(respostaEncontrada);
            // Retorna apenas os primeiros 300 caracteres para não sobrecarregar a voz (opcional)
            const resumo = textoLimpo.length > 400 ? textoLimpo.substring(0, 397) + "..." : textoLimpo;
            
            callback({ corpo_da_dica: resumo });
        } else {
            // Se o cérebro falhar, ele pede um Fallback pro Database (via script.js)
            callback({ corpo_da_dica: LUMI_DB.getResposta('fallbacks') });
        }
    }
};

// Auto-inicia o carregamento ao carregar o script
LUMI_BRAIN.init();