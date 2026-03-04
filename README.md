# LUMI - Lanterna Universal de Mediação Inteligente 💡

**Conceito:** A Inteligência Artificial como uma lanterna para o raciocínio.

A **LUMI** é um ecossistema de apoio ao professor desenvolvido para rodar 100% offline. Ela não entrega respostas; ela media o raciocínio socrático utilizando materiais didáticos (PDFs e Post-its) fornecidos pelo docente.

---

## 👐 Projeto Open Source & Comunidade
Este é um projeto **Open Source** (Código Aberto). Acreditamos que a tecnologia educacional deve ser acessível, auditável e construída coletivamente.

* **Contribua:** Sugestões de melhoria na lógica socrática, otimização de performance para hardware antigo e novas interfaces de acessibilidade são muito bem-vindas.
* **Filosofia:** Priorizamos o "Simples Bem Feito". Se uma funcionalidade pode ser resolvida com um `Regex` na borda (Pinky) em vez de onerar a LLM (Cérebro), esse é o caminho que seguimos.
* **Privacidade:** Nenhuma contribuição deve quebrar a regra de "Zero Nuvem". A Lumi nasce e morre na rede local da escola.

---

## 🏗️ Arquitetura Cérebro-Pinky
- **O Cérebro (Backend):** Servidor Python (Ollama/Llama 3 + ChromaDB). Onde mora a inteligência e o controle do professor.
- **O Pinky (Frontend):** Interface leve em JS Vanilla/Web Speech API. Onde o aluno interage com a Lumi.

---

## 🗺️ Roadmap de Desenvolvimento/Implementação 

| Fase | Nome | Status | Descrição |
| :--- | :--- | :--- | :--- |
| Fase 0 | Cérebro Simulado | ✅ Concluído | Criação do servidor de testes (Mock) e comandos de depuração (Latência, Kill Switch, Drible). |
| Fase 1 | Alpha (Conexão) | ✅ Concluído | Estabilização do WebSocket e JSON base para nomes simples/duplas. |
| Fase 2 | Alpha UX (Borda) | ✅ Concluído | Onboarding de Aluno, Filtros de Papo Furado e Blindagem de Contexto Emocional. |
| **Fase 3** | **Lumi Pocket** | 🔵 **ATUAL** | Versão estática para GitHub Sites (Vitrine de demonstração). |
| Fase 4 | Beta (O Despertar) | ⚪ Planejado | Integração com LLM real e Validação de Sucesso com argumento. |
| Fase 5 | Beta RAG (Grupo) | ⚪ Planejado | Modo Dupla Ativo e consulta profunda a PDFs e Post-its. |
| Fase 6 | Lumi 1.0 (Mestre) | ⚪ Planejado | Caderno de Erros funcional e Gestão de Fila de Hardware. |

