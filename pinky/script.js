/**
 * LUMI 5.7 - ANTI-TROLL & NEURAL
 * Correção definitiva de detecção de 'Por que' e validação de nome.
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
            if (socket?.readyState === 1) this.ui.updateStatus('idle', 'Em sintonia');
        };
        window.speechSynthesis.speak(u);
    },

    validarNome(nome) {
        const blacklist = ["lixo", "burro", "idiota", "teste", "nada", "lumi", "megaboga", "admin"];
        const limpo = nome.trim().toLowerCase();
        // Regex para validar se parece um nome (sem números, sem caracteres especiais, max 2 palavras)
        const apenasLetras = /^[a-zA-ZÀ-ÿ\s]+$/.test(limpo);
        const palavras = limpo.split(/\s+/);
        
        if (limpo.length < 2 || limpo.length > 20 || !apenasLetras || blacklist.includes(limpo) || palavras.length > 3) {
            return false;
        }
        return true;
    },

    analyze(msg) {
        // Limpeza agressiva para análise
        const raw = msg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[?.!,;]/g, "").trim();
        const agora = Date.now();
        const offline = !socket || socket.readyState !== 1;

        if (!raw) { this.ui.updateStatus('idle', 'Em sintonia'); return true; }

        // 1. BLOQUEIO DE ONBOARDING
        if (!this.state.userName) {
            if (this.validarNome(msg)) {
                const nomeFinal = msg.trim().split(' ')[0].charAt(0).toUpperCase() + msg.trim().split(' ')[0].slice(1).toLowerCase();
                this.state.userName = nomeFinal;
                localStorage.setItem('lumi_user_name', nomeFinal);
                this.render(`Prazer em te conhecer, ${nomeFinal}! Estou pronta para ajudar você com a aula de hoje.`);
            } else {
                this.render("Como sou uma inteligência para a escola, preciso saber seu primeiro nome primeiro. Como se chama?");
            }
            return true;
        }

        // 2. DETECÇÃO DE "POR QUE" (Neural-style Regex)
        // Pega: "por que", "porque", "pq", "por que?" em qualquer lugar da frase
        const regexPorQue = /\bpq\b|\bporque\b|\bpor\s+que\b/i;
        const perguntouPorQue = regexPorQue.test(raw);
        const estaNoContextoAcolhimento = (this.state.lastContext.type === "acolhimento" && (agora - this.state.lastContext.time < 90000));

        if (perguntouPorQue && estaNoContextoAcolhimento) {
            this.render(`Como eu disse, ${this.state.userName}, eu sou apenas um programa feito para ensinar. Nesses momentos de tristeza, o seu professor é quem tem o coração para te acolher de verdade.`, true);
            return true;
        }

        // 3. GATILHOS DE DOR
        if (["triste", "medo", "morreu", "mal", "ruim", "perdi", "sozinho", "chorar"].some(p => raw.includes(p))) {
            this.state.lastContext = { type: 'acolhimento', time: agora };
            this.ui.updateStatus('acolhimento', 'Acolhendo');
            this.render(`Sinto muito por isso. Saiba que seu professor está aqui na sala e você pode contar com ele agora.`, true);
            return true;
        }

        // 4. SOCIAL
        if (["oi", "ola", "tudo bem", "bom dia", "boa tarde"].some(s => raw.includes(s))) {
            if (offline) {
                this.ui.updateStatus('off', 'Luz fraca');
                this.render("Minha luz está fraca sem conexão. Avise o professor!");
            } else {
                this.state.socialCount++;
                if (this.state.socialCount > 2) {
                    this.state.socialCount = 0;
                    this.ui.updateStatus('drible', 'Foco');
                    this.render(`É muito bom conversar com você, ${this.state.userName}, mas vamos focar no desafio da aula?`, true);
                } else {
                    const frases = [`Olá, ${this.state.userName}!`, "Oi! Vamos aprender?", "Estou sintonizada!", "Em que posso ajudar?"];
                    this.render(frases[Math.floor(Math.random() * frases.length)], true);
                }
            }
            return true;
        }

        return false;
    }
};

// --- COMUNICAÇÃO ---
let socket, bufferMensagens = [];
function conectar() {
    socket = new WebSocket('ws://localhost:8000/ws');
    socket.onopen = () => LUMI_ENGINE.ui.updateStatus('idle', 'Em sintonia');
    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        LUMI_ENGINE.state.history.push(data.corpo_da_dica);
        if (LUMI_ENGINE.state.history.length > 10) LUMI_ENGINE.state.history.shift();
        
        // Se recebeu resposta do servidor, o foco voltou a ser acadêmico
        LUMI_ENGINE.state.lastContext.type = 'idle';
        LUMI_ENGINE.render(data.corpo_da_dica, false);
    };
    socket.onclose = () => {
        LUMI_ENGINE.ui.updateStatus('off', 'Desconectado');
        setTimeout(conectar, 3000);
    };
}

function enviarMensagem() {
    const texto = LUMI_ENGINE.ui.input.value.trim();
    if (!texto) { LUMI_ENGINE.ui.updateStatus('idle', 'Em sintonia'); return; }
    
    clearTimeout(LUMI_ENGINE.timers.envio);
    bufferMensagens.push(texto);
    LUMI_ENGINE.ui.input.value = '';
    LUMI_ENGINE.ui.updateStatus('captando', 'Escutando...');

    LUMI_ENGINE.timers.envio = setTimeout(() => {
        const msg = bufferMensagens.join(" ");
        bufferMensagens = [];
        if (!LUMI_ENGINE.analyze(msg)) {
            if (socket?.readyState === 1) {
                socket.send(JSON.stringify({ texto: msg, historico: LUMI_ENGINE.state.history }));
            } else {
                LUMI_ENGINE.ui.updateStatus('drible', 'Sem sinal');
                LUMI_ENGINE.render("Minha luz caiu... Chame o professor.", true);
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

// --- MOTOR DE VOZ (STT) ---
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    
    recognition.onresult = (e) => { 
        const result = e.results[0][0].transcript;
        if (result) { LUMI_ENGINE.ui.input.value = result; enviarMensagem(); }
    };

    recognition.onend = () => {
        LUMI_ENGINE.state.isRecording = false;
        LUMI_ENGINE.ui.sttBtn.classList.remove('btn-active');
        if (LUMI_ENGINE.ui.status.innerText === "Irradiando...") LUMI_ENGINE.ui.updateStatus('idle', 'Em sintonia');
    };

    recognition.onerror = () => { recognition.stop(); LUMI_ENGINE.ui.updateStatus('idle', 'Em sintonia'); };

    LUMI_ENGINE.ui.sttBtn.onmousedown = () => {
        if (LUMI_ENGINE.state.isRecording) try { recognition.stop(); } catch(e) {}
        window.speechSynthesis.cancel();
        LUMI_ENGINE.state.isRecording = true;
        LUMI_ENGINE.ui.sttBtn.classList.add('btn-active');
        LUMI_ENGINE.ui.updateStatus('captando', 'Irradiando...');
        try { recognition.start(); } catch(e) {}
        clearTimeout(LUMI_ENGINE.timers.stt);
        LUMI_ENGINE.timers.stt = setTimeout(() => {
            if (LUMI_ENGINE.state.isRecording) { recognition.stop(); LUMI_ENGINE.ui.updateStatus('idle', 'Sintonizada'); }
        }, 6000);
    };

    LUMI_ENGINE.ui.sttBtn.onmouseup = () => { 
        setTimeout(() => { if (LUMI_ENGINE.state.isRecording) recognition.stop(); }, 500);
    };
}

// --- INICIALIZAÇÃO ---
conectar();
setTimeout(() => {
    if (!LUMI_ENGINE.state.userName) {
        LUMI_ENGINE.render("Olá! Sou a Lumi, sua luz para os estudos. Antes de começarmos, como você se chama?");
    }
}, 1500);