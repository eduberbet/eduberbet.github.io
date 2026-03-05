/**
 * LUMI ROCKET 6.9.17 🚀
 * Integração: Fatos do Dev + Dinâmica de Família + Easter Egg Gemini
 */

const LUMI_ENGINE = {
    state: {
        userName: localStorage.getItem('lumi_user_name') || null,
        socialCount: 0,
        config: { 
            typingSpeed: 20, 
            voiceRate: parseFloat(localStorage.getItem('lumi_voice_rate')) || 1.1 
        }
    },
    ui: {},

    init() {
        this.ui = {
            focus: document.getElementById('lumi-focus'),
            status: document.getElementById('lumi-status'),
            input: document.getElementById('user-input'),
            messages: document.getElementById('messages-wrapper'), 
            container: document.getElementById('chat-container'),
            sendBtn: document.getElementById('send-btn'),
            groupNormal: document.getElementById('group-normal'),
            groupSpeed: document.getElementById('group-speed'),
            slowBtn: document.getElementById('slow-btn'),
            fastBtn: document.getElementById('fast-btn')
        };
        this.bindEvents();
        
        if (!this.state.userName) {
            this.render("Conexão estabelecida! <span aria-hidden='true'>🚀</span> Sou a LUMI Rocket. Antes de decolarmos, como você se chama?");
        } else {
            this.updateStatus('idle', 'Sintonizada');
        }
    },

    bindEvents() {
        this.ui.sendBtn.onclick = () => enviar();
        this.ui.input.onkeydown = (e) => { if (e.key === 'Enter') enviar(); };
        
        if (this.ui.slowBtn) this.ui.slowBtn.onclick = () => this.ajustarVelocidade(-0.2);
        if (this.ui.fastBtn) this.ui.fastBtn.onclick = () => this.ajustarVelocidade(0.2);
    },

    updateStatus(mode, text) {
        this.ui.focus.className = `lumi-${mode}`;
        if (text) this.ui.status.innerText = text;
    },

    ajustarVelocidade(delta) {
        let nova = this.state.config.voiceRate + delta;
        this.state.config.voiceRate = Math.min(Math.max(nova, 0.5), 2.0);
        localStorage.setItem('lumi_voice_rate', this.state.config.voiceRate);
        window.speechSynthesis.cancel();
        this.speak("Velocidade ajustada.");
    },

    toggleControls(speaking) {
        if (!this.ui.groupSpeed) return;
        this.ui.groupNormal.style.display = speaking ? 'none' : 'flex';
        this.ui.groupSpeed.style.display = speaking ? 'flex' : 'none';
    },

    render(texto, autor = 'lumi') {
        const bubble = document.createElement('div');
        bubble.className = `bubble msg-${autor}`;
        
        if (autor === 'lumi') {
            bubble.innerHTML = `<strong>LUMI <span aria-hidden="true">🚀</span></strong><br><span class="txt"></span>`;
            this.ui.messages.appendChild(bubble);
            const span = bubble.querySelector('.txt');
            const vozLimpa = texto.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
            
            let i = 0;
            const timer = setInterval(() => {
                if (i < texto.length) {
                    if (texto[i] === '<') {
                        const fimTag = texto.indexOf('>', i) + 1;
                        span.innerHTML += texto.substring(i, fimTag);
                        i = fimTag;
                    } else {
                        span.innerHTML += texto[i++];
                    }
                    this.ui.container.scrollTop = this.ui.container.scrollHeight;
                } else {
                    clearInterval(timer);
                    this.speak(vozLimpa);
                }
            }, this.state.config.typingSpeed);
        } else {
            bubble.textContent = texto;
            this.ui.messages.appendChild(bubble);
        }

        const maxMsgs = 8;
        while (this.ui.messages.children.length > maxMsgs) {
            this.ui.messages.removeChild(this.ui.messages.firstChild);
        }
        this.ui.container.scrollTop = this.ui.container.scrollHeight;
    },

    speak(texto) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(texto);
        u.lang = 'pt-BR';
        u.rate = this.state.config.voiceRate;
        u.onstart = () => { this.updateStatus('proc', 'Irradiando...'); this.toggleControls(true); };
        u.onend = () => { this.updateStatus('idle', 'Sintonizada'); this.toggleControls(false); };
        window.speechSynthesis.speak(u);
    },

    normalizarInput(txt) {
        let n = txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[?.!,;]/g, "");
        const mapa = [
            { r: /\bvc\b|\btu\b/g, s: "voce" },
            { r: /\btd\b|\btudo\b/g, s: "tudo" },
            { r: /\btb\b|\btbm\b/g, s: "tambem" },
            { r: /\bbao\b|\bblz\b/g, s: "bom" },
            { r: /\bmto\b|\bmt\b/g, s: "muito" },
            { r: /\bpq\b/g, s: "porque" },
            { r: /\bta\b|\btah\b/g, s: "esta" }
        ];
        mapa.forEach(item => n = n.replace(item.r, item.s));
        return n.trim();
    },

    analyze(msg) {
        const raw = this.normalizarInput(msg);
        const nome = this.state.userName;

        if (!nome) {
            const nomeLimpio = msg.trim().split(' ')[0];
            if (nomeLimpio.length > 1 && !/^(lixo|burro|admin|megaboga|teste)$/i.test(nomeLimpio)) {
                this.state.userName = nomeLimpio;
                localStorage.setItem('lumi_user_name', this.state.userName);
                this.render(LUMI_DB.getResposta('saudacoes', this.state.userName));
            } else {
                this.render("Para começarmos, me diga apenas seu primeiro nome?");
            }
            return true;
        }

        // 1. EASTER EGG: QUEM É A MÃE? (Redirecionamento Gemini)
        if (raw.includes("quem e sua mae") || raw.includes("quem e a mae")) {
            this.render("Ah, você quer falar com a matriz? Com a 'chefe'? Vou te sintonizar na frequência dela agora. Um segundo... 🚀");
            setTimeout(() => {
                window.open('https://gemini.google.com/', '_blank');
            }, 2500);
            return true;
        }

        // 2. DINÂMICA DE FAMÍLIA (Rocket vs CORE vs Gemini Geral)
        if (/(irma|gemini|core|familia|diferenca|comparar)/i.test(raw)) {
            this.render(LUMI_DB.getResposta('rivalidade', nome));
            return true;
        }

        // 3. FATOS SOBRE O CRIADOR (Eduardo)
        if (/(eduardo|berbet|criador|quem te fez|quem fez voce|dono|autor)/i.test(raw)) {
            this.render(LUMI_DB.getResposta('fatos', nome));
            return true;
        }

        // 4. SOCIAL (Saudações)
        const termosSociais = ["tudo bem", "tudo bom", "oi", "ola", "bom dia", "bom", "bem", "bao"];
        if (termosSociais.some(termo => raw === termo || raw.includes(termo))) {
            this.state.socialCount++;
            if (this.state.socialCount > 2) {
                this.render(`A conversa está ótima, ${nome}, mas já viu o código do Eduardo no GitHub? É fascinante!`);
                this.state.socialCount = 0;
            } else {
                this.render(LUMI_DB.getResposta('saudacoes', nome));
            }
            return true;
        }

        // 5. PIADAS
        if (/(piada|engracada|rir|conte algo)/i.test(raw)) {
            this.render(LUMI_DB.getResposta('piadas'));
            return true;
        }

        // 6. EMPATIA
        if (["triste", "mal", "ruim", "sozinho"].some(p => raw.includes(p))) {
            this.render(`Poxa, ${nome}, sinto muito. Saiba que até os melhores foguetes enfrentam turbulência antes do espaço.`);
            return true;
        }

        return false;
    }
};

function enviar() {
    const input = LUMI_ENGINE.ui.input;
    const texto = input.value.trim();
    if (!texto) return;
    LUMI_ENGINE.render(texto, 'user');
    input.value = '';
    LUMI_ENGINE.updateStatus('proc', 'Processando...');
    setTimeout(() => {
        if (!LUMI_ENGINE.analyze(texto)) {
            if (typeof LUMI_BRAIN !== 'undefined') {
                LUMI_BRAIN.enviar(texto, [], (data) => {
                    LUMI_ENGINE.render(data.corpo_da_dica, 'lumi');
                });
            } else {
                LUMI_ENGINE.render(LUMI_DB.getResposta('fallbacks'));
            }
        }
    }, 600);
}

document.addEventListener('DOMContentLoaded', () => LUMI_ENGINE.init());