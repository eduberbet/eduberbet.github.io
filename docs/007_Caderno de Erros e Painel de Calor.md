# [DOC-07] Caderno de Erros e Painel de Calor
**Versão:** 1.0 (Consolidada com Métricas de Frustração e Calor)  
**Conceito:** Dashboard de Decisão e Ciclo de Feedback Pedagógico.  
**Acesso:** Exclusivo Cérebro (Porta 9999 - Localhost).

---

## 1. O Conceito do Caderno de Erros
O Caderno de Erros não é apenas um log de sistema, mas um relatório de "pontos cegos" no material didático ou na mediação da Lumi. Ele registra interações onde o objetivo socrático encontrou barreiras técnicas ou pedagógicas.

### 1.1. Gatilhos de Registro
Uma entrada é gerada automaticamente no caderno quando ocorre:
1. **Status "Luz Insuficiente":** O aluno chega ao Nível 3 de ajuda (Localização) e ainda demonstra incompreensão ou frustração.
2. **Drible Detectado:** Tentativas persistentes (3+) de burlar a Regra de Ouro.
3. **Fora de Alcance:** Perguntas que o RAG não conseguiu responder com base no material disponível.
4. **Timeout Crítico:** Quando a latência excede 25s e o Pinky ativa o "Grito de Socorro".

---

## 2. Métricas de "Calor" (Heatmap)
O Cérebro utiliza o **Cache Semântico** para agrupar dúvidas similares e gerar um mapa visual para o professor.

* **Métrica de Recorrência:** Se 5 ou mais alunos buscam o mesmo trecho do PDF num intervalo de 30 minutos, esse trecho é marcado como **"Zona Quente"**.
* **Visualização:** O professor vê o PDF original com marcações de calor (de amarelo a vermelho) sobre os parágrafos que mais geraram dúvidas.
* **Objetivo:** Permitir que o professor faça uma intervenção coletiva ("Gente, notei que muitos estão com dúvida na página 12, vamos revisar?") ou crie um **Post-it** corretivo.

---

## 3. Gestão de Frustração (Bandeiras Vermelhas)
Para evitar que o aluno desista do exercício, o sistema monitora o "sentimento" da interação.

* **Bandeira de Loop:** Ativada quando o aluno repete a mesma pergunta original após receber uma dica da Lumi.
* **Ação Lumi:** No Pinky, a Lumi mantém o tom lúdico, mas no Cérebro, um alerta é emitido no painel do professor: *"Aluno [NOME] em estado de loop no tema [X]"*.

---

## 4. Interface de Resolução (Fluxo do Professor)
O professor não apenas lê o erro; ele interage com ele. Cada entrada no Caderno de Erros possui três ações rápidas:

1. **Botão "Iluminar" (Criar Post-it):** Abre instantaneamente uma caixa para criar um Post-it (DOC-06) vinculado àquela dúvida específica.
2. **Botão "Atender":** Marca o aluno para atendimento presencial (útil para o professor se organizar na sala).
3. **Botão "Arquivar":** Remove o erro da lista após a dúvida ter sido sanada ou o material corrigido.

---

## 5. Estrutura de Dados do Log (JSON Interno)
Para fins de auditoria offline, cada erro é salvo localmente com a seguinte estrutura:

