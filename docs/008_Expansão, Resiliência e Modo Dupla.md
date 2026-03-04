# [DOC-08] Expansão, Resiliência e Modo Dupla

**Versão:** 2.0 (Consolidada: Borda, Dupla e Gestão de Fila)  
**Conceito:** Otimização de Performance e Refinamento da Experiência.  
**Aplicação:** Camada de Integração (Pinky e Middleware do Cérebro).

---

## 1. Inteligência de Borda (Frequência de Cortesia)
Para que a Lumi pareça instantânea e não gaste o "fôlego" (processamento) do Cérebro com besteiras.
* **Mecânica:** O JavaScript do Pinky intercepta o texto do STT via Regex antes do envio.
* **Gatilhos Sociais:** "Oi", "Tudo bem?", "Tchau", "Bom dia".
* **Resposta Local:** O Pinky responde imediatamente via TTS com frases pré-programadas. 
* **Vantagem:** Latência zero e economia de 100% da LLM para interações não-pedagógicas.

---

## 2. Modo Dupla Ativo (Sincronia e Colaboração)
A Lumi atua como mediadora entre dois alunos, garantindo que ambos participem.
* **Login:** O Pinky envia: `{"aluno": ["João", "Maria"]}`.
* **Alternância de Foco:** O Cérebro alterna o campo `aluno_alvo` no JSON de resposta.
* **Interação Cruzada:** A Lumi gera provocações como: *"João, a Maria trouxe um ponto interessante. Como você acha que isso se conecta com o que vimos agora?"*.

---

## 3. Fila de Prioridade Dinâmica (Gestão de Hardware)
Em uma sala com 30 Pinkys e apenas 1 Cérebro, o sistema gerencia o gargalo:
1.  **Fura-Fila (Prioridade Crítica):** Alunos com status "Drible" ou "Inatividade" recente (para recuperá-los logo) e alunos em "Bandeira de Loop".
2.  **Feedback de Espera (UX):** Enquanto o aluno está na fila, o Pinky exibe animações da Lumi "mergulhando na biblioteca" e o Alfaiate diz: *"Estou iluminando um caminho difícil aqui do lado, já já chego na sua mesa!"*.

---

## 4. Snapshot de Brilho (Continuidade)
Para que a queda de energia ou fim da aula não apague o progresso.
* **O Snapshot:** A cada sucesso validado, o Cérebro salva o estado (páginas lidas e conceitos dominados).
* **Retomada:** Ao logar novamente, a Lumi saúda: *"Oi [NOME]! Da última vez focamos em [TEMA]. Quer continuar dali ou brilhar em algo novo?"*.

---

## 5. Validação de Sucesso com Argumento (A Trava Final)
Diferenciando o "chute" da "aprendizagem". A sessão só ganha a marca de "Concluída" no Caderno de Erros se:
1.  O aluno der a resposta correta.
2.  A LLM validar que a explicação (o "porque") faz sentido lógico.