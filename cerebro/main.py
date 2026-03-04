import asyncio
import json
import logging
import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

# --- CONFIGURAÇÃO ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - LUMI_LOG: %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="LUMI - Cérebro Alpha (Fase 1)")

# Caminho para a base de conhecimento (Post-it do Professor)
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
BASE_CONHECIMENTO = os.path.join(DATA_DIR, "aula.txt")

# Garante que a pasta data existe
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

def carregar_conteudo_aula():
    """Lê o arquivo de aula para simular o RAG (Fase 1)"""
    if os.path.exists(BASE_CONHECIMENTO):
        with open(BASE_CONHECIMENTO, "r", encoding="utf-8") as f:
            return f.read()
    return "O professor ainda não escreveu nada no Post-it de aula."

# --- PROCESSAMENTO ---

async def processar_comando_lumi(mensagem_aluno: str):
    msg = mensagem_aluno.lower()
    conteudo_aula = carregar_conteudo_aula()

    # Template de resposta base
    resposta = {
        "prefixo_padrao": "Interessante...",
        "corpo_da_dica": "Minha luz ainda está calibrando.",
        "status_progresso": "EM_PROGRESSO",
        "comando_pinky": "CONTINUAR",
        "aluno_alvo": "Aluno"
    }

    # Simulação de resposta baseada no arquivo de aula
    if "aula" in msg or "conteúdo" in msg or "ajuda" in msg:
        resposta["corpo_da_dica"] = f"Sintonizei no material do professor! Ele diz: {conteudo_aula}. O que você entende disso?"
    
    # Comandos de teste preservados para o desenvolvedor
    elif "teste_latencia" in msg:
        await asyncio.sleep(15)
        resposta["corpo_da_dica"] = "Demorei, mas sintonizei uma frequência profunda!"
    
    elif "teste_drible" in msg:
        resposta["status_progresso"] = "DRIBLE"
        resposta["corpo_da_dica"] = "Foco na luz! Vamos voltar ao tema da aula?"

    return resposta

# --- COMUNICAÇÃO (WEBSOCKET) ---

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("Pinky sintonizado!")

    try:
        while True:
            data = await websocket.receive_text()
            dados = json.loads(data)
            
            # Processa e devolve a resposta
            resposta = await processar_comando_lumi(dados.get("texto", ""))
            await websocket.send_json(resposta)

    except WebSocketDisconnect:
        logger.info("Pinky saiu da frequência.")
    except Exception as e:
        logger.error(f"Erro na sintonização: {e}")