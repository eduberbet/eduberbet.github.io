/**
 * LUMI PINKY 🚀 - A Interface da Rocket
 * Arquitetura: Terminal Leve (Apenas Hardware e UI)
 */
const LUMI_ENGINE = {
    state: {
        userName: localStorage.getItem('lumi_user_name') || null,
        config: { 
            typingSpeed: 20, 
            voiceRate: parseFloat(localStorage.getItem('lumi_voice_rate')) || 1.1 
        }
    },

    init() {
        this.ui = {
            focus: document.getElementById('lumi-focus'),
            status: document.getElementById('lumi-status'),
            input: document.getElementById('user-input'),
            messages: document.getElementById('messages-wrapper'),
            container: document.getElementById('chat-container')
        };
        this.bindEvents();
        
        // Boas-vindas inicial se for o primeiro acesso
        if (!this.state.userName) {
            this.render("Conexão estabelecida! 🚀 Sou a LUMI Rocket. Antes de decolarmos, como você se chama?");
        } else {
            this.updateStatus('idle', 'Sintonizada');
        }
    },

    /**
     * PROCESSAMENTO PRINCIPAL
     * O Pinky captura o texto e delega toda a lógica para o Cérebro.
     */
    processar() {
        const txt = this.ui.input.value.trim();
        if (!txt) return;
        
        this.render(txt, 'user');
        this.ui.input.value = '';

        // Se for o primeiro contato, o Pinky guarda o nome antes de processar
        if (!this.state.userName) {
            this.state.userName = txt.split(' ')[0];
            localStorage.setItem('lumi_user_name', this.state.userName);
        }

        this.updateStatus('proc', 'Processando...');

        // O PINKY ENVIAR PARA O CÉREBRO ORQUESTRADOR
        // Enviamos o texto e o contexto atual (nome)
        LUMI_BRAIN.processarRequisicao(txt, { nome: this.state.userName }, (pacote) => {
            // O pacote já vem com o texto humanizado e o mood definido pelo Cérebro
            this.render(pacote.texto);
            this.updateStatus('idle', 'Sintonizada');
        });
    },

    /**
     * RENDERIZAÇÃO DE INTERFACE
     */
    render(texto, autor = 'lumi') {
        const bubble = document.createElement('div');
        bubble.className = `bubble msg-${autor}`;
        
        if (autor === 'lumi') {
            bubble.innerHTML = `<strong>LUMI 🚀</strong><br><span class="txt"></span>`;
            this.ui.messages.appendChild(bubble);
            const span = bubble.querySelector('.txt');
            
            let i = 0;
            const interval = setInterval(() => {
                if (i < texto.length) {
                    span.innerHTML += texto[i++];
                    this.ui.container.scrollTop = this.ui.container.scrollHeight;
                } else {
                    clearInterval(interval);
                    this.speak(texto); // Aciona a voz ao terminar de digitar
                }
            }, this.state.config.typingSpeed);
        } else {
            bubble.textContent = texto;
            this.ui.messages.appendChild(bubble);
        }
        
        this.ui.container.scrollTop = this.ui.container.scrollHeight;
    },

    /**
     * SISTEMA DE VOZ (TTS)
     */
    speak(t) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(t);
        u.lang = 'pt-BR';
        u.rate = this.state.config.voiceRate;
        u.onstart = () => this.updateStatus('proc', 'Irradiando...');
        u.onend = () => this.updateStatus('idle', 'Sintonizada');
        window.speechSynthesis.speak(u);
    },

    /**
     * HARDWARE & STATUS
     */
    updateStatus(mode, text) {
        this.ui.focus.className = `lumi-${mode}`;
        this.ui.status.innerText = text;
    },

    bindEvents() {
        const btnSend = document.getElementById('send-btn');
        if (btnSend) btnSend.onclick = () => this.processar();

        this.ui.input.onkeydown = (e) => { 
            if (e.key === 'Enter') this.processar(); 
        };

        // Controles de velocidade da voz (Opcional, se existir no HTML)
        const btnSlow = document.getElementById('slow-btn');
        const btnFast = document.getElementById('fast-btn');
        if (btnSlow) btnSlow.onclick = () => { this.state.config.voiceRate = 0.8; };
        if (btnFast) btnFast.onclick = () => { this.state.config.voiceRate = 1.4; };
    }
};

// Inicia a Engine quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => LUMI_ENGINE.init());