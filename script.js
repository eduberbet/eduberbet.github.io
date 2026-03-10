const LUMI_ENGINE = {
    state: { userName: null, esperandoNome: true, config: { typingSpeed: 25, voiceRate: 1.1 } },

    ui: {
        input: document.getElementById('user-input'),
        messages: document.getElementById('messages-wrapper'),
        status: document.getElementById('lumi-status'),
        focus: document.getElementById('lumi-focus'),
        
        updateStatus(mode, text) {
            if(this.focus) this.focus.className = `lumi-${mode}`; 
            if(this.status) this.status.innerText = text;
        }
    },

    init() {
        this.ui.updateStatus('idle', 'Aguardando ignição...');
        setTimeout(() => { this.render("Olá! Sou a LUMI Rocket v4.2.1 Pinguim Astronauta. Qual é o seu nome?"); }, 800);
    },

    render(texto, isUser = false) {
        const wrapper = this.ui.messages;
        const msg = document.createElement('div');
        msg.className = `bubble ${isUser ? 'msg-user' : 'msg-lumi'}`;
        if (!isUser) {
            msg.innerHTML = `<strong>LUMI</strong><br><span class="texto-lumi"></span>`;
            wrapper.appendChild(msg);
            this.falar(texto); 
            this.efeitoEscrita(msg.querySelector('.texto-lumi'), texto);
        } else {
            msg.innerText = texto;
            wrapper.appendChild(msg);
        }
        wrapper.scrollTop = wrapper.scrollHeight;
    },

    efeitoEscrita(elemento, texto) {
        let i = 0;
        const timer = setInterval(() => {
            if (i < texto.length) { elemento.innerHTML += texto.charAt(i); i++; }
            else { clearInterval(timer); }
        }, this.state.config.typingSpeed);
    },

    falar(texto) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(texto.replace(/🚀|..|{NOME}/g, ''));
        utterance.lang = 'pt-BR';
        utterance.rate = this.state.config.voiceRate;
        window.speechSynthesis.speak(utterance);
    },

    enviarMensagem() {
        const texto = this.ui.input.value.trim();
        if (!texto) return;
        this.ui.input.value = '';
        this.render(texto, true);

        if (this.state.esperandoNome) {
            this.state.userName = texto.split(' ')[0];
            this.state.esperandoNome = false;
            this.render(`Bem-vindo a bordo, ${this.state.userName}! Sou a marqueteira do Projeto Lumi. Pronta para contar piadas ou explicar tecnologias. O que vamos explorar?`);
            this.ui.updateStatus('idle', 'Em Órbita');
            return;
        }

        this.ui.updateStatus('proc', 'Sintonizando...'); 
        LUMI_BRAIN.processarRequisicao(texto, this.state, (res) => {
            this.render(res.texto);
            this.ui.updateStatus('idle', 'Em Órbita'); 
        });
    }
};

document.getElementById('send-btn').addEventListener('click', () => LUMI_ENGINE.enviarMensagem());
document.getElementById('user-input').addEventListener('keypress', (e) => { if(e.key === 'Enter') LUMI_ENGINE.enviarMensagem(); });
window.onload = () => LUMI_ENGINE.init();