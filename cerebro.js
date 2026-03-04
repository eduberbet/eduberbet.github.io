/**
 * LUMI POCKET - CÉREBRO LOCAL (SIMULADOR)
 * Substitui o servidor Python para funcionamento 100% Offline/GitHub Pages.
 */

const LUMI_BRAIN = {
    // Banco de respostas pedagógicas para a versão de demonstração
    database: [
        "Essa é uma ótima pergunta! Como você acha que isso se aplica no seu dia a dia?",
        "Interessante... Tente pensar por outro ângulo: o que aconteceria se mudássemos um detalhe?",
        "Sua curiosidade é o motor do aprendizado. O que mais você sabe sobre esse assunto?",
        "Estou sintonizando... Lembre-se que errar faz parte da descoberta científica!",
        "Que dúvida incrível! O professor vai adorar aprofundar isso com você na aula.",
        "A ciência é feita de perguntas. Como você explicaria isso para um colega?",
        "Estou processando... Tente relacionar isso com o que vimos na última aula!"
    ],

    // Simula o envio que antes era via Socket.io / WebSocket
    enviar(mensagem, historico, callback) {
        console.log("Pocket Brain: Processando logicamente...");
        
        // Simula a latência de processamento do LLM (2.5 segundos)
        setTimeout(() => {
            const respostaAleatoria = this.database[Math.floor(Math.random() * this.database.length)];
            
            // Retorna o objeto exatamente como o backend Python faria
            const data = {
                corpo_da_dica: respostaAleatoria
            };
            
            callback(data);
        }, 2500);
    }
};