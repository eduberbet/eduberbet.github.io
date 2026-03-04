# [DOC-09] Roadmap de Implementação: A Evolução da Luz

**Versão:** 3.0 (Foco em Resiliência, Entrega Incremental e Testes de Cenário)  
**Linguagem Base do Cérebro:** Python (FastAPI/WebSockets)  
**Conceito:** Do Cérebro Simulado à Autonomia Socrática.

---

## 1. Fase 0: O Cérebro Simulado (Mock Brain & Debugger)
Nesta fase, o Cérebro em Python funciona como um simulador de cenários para testar a robustez do Pinky (Frontend) sem depender de IA real.

### 1.1. Dicionário de Comandos de Teste (Palavras-Chave)
Ao receber uma string do Pinky, o Cérebro verifica palavras-chave para disparar comportamentos específicos:
- `teste_latencia`: O servidor espera 15s antes de responder (Valida o **Estado de Sussurro** e o **Alfaiate**).
- `teste_queda`: Encerra a conexão WebSocket abruptamente (Valida o **Protocolo de Reconexão**).
- `teste_kill`: Envia o sinal de interrupção mestre (Valida o **Kill Switch**).
- `teste_dupla`: Devolve um JSON tratando dois nomes (Valida a **Interação em Dupla**).
- `teste_drible`: Dispara a resposta fixa de "Papo Furado" (Valida o **Anti-Drible**).
- `teste_vazio`: Simula o comportamento para silêncio prolongado (Valida a **Gestão de Inatividade**).
- `teste_sucesso`: Simula o cenário onde o aluno acerta (Valida a **Exigência de Argumento**).

---

## 2. Fases de Implementação (Caminho da Maturidade)

### Fase 1: Alpha 1 - "O Aperto de Mão" (Conectividade)
* **Foco:** Estabilizar o transporte de dados entre as pontas.
* **Marcos:** Login com nomes simples/duplos, WebSocket estável e troca de JSON básico.

### Fase 2: Alpha 2 - "A Borda e a Identidade" (UX e Engajamento)
* **Foco:** Implementar a lógica local no Pinky (JS).
* **Marcos:** * Interface do **Círculo Radiante** (DOC-03).
    * **Monitor de Inatividade:** Timer local que faz a Lumi "pulsar" após 2min de silêncio.
    * **Interceptador de Borda:** Respostas locais para saudações (Frequência de Cortesia).

### Fase 3: Lumi Pocket (Vitrine Estática)
* **Foco:** Versão demonstrativa para GitHub Sites.
* **Marcos:** Cérebro Simulado convertido para script JS interno. RAG "fake" baseado em busca por palavras-chave nos documentos do projeto.

### Fase 4: Beta 1 - "O Despertar Socrático" (Integração LLM)
* **Foco:** Substituir os `ifs/fors` pela inferência real do Llama 3.
* **Marcos:** * Implementação do **Prompt de Ouro** (DOC-05).
    * **Lumi Inquisidora:** A IA passa a tomar a iniciativa e pergunta ao aluno se ele ficar em silêncio.
    * **Validação de Sucesso:** A sessão só fecha se o aluno explicar o "porquê".

### Fase 5: Beta 2 - "A Biblioteca Viva" (RAG e Contexto)
* **Foco:** Alimentação de conhecimento e colaboração.
* **Marcos:** * Integração com **ChromaDB** (Leitura de PDFs).
    * **Modo Dupla Ativo:** A Lumi alterna perguntas entre "Aluno A" e "Aluno B".
    * Leitura de **Post-its** do professor (DOC-06).

### Fase 6: Lumi 1.0 - "O Olhar do Mestre" (Gestão e Resiliência)
* **Foco:** Ferramentas para o docente e escala.
* **Marcos:** * **Caderno de Erros** funcional com logs de inatividade e drible (DOC-07).
    * Painel Administrativo (Porta 9999).
    * Gestão de **Fila de Hardware** para salas de aula reais.

---

## 3. Critérios de Sucesso por Fase
Cada fase só é considerada concluída quando o sistema for capaz de passar nos testes de "stress" (latência e queda) definidos na Fase 0 sem precisar de reiniciar manualmente o Pinky.