> 🌐 **Lumi em Tempo Real:** Quer ver a Lumi Pocket em ação? Acesse a versão de demonstração em [eduberbet.github.io](https://eduberbet.github.io).

---

## 🚀 Evolução Atual (Alpha 5.7 - Ironclad Edition)

### 🧠 Destaques da Versão:

* **O Ritual de Batismo (Onboarding de Identidade):**
    * A Lumi não é mais uma estranha; ela agora pergunta e memoriza o nome do aluno no primeiro contato.
    * **Filtro Anti-Troll:** Sistema de validação que barra nomes ofensivos ou robóticos 
* **Blindagem Emocional (O Muro de Borda):**
    * Evolução do contexto de acolhimento: a Lumi agora sustenta diálogos sobre sentimentos por até **90 segundos**, mesmo que o aluno tente mudar de assunto com um "Oi" no meio.
    * O gatilho "Por quê?" agora é inteligente; se você estiver triste, ela sabe que a explicação deve ser humana (Professor) e não técnica (Cérebro).
* **Ouvido Absoluto (Resiliência de Áudio):**
    * **Teste do Bocejo:** O motor de limpeza agora é tão refinado que ignora ruídos não-verbais e silêncios prolongados com louvor.
    * Correção definitiva do "Loop Visual": o botão lilás e o estado "Irradiando" agora morrem no milissegundo em que você solta o dedo.
* **Psicologia das Cores & Estados:**
    * 🔵 **Azul Turquesa:** Estado *Idle* (Sintonizada e Pronta).
    * 🟣 **Lilás:** Acolhimento, Empatia e Captura de Voz.
    * 🔴 **Vermelho:** Drible (Foco na Aula) ou **Luz Fraca** (Offline).
    * ⚪ **Branco Pulsante:** Irradiando (Escutando o Aluno).

---

## 🛠️ Arquitetura de Filtros (O Funil de Borda)

1. **Protocolo de Batismo:** Bloqueio pedagógico inicial; nenhuma dúvida acadêmica é enviada ao Cérebro antes da apresentação formal do aluno.
2. **Escape Pod (Acolhimento):** Identifica gatilhos de dor severa via Regex Neural e redireciona o aluno para o suporte humano, mantendo a mensagem de apoio visível na tela mesmo durante interações sociais.
3. **Filtro de Ruído:** Normalização agressiva de strings (NFD + Regex) que limpa interrogações, gírias e bocejos antes de decidir se deve incomodar o servidor.
4. **Memória de Curto Prazo:** Janela de **90 segundos** (dobrada!) para garantir que o fio da meada emocional não se perca em "papo furado".

---

## 🛠️ Guia de Implementação (Tutorial)

### 1. Requisitos do Sistema
* **Python 3.10 ou superior.**
* Dependências: `fastapi`, `uvicorn`, `websockets`.

### 2. Preparando o Cérebro (Backend)
Na pasta `/cerebro`, instale as bibliotecas necessárias e inicie o servidor:

```bash
pip install fastapi uvicorn websockets
```
#### Execução (Caso o comando uvicorn não seja reconhecido diretamente, utilize o prefixo python -m)
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

O servidor estará ativo em localhost:8000.

### 3. Sintonizando o Pinky (Frontend)
Navegue até a pasta /pinky.

Abra o arquivo index.html em seu navegador.

O status deve exibir "Sintonizada" (conexão via WebSocket estabelecida).

---

## 📖 Manual de Interação (Como falar com a Lumi)

Use este guia para entender as reações da Lumi e validar se a "personalidade" dela está bem calibrada:

### 1. O Filtro de Regionalismo (A "Normalização")
* **O que dizer:** "Boa noite, tudo bão?" ou "Eai, blz?"
* **O que esperar:** A Lumi deve brilhar em **Azul Turquesa** e responder instantaneamente na borda, sem "pensar" (ficar branca). Ela ignora acentos e gírias para te saudar.

### 2. O Acolhimento Lilás (Empatia)
* **O que dizer:** "Estou muito triste hoje" ou "Meu gato morreu".
* **O que esperar:** A Lumi assume o estado **Lilás**. Ela oferece conforto e sugere que você converse com seu professor, entendendo que momentos de dor exigem um abraço humano que uma IA não pode dar.

### 3. A Curiosidade de Contexto (O "Por quê?")
* **O que dizer:** Após ela te acolher no modo Lilás, pergunte: "Mas por que não posso falar com você?".
* **O que esperar:** Graças à **Memória de Curto Prazo**, ela não envia esse "por que" genérico para o Cérebro. Ela entende que você está questionando a sugestão anterior dela e explica sua natureza de código e luz.

### 4. O Brilho da Vitória (Entusiasmo Situacional)
* **O que dizer:** "Hoje estou feliz!" ou, após uma dica de aula, "Consegui fazer!".
* **O que esperar:** Ela assume o estado **Verde**. 
    * Se for apenas humor, ela compartilha da sua alegria. 
    * Se houver um contexto de aula recente, ela celebra sua conquista acadêmica específica.

### 5. O Drible Pedagógico (Foco)
* **O que dizer:** Tentar conversar muito sobre futebol ou outros assuntos fora da aula.
* **O que esperar:** O estado muda para **Vermelho**. A Lumi fará um "drible", lembrando gentilmente que o objetivo ali é o aprendizado.

---

## 🛠️ Resiliência Técnica
* **Estado Cinza (`lumi-off`):** Se o servidor Python cair, a Lumi apaga sua luz e tenta reconectar sozinha a cada 3 segundos.
* **Estado Branco (`lumi-captando`):** Indica que a Lumi enviou sua dúvida para o "Cérebro" e está traduzindo o conhecimento em luz.

---

## 📬 Contato e Suporte
Dúvidas, sugestões de melhoria ou interesse em apoiar o projeto (doações e parcerias) Entre em contato: **edu.berbet@gmail.com** ou **edu.berbet@hotmail.com**

*LUMI: Menos respostas prontas, mais mentes brilhantes.*