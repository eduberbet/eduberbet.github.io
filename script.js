/**
 * LUMI 5.8 POCKET - STANDALONE EDITION
 * Blindagem total contra loops e integração direta com cerebro.js
 */

const LUMI_ENGINE = {
    state: {
        userName: localStorage.getItem('lumi_user_name') || null,
        isRecording: false,
        socialCount: 0,
        lastContext: { type: 'idle', time: 0 },
        history: [],
        config: {
            get typingSpeed() { return parseInt(localStorage.getItem('lumi_typing_speed')) || 30 },
            get voiceRate() { return parseFloat(localStorage.getItem('lumi_voice_rate')) || 1.0 }
        }
    },

    timers: { envio: null, stt: null, escrita: null },

    ui: {
        focus: document.getElementById('lumi-focus'),
        status: document.getElementById('lumi-status'),
        input: document.getElementById('user-input'),
        messages: document.getElementById('messages'),
        sttBtn: document.getElementById('stt-btn'),

        updateStatus(mode, text) {
            this.focus.className = `lumi-${mode}`;
            if (text) this.status.innerText = text;
        },

        toggleControls(speaking) {
            document.getElementById('group-normal').style.display = speaking ? 'none' : 'flex';
            document.getElementById('group-speed').style.display = speaking ? 'flex' : 'none';
        },

        clearTemps() {
            const agora = Date.now();
            if (LUMI_ENGINE.state.lastContext.type !== 'acolhimento' || (agora - LUMI_ENGINE.state.lastContext.time > 90000)) {
                document.querySelectorAll('.msg-temp').forEach(m => m.remove());
            }
        }
    },

    render(texto, isTemp = false) {
        clearInterval(this.timers.escrita);
        window.speechSynthesis.cancel();
        if (!isTemp) this.ui.clearTemps();

        const div = document.createElement('div');
        div.className = isTemp ? 'dica-lumi msg-temp' : 'dica-lumi';
        div.innerHTML = `<strong>LUMI:</strong> <span class="txt"></span>`;
        this.ui.messages.appendChild(div);
        
        const span = div.querySelector('.txt');
        let i = 0;
        this.ui.toggleControls(true);

        this.timers.escrita = setInterval(() => {
            if (i < texto.length) {
                span.textContent += texto[i++];
                this.ui.messages.scrollTop = this.ui.messages.scrollHeight;
            } else {
                clearInterval(this.timers.escrita);
                this.speak(texto);
            }
        }, this.state.config.typingSpeed);

        while (this.ui.messages.children.length > 15) this.ui.messages.removeChild(this.ui.messages.firstChild);
    },

    speak(texto) {
        if (!('speechSynthesis' in window)) return this.ui.toggleControls(false);
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(texto);
        u.lang = 'pt-BR';
        u.rate = this.state.config.voiceRate;
        u.onend = () => {
            this.ui.toggleControls(false);
            this.ui.updateStatus('idle', 'Sintonizada');
        };
        window.speechSynthesis.speak(u);
    },

    validarNome(nome) {
        const blacklist = ["lixo", "burro", "idiota", "teste", "nada", "lumi", "megaboga", "admin"];
        const limpo = nome.trim().toLowerCase();
        const apenasLetras = /^[a-zA-ZÀ-ÿ\s]+$/.test(limpo);
        return (limpo.length >= 2 && limpo.length <= 15 && !blacklist.includes(limpo) && apenasLetras);
    },

    analyze(msg) {
        const raw = msg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[?.!,;]/g, "").trim();
        const agora = Date.now();

        if (!raw) { this.ui.updateStatus('idle', 'Sintonizada'); return true; }

        // 1. BATISMO
        if (!this.state.userName) {
            if (this.validarNome(msg)) {
                const nomeFinal = msg.trim().split(' ')[0].charAt(0).toUpperCase() + msg.trim().split(' ')[0].slice(1).toLowerCase();
                this.state.userName = nomeFinal;
                localStorage.setItem('lumi_user_name', nomeFinal);
                this.render(`Prazer em te conhecer, ${nomeFinal}! Estou pronta para ajudar você com os estudos.`);
            } else {
                this.render("Preciso saber seu primeiro nome antes de começarmos. Como se chama?");
            }
            return true;
        }

        // 2. POR QUÊ EMOCIONAL
        const regexPorQue = /\bpq\b|\bporque\b|\bpor\s+que\b/i;
        if (regexPorQue.test(raw) && (this.state.lastContext.type === "acolhimento" && (agora - this.state.lastContext.time < 90000))) {
            this.render(`Como eu disse, ${this.state.userName}, sou apenas um programa. Nesses momentos, seu professor é quem pode te acolher de verdade.`, true);
            return true;
        }

        // 3. GATILHOS DE DOR
        if (["triste", "medo", "morreu", "mal", "ruim", "perdi", "sozinho"].some(p => raw.includes(p))) {
            this.state.lastContext = { type: 'acolhimento', time: agora };
            this.ui.updateStatus('acolhimento', 'Acolhendo');
            this.render(`Sinto muito por isso. Saiba que seu professor está aqui na sala para te ouvir e te ajudar.`, true);
            return true;
        }

        // 4. SOCIAL
        if (["oi", "ola", "tudo bem", "bom dia", "boa tarde"].some(s => raw.includes(s))) {
            this.state.socialCount++;
            if (this.state.socialCount > 2) {
                this.state.socialCount = 0;
                this.ui.updateStatus('drible', 'Foco');
                this.render(`É bom conversar com você, ${this.state.userName}, mas vamos focar no desafio da aula?`, true);
            } else {
                const frases = [`Olá, ${this.state.userName}!`, "Oi! Vamos aprender?", "Estou sintonizada!", "Como posso ajudar agora?"];
                this.render(frases[Math.floor(Math.random() * frases.length)], true);
            }
            return true;
        }

        return false;
    }
};

