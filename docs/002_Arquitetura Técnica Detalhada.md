⚙️ [DOC-02] Arquitetura Técnica Detalhada: Ecossistema LUMI

Versão: 1.0 (Baseada na Estratégia Cérebro-Pinky)
Protocolo de Rede: WebSockets (Bidirecional / Baixa Latência)
Processamento: Híbrido (Inteligência Central / Interface Distribuída)

1. Topologia de Rede e Conectividade
A Lumi opera em uma Intranet Local. O Cérebro atua como o servidor central (Host) e os Pinkys como clientes (Nodes).
Servidor WebSocket (Cérebro): Escuta na porta 8501 (ou similar). Gerencia uma tabela de conexões ativas [Socket_ID : Nome_Aluno].
Protocolo de Reconexão (Hands-off): Como as "mãos podem se soltar" no Wi-Fi, o Pinky implementa uma estratégia de Exponential Backoff:
Se cair, o Pinky tenta reconectar em 1s, 2s, 4s... até 15s.
Estado de Sobrevivência: Se a conexão cair durante uma pergunta, o Pinky mantém o texto na memória e tenta reenviar assim que o "aperto de mão" for refeito.

2. Divisão de Processamento (O Fluxo de Dados)
A. No Pinky (O Terminal de Campo)
Captura (STT): Usa a Web Speech API do navegador para converter a fala do aluno em texto (Local/Offline no dispositivo).
Envio: Dispara um JSON via WebSocket: { "action": "ask", "payload": "Texto do Aluno" }.
Gestão de Espera (Timer): Se o Cérebro não responder em 3s, o Pinky inicia as Frases Tapa-Buraco lúdicas e marca o status_espera.
Recebimento e Costura: Recebe a dica do Cérebro e enxerta o início baseado no que ele mesmo falou para o aluno.
Fala (TTS): Usa a voz padrão do sistema (Android/iOS) para ler a dica costurada.
B. No Cérebro (O Núcleo de Inteligência)
Cache Semântico: Antes de chamar a IA, compara a pergunta com o banco de vetores de perguntas já respondidas na aula.
RAG em Camadas:
Camada 1: Busca no índice de palavras-chave (RAM).
Camada 2: Recupera trechos do PDF (Disco/Vetor DB).
Inferência (Ollama/Llama 3): Gera a dica socrática baseada no contexto + Post-its do professor.
Resposta: Devolve o texto puro via WebSocket.

3. Lógica do "Alfaiate" (Enxerto de Texto no Pinky)
O Pinky possui uma tabela de mapeamento para garantir a Coerência Narrativa:
Se Pinky disse: "Eita, derrubei minhas lentes..."
Ação de Costura: Prefixar a resposta do Cérebro com "Achei! Olha só, [NOME]...".
Se Pinky disse: "Estou lendo com muita atenção..."
Ação de Costura: Prefixar com "Terminei de ler! Veja bem, [NOME]...".

4. Segurança e Acessibilidade Local
Barreira de IP: O código do servidor bloqueia qualquer requisição ao /admin que não venha do IP 127.0.0.1 (Acesso físico ao Cérebro).
Acessibilidade: Ao usar a Web Speech API, o Pinky respeita automaticamente as configurações de "Tamanho de Fonte", "Contraste" e "Velocidade de Fala" que o aluno já definiu no seu próprio tablet/celular.

5. Módulo de Resiliência (Pane no Servidor)
Caso o WebSocket feche e não retorne após 3 tentativas:
Pinky muda para o estado OFFLINE_EMERGENCY.
Ação: Dispara a frase de erro lúdico: "Vixe, [NOME]! Minha lanterna apagou. Pode chamar o professor?".
Log Local: Guarda a última pergunta para que o professor veja o que o aluno estava tentando saber.

6. Stack Tecnológica
Backend (Cérebro): Python, FastAPI (para WebSockets), Ollama, ChromaDB.
Frontend (Pinky): HTML5/Javascript, Web Speech API.