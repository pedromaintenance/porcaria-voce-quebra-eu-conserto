# Acassio — instrutor, personagem inicial (19/10/2026)

## Cadastro
- Membro inicial **M4** após Pedro, Geovane e Junior em nova campanha.
- Identidade: `name:'Acassio'`, `sprite:'acassio'`, `specialty:'Instrutor'`, `role:'geral'` (mesmo papel operacional do instrutor Geovane).
- Atributos de máquinas: CAT 777E, 6030, 395, 336GC, Sandvik DR410i, DI650i = **91**; CAT D9, 966 e 16 = **87**.
- Sistemas: FPS=49, Motor=91, Pneus=2, Cilindros=89, Mangueiras=89, Válvulas=91, Eletrônica embarcada=93, Freio=91, Suspensão=91, Combustível e injeção=93, Admissão e escape=93, Lubrificação=88, Circuitos hidráulicos=94, Sistema elétrico=94, Bombas=93, Ar-condicionado=87. **Todos os demais sistemas = 93.**
- Disciplinas: Soldagem=0, Usinagem=0, **todas as outras = 91**.
- Os atributos nomeados são da matriz de proficiência, não do antigo `skill` histórico. Eles afetam as mesmas lógicas de diagnóstico, reparo e treinamento já aplicadas à equipe.

## Arte
- Fonte: `Cartela de Adesivos do Trabalhador da Construção(2).png`, enviada pelo usuário.
- **Arquivo obrigatório:** `acassio-4poses.png`; RGBA, 1160×1244 px; grade 2×2 com células de 580×622 px.
- Quadros: (0) em pé segurando rádio; (1) positivo com a mão; (2) medindo com trena; (3) agachado, inspecionando o solo.
- Atlas derivado das quatro silhuetas transparentes originais sem redesenho, usando a mesma escala em todos os quadros, centralizado e com base dos pés a 12 px da borda.
- SHA-256 **3c269e024dada8e9cdd31463fbe1d336bd2b4be856b40e1141dcfbfc101dae08**.
- A imagem também é listada no cache offline do PWA. **Não fazer merge enquanto a imagem não estiver no branch**: ausência bloqueia o teste `scripts/test-acassio.cjs` e a instalação da nova versão offline.

## Compatibilidade
- Novas campanhas iniciam com 4 personagens, ID M4 para Acassio, primeiro contratado passa a M5 e teto da equipe a 14.
- Saves pré-existentes **não** ganham personagens automaticamente; apenas recebem normalização de competências para membros já presentes, sem adulterar OS, IDs, experiência ou recursos.
