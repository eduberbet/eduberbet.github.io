/**
 * LUMI BRAIN ROCKET 🧠 v2.1 - O MAESTRO DOS BITS
 * Arquitetura: Indexação por Ponteiros e Composição de Resposta
 * Autor: Eduardo Berbet (eduberbet) & LUMI AI
 */

const LUMI_BRAIN = {
    index: new Map(),
    dicionario: new Map(),
    fontes: ['./LRPS.md'],
    isReady: false,

    async init() {
        try {
            const response = await fetch(this.fontes[0]);
            if (!response.ok) throw new Error("Não foi possível carregar o LRPS.md");
            const text = await response.text();
            this.preCompilar(text);
            this.isReady = true;
            console.log("🚀 Cérebro v2.1: Sistema de IDs e Dicionário em órbita.");
        } catch (e) { 
            console.error("❌ Falha na ignição do Cérebro:", e); 
        }
    },

    /**
     * PRÉ-COMPILAÇÃO: Mapeia o Markdown para acesso instantâneo em memória.
     */
    preCompilar(texto) {
        const secoes = texto.split(/\n##\s+/);
        secoes.forEach(secao => {
            const linhas = secao.split('\n');
            const cabecalho = linhas[0].trim();

            // 1. MAPEIA O ÍNDICE (Busca Rápida)
            if (cabecalho.includes("[INDEX]")) {
                linhas.slice(1).forEach(linha => {
                    const match = linha.match(/(\d+):\s*(.*)/);
                    if (match) {
                        const id = match[1];
                        const termos = match[2].toLowerCase().split('|').map(t => t.trim());
                        this.index.set(id, termos);
                    }
                });
            } 
            // 2. MAPEIA O DICIONÁRIO (Conteúdo e Ações)
            else {
                const idMatch = cabecalho.match(/\[(\d+)\]/);
                if (idMatch) {
                    const id = idMatch[1];
                    const meta = {};
                    linhas.slice(1).forEach(l => {
                        if (l.startsWith("Título:")) meta.titulo = l.replace("Título:", "").trim();
                        if (l.startsWith("Explicação:")) meta.corpo = l.replace("Explicação:", "").trim();
                        if (l.startsWith("Ação:")) meta.corpo = l.replace("Ação:", "").trim();
                        if (l.startsWith("Social:")) meta.corpo = l.replace("Social:", "").trim();
                    });
                    this.dicionario.set(id, meta);
                }
            }
        });
    },

    /**
     * PROCESSAMENTO: Identifica as intenções do usuário por Scoring.
     */
    async processarRequisicao(pergunta, contexto, callback) {
        if (!this.isReady) {
            setTimeout(() => this.processarRequisicao(pergunta, contexto, callback), 200);
            return;
        }

        const raw = pergunta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        let idsAtivados = [];

        // Identifica quais IDs do INDEX aparecem na pergunta
        this.index.forEach((termos, id) => {
            if (termos.some(t => raw.includes(t))) {
                idsAtivados.push(id);
            }
        });

        // Orquestra a resposta final
        const respostaFinal = this.comporResposta(idsAtivados, contexto, raw);
        callback({ texto: respostaFinal, tipo: 'rocket_response' });
    },

    /**
     * COMPOSIÇÃO: Une conceitos, ações e variações aleatórias.
     */
    comporResposta(ids, contexto, raw) {
        // Função interna para sortear variações separadas por '|'
        const sortear = (texto) => {
            if (!texto) return "";
            const variantes = texto.split('|');
            return variantes[Math.floor(Math.random() * variantes.length)].trim();
        };

        // Separação por Categoria (Ação/Social vs Conceito Técnico)
        const acoes = ids.filter(id => parseInt(id) >= 900);
        const conceitos = ids.filter(id => parseInt(id) < 900);

        // REGRA 1: Fallback (Nada encontrado)
        if (ids.length === 0) {
            const fallback = this.dicionario.get('999');
            return sortear(fallback ? fallback.corpo : "Hum, não entendi. Pode repetir?");
        }

        // REGRA 2: Ação + Conceito (Ex: Piada de PWA)
        if (acoes.length > 0 && conceitos.length > 0) {
            const acaoData = this.dicionario.get(acoes[0]);
            const conceitoData = this.dicionario.get(conceitos[0]);
            
            let base = sortear(acaoData.corpo);
            const nomeConceito = conceitoData.titulo || this.index.get(conceitos[0])[0];
            return base.replace(/{CONCEITO}/g, nomeConceito);
        }

        // REGRA 3: Apenas Ação/Social (Ex: "Oi", "Tudo bem")
        if (acoes.length > 0 && conceitos.length === 0) {
            const socialData = this.dicionario.get(acoes[0]);
            return sortear(socialData.corpo).replace("{NOME}", contexto.nome || "amigo");
        }

        // REGRA 4: Apenas Conceitos (Ex: "O que é PWA e WebSockets?")
        if (conceitos.length > 0) {
            let prefixos = [
                "Sintonizei aqui: ",
                "A Rocket buscou no cofre: ",
                "Olha o que descobri: "
            ];
            let resumo = prefixos[Math.floor(Math.random() * prefixos.length)];

            conceitos.forEach((id, idx) => {
                const data = this.dicionario.get(id);
                if (data) {
                    const sep = idx === 0 ? "" : (idx === conceitos.length - 1 ? " e além disso, " : ", ");
                    resumo += sep + sortear(data.corpo);
                }
            });

            return resumo + ". Bem legal, né? 🚀";
        }

        return "Erro no processamento da Rocket. Verifique o LRPS.";
    }
};

// Inicialização automática
LUMI_BRAIN.init();