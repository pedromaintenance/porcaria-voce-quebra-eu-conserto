# Quatro ocorrências didáticas derivadas de roteiros FMEA — 20/10/2026

Origem: [fmea-database-mining](https://github.com/pedromaintenance/fmea-database-mining), `data/knowledge/diagnostic/playbooks.v1.json` v1.2.1 (12 roteiros). Os quatro roteiros abaixo têm `review.status = pendente`, `evidenceStatus = sem_resultado_observado` e `mapping.locationId/componentCode/damageId/causeId = null` na origem.

**Interpretação:** são novas histórias **ficcionais**, baseadas nos sintomas e hipóteses concorrentes. Os gabaritos escolhidos no `game-data.json` são escolhas didáticas do jogo, **não** FMEAs homologadas, análises de laboratório, causas reais confirmadas, planos OEM ou vínculos SAP validados. O campo `sourcePartMatch:false` explicita que o vínculo completo de peça/dano/causa não foi validado pela fonte. Valores de HH e R$ são balanceamento da economia existente no PORCARIA, não estimativas empíricas.

| ID | Fonte | Modelo | Sistema/Grupo/Subgrupo | Componente · Dano · Causa (gabarito simulado) |
| --- | --- | --- | --- | --- |
| INC030 | PB-EXC-PUMP-01 | EQ03 CAT 395 | HYSY/DRPU/HYPU | Vedação · Vazando · Falha de vedação |
| INC031 | PB-SHOVEL-COOL-01 | EQ02 CAT 6030 | ENS1/COSY/RADI | Radiador · Entupido ou restringido · Material estranho |
| INC032 | PB-DOZER-TRACK-01 | EQ07 CAT D9 | UNCR/TRF1/IDL1 | Rolamento · Gripado · Lubrificação insuficiente |
| INC033 | PB-TRUCK-FINAL-01 | EQ01 CAT 777E | DRTR/AXAS/FID2 | Engrenagem · Desgastado · Lubrificação insuficiente |

**Critérios editoriais:** mantidas as 29 ocorrências antigas; novos caminhos e vocabulário confrontados com os catálogos já presentes no jogo; sem transferência indevida de modelo (p.ex. CAT 980 → 966), sem atribuir peça onde não existe cadastro suficiente (p.ex. pneu na coluna de Parte Objeto). Mantidas alternativas no texto de verificação, com linguagem de **teste a executar** — não resultado executado. O sistema atual do jogo continua com seis respostas determinísticas e pode revelar gabaritos apenas após a progressão prevista.

## Pendências para evolução de Inspeção/PCM

A biblioteca FMEA contém três hipóteses e dois testes propostos por roteiro. A futura simulação de inspeção poderá expor achados/evidências graduais com resultados positivos, negativos ou inconclusivos. **Nada dessa mecânica foi implementado nesta alteração.** Revisão de aplicabilidade por prefixo, sistema, peça, modo de dano e manual continua pendente antes de chamar os casos de *curados* no FMEA Database.

Cenários não integrados por falta de compatibilidade confirmada com catálogo atual: DR410i avanço (ausência de subgrupo correspondente FECH), DI650i compressor (parte objeto de circuito pneumático não resolvida), CAT 16 pneus (catálogo sem Parte Objeto Pneus), CAT 980 (modelo ausente), CAT 777 combustível (catálogo sem filtro específico), CAT 6030 lubrificação (componente/causa ainda não resolvidos).
