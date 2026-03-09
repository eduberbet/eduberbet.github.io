/**
 * LUMI ROCKET - SCRIPT INTERFACE (PINKY) v2.3.5
 * Ajuste: Reset de Nome, Correção de Seletores e Empatia
 */

const LUMI_ENGINE = {
    state: {
        userName: null, // Começa sempre nulo
        esperandoNome: true,
        isRecording: false,
        config: {
            typingSpeed: 25,
            voiceRate: 1.1
        }
    },

    ui: {
        input: document.getElementById('user-input'),
        messages: document.getElementById('messages-wrapper'), // ID Correto do HTML
        status: document.getElementById('lumi-status'),
        focus: document.getElementById('lumi-focus'),
        
        updateStatus(mode, text) {
            if(this.focus) this.focus.className = `lumi-${mode}`;
            if(this.status) this.status.innerText = text;
        }
    },

    init() {
        console.log("🚀 LUMI Engine Iniciada");
        // Força a LUMI a esquecer o nome anterior para sempre perguntar ao iniciar
        localStorage.removeItem('lumi_user_name');
        
        this.ui.updateStatus('off', 'Aguardando ignição...');
        setTimeout(() => {
            this.render("Olá! Eu sou a LUMI Rocket. Antes de decolarmos, como devo te chamar?");
        }, 800);
    },

    validarNome(nome) {
        const blacklist = ['lumi', 'computador', 'bot', 'ia', 'teste', 'pwa', 'github'];
        const n = nome.toLowerCase().trim();
        if (n.length < 2 || n.length > 15) return false;
        if (blacklist.some(b => n.includes(b))) return false;
        return /^[a-zA-ZÀ-ÿ\s]+$/.test(n);
    },

    render(texto, isUser = false) {
        this.ui.updateStatus(isUser ? 'idle' : 'proc', isUser ? 'Em sintonia' : 'Sintonizando...');
        
        const msgDiv = document.createElement('div');
        msgDiv.className = isUser ? 'bubble msg-user' : 'bubble msg-lumi';
        
        if (!isUser) {
            msgDiv.innerHTML = '<strong>LUMI 🚀</strong><br>';
        }

        this.ui.messages.appendChild(msgDiv);
        
        if (isUser) {
            msgDiv.innerText = texto;
            this.ui.messages.scrollTop = this.ui.messages.scrollHeight;
            return;
        }

        let i = 0;
        const speed = this.state.config.typingSpeed;
        const digitar = () => {
            if (i < texto.length) {
                // Previne renderizar tags incompletas como {CONCEITO}
                msgDiv.innerHTML += texto.charAt(i);
                i++;
                this.ui.messages.scrollTop = this.ui.messages.scrollHeight;
                setTimeout(digitar, speed);
            } else {
                this.ui.updateStatus('idle', 'Em sintonia');
                this.falar(texto);
            }
        };
        digitar();
    },

    falar(texto) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR';
        window.speechSynthesis.speak(utterance);
    },

    enviarMensagem() {
        const texto = this.ui.input.value.trim();
        if (!texto) return;
        this.ui.input.value = '';
        this.render(texto, true);

        // LÓGICA DE CAPTURA DE NOME
        if (this.state.esperandoNome) {
            if (this.validarNome(texto)) {
                const nomeFinal = texto.split(' ')[0].charAt(0).toUpperCase() + texto.split(' ')[0].slice(1).toLowerCase();
                this.state.userName = nomeFinal;
                this.state.esperandoNome = false;
                localStorage.setItem('lumi_user_name', nomeFinal);
                this.render(`Prazer em te conhecer, ${nomeFinal}! Motores aquecidos. O que vamos explorar hoje?`);
            } else {
                this.render("Hum, esse nome não parece válido para o meu registro. Pode me dizer apenas o seu primeiro nome?");
            }
            return;
        }

        LUMI_BRAIN.processarRequisicao(texto, this.state, (resposta) => {
            this.render(resposta.texto);
        });
    }
};

document.getElementById('send-btn').onclick = () => LUMI_ENGINE.enviarMensagem();
document.getElementById('user-input').onkeypress = (e) => { if(e.key === 'Enter') LUMI_ENGINE.enviarMensagem(); };
LUMI_ENGINE.init();