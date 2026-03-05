/**
 * LUMI ROCKET - SCRIPT 6.9.1 🚀
 * Fix: Proteção contra carregamento precoce (DOMReady)
 */

const LUMI_ENGINE = {
    state: {
        userName: localStorage.getItem('lumi_user_name') || null,
        config: { typingSpeed: 25, voiceRate: 1.1 }
    },

    // Deixamos os seletores para serem preenchidos quando o DOM estiver pronto
    ui: {},

    init() {
        // Mapeamento dos elementos (IDs exatos do seu index.html)
        this.ui = {
            focus: document.getElementById('lumi-focus'),
            status: document.getElementById('lumi-status'),
            input: document.getElementById('user-input'),
            messages: document.getElementById('messages'), 
            container: document.getElementById('chat-container'),
            sendBtn: document.getElementById('send-btn')
        };

        // Verifica se o container principal existe antes de continuar
        if (!this.ui.messages) {
            console.error("ERRO: A div 'messages' não foi encontrada. Verifique o index.html.");
            return;
        }

        this.bindEvents();
        this.ui.focus.className = 'lumi-idle';
        console.log("🚀 Rocket Engine: Sistema de ignição pronto e sincronizado!");
    },

    bindEvents() {
        this.ui.sendBtn.onclick = () => enviar();
        this.ui.input.onkeydown = (e) => { if (e.key === 'Enter') enviar(); };
    },

    render(texto, autor = 'lumi') {
        const bubble = document.createElement('div');
        bubble.className = `bubble msg-${autor}`;
        
        if (autor === 'lumi') {
            bubble.innerHTML = `<strong>LUMI 🚀</strong><br><span class="txt"></span>`;
            this.ui.messages.appendChild(bubble);
            const span = bubble.querySelector('.txt');
            let i = 0;
            const timer = setInterval(() => {
                if (i < texto.length) {
                    span.textContent += texto[i++];
                    this.ui.container.scrollTop = this.ui.container.scrollHeight;
                } else {
                    clearInterval(timer);
                    this.speak(texto);
                }
            }, this.state.config.typingSpeed);
        } else {
            bubble.textContent = texto;
            this.ui.messages.appendChild(bubble);
            this.ui.container.scrollTop = this.ui.container.scrollHeight;
        }

        if (this.ui.messages.children.length > 10) {
            this.ui.messages.removeChild(this.ui.messages.firstChild);
        }
    },

    speak(texto) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(texto);
        u.lang = 'pt-BR';
        u.rate = this.state.config.voiceRate;
        u.onend = () => this.ui.focus.className = 'lumi-idle';
        window.speechSynthesis.speak(u);
    },

    analyze(msg) {
        const raw = msg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (/quem\s+(?:e|eh|sao|seria)\s+(?:vc|voce|vcs|tu)/i.test(raw)) {
            this.render("Eu sou a Lumi Rocket! 🚀 A irmã caçula veloz que ajuda a explicar o projeto do Eduardo Berbet para o mundo!");
            return true;
        }
        if (/(?:piada|engracada)/i.test(raw)) {
            this.render("Por que o desenvolvedor se afogou? Porque não sabia nadar, só navegar! 🌊");
            return true;
        }
        return false;
    }
};

// FUNÇÃO GLOBAL DE ENVIO
function enviar() {
    const texto = LUMI_ENGINE.ui.input.value.trim();
    if (!texto) return;

    LUMI_ENGINE.render(texto, 'user');
    LUMI_ENGINE.ui.input.value = '';
    LUMI_ENGINE.ui.focus.className = 'lumi-proc';

    setTimeout(() => {
        if (!LUMI_ENGINE.analyze(texto)) {
            if (typeof LUMI_BRAIN !== 'undefined') {
                LUMI_BRAIN.enviar(texto, [], (data) => {
                    LUMI_ENGINE.render(data.corpo_da_dica, 'lumi');
                });
            }
        } else {
            LUMI_ENGINE.ui.focus.className = 'lumi-idle';
        }
    }, 600);
}

// O SEGREDO: Só liga o motor quando a página estiver totalmente carregada
document.addEventListener('DOMContentLoaded', () => {
    LUMI_ENGINE.init();
});