```json
{
  "id_sessao": "UUID-12345",
  "timestamp": "2023-10-27T10:30:00Z",
  "aluno_nome": "João Silva",
  "input_bruto": "Como faz a conta de divisão?",
  "categoria_erro": "FORA_DE_ESCOPO",
  "nivel_ajuda_alcancado": 1,
  "trecho_pdf_relacionado": "null",
  "status_professor": "PENDENTE"
}

O Gemini disse
Excelente. Com essas definições, fechamos o ciclo entre o comportamento da IA (Cérebro), a experiência do aluno (Pinky) e a supervisão do docente. O Caderno de Erros deixa de ser um log passivo para se tornar uma ferramenta de intervenção pedagógica.

Aqui está o [DOC-07] estruturado em formato Markdown:

Markdown
# [DOC-07] Caderno de Erros e Painel de Calor
**Versão:** 1.0 (Consolidada com Métricas de Frustração e Calor)  
**Conceito:** Dashboard de Decisão e Ciclo de Feedback Pedagógico.  
**Acesso:** Exclusivo Cérebro (Porta 9999 - Localhost).

---

## 1. O Conceito do Caderno de Erros
O Caderno de Erros não é apenas um log de sistema, mas um relatório de "pontos cegos" no material didático ou na mediação da Lumi. Ele registra interações onde o objetivo socrático encontrou barreiras técnicas ou pedagógicas.

### 1.1. Gatilhos de Registro
Uma entrada é gerada automaticamente no caderno quando ocorre:
1. **Status "Luz Insuficiente":** O aluno chega ao Nível 3 de ajuda (Localização) e ainda demonstra incompreensão ou frustração.
2. **Drible Detectado:** Tentativas persistentes (3+) de burlar a Regra de Ouro.
3. **Fora de Alcance:** Perguntas que o RAG não conseguiu responder com base no material disponível.
4. **Timeout Crítico:** Quando a latência excede 25s e o Pinky ativa o "Grito de Socorro".

---

## 2. Métricas de "Calor" (Heatmap)
O Cérebro utiliza o **Cache Semântico** para agrupar dúvidas similares e gerar um mapa visual para o professor.

* **Métrica de Recorrência:** Se 5 ou mais alunos buscam o mesmo trecho do PDF num intervalo de 30 minutos, esse trecho é marcado como **"Zona Quente"**.
* **Visualização:** O professor vê o PDF original com marcações de calor (de amarelo a vermelho) sobre os parágrafos que mais geraram dúvidas.
* **Objetivo:** Permitir que o professor faça uma intervenção coletiva ("Gente, notei que muitos estão com dúvida na página 12, vamos revisar?") ou crie um **Post-it** corretivo.

---

## 3. Gestão de Frustração (Bandeiras Vermelhas)
Para evitar que o aluno desista do exercício, o sistema monitora o "sentimento" da interação.

* **Bandeira de Loop:** Ativada quando o aluno repete a mesma pergunta original após receber uma dica da Lumi.
* **Ação Lumi:** No Pinky, a Lumi mantém o tom lúdico, mas no Cérebro, um alerta é emitido no painel do professor: *"Aluno [NOME] em estado de loop no tema [X]"*.

---

## 4. Interface de Resolução (Fluxo do Professor)
O professor não apenas lê o erro; ele interage com ele. Cada entrada no Caderno de Erros possui três ações rápidas:

1. **Botão "Iluminar" (Criar Post-it):** Abre instantaneamente uma caixa para criar um Post-it (DOC-06) vinculado àquela dúvida específica.
2. **Botão "Atender":** Marca o aluno para atendimento presencial (útil para o professor se organizar na sala).
3. **Botão "Arquivar":** Remove o erro da lista após a dúvida ter sido sanada ou o material corrigido.

---

## 5. Estrutura de Dados do Log (JSON Interno)
Para fins de auditoria offline, cada erro é salvo localmente com a seguinte estrutura:

```json
{
  "id_sessao": "UUID-12345",
  "timestamp": "2023-10-27T10:30:00Z",
  "aluno_nome": "João Silva",
  "input_bruto": "Como faz a conta de divisão?",
  "categoria_erro": "FORA_DE_ESCOPO",
  "nivel_ajuda_alcancado": 1,
  "trecho_pdf_relacionado": "null",
  "status_professor": "PENDENTE"
}

6. Privacidade e Retenção
Localismo: Os dados do Caderno de Erros nunca saem do hardware do Cérebro.

Volatilidade: O professor pode optar por "Limpar Caderno" ao final de cada aula ou ciclo de aprendizagem, garantindo a privacidade histórica dos alunos.