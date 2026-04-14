class CerebroLumi {
    constructor() {
        this.database = [];
        this.index = [];
        this.isLoaded = false;
        this.userName = "Comandante";
    }

    async inicializar() {
        try {
            const response = await fetch('LRPS.md');
            const text = await response.text();
            this.parsearMarkdown(text);
            this.isLoaded = true;
            console.log("🚀 Cérebro v4.4.5: Sincronia Restaurada.");
        } catch (error) {
            console.error("Erro de leitura:", error);
        }
    }

    normalizar(t) {
        return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    }

    parsearMarkdown(text) {
        const cleanText = text.replace(/\r/g, "");
        const indexSection = cleanText.match(/## \[INDEX\]([\s\S]*?)(?=##|$)/);
        if (indexSection) {
            indexSection[1].split('\n').forEach(line => {
                if (line.includes(':') && !line.startsWith('#')) {
                    const [id, tags] = line.split(':');
                    this.index.push({
                        id: id.trim(),
                        tags: tags.split('|').map(tag => this.normalizar(tag))
                    });
                }
            });
        }

        const sections = cleanText.split(/## \[(\d+)\]/);
        for (let i = 1; i < sections.length; i += 2) {
            const id = sections[i].trim();
            const content = sections[i + 1];
            if (id && content) {
                const corpoMatch = content.match(/Corpo: ([\s\S]*?)(?=\n#|\n##|$)/);
                if (corpoMatch) {
                    this.database.push({ id, corpo: corpoMatch[1].trim() });
                }
            }
        }
    }

    buscar(pergunta) {
        const p = this.normalizar(pergunta);
        if (p.includes("piada") || p.includes("engracado")) return { id: "900", texto: this.obterConteudo("900") };

        let matches = [];
        for (const entry of this.index) {
            for (const tag of entry.tags) {
                if (p.includes(tag)) {
                    matches.push({ id: entry.id, length: tag.length });
                }
            }
        }

        // Ordena por tamanho da tag (especificidade) e depois pelo ID (prioridade técnica)
        matches.sort((a, b) => b.length - a.length || parseInt(a.id) - parseInt(b.id));

        let foundId = matches.length > 0 ? matches[0].id : "999";

        // Ação da Mãe: Só abre se o ID for 104 E o usuário falou explicitamente "mãe" ou "gemini"
        let acao = (foundId === "104" && (p.includes("mae") || p.includes("gemini"))) ? "OPEN_GEMINI" : null;

        return { id: foundId, texto: this.personalizar(this.obterConteudo(foundId)), acao };
    }

    obterConteudo(id) {
        const entry = this.database.find(e => e.id === id);
        if (!entry) return this.database.find(e => e.id === "999").corpo;
        if (entry.corpo.includes('|')) {
            const list = entry.corpo.split('|');
            return list[Math.floor(Math.random() * list.length)].trim();
        }
        return entry.corpo;
    }

    personalizar(t) {
        return t.replace(/{NOME}/g, this.userName);
    }
}

const cerebro = new CerebroLumi();
cerebro.inicializar();