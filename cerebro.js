const LUMI_BRAIN = {
    tree: {}, dicionario: new Map(), fonte: './LRPS.md', isReady: false,
    memoria: { ultimoID: null },

    async init() {
        try {
            const res = await fetch(this.fonte);
            const text = await res.text();
            this.construirArvore(text);
            this.isReady = true;
        } catch (e) { /* Silêncio orbital */ }
    },

    construirArvore(texto) {
        const secoes = texto.split(/\n##\s+/);
        secoes.forEach(secao => {
            const linhas = secao.split('\n');
            const idMatch = linhas[0].match(/\[(\d+)\]/);
            if (linhas[0].includes("[INDEX]")) {
                linhas.slice(1).forEach(l => {
                    const m = l.match(/(\d+):\s*(.*)/);
                    if (m) {
                        const id = m[1];
                        const aliases = m[2].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split('|').map(a => a.trim());
                        aliases.forEach(alias => {
                            let node = this.tree;
                            alias.split(/\s+/).forEach((pal, idx, arr) => {
                                if (!node[pal]) node[pal] = { _ids: [] };
                                node = node[pal];
                                if (idx === arr.length - 1) node._ids.push(id);
                            });
                        });
                    }
                });
            } else if (idMatch) {
                const id = idMatch[1];
                const meta = { corpo: "", titulo: "" };
                linhas.forEach(l => {
                    if (l.startsWith("Título:")) meta.titulo = l.replace("Título:", "").trim();
                    if (l.startsWith("Corpo:")) meta.corpo = l.replace("Corpo:", "").trim();
                });
                this.dicionario.set(id, meta);
            }
        });
    },

    processarRequisicao(pergunta, contexto, callback) {
        if (!this.isReady) return;
        const input = pergunta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[?.,!/#!$%\^&\*;:{}=\-_`~()]/g, " ").trim();
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

        let idsFinais = Array.from(encontrados);

        // --- CORREÇÃO: SILENCIAMENTO GLOBAL DO 101 ---
        // Se houver QUALQUER ID técnico (010 a 080) ou módulos (102, 103), remove o Geral (101)
        const temEspecifico = idsFinais.some(id => (parseInt(id) >= 10 && parseInt(id) <= 104 && id !== '101'));
        if (temEspecifico) {
            idsFinais = idsFinais.filter(id => id !== '101');
        }

        callback({ texto: this.compor(idsFinais, contexto, input) });
    },

    compor(ids, contexto, raw) {
        let buffer = [];
        let tecnicos = ids.filter(id => parseInt(id) < 900);
        let sociais = ids.filter(id => parseInt(id) >= 900 && id !== '999');

        if (tecnicos.length > 0) {
            this.memoria.ultimoID = tecnicos[0];
            const txts = tecnicos.map(id => {
                const frases = this.dicionario.get(id)?.corpo.split('|') || [""];
                return frases[Math.floor(Math.random() * frases.length)].trim();
            });
            buffer.push(`Sintonizei: ${txts.join(" + ")}. 🚀`);
        } 
        else if (sociais.length > 0) {
            if (sociais.includes('920')) this.memoria.ultimoID = null;
            sociais.forEach(id => {
                const frases = this.dicionario.get(id).corpo.split('|');
                let txt = frases[Math.floor(Math.random() * frases.length)].trim();
                buffer.push(txt.replace(/{NOME}/g, contexto.userName));
            });
        }
        else if (this.memoria.ultimoID && raw.split(/\s+/).length < 3) {
            const frases = this.dicionario.get(this.memoria.ultimoID).corpo.split('|');
            buffer.push(`Ainda sobre isso: ${frases[0]}`);
        }

        if (buffer.length === 0) {
            this.memoria.ultimoID = null;
            // --- CORREÇÃO: SPLIT NO FALLBACK ---
            const fallbacks = this.dicionario.get('999').corpo.split('|');
            const sorteada = fallbacks[Math.floor(Math.random() * fallbacks.length)].trim();
            return sorteada.replace("{NOME}", contexto.userName);
        }
        return buffer.join(" .. ");
    }
};
LUMI_BRAIN.init();