const LUMI_BRAIN = {
    dadosOrigem: "https://raw.githubusercontent.com/eduberbet/Lumi/main/ReadMe.md",
    documentacao: "",
    
    async inicializar() {
        try {
            const resp = await fetch(this.dadosOrigem);
            if (resp.ok) {
                this.documentacao = await resp.text();
                console.log("🚀 Rocket Brain: Conectada exclusivamente ao projeto LUMI.");
            }
        } catch (e) {
            console.warn("🚀 Rocket Brain: Offline.");
        }
    },

    enviar(mensagem, historico, callback) {
        setTimeout(() => {
            let resposta = "Recebi sua mensagem! 🚀 Não encontrei esse termo específico na documentação da LUMI, mas posso te contar sobre o propósito do projeto!";
            
            const rawMsg = mensagem.toLowerCase();
            if (this.documentacao && rawMsg.length > 3) {
                if (this.documentacao.toLowerCase().includes(rawMsg)) {
                    resposta = "Isso faz parte do ecossistema LUMI! 📚 Estamos focados em criar ferramentas inteligentes para professores e alunos.";
                }
            }
            callback({ corpo_da_dica: resposta });
        }, 800);
    }
};
LUMI_BRAIN.inicializar();