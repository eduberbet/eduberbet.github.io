const inputField = document.getElementById('user-input');
const sendBtn = document.getElementById('btn-ignition');
const chatOutput = document.getElementById('chat-output');
const flightStick = document.getElementById('flight-stick');
const modeLabel = document.querySelector('#manche-control label');
const lantern = document.getElementById('lantern-indicator');
const body = document.body;

let aguardandoNome = true;

const flightModes = ['mode-sonda', 'mode-orbital', 'mode-hiper'];
const flightLabels = ['MODO: SONDA', 'MODO: ORBITAL', 'MODO: HIPER'];

function changeFlightMode(value) {
    body.classList.remove(...flightModes);
    body.classList.add(flightModes[value]);
    modeLabel.innerText = flightLabels[value];
}

flightStick.addEventListener('input', (e) => changeFlightMode(e.target.value));

function exibirMensagem(texto, classe) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${classe}`;
    msgDiv.innerHTML = texto;
    chatOutput.appendChild(msgDiv);
    chatOutput.scrollTo({ top: chatOutput.scrollHeight, behavior: 'smooth' });
}

async function processarComando() {
    const texto = inputField.value.trim();
    if (!texto) return;

    exibirMensagem(texto, 'msg-user');
    inputField.value = '';
    lantern.classList.add('active-lantern');

    if (aguardandoNome) {
        cerebro.userName = texto; 
        aguardandoNome = false;
        setTimeout(() => {
            const saudacao = cerebro.personalizar(cerebro.obterConteudo("950"));
            exibirMensagem(saudacao, 'msg-rocket');
            lantern.classList.remove('active-lantern');
        }, 800);
        return;
    }

    const resposta = cerebro.buscar(texto);
    setTimeout(() => {
        exibirMensagem(resposta.texto, 'msg-rocket');
        lantern.classList.remove('active-lantern');
        if (resposta.acao === "OPEN_GEMINI") {
            setTimeout(() => { window.open('https://gemini.google.com', '_blank'); }, 2000);
        }
    }, 600);
}

document.addEventListener('mousedown', (e) => {
    if (aguardandoNome) return;
    const el = e.target;
    if (el.id === 'star-samuel' || el.id === 'isaque-seal' || el.classList.contains('interactive-lore')) {
        const targetId = el.getAttribute('data-target') || (el.id === 'star-samuel' ? "105" : "106");
        const texto = cerebro.obterConteudo(targetId);
        exibirMensagem(cerebro.personalizar(texto), 'msg-rocket');
    }
});

sendBtn.addEventListener('click', processarComando);
inputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') processarComando(); });

window.onload = () => {
    setTimeout(() => {
        exibirMensagem("Sistemas iniciados. Identificação necessária para o log de bordo. Como devo chamar você, comandante?", 'msg-rocket');
    }, 1000);
};