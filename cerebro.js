/**
 * LUMI ROCKET - CÉREBRO v4.0 (Beta Stabilizer)
 * Correções: Buffer Acumulativo, Prioridade Social e Reset de Contexto
 */

const LUMI_BRAIN = {
    tree: {}, 
    dicionario: new Map(),
    fonte: './LRPS.md',
    isReady: false,
    
    memoria: {
        ultimoID: null,
        explicados: new Set()
    },

    async init() {
        try {
            const res = await fetch(this.fonte);
            const text = await res.text();
            this.construirArvore(text);
            this.isReady = true;
            console.log("🚀 Cérebro v4.0: Estabilizadores Online");
        } catch (e) { console.error("❌ Erro na ignição:", e); }
    },

    construirArvore(texto) {
        const secoes = texto.split(/\n##\s+/);
        secoes.forEach(secao => {
            const linhas = secao.split('\n');
            const cabecalho = linhas[0].trim();
            const idMatch = cabecalho.match(/\[(\d+)\]/);

            if (cabecalho.includes("[INDEX]")) {
                linhas.slice(1).forEach(linha => {
                    const match = linha.match(/(\d+):\s*(.*)/);
                    if (match) {
                        const id = match[1];
                        const aliases = match[2].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split('|').map(a => a.trim());
                        aliases.forEach(alias => {
                            let node = this.tree;
                            alias.split(/\s+/).forEach((palavra, index, arr) => {
                                if (!node[palavra]) node[palavra] = { _ids: [] };
                                node = node[palavra];
                                if (index === arr.length - 1) node._ids.push(id);
                            });
                        });
                    }
                });
            } else if (idMatch) {
                const id = idMatch[1];
                const meta = { corpo: "", titulo: "" };
                linhas.slice(1).forEach(l => {
                    if (l.startsWith("Título:")) meta.titulo = l.replace("Título:", "").trim();
                    else if (l.includes("Corpo:")) meta.corpo = l.split('Corpo:')[1].trim();
                });
                this.dicionario.set(id, meta);
            }
        });
    },

    processarRequisicao(pergunta, contexto, callback) {
        if (!this.isReady) return;
        const input = pergunta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const tokens = input.split(/\s+/).filter(t => t.length > 0);
        let encontrados = new Set();

        for (let i = 0; i < tokens.length; i++) {
            let node = this.tree;
            for (let j = i; j < tokens.length; j++) {
                if (node[tokens[j]]) {
                    node = node[tokens[j]];
                    if (node._ids.length > 0) node._ids.forEach(id => encontrados.add(id));
                } else break;
            }
        }

        const resposta = this.compor(Array.from(encontrados), contexto, input);
        callback({ texto: resposta });
    },

    compor(ids, contexto, raw) {
        let buffer = [];
        let acoes = ids.filter(id => parseInt(id) >= 900);
        let conceitos = ids.filter(id => parseInt(id) < 900);

        // --- REGRA 1: PRIORIDADE SOCIAL ---
        // Se der match em Saudações (950) ou Social (910), limpamos a memória técnica
        if (acoes.some(id => id === '950' || id === '910')) {
            this.memoria.ultimoID = null;
            this.memoria.explicados.clear();
        }

        // --- REGRA 2: ESPECIFICIDADE ---
        if ((conceitos.includes('102') || conceitos.includes('103')) && conceitos.includes('101')) {
            conceitos = conceitos.filter(id => id !== '101');
        }

        // --- REGRA 3: RECUPERAÇÃO DE CONTEXTO ---
        if (conceitos.length === 0 && acoes.length > 0 && this.memoria.ultimoID) {
            conceitos = [this.memoria.ultimoID];
        }

        const sortear = (id) => {
            const variantes = this.dicionario.get(id)?.corpo.split('|') || ["..."];
            return variantes[Math.floor(Math.random() * variantes.length)].trim();
        };

        const querHumor = acoes.some(a => ['900', '905', '906'].includes(a)) || raw.includes("piada");

        // --- COMPOSIÇÃO DE RESPOSTA ---
        if (conceitos.length > 0) {
            let textosConceitos = conceitos.map(id => {
                this.memoria.ultimoID = id;
                return this.dicionario.get(id)?.corpo.split('|')[0] || "";
            }).filter(t => t !== "");
            
            if (textosConceitos.length > 0 && !querHumor) {
                buffer.push(`Sintonizei: ${textosConceitos.join(" + ")}. 🚀`);
            }
        }

        if (querHumor) {
            const idT = conceitos[0] || this.memoria.ultimoID;
            if (idT && !raw.includes("comum")) {
                const nomeT = this.dicionario.get(idT).titulo;
                buffer.push(sortear('900').replace(/{CONCEITO}/g, nomeT));
            } else {
                buffer.push(sortear(acoes.includes('906') ? '906' : '905'));
            }
        }

        if (acoes.includes('910')) buffer.push(sortear('910').replace(/{NOME}/g, contexto.userName));
        if (acoes.includes('950')) buffer.push(sortear('950').replace(/{NOME}/g, contexto.userName));

        let respostaFinal = buffer.join(" .. ");
        return respostaFinal || sortear('999').replace("{NOME}", contexto.userName);
    }
};

LUMI_BRAIN.init();