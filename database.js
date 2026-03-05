/**
 * LUMI DATABASE - GESTOR DE MEMÓRIA E RESPOSTAS
 */
const LUMI_DB = {
    // Memória para evitar repetição imediata
    lastIndices: {
        saudacoes: -1,
        piadas: -1,
        fallbacks: -1
    },

    // Bancos de Dados
    bancos: {
        saudacoes: [
            "Olá, ${nome}! Sistemas prontos para decolagem. O que vamos explorar?",
            "Oi, ${nome}! Sintonizada e pronta. Qual o plano de hoje?",
            "Conexão estável, ${nome}. Como posso acelerar seu projeto agora?",
            "Saudações, ${nome}! No que o meu código pode ser útil para você?"
        ],
        piadas: [
            "Por que o desenvolvedor se afogou? Porque não sabia nadar, só navegar! <span aria-hidden='true'>🌊</span>",
            "O que o JavaScript disse para o CSS? 'Tu é bonitinho, mas eu tenho a lógica!'",
            "Quantos programadores são necessários para trocar uma lâmpada? Nenhum, é problema de hardware.",
            "Dev não morre, vira código legado! <span aria-hidden='true'>💀</span>"
        ],
        fallbacks: [
            "Minha antena oscilou, mas sigo firme! Pode repetir ou perguntar sobre minha arquitetura?",
            "Interessante... Não mapeei isso no repositório ainda",
            "Estou processando... Enquanto isso, já viu as novidades no ReadMe do projeto?"
        ]
    },

    /**
     * Solicita uma resposta aleatória sem repetir a anterior
     * @param {string} categoria - saudacoes, piadas, fallbacks
     * @param {string} nome - Nome do usuário para interpolação
     */
    getResposta(categoria, nome = "Viajante") {
        const banco = this.bancos[categoria];
        if (!banco) return "Erro de sistema: Categoria não encontrada.";

        let novoIndice;
        do {
            novoIndice = Math.floor(Math.random() * banco.length);
        } while (novoIndice === this.lastIndices[categoria] && banco.length > 1);

        this.lastIndices[categoria] = novoIndice;
        
        // Substitui o placeholder ${nome} pelo nome real
        return banco[novoIndice].replace("${nome}", nome);
    }
};