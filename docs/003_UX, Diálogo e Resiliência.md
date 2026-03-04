# [DOC-03] UX, Diálogo e Resiliência: A Alma da LUMI

**Versão:** 3.0 
**Conceito:** A Inteligência Artificial como uma lanterna para o raciocínio.  
**Foco:** Naturalidade, Redução de Ansiedade e Autonomia do Aluno.

---

## 1. Identidade e Interface de Interação
A Lumi não é um personagem; ela é a própria radiação pedagógica. A interface deve ser minimalista, eliminando elementos que distraiam do foco central: o conhecimento.

* **O Foco (Círculo Radiante):** Um círculo central que pulsa organicamente no Pinky. Não há botões de "enviar" ou "parar" de forma textual. O ato de tocar ou falar com o círculo inicia a sintonização.
* **Feedback Visual de Estado:**
    * **Captando:** Pulsação rítmica, vibrante e dourada. O brilho expande e contrai simulando uma escuta ativa (Glow dinâmico).
    * **Processando (Sussurro):** O brilho se concentra no núcleo, emitindo pequenas partículas de luz (faíscas). É o estado onde o "Alfaiate" entra em ação com as frases de espera.
    * **Iluminando (Falando):** A luz se expande suavemente para a área de texto, como um amanhecer que revela o conteúdo da dica socrática.

---

## 2. Gestão de Silêncio e Inatividade (O Brilho que Enfraquece)
Diferente de IAs passivas, a Lumi monitora o engajamento. Se o aluno parar de interagir, a Lumi proativamente tenta reanimar a conexão para evitar a dispersão em sala de aula.

* **Estágio 1 - Chamado de Luz (2 minutos de inatividade):**
    * **Visual:** O círculo muda de dourado para um tom âmbar suave e começa a oscilar como uma chama de vela ao vento.
    * **Áudio:** *"Sua luz está ficando fraquinha, [NOME]. Ainda está por aqui ou quer que eu foque em outro assunto?"*
* **Estágio 2 - Modo Repouso (5 minutos de inatividade):**
    * **Visual:** A luz se reduz a um único ponto branco quase imperceptível no centro da tela (pixel de luz).
    * **Áudio:** *"Vou poupar energia por agora para não ofuscar seu descanso. Quando quiser brilhar de novo, é só me chamar!"*
    * **Log:** O evento é enviado ao Cérebro e registrado no **[DOC-07] Caderno de Erros** como "Inatividade Crítica".

---

## 3. Resiliência Narrativa (O Alfaiate)
Para garantir que a latência do hardware local ou do processamento da LLM não quebre o fluxo, o Pinky utiliza a lógica de "costura" de frases:

* **Espera Curta (até 7s):** "Sintonizando os livros..." -> *Resposta:* "Achei! Veja o que o material diz..."
* **Espera Longa (7s a 20s):** "Estou mergulhando fundo nessa ideia, é uma pergunta brilhante!" -> *Resposta:* "Voltei com algo interessante! Seguinte..."

---

## 4. Protocolo de Erro de Frequência (Ruído)
Em ambientes escolares ruidosos, se o reconhecimento de voz (STT) falhar ou for inconclusivo:
* **Ação:** A Lumi assume o erro de forma lúdica, sem culpar o usuário.
* **Narrativa:** *"Puxa, a vibração da sala agitou minha luz e não consegui te ouvir bem. Pode repetir com calma para eu sintonizar sua dúvida?"*

---

## 5. Acessibilidade Nativa
A Lumi utiliza as configurações do dispositivo do aluno (Pinky) de forma transparente:
* **Tamanho de Fonte e Contraste:** Respeitados automaticamente via CSS relativo.
* **Velocidade de Fala:** Sincronizada com as preferências de acessibilidade do sistema operacional do aluno.