// --- FLUXO DE ENVIO (PLUGADO NO CEREBRO.JS) ---
let bufferMensagens = [];
function enviarMensagem() {
    const texto = LUMI_ENGINE.ui.input.value.trim();
    if (!texto) { LUMI_ENGINE.ui.updateStatus('idle', 'Sintonizada'); return; }
    
    clearTimeout(LUMI_ENGINE.timers.envio);
    bufferMensagens.push(texto);
    LUMI_ENGINE.ui.input.value = '';
    LUMI_ENGINE.ui.updateStatus('captando', 'Processando...');

    LUMI_ENGINE.timers.envio = setTimeout(() => {
        const msg = bufferMensagens.join(" ");
        bufferMensagens = [];
        
        if (!LUMI_ENGINE.analyze(msg)) {
            LUMI_ENGINE.ui.updateStatus('proc', 'Irradiando...'); // Branco pulsante

            // Chamada segura para o LUMI_BRAIN (Cerebro.js)
            if (typeof LUMI_BRAIN !== 'undefined') {
                LUMI_BRAIN.enviar(msg, LUMI_ENGINE.state.history, (data) => {
                    LUMI_ENGINE.state.history.push(data.corpo_da_dica);
                    if (LUMI_ENGINE.state.history.length > 10) LUMI_ENGINE.state.history.shift();
                    LUMI_ENGINE.state.lastContext.type = 'idle';
                    LUMI_ENGINE.render(data.corpo_da_dica, false);
                });
            } else {
                console.error("Cérebro não encontrado! Verifique se cerebro.js está carregado.");
                LUMI_ENGINE.ui.updateStatus('off', 'Erro Interno');
                LUMI_ENGINE.render("Minha luz falhou... Não encontrei meu cérebro local.");
            }
        }
    }, 2000);
}

document.getElementById('send-btn').onclick = enviarMensagem;
LUMI_ENGINE.ui.input.onkeydown = (e) => { if (e.key === 'Enter') enviarMensagem(); };

// --- CONTROLES DE VELOCIDADE ---
function ajustarVelocidade(deltaRate, deltaTyping) {
    const newRate = Math.min(2.0, Math.max(0.5, (LUMI_ENGINE.state.config.voiceRate + deltaRate).toFixed(1)));
    const newTyping = Math.min(100, Math.max(5, LUMI_ENGINE.state.config.typingSpeed + deltaTyping));
    localStorage.setItem('lumi_voice_rate', newRate);
    localStorage.setItem('lumi_typing_speed', newTyping);
    const ultimaDica = document.querySelector('.dica-lumi:last-child .txt')?.textContent;
    if (ultimaDica) LUMI_ENGINE.speak(ultimaDica);
}
document.getElementById('slow-btn').onclick = () => ajustarVelocidade(-0.2, 15);
document.getElementById('fast-btn').onclick = () => ajustarVelocidade(0.2, -10);

// --- MOTOR DE VOZ (STT) - MODO WALKIE-TALKIE POCKET ---
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechConstructor = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechConstructor();
    
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        console.log("✅ Escutando...");
        LUMI_ENGINE.ui.updateStatus('captando', 'Escutando...');
    };

    recognition.onresult = (e) => { 
        const result = e.results[0][0].transcript;
        console.log("🎤 Lumi ouviu:", result);
        if (result) { 
            LUMI_ENGINE.ui.input.value = result; 
            // Dispara o envio automático
            enviarMensagem(); 
        }
    };

    recognition.onend = () => {
        LUMI_ENGINE.state.isRecording = false;
        LUMI_ENGINE.ui.sttBtn.classList.remove('btn-active');
        if (!LUMI_ENGINE.ui.input.value) {
            LUMI_ENGINE.ui.updateStatus('idle', 'Sintonizada');
        }
    };

    // --- LÓGICA DE SEGURAR (PRESS & HOLD) ---
    LUMI_ENGINE.ui.sttBtn.onmousedown = () => {
        LUMI_ENGINE.ui.input.value = "";
        window.speechSynthesis.cancel();
        
        try {
            recognition.start();
            LUMI_ENGINE.state.isRecording = true;
            LUMI_ENGINE.ui.sttBtn.classList.add('btn-active');
        } catch(err) {
            recognition.stop();
        }

        // Kill-switch de segurança (8 segundos de fala máxima)
        clearTimeout(LUMI_ENGINE.timers.stt);
        LUMI_ENGINE.timers.stt = setTimeout(() => {
            if (LUMI_ENGINE.state.isRecording) recognition.stop();
        }, 8000);
    };

    LUMI_ENGINE.ui.sttBtn.onmouseup = () => {
        // O SEGREDO: Não damos o stop imediato. 
        // Damos 800ms para o Chrome terminar de processar a última palavra.
        setTimeout(() => {
            if (LUMI_ENGINE.state.isRecording) {
                recognition.stop();
                console.log("Finalizando captura...");
            }
        }, 800);
    };
}

// INICIALIZAÇÃO
LUMI_ENGINE.ui.updateStatus('idle', 'Sintonizada');
setTimeout(() => {
    if (!LUMI_ENGINE.state.userName) {
        LUMI_ENGINE.render("Olá! Sou a Lumi, sua luz para os estudos. Antes de começarmos, como você se chama?");
    }
}, 1500);