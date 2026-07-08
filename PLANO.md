# PLANO COMPLETO — "O PASSEIO"

> *Aventura point-and-click de dioramas fixos. Estética bizarra, ilustrada, surreal. No estilo Rust Lake / Cube Escape / Sansara Room.*

---

## 1. LORE

### Premissa

Peu vai viajar por uma semana. Deixa Shiva, sua golden retriever descendente de Cérbero, aos cuidados de **você** — um amigo. Você prometeu passear com ela todo dia. Não cumpriu.

No sétimo dia, você dorme. Acorda 3h da manhã. O quarto não é o mesmo. A parede tem uma textura que não existia antes. O espelho mostra um reflexo com um sorriso que não é o seu. Você está na **prisão mental que Shiva construiu para você**: um palácio de culpa, um museu de memórias distorcidas, moldado com as almas que ela aprisionou antes. A única saída é entender cada uma delas.

### Quem é Shiva

Descendente de **Cérbero** — o cão de três cabeças que guarda os portões do submundo. No mundo real, é uma golden retriever. No palácio, é a **guardiã do afeto**:

| Cabeça | Aspecto | Função |
|--------|---------|--------|
| **Esquerda** | Ciúme | Prensa quem divide a atenção de Peu |
| **Centro** | Vigilância | Observa tudo no palácio |
| **Direita** | Punição | Prende quem vê sua verdadeira forma |

Ela não é malvada. É um animal que ama incondicionalmente e **não sabe lidar com divisão**. Cada pessoa presa foi alguém que, de alguma forma, ameaçou o amor que ela sente por Peu. Não fala, não explica, não negocia. Apenas **observa** e espera.

### As Seis Celas

| Cela | Pessoa | Peca | Ambiente | Puzzle Central | Recompensa |
|------|--------|------|----------|----------------|------------|
| 1 | **João Marcelo** | Ciúme | Quarto de aniversário distorcido | Cadeado 18/04 | Chave ☽ + Amuleto |
| 2 | **Sandália** | Posse | Beco infinito com perspectiva impossível | Sequência de patas | Chave ⌵ + Sal |
| 3 | **Seu Ulisses** | Medo | Sala de rádios com paredes que escutam | Sintonizar 3 frequências | Chave ⌂ + Giz |
| 4 | **Enzo** | Perturbação | Quarto infantil com desenhos que se mexem | Ordenar ciclo do dia | Chave ☆ + Ervas |
| 5 | **Elaine** | Vaidade | Altar de velas com espelhos que mentem | Acender na ordem inversa | Chave 🔥 + Espelho |
| 6 | **Giulia L.** | Testemunha | Cemitério infinito sob céu de olhos | Símbolos nas lápides | Chave ◇ + Vela |

### Símbolos

```
☽  ⌵  ⌂  ☆  🔥  ◇
```

---

## 2. DIRETRIZES ARTÍSTICAS

### Estilo Visual

- **Ilustrado, não pixelado.** Cenários pintados digitalmente com pincel solto, texturas orgânicas, luz e sombra dramáticos. Cores saturadas nos destaques, apagadas nas sombras.
- **Surreal e bizarro.** Objetos em lugares impossíveis. Perspectivas que não fecham. Portas onde não deveria haver portas. Tamanhos inconsistentes. Sonho/loucura.
- **Paleta limitada por cena.** Cada cômodo tem seu próprio esquema de cor emocional: quarto em tons sépia, corredor em azul noturno, cela 2 em verde musgo, cela 6 em cinza pedra.
- **Sem personagem visível.** O jogador é um olho flutuante. Não há avatar na tela. O clique é direto e imediato.
- **Animações suaves.** Transições de cena com fade/morph. Objetos que se movem, respiram, transformam. Fumaça, névoa, partículas.

### Analogias de Referência

| Elemento | Referência Rust Lake |
|----------|---------------------|
| Estilo de arte | Rust Lake Hotel, Cube Escape: Seasons |
| Tom | Surreal, melancólico, com horror corporal leve |
| Transições | Fade escuro com morphing de cena |
| Objetos | Ilustrados com detalhes nojentoss/hiper-realistas |
| Puzzles | Mecânicos, de combinação, de observação, de sequência |
| Atmosfera | Silêncio + sons ambientes + ocasional música de piano |

---

## 3. ESTRUTURA DO JOGO

Dioramas **fixos** (sem scroll, sem personagem). Cada cômodo é uma cena estática com objetos clicáveis espalhados. O clique é direto — clicou, ação acontece. Transições de cena via portas ou setas nas bordas.

```
PRÓLOGO (typewriter preto)
    ↓
CÔMODO 0 — O QUARTO ............. (tutorial)
    ↓
CÔMODO 1 — O CORREDOR ........... (encontro com Shiva)
    ↓
CELA 1 — JOÃO MARCELO ........... ☽
    ↓
CÔMODO 2 — SALA DE ESTAR ........
    ↓
CELA 2 — SANDÁLIA (BECO) ....... ⌵
    ↓
CÔMODO 3 — COZINHA ..............
    ↓
CELA 3 — SEU ULISSES (RÁDIOS) ... ⌂
    ↓
CÔMODO 4 — QUINTAL ..............
    ↓
CELA 4 — ENZO (QUARTO) ......... ☆
    ↓
CÔMODO 5 — DESPENSA .............
    ↓
CELA 5 — ELAINE (ALTAR) ........ 🔥
    ↓
CÔMODO 6 — PASSAGEM SECRETA ......
    ↓
CELA 6 — GIULIA (CEMITÉRIO) .... ◇
    ↓
CÔMODO 7 — O TÚNEL .............. (Shiva)
    ↓
A PORTA DOURADA ................. (final)
```

---

## 4. GUIA COMPLETO — FASE A FASE

---

### FASE 0: PRÓLOGO

**Tela preta.** Texto typewriter, letra branca, fonte serifada:

> "Você prometeu."
> "Uma semana."
> "Sete dias."
> "Ela esperou."
> "Você dormiu."
> "3h da manhã."
> "O quarto está diferente."

Cada linha: 3s. A sétima linha fica por 5s, depois dissolve para o Cômodo 0.

---

### FASE 1: CÔMODO 0 — O QUARTO

**Diorama:** Um quarto noturno visto de ângulo frontal levemente inclinado. Cama à esquerda com lençóis amassados. Mesa com abajur à direita. Janela no centro — do lado de fora não é noite, é uma parede de olhos. Espelho na parede esquerda. Guarda-roupa entreaberto. BAU no canto.

**Paleta:** Sépia, azul escuro, laranja fraco do abajur.

**Atmosfera bizarra:** O abajur está desconectado, mas uma **luz tênue** emana da tomada mesmo desplugada. A janela mostra olhos que piscam em sincronia irregular. O guarda-roupa está entreaberto, mas não há profundidade lá dentro — só preto infinito.

#### Objetos

| Objeto | Aparência | Clique | Resultado |
|--------|-----------|--------|-----------|
| Cama | Lençóis com um formato de corpo | 1º | "A cama ainda está quente. A marca do seu corpo ainda está lá." |
| | | 2º | Um dos travesseiros tem um **bilhete** dobrado |
| Bilhete | Papel amassado | click | Abre nota: "Cuide dela pra mim, vou viajar. Passeia com ela todo dia, ela gosta. Volto semana que vem. — Peu" + "TEM UM NÚMERO RABISCADO: 18" + "DEBAIXO TEM OUTRO: 04" |
| Abajur | Abajur vintage, sem lâmpada | 1º | "Não funciona. A tomada está desconectada." |
| Tomada | Na parede, o plugue está fora | click | Conecta → o abajur acende mesmo sem lâmpada — a luz vem **do fio**. Ilumina o chão |
| Lanterna | Chão (só visível após abajur) | click | Coleta: **Lanterna**. "A bateria está pela metade. Ela pulsa." |
| Janela | Moldura com vidro | 1º | "Lá fora: olhos. Dezenas. Todos te olhando." |
| | | 2º | Um olho pisca. Depois outro. Depois todos. Em uníssono. |
| Espelho | Moldura oval | 1º | "Seu reflexo está lá. Mas está **atrasado**. Meio segundo." |
| | | 2º | O reflexo sorri. Você não está sorrindo. |
| Guarda-roupa | Porta entreaberta | 1º | "Escuro infinito lá dentro." |
| | | 2º | Uma mão emerge do escuro. Segura uma **pilha**. A mão desaparece. |
| Pilha | Flutuando (cai no chão) | click | Coleta: **Pilha**. Combine com a lanterna no inventário. |
| BAU | Canto inf-esq, madeira escura | 1º | "Um cadeado de 3 números. 0-0-0." |
| | | puzzle | Puzzle do baú |
| Porta | Direita, madeira maciça | click | "A maçaneta é fria. Gela a mão." 2º click: transição. |

#### Puzzle 01 — Baú do Quarto

**Tipo:** Cadeado 3 dígitos.
**UI:** 3 rotores com clique em setas. Botão de confirmar (uma língua de metal que você puxa).
**Pista:** O bilhete tem "18" e "04". 18 + 04 = 22. 18 - 04 = 14. 18 / 04 = 4.5. O baú tem "PEU" gravado na tampa. No calendário que você ainda não viu (mas a pista está no bilhete), o aniversário do Peu é 18 de abril.
**Solução:** 1-8-4
**Recompensa:** **Chave do Guarda-roupa** (estranhamente, a chave é de osso).

#### Puzzle 02 — Guarda-roupa

**Tipo:** Usar item.
**Ação:** Usar chave de osso no guarda-roupa.
**Resultado:** A porta range abrindo. Dentro, não há fundo — só um casaco **flutuando** no escuro. Clicar no casaco → coleta: **casaco** (protege do frio do túnel mais tarde — item narrativo). No bolso: **moeda antiga** com a face de um cão de 3 cabeças.

#### Puzzle 03 — Combinar Pilha + Lanterna

**Tipo:** Combinar itens no inventário.
**Ação:** Clicar na pilha → clicar na lanterna → "A lanterna agora brilha com uma luz azulada."

#### Transição

1. Clicar no travesseiro → bilhete
2. Clicar no abajur + tomada → lanterna
3. Clicar 2× no guarda-roupa → pilha
4. Combinar pilha + lanterna
5. Resolver baú → chave de osso
6. Usar chave no guarda-roupa → moeda
7. Clicar na porta → transição

**Evento bizarro:** Ao clicar na porta, a maçaneta **geme**. Não o som da madeira — um gemido humano. A porta treme. Depois para.

---

### FASE 2: CÔMODO 1 — O CORREDOR

**Diorama:** Corredor longo em perspectiva forçada — o fundo parece estar a quilômetros de distância, mas o teto está a centímetros da sua cabeça. Papel de parede com padrão repetitivo que, se você olhar fixo, os desenhos se mexem. Lâmpada piscando. Duas portas. Um telefone preto na parede. Um vaso com uma planta morta. No fundo do corredor, uma **silhueta** preta.

**Paleta:** Azul meia-noite, roxo, lâmpada amarela doentia.

**Atmosfera bizarra:** A perspectiva do corredor não faz sentido — o fundo é distante, mas o chão parece subir. A silhueta no fundo não projeta sombra, mas tudo ao redor dela está mais escuro.

#### Objetos

| Objeto | Aparência | Clique | Resultado |
|--------|-----------|--------|-----------|
| Silhueta | Figura preta no fundo | 1º | "Ela está parada." |
| | | 2º | Ela estala o pescoço 180° e desaparece. Um **grampo de cabelo** cai no chão onde ela estava. |
| Grampo | Metal brilhando | click | Coleta: **Grampo** |
| Porta esq | Madeira, fechadura antiga | 1º | "Fechada. A fechadura é de ferro trabalhado." |
| | | grampo | Usar grampo → "A fechadura rangeu." → abre → dentro: **parede de tijolos**. Um dos tijolos está solto. Clicar → **recorte de jornal**: "JOVEM DESAPARECE APÓS FESTA — 18/04" — foto de João |
| Porta dir (Cela 1) | Madeira, maçaneta dourada | click | "Dourada. Brilha mesmo no escuro." → transição |
| Telefone | Preto, fio cortado | 1º | "O fio está cortado. Mas o bocal ainda tem tom." |
| | | moeda | Usar moeda → "O som de uma moeda caindo num poço sem fundo." → discar 1-8-0-4 → o telefone toca DO LADO DE FORA. Uma voz: "Ela está te observando." Click. |
| Vaso | Barro, terra seca | 1º | "Terra seca. Rachada." |
| | | 2º | A terra se mexe. Algo brilha → **moeda de cobre** (diferente da de osso) |
| Lâmpada | Teto | click | "Pisca. 3 segundos acesa. 2 segundos apagada." Padrão: 3-2-3-2. (Código Morse: ··· -- ··· -- = SOS?) |
| Quadro | Moldura na parede | 1º | "Uma pintura de uma golden retriever. Os olhos seguem você." |
| | | 2º | Os olhos brilham vermelhos. O quadro treme. |

#### Transição

1. Clicar 2× na silhueta → grampo
2. Clicar no vaso 2× → moeda de cobre
3. Usar grampo na porta esq → recorte de jornal
4. (Opcional) Usar moeda no telefone + discar → lore
5. Clicar na porta dir → Cela 1

**Evento bizarro:** Depois que a silhueta desaparece, a lâmpada para de piscar. Fica acesa fixa. Mas a luz **não ilumina mais o fundo** — o corredor agora é infinitamente escuro atrás de você.

---

### FASE 3: CELA 1 — O QUARTO DE JOÃO MARCELO (☽)

**Diorama:** Quarto visto de cima, como se você fosse um ponto no teto. Cama de solteiro. Fotos na parede que **se movem** — os rostos nas fotos mudam de expressão quando você não está olhando. Calendário na parede com o mês de abril — mas só existe o dia 18, os outros dias estão **em branco**. Gaveta com cadeado. Estante com livros que sussurram.

**Paleta:** Sépia, caramelo, sombras longas.

**Atmosfera bizarra:** As fotos na parede não são estáticas. João e Peu estão numa festa — mas a cada vez que você olha, eles estão em uma posição diferente. A cama tem um formato de corpo deitado, mas está vazia. O cobertor **respira**.

#### Objetos

| Objeto | Aparência | Clique | Resultado |
|--------|-----------|--------|-----------|
| Fotos (3) | Polaroides na parede | 1º | "João e Peu." |
| | | 2º | "Agora João está sozinho." |
| | | 3º | "Agora a foto está em branco." |
| | | 4º | No verso: "18/04 — Obrigado por tudo." |
| Calendário | Parede | 1º | "Abril. Só o 18 existe." |
| | | 2º | O 18 começa a brilhar vermelho. |
| Gaveta | Mesa centro, cadeado 4 dígitos | puzzle | Puzzle 06 |
| Estante | Canto, livros | 1º | "Eles sussurram quando você não presta atenção." |
| | | 2º | "Mitologia Grega — Cérbero." O livro abre sozinho na página do cão de 3 cabeças. |
| Gaiola | Canto, vazia, porta aberta | 1º | "Penas no chão." |
| | | 2º | As penas formam uma seta apontando para a cama. |
| Cama | Centro | 1º | "O lençol está quente." |
| | | 2º | Embaixo do travesseiro: **chave pequena** |
| Janela | Parede | 1º | "Do lado de fora: uma parede branca. Infinita." |
| | | 2º | Na parede branca, uma sombra de três cabeças passa. |

#### Puzzle 04 — Chave Pequena (sub-puzzle)

**Tipo:** Encontrar item escondido.
**Ação:** Clicar 2× na cama → chave pequena cai.
**Uso:** A chave abre uma gaveta **invisível** na estante. Clicar 3× na estante → uma gaveta aparece onde não havia nada. Usar chave.
**Dentro:** Uma foto amassada. João e Peu no parque. No verso: "Obrigado por tudo. — J." A foto sangra quando você toca.

#### Puzzle 05 — Pena Azul (mini-puzzle opcional)

**Tipo:** Coletar e usar item.
**Ação:** Clicar na gaiola → **pena azul**. Usar pena no calendário → a pena gruda no dia 18. O calendário inteiro se rasga, revelando atrás dele: **18·04·1994** escrito a sangue. (Data do nascimento de João? Da morte? Lore.)

#### Puzzle 06 — Cadeado 18/04 (puzzle central)

**Tipo:** Cadeado de 4 dígitos.
**UI:** 4 rotores que giram com clique, engrenagens visíveis.
**Pistas combinadas:**
- Bilhete do Peu: "18" e "04"
- Calendário: dia 18 de abril
- Foto: "18/04"
**Solução:** 1-8-0-4

**Ao resolver:** A gaveta abre sozinha. Dentro:
- **Chave ☽** (pequena lua de prata)
- **Amuleto de Osso** (um osso esculpido com runas)
- **Nota de João** — o papel está úmido: "Eu não entendi no começo. Eu só via ela me olhando do canto. Quando eu abraçava o Peu, ela se sentava na porta. No dia do meu aniversário — 18 de abril — ela me encarou por uma hora sem piscar. Naquela noite, eu acordei aqui. Ela não gostava de dividir. Eu não era o problema. Eu era só o alvo. ☽"

**Porta de saída** se materializa na parede direita — uma porta de ferro que não estava ali antes. Nela, gravado: "CELA 1 — JOÃO MARCELO — LIBERTADO."

---

### FASE 4: CÔMODO 2 — SALA DE ESTAR

**Diorama:** Sala vista em perspectiva holandesa (inclinada). Sofá, estante, lareira apagada. Mesa de centro com um tabuleiro de xadrez — mas as peças são miniaturas de pessoas que você conhece. Retrato de família na parede. Um tapete vermelho que parece se mover sozinho.

**Paleta:** Marrom, vermelho escuro, dourado sujo.

**Atmosfera bizarra:** O tabuleiro de xadrez tem uma partida em andamento. As peças mudam de posição quando você pisca. No retrato de família, Shiva está sentada à mesa com os humanos — mas ela tem **três cabeças** na pintura. O tapete pulsa como se houvesse algo vivo debaixo.

#### Objetos

| Objeto | Aparência | Clique | Resultado |
|--------|-----------|--------|-----------|
| Estante | Madeira, livros | 1º | Livros. Um vermelho: "Cérbero — Guardião do Submundo." |
| | | 2º | O livro se abre sozinho: "O cão guarda não a entrada, mas a saída. Quem entra no submundo só sai se o cão permitir." |
| Lareira | Apagada | 1º | "Cinzas frias. Algo brilha." |
| | | 2º | Dentro das cinzas: **isqueiro** de prata. O isqueiro está frio, mas a chama é azul. |
| | | 3º | Após pegar o isqueiro, clicar de novo na lareira: um **cofre** está embutido atrás dos tijolos falsos. |
| Cofre | Na lareira | puzzle | Puzzle 07 |
| Mesa | Centro, xadrez | 1º | "Uma partida interminável. As peças são pessoas." |
| | | 2º | "Peu é o rei. Shiva é a rainha. João é um peão que caiu." |
| Tabuleiro | Na mesa | 3º | Mover o peão de João para fora do tabuleiro → a rainha (Shiva) avança 3 casas. O tabuleiro range. Não acontece mais nada. |
| Tapete | Chão | 1º | "Pulsa." |
| | | 2º | Levanta uma ponta → **recorte de jornal**: "JOVEM DESAPARECE APÓS FESTA DE ANIVERSÁRIO — Data: 17/04" (um dia antes do aniversário). |
| Retrato | Parede fundo | 1º | "Família de Peu. Shiva tem três cabeças na pintura." |
| | | 2º | Uma das cabeças de Shiva no retrato **pisca**. |
| Porta Cela 2 | Direita | click | "Madeira rangendo. Fria." → transição |

#### Puzzle 07 — Cofre na Lareira

**Tipo:** Cadeado de data.
**Pista:** O recorte de jornal fala em 17/04 (véspera). A foto de João é 18/04. A data do desaparecimento foi 17, não 18.
**Solução:** 1-7-0-4
**Recompensa:** **Fio de Cobre** (enrolado em carretel).

**Evento bizarro:** Ao resolver o cofre, uma das peças de xadrez na mesa cai sozinha. O rei (Peu) tombou.

---

### FASE 5: CELA 2 — O BECO DE SANDÁLIA (⌵)

**Diorama:** Beco visto em perspectiva de olho de peixe — as paredes se curvam para dentro como se o beco fosse um tubo. Chão de paralelepípedos molhados. Poste de luz piscando. 5 marcas de pata no chão, cada uma de um tamanho diferente. Uma caixa de papelão. Uma lixeira. Um hidrante. Pichações nas paredes.

**Paleta:** Verde musgo, cinza, luz amarela do poste.

**Atmosfera bizarra:** O beco é um **loop**. As paredes têm as mesmas pichações dos dois lados. A caixa de papelão está sempre no mesmo lugar, mas **molhada** quando você olha de novo. O poste pisca exatamente 5 vezes, depois apaga, depois acende de novo — 5, 5, 5.

#### Objetos

| Objeto | Aparência | Clique | Resultado |
|--------|-----------|--------|-----------|
| Marcas de pata (5) | Chão, tamanhos diferentes | puzzle | Puzzle 10 |
| Poste | Centro | 1º | "Pisca 5 vezes. Depois apaga. Depois 5 de novo." |
| | | 2º | "O número 5 está em toda parte aqui." |
| Caixa | Canto | 1º | "Vazia." |
| | | 2º | "Riscados de unha na borda. Frescos." |
| | | 3º | A caixa se move sozinha 10cm para a esquerda. Atrás: **nota de Sandália** |
| Lixeira | Outro canto | 1º | "Fedor insuportável." |
| | | 2º | Dentro: **lata de sardinha vazia**. A lata tem números gravados no fundo: "3-1-4-5-2" |
| Hidrante | Parede | 1º | "Vermelho descascando." |
| | | 2º | Apertar o botão do hidrante → água jorra 3s → revela números no chão: "3 1 4 5 2" |
| Pichação | Parede | click | "AQUI MORREU UM GATO QUE NÃO TINHA CULPA." Ao ler, a tinta escorre como lágrimas. |

#### Puzzle 08 — Sardinha (sub-puzzle)

**Tipo:** Encontrar pista.
**Ação:** Clicar 2× na lixeira → lata com números 3-1-4-5-2.

#### Puzzle 09 — Hidrante (sub-puzzle)

**Tipo:** Revelar pista.
**Ação:** Clicar 2× no hidrante → água revela a mesma sequência: 3 1 4 5 2.

#### Puzzle 10 — Marcas de Pata (puzzle central)

**Tipo:** Sequência de botões.
**Funcionamento:** 5 marcas de pata no chão, numeradas invisivelmente da esquerda para a direita: 1 (grande), 2 (médio), 3 (pequeno 1), 4 (pequeno 2), 5 (menor). Clicar na ordem errada → reset com som de miado. Ordem correta: 3-1-4-5-2 (a sequência dos números na lata e no hidrante).

**Lógica:** O gato pisou primeiro com a pata menor (curiosidade), depois a maior (medo), depois a média (hesitação), depois a pequena 2 (recuo), depois a média de novo? Na verdade — os números 3-1-4-5-2 foram encontrados, o jogador não precisa entender a lógica, só seguir a pista.

**Solução:** Marca 3 → Marca 1 → Marca 4 → Marca 5 → Marca 2

**Ao resolver:** As marcas brilham em azul, uma por uma, formando um rastro que leva até o centro do beco. Lá: **Chave ⌵** + **Sal Grosso** (um saco de sal que brilha). No topo do beco, uma porta se abre.

---

### FASE 6: CÔMODO 3 — COZINHA

**Diorama:** Cozinha vista de cima, como se você fosse um lustre. Fogão, pia, geladeira, armários. Rádio na bancada. Relógio na parede parado em 3:00. Quadro de avisos com contas. Janela acima da pia — do lado de fora é o mesmo beco que você acabou de sair.

**Paleta:** Cinza, amarelo doentio, branco sujo.

**Atmosfera bizarra:** O relógio está parado, mas o ponteiro dos segundos **se mexe** — um tique a cada 15 segundos. O rádio toca estático, mas de vez em quando uma voz diz um número. A janela mostra o beco — mas é o MESMO beco, visto de outro ângulo. Você está numa cozinha que dá para o beco que dá para a cozinha.

#### Objetos

| Objeto | Aparência | Clique | Resultado |
|--------|-----------|--------|-----------|
| Rádio | Bancada, prata | 1º | "Chiado." |
| | | 2º | Voz: "87.5..." |
| | | 3º | Voz: "91.3..." |
| | | 4º | Voz: "104.7..." |
| | | 5º | Sussurro: "Três frequências. Três vozes. Três medos." |
| Fogão | Centro | 1º | "Desligado." |
| | | 2º | Abrir forno → dentro: **chave de fenda** enferrujada. O forno está frio, mas a chave de fenda está **quente**. |
| Geladeira | Direita | 1º | "Vazia. Só um ímã: 'Cuidado com o cão.'" |
| | | 2º | O ímã cai sozinho. Atrás dele, escrito na geladeira: "R$ 87,50" (combina com 87.5 do rádio) |
| Quadro avisos | Parede | click | Conta de luz: R$ 87,50. Anúncio classificado: "Vendo rádio — R$ 91,30". Nota fiscal: "Conserto de rádio — R$ 104,70". |
| Relógio | Parede | 1º | "Parado em 3:00." |
| | | 2º | O ponteiro dos segundos se move UM tique. 3:00:01. |
| | | 3º | Outro tique. Uma hora ele vai chegar em 3:05 e algo vai acontecer. |  
| | | (15 cliques depois) | O relógio bate 3:05. A geladeira **abre sozinha**. Dentro: um **olho** boiando num pote. |
| Olho no pote | Geladeira | click | "Um olho. Flutuando em formol. Ele te encara." → Coleta: **Pote com Olho** (item — usado na Cela 6). |
| Armário 1 | Esquerda | 1º | "Trancado." |
| | | chave fenda | Usar chave de fenda → abre. Dentro: 3 **velas** vermelhas. |
| Armário 2 | Esquerda | click | "Panelas. Uma delas tem um **íma** preso." |
| Ímã | Dentro da panela | click | Coleta: **Ímã** |

#### Puzzle 11 — Fio de Cobre + Ímã (combinação opcional)

**Tipo:** Combinar itens.
**Ação:** Fio de cobre + ímã → **Antena improvisada**.
**Uso:** Usar antena no rádio → o chiado melhora. As vozes ficam claras: "87.5... a primeira voz... 91.3... a segunda... 104.7... a terceira..."
**Recompensa:** Pista mais clara para a Cela 3.

#### Transição

Porta à direita → Cela 3.

---

### FASE 7: CELA 3 — SALA DOS RÁDIOS (⌂)

**Diorama:** Sala octogonal (8 paredes), cada parede coberta de **papel alumínio**. Três rádios empilhados no centro. Móveis com pó. 3 números escritos no pó dos móveis. Porta de ferro com 3 travas em formato de **cabeças de cão**.

**Paleta:** Cinza metálico, azul elétrico dos rádios, vermelho das travas.

**Atmosfera bizarra:** O papel alumínio nas paredes **ondula** como se houvesse vento, mas não há. Cada rádio toca uma versão distorcida da mesma música — em frequências diferentes, criando um dissonância dolorida. As 3 travas da porta latem quando você chega perto.

#### Objetos

| Objeto | Aparência | Clique | Resultado |
|--------|-----------|--------|-----------|
| Rádio 1 (esq) | Rádio antigo, prata | puzzle | Slider vertical, 87.0-108.0 |
| Rádio 2 (centro) | Rádio antigo, preto | puzzle | Slider vertical |
| Rádio 3 (dir) | Rádio antigo, marrom | puzzle | Slider vertical |
| Móvel 1 | Parede | click | Pó escrito: "87.5" |
| Móvel 2 | Parede | click | Pó escrito: "91.3" |
| Móvel 3 | Parede | click | Pó escrito: "104.7" |
| Gaveta | Mesa | 1º | "Trancada. Tem um adesivo: 375." |
| | | puzzle | Puzzle 12 |
| Porta | Ferro | 1º | "3 travas. Cada uma tem a forma de uma cabeça de cão." |
| Nota | Chão | click | "Eu nunca gostei de cachorro. Sempre tive medo. Quando o Peu apareceu com aquela golden, eu já sabia. Ela me olhava de um jeito que não era normal. Uma noite eu xinguei o Peu na janela. No dia seguinte eu acordei aqui. Os rádios não param de tocar. Estático. Vozes. Eu escuto ela latir às vezes. De longe. Ela sabe que eu tenho medo. Ela se alimenta disso. ⌂" |

#### Puzzle 12 — Gaveta 375 (sub-puzzle)

**Tipo:** Puzzle deslizante 3×3 (8 peças, 1 espaço vazio). Formar o número "375" na primeira linha.
**Recompensa:** **Fone de Ouvido**. Usar fone em qualquer rádio → ouve as vozes claramente: memórias de Ulisses.

#### Puzzle 13 — 3 Rádios (puzzle central)

**Tipo:** Sintonizar 3 frequências com sliders.
**Pistas:**
- Pó nos móveis: 87.5, 91.3, 104.7
- Recortes na cozinha: R$ 87,50, R$ 91,30, R$ 104,70
- Rádio da cozinha: "87.5... 91.3... 104.7..."
**Solução:**
- Rádio 1: 87.5
- Rádio 2: 91.3
- Rádio 3: 104.7

**Ao resolver:** Os 3 rádios tocam a mesma nota em uníssono. As 3 travas da porta caem com som de osso quebrando. Atrás do Rádio 3: **Chave ⌂** + **Giz de Cera** (preto, como carvão).

---

### FASE 8: CÔMODO 4 — QUINTAL

**Diorama:** Quintal visto do alto. Cercado por muros que são **altos demais** — não dá pra ver o céu. Grama seca e morta. Um poço no centro. Uma árvore retorcida com um balanço. Brinquedos espalhados. Uma coleira no chão. Um portão de ferro.

**Paleta:** Verde pálido, marrom, cinza.

**Atmosfera bizarra:** A árvore tem **rostos** no tronco. O balanço range sozinho, mesmo sem vento. O poço não tem fundo — você joga uma moeda e nunca ouve o plim. A grama estala quando você clica, como se estivesse quebradiça.

#### Objetos

| Objeto | Aparência | Clique | Resultado |
|--------|-----------|--------|-----------|
| Coleira | Chão | click | "De couro arrebentado. Plaquinha: 'Shiva — Se achar, me leve pra passear.' A placa está **quente**." |
| Bola | Canto | click | "Murcha. Marcas de dente que **não são de cachorro**. São humanas." |
| Desenho | Muro | click | "Sol, lua, estrela, fogo, casa. No verso: 'Enzo — 4 anos.' O sol no desenho tem **um rosto**. Ele chora." |
| Balanço | Árvore | click | "Range. Ninguém está nele." |
| Poço | Centro | 1º | "Escuro. Sem fundo." |
| | | 2º (com lanterna) | A lanterna ilumina o fundo... que está a **3cm** da superfície. O poço tem fundo falso. Dentro: **corda** |
| Corda | Poço | click | Coleta: **Corda**. "Tem nós. Cada nó é uma data." |
| Árvore | Tronco | 1º | "Um rosto no tronco. De olhos fechados." |
| | | 2º | "Outro rosto. De boca aberta." |
| | | 3º | "Vários rostos. Todos mudos." |
| Caixa de brinquedos | Canto | 1º | "Brinquedos velhos." |
| | | 2º | "Um **rato de corda** no fundo. A corda está quebrada." |
| | | 3º | Coleta: **Rato de Corda** (quebrado) |
| Portão Cela 4 | Ferro | click | "Fechado. A maçaneta é uma pata de cachorro." → transição |

#### Puzzle 14 — Consertar Rato de Corda (mini-puzzle)

**Tipo:** Usar item.
**Ação:** Usar **fio de cobre** (do cofre) OU **grampo** (do corredor) no rato → "A corda foi consertada. O rato agora anda."
**Resultado:** **Rato de Corda** (funcionando).

#### Puzzle 15 — Rato + Árvore (mini-puzzle)

**Tipo:** Usar item em objeto.
**Ação:** Usar rato na árvore → o rato sobe pelo tronco. Os rostos na árvore **abrem os olhos**. Um deles cuspi uma **alavanca** de metal.
**Coleta:** **Alavanca**.

#### Puzzle 16 — Poço + Corda (mini-puzzle opcional)

**Tipo:** Usar item.
**Ação:** Usar corda no poço → ela desce. E desce. E desce. 30 segundos depois, algo sobe: um **osso enterrado**. "Um osso. O cheiro é familiar. É de cachorro." → Coleta: **Osso** (item decorativo/lore).

---

### FASE 9: CELA 4 — QUARTO DE ENZO (☆)

**Diorama:** Quarto infantil visto de ângulo reto — as paredes são **só desenhos**. Não há papel de parede, só desenhos infantis colados um sobre o outro, formando camadas e camadas. 5 slots de desenhos no centro da sala. Cama. Estante. Quadro negro.

**Paleta:** Cores primárias berrantes que destoam do tom escuro do jogo.

**Atmosfera bizarra:** Os desenhos na parede **mudam sozinhos** a cada 10 segundos — o sol vira lua, a lua vira estrela, a estrela vira fogo, o fogo vira casa, a casa vira sol. Ciclo infinito. O quadro negro tem uma frase escrita em giz que se **apaga e reescreve sozinha**: "O SOL SEMPRE VOLTA PRO COMEÇO."

#### Objetos

| Objeto | Aparência | Clique | Resultado |
|--------|-----------|--------|-----------|
| Slots de desenhos (5) | Centro | puzzle | Puzzle 19 |
| Parede de desenhos | Parede toda | 1º | "Centenas de desenhos. Todos do mesmo ciclo: sol, lua, estrela, fogo, casa." |
| | | 2º | "Eles mudam. Você piscou e o sol virou lua." |
| Cama | Centro | 1º | "Bagunçada. Quente." |
| | | 2º | Embaixo do travesseiro: **nota de Enzo** |
| Estante | Esquerda | 1º | "Brinquedos. Tem um espaço vazio em forma de rato." |
| | | rato | Usar rato de corda → o rato **sobe na estante sozinho**. A estante range e se move para o lado. |
| Atrás da estante | — | click | Um buraco na parede. Dentro: **papel amassado**: "a ordem do dia: manhã, tarde, noite, madrugada, amanhecer" + desenho de uma seta circular |
| Quadro negro | Parede direita | 1º | "O SOL SEMPRE VOLTA PRO COMEÇO." |
| | | 2º | A frase se apaga sozinha. Escreva com o **Giz de Cera** (da Cela 3) → "SOL → LUA → ESTRELA → FOGO → CASA" |
| Armário | Perto estante | 1º | "Gaveta emperrada." |
| | | alavanca | Usar alavanca → "A gaveta rangeu abrindo." Dentro: **giz branco** (mas você já tem o giz de cera preto — são diferentes). O giz branco é para o quadro negro. |
| Boneco | Estante | click | "Olhos de botão. Um dos botões está solto." 2º click: o botão cai. "4 letras embaixo do olho: E-N-Z-O." |

#### Puzzle 17 — Gaveta + Alavanca

**Tipo:** Usar item. Já descrito acima.

#### Puzzle 18 — Rato + Estante

**Tipo:** Usar item. Já descrito acima.

#### Puzzle 19 — Ordenar Desenhos (puzzle central)

**Tipo:** Sequência de 5 slots. Clicar em um slot → seleciona. Clicar em outro → troca.
**Pistas:**
- Giz no quadro negro: SOL → LUA → ESTRELA → FOGO → CASA
- Papel atrás da estante: "manhã, tarde, noite, madrugada, amanhecer"
- Desenho no quintal: mesma sequência
- Parede de desenhos: ciclo infinito mostrando a ordem correta

**Solução:** SOL → LUA → ESTRELA → FOGO → CASA

**Ao resolver:** Os desenhos começam a girar em um ciclo perfeito. As portas do quarto se abrem. Embaixo da cama: **Chave ☆** + **Ervas Secas** (um maço de ervas que **queima sem fogo**).

---

### FASE 10: CÔMODO 5 — DESPENSA

**Diorama:** Despensa claustrofóbica — as prateleiras se fecham para dentro, como se a sala estivesse encolhendo. Comida estragada em potes de vidro. Prateleiras empoeiradas. Calendário na parede. Porta de porão no chão.

**Paleta:** Marrom escuro, verde mofo, preto.

**Atmosfera bizarra:** Os potes de vidro na prateleira têm **coisas boiando** que não deveriam estar ali — um dedo, um dente, um olho. O calendário mostra o mês atual, mas os dias estão todos riscados em **X** — menos o dia de hoje, que está circulado em vermelho. O círculo **pulsa**.

#### Objetos

| Objeto | Aparência | Clique | Resultado |
|--------|-----------|--------|-----------|
| Prateleira 1 | Esquerda | 1º | "Potes vazios. Um tem um **dente** boiando." |
| | | 2º | O dente no pote — clicar → "Pré-molar. Humano." |
| Prateleira 2 | Direita | 1º | "Caixa de **fósforos**." |
| | | 2º | Dentro da caixa: só 7 fósforos. Eles acendem com uma chama **verde**. |
| | | 3º | **Item:** Fósforos |
| Comida | Bancada | 1º | "Restos de ração. Data: mês passado." |
| | | 2º | "A ração ainda está úmida." |
| Calendário | Parede | 1º | "Dias riscados em X. Só hoje está circulado." |
| | | 2º | "DOM SEG TER QUA QUI SEX SAB" — alguém riscou de SÁB até DOM, uma linha curva ligando um ao outro, como um **arco-íris ao contrário** |
| Porta de porão | Chão | 1º | "Trancada com corrente e cadeado de **3 letras**." |
| | | puzzle | Puzzle 20 |
| Porta Cela 5 | Parede | 1º | "Não tem maçaneta." |
| | | 2º | "Parede lisa. Mas tem um **painel** embutido, quase invisível." |
| | | puzzle | Puzzle 21 |

#### Puzzle 20 — Cadeado do Porão

**Tipo:** Cadeado de 3 letras (A-Z). 3 rotores com letras.
**Pista:** Na prateleira de trás, atrás dos potes: "CÃO" arranhado na madeira. Também: o dente no pote é de **cão** (canino).
**Solução:** C-A-O.
**Resultado:** Corrente cai. Dentro do porão: **garrafa de vinho tinto** empoeirada. Ano: 1994. "O ano do nascimento de Peu?" — o rótulo tem um golden retriever.

#### Puzzle 21 — Painel da Porta

**Tipo:** 3 botões com símbolos: ☀ (domingo), 🌙 (segunda?), não — vamos simplificar.
**Descrição:** Painel quase invisível na parede. 3 botões: D, S, S. A porta da Cela 5 só abre apertando na ordem correta.
**Pista:** Calendário riscado ao contrário: DOM → SÁB → SEX. Primeiras letras: D-S-S.
**Solução:** Clicar D → S → S.
**Resultado:** A porta range abrindo. Do lado de dentro, uma **voz** (Elaine): "Você também veio me julgar?"

---

### FASE 11: CELA 5 — ALTAR DE ELAINE (🔥)

**Diorama:** Cômodo circular. 7 velas em círculo no chão. Cada vela tem um dia da semana gravado no castiçal. Altar no centro com uma tigela de comida. 3 espelhos nas paredes — mas eles não refletem a sala, refletem **outros lugares**. Um quarto, um beco, um cemitério.

**Paleta:** Laranja, vermelho, preto, dourado.

**Atmosfera bizarra:** O círculo de velas não está completo — 7 velas, mas uma delas está **apagada e quebrada**. A tigela no altar tem comida que **se mexe sozinha**. Os espelhos mostram cenas do jogo: o espelho 1 mostra o quarto inicial, o espelho 2 mostra o beco, o espelho 3 mostra o cemitério. Em todos eles, **algo está diferente**.

#### Objetos

| Objeto | Aparência | Clique | Resultado |
|--------|-----------|--------|-----------|
| Velas (7) | Círculo | puzzle | Cada uma com DOM/SEC/TER/QUA/QUI/SEX/SAB gravado. Acender na ordem certa com fósforos. |
| Altar | Centro | 1º | "Tigela de comida estragada. O cheiro é de carne podre." |
| | | 2º | Usar **garrafa de vinho** na tigela → "O vinho cobre a comida. Ela parece menos podre agora." |
| Espelho 1 (esq) | Moldura dourada | 1º | "Mostra o quarto. Sua cama. A cama está **vazia**." |
| | | 2º | "Você não está na cama. Você está aqui. Onde é aqui?" |
| Espelho 2 (dir) | Moldura prata | 1º | "Mostra o beco. As marcas de pata formam uma **palavra**: LIÇO." |
| | | 2º | "Liço? L-i-ç-o. O contrário de ... ócil? ÓCIL?" (dica: ao contrário = "ÓCIL" → "LIÇO" → ler ao contrário = "OCIL" → ???)
Na verdade: LIÇO ao contrário é OÇIL. Não faz sentido. Melhor: espelho 2 é só atmosfera. |
| Espelho 3 (fundo) | Moldura preta | 1º | "Mostra o cemitério. Uma lápide tem seu **nome**." |
| | | 2º | "Você se aproxima. O nome na lápide é 'PEU'." |
| Mesa lateral | Direita | 1º | "Garrafa vazia e um diário." |
| Diário | Mesa | click | "Ela escrevia: 'Hoje dei carne pra Shiva. Ela comeu. Depois vomitou. Depois me olhou. Acho que ela não gosta mais de mim. Acho que ela nunca gostou.'" |
| Nota | Atrás do altar | click | "Eu adoro a Shiva. Desde filhote. Eu dava biscoito, petisco, um brinquedo novo toda semana. Ela comia tudo. No começo ela abanava o rabo. Depois, ela só olhava. Depois, ela começou a virar de costas. Eu achei que era enjo. Mas não. Ela estava ficando gorda. Lenta. Ela me culpava. Eu vi nos olhos dela no dia em que ela me prendeu: 'Você me deixou feia.' Eu juro, eu só queria agradar. 🔥" |

#### Puzzle 22 — Preparar Fogo (sub-puzzle)

**Tipo:** Usar item.
**Ação:** Usar **fósforos** no círculo de velas → "A chama verde acende."
**Efeito:** Agora as velas podem ser acesas individualmente. Clicar numa vela → acende. Clicar de novo → apaga.

#### Puzzle 23 — Acender Velas (puzzle central)

**Tipo:** Sequência de 7.
**Funcionamento:** 7 velas em círculo, cada uma com um dia. Acender na ordem correta.
**Pistas:**
- Calendário da despensa: riscado ao contrário (SÁB→SEX→QUI→QUA→TER→SEG→DOM)
- Espelhos: tudo ao contrário, invertido, distorcido
- Diário de Elaine: "ela nunca gostou de mim" — a percepção invertida

**Solução:** SÁB → SEX → QUI → QUA → TER → SEG → DOM

**Ao resolver:** As 7 velas dançam juntas. As chamas sobem, encontram-se no centro, formam uma **única chama** que paira no ar. Atrás do altar: **Chave 🔥** + **Espelho de mão** (pequeno, circular, o reflexo mostra seu rosto — seu rosto real, não a silhueta).

---

### FASE 12: CÔMODO 6 — PASSAGEM SECRETA

**Diorama:** Corredor estreito de pedra, tectos baixos, paredes úmidas. Duas tochas apagadas. Porta de madeira no fundo. Inscrições nas paredes.

**Paleta:** Cinza pedra, preto, azul muito escuro.

**Atmosfera bizarra:** O corredor é mais comprido do que a moldura da tela permite — as paredes no fundo são **menores** que as da frente, mas a porta do fundo está no **tamanho certo**, criando uma perspectiva impossível. As inscrições na parede não estão escritas — estão **cravadas** na pedra como se alguém tivesse arranhado com unhas.

#### Objetos

| Objeto | Aparência | Clique | Resultado |
|--------|-----------|--------|-----------|
| Tocha 1 (esq) | Ferro forjado | 1º | "Apagada." |
| | | isqueiro | Acende → revela inscrição: "QUEM VÊ O ROSTO DO CÃO NÃO PODE MAIS VOLTAR" — a inscrição sangra |
| Tocha 2 (dir) | Ferro forjado | 1º | "Apagada." |
| | | isqueiro | Acende → revela: "TRÊS CABEÇAS. TRÊS OFERENDAS." |
| Porta | Fundo | 1º | "Pesada. Rangendo." |
| | | 2º | "Trancada." |
| Sombra | Teto | 1º | "A sombra tem três cabeças." |
| | | 2º | "Ela se mexeu." |

#### Puzzle 24 — Ordem das Tochas

**Tipo:** Puzzle de observação e sequência.
**Funcionamento:** Tentar acender qualquer tocha com isqueiro → falha. "A chama não pega." Tentar de novo → falha. 
**Solução:** Acender na ordem: Tocha 2 → Tocha 1 → Tocha 2. 
**Por quê:** "TRÊS OFERENDAS" (Tocha 2) precisa ser lido primeiro, depois "QUEM VÊ O ROSTO" (Tocha 1) — as revelações precisam estar na ordem certa. A terceira vez na Tocha 2 confirma.
**Resultado:** A porta range e se abre parcialmente.

---

### FASE 13: CELA 6 — CEMITÉRIO DE GIULIA (◇)

**Diorama:** Cemitério sob um céu que não é céu — é um **teto de olhos**. Centenas de olhos abertos, piscando em intervalos aleatórios. 6 lápides em círculo. Névoa rasteira que se move contra o vento. Silêncio absoluto — nenhum som.

**Paleta:** Cinza, preto, azul gelo, vermelho dos olhos.

**Atmosfera bizarra:** As lápides não têm nome — têm números. 1 a 6. A névoa forma figuras humanas que se desfazem quando você olha diretamente. O chão não é terra — é **vidro fosco**. Abaixo dele, corpos flutuam.

#### Objetos

| Objeto | Aparência | Clique | Resultado |
|--------|-----------|--------|-----------|
| Lápides 1-6 | Círculo, números romanos | puzzle | Puzzle 27 |
| Portão | Sul | click | "6 fechaduras de ferro. Cada uma em forma de olho." |
| Lápide central | Centro | 1º | "GIULIA L. — ELA SÓ VIU." |
| | | 2º | A lápide se abre como um livro. Dentro: papel com 6 símbolos — ilegível. |
| | | lanterna | Usar **lanterna** no papel → "Os símbolos aparecem: ☽ ⌵ ⌂ ☆ 🔥 ◇" |
| Nota | Chão | click | "Eu não devia estar aqui. Eu não fiz nada. Eu só vi. Era tarde da noite, eu tinha ido na casa do Peu buscar um livro. A luz do corredor estava apagada. Mas tinha uma sombra. Três cabeças. Seis olhos vermelhos. Eu gritei. Eu não gritei de medo — eu gritei porque eu sabia que não era pra eu ter visto. Quando eu abri os olhos, já estava aqui. Entre as lápides. Andando. Procurando a saída que não existe. ◇" |
| Corvo | Portão | 1º | "Empoleirado. Te olha." |
| | | 2º | "Ele abre o bico. Uma **voz de criança** sai: 'Os olhos dela estão em toda parte.'" |

#### Puzzle 25 — Pote com Olho (sub-puzzle opcional)

**Tipo:** Usar item.
**Ação:** Usar **pote com olho** (da cozinha) no chão → o vidro quebra. O olho flutua até o céu e se junta aos outros olhos. O céu pisca em agradecimento.
**Recompensa:** Nenhuma funcional. Apenas atmosfera.

#### Puzzle 26 — Papel + Lanterna

**Tipo:** Usar item.
**Ação:** Usar lanterna na lápide central → símbolos revelados.

#### Puzzle 27 — Símbolos nas Lápides (puzzle central)

**Tipo:** Combinar 6 pares.
**Funcionamento:** Clicar em lápide → menu dos 6 símbolos. Selecionar um → grava na lápide. Todos os 6 precisam estar corretos.
**Pistas:**
- Papel revelado pela lanterna: ☽ ⌵ ⌂ ☆ 🔥 ◇
- Cada nota anterior termina com um símbolo
- O símbolo ◇ está na nota da Giulia
**Solução:**
1. ☽ (João)
2. ⌵ (Sandália)
3. ⌂ (Ulisses)
4. ☆ (Enzo)
5. 🔥 (Elaine)
6. ◇ (Giulia)

**Ao resolver:** O céu de olhos **se fecha** — todos os olhos piscam simultaneamente e desaparecem. O céu fica azul claro pela primeira vez. A névoa se dissipa. O portão range. Atrás da lápide 6: **Chave ◇** + **Vela** (branca, pura, que **acende sozinha** quando você toca).

**Evento especial** (se todas as 6 notas lidas): A tela pisca em branco.
> "AS 6 CELAS ESTÃO ABERTAS."
> "A PORTA DOURADA TE ESPERA."
A tela volta ao normal. Uma música distante de piano começa.

---

### FASE 14: CÔMODO 7 — O TÚNEL

**Diorama:** Túnel estreito que se abre para uma câmara circular. No centro, **Shiva forma verdadeira**: três cabeças, seis olhos vermelhos, corpo de golden retriever mas do **tamanho de um cavalo**. Atrás dela, a **Porta Dourada** brilha.

**Paleta:** Preto, vermelho dos olhos, dourado da porta.

**Atmosfera bizarra:** A forma verdadeira de Shiva não é fixa — as três cabeças se movem em padrões ondulados, como se fossem parte de uma criatura maior. O chão da câmara é **líquido** — você vê ondas quando olha. O ar é denso, quente, úmido.

#### Objetos

| Objeto | Aparência | Clique | Resultado |
|--------|-----------|--------|-----------|
| Shiva (centro) | 3 cabeças, 6 olhos | 1º | "Ela te encara. Três pares de olhos. Três julgamentos." |
| | | 2º | "A cabeça esquerda rosna. A central inclina. A direita observa." |
| Tocha | Parede | isqueiro | Acende → revela inscrição: "VELA. ESPELHO. AMULETO." |
| Porta Dourada | Atrás de Shiva | click | "Brilha. Ela está tão perto." |

#### Puzzle 28 — Três Oferendas (puzzle final)

**Passo 1 — Vela:** Usar **Vela** no chão entre você e Shiva. A vela acende sozinha com chama azul. A cabeça **esquerda** (Ciúme) de Shiva se fecha.

**Passo 2 — Espelho:** Usar **Espelho** na luz da vela. O reflexo atinge a face de Shiva. A cabeça **direita** (Punição) se fecha.

**Passo 3 — Amuleto:** Usar **Amuleto de Osso** no chão. Shiva cheira o ar. A cabeça **central** (Vigilância) se abaixa. Ela se deita. O caminho está livre.

**Apenas com todos os 5 itens de proteção:** A luz da porta dourada envolve tudo.

---

### FASE 15: A PORTA DOURADA — FINAL

```js
function checkEnding(state) {
  const { keys, notesRead, protectionItems } = state;
  if (!keys.every(Boolean)) return 'bad';
  if (protectionItems.length < 5 || !notesRead.every(Boolean)) return 'neutral';
  return 'good';
}
```

---

### BAD — "O OSSO"

**Faltam chaves.**

> Você parou.
> O palácio é grande demais.
> Você senta no chão.
> O eco dos próprios passos te engole.
> Você nunca vai sair daqui.
> Ela está em toda parte.
> E em nenhuma.
> Você prometeu. Não cumpriu.
> Aqui não existe tempo.
> Não existe porta.
> Só o silêncio.
> E o peso de uma promessa quebrada.

Fade para preto. Silêncio de 10s. Depois, dissolve para o quarto — exatamente como no início. A lanterna de volta na mesa. O bilhete de novo na parede. O ciclo recomeça.

---

### NEUTRAL — "A COLEIRA"

**6 chaves, mas faltam proteção ou notas.**

> A porta se abriu.
> Você voltou pro mundo real.
> Mas algo mudou.
> Você sente quando alguém mente.
> Sente o medo das pessoas como um gosto.
> Você virou o novo porteiro.
> Agora Shiva usa você.
> Pra sentir quem merece ser preso.
> Ela não precisa mais do palácio.
> Ela tem você.
> E você nunca mais vai dormir tranquilo.

Fade para o quarto. O reflexo no espelho não é mais uma silhueta — é seu rosto, mas com **olhos vermelhos**. Você sorri. Você não está controlando o sorriso.

---

### GOOD — "O PASSEIO"

**6 chaves + 5 itens de proteção + 6 notas lidas.**

> O sol nasceu.
> Você sentiu o vento no rosto pela primeira vez em dias.
> Shiva está na sua frente.
> Não deusa. Não monstro.
> Só uma golden retriever.
> Ela abaixa a cabeça.
> Você entende.
> Você se ajoelha. Prende a coleira.
> O palácio se desfaz ao redor de vocês.
> Vocês acordam no mundo real.
> Na calçada de casa.
> O sol está nascendo de verdade.
> Uma senhora acena do portão.
> Um gato cruza o caminho.
> Shiva olha. Mas não persegue.
> Ela lambe sua mão.
> Você cumpriu.
> O Passeio.

O diorama do túnel derrete como tinta na chuva. As cores se dissolvem, viram branco. Então, lentamente, um novo diorama se forma: uma calçada ensolarada, uma casa colorida, um portão azul. Uma golden retriever abana o rabo ao lado de uma figura humana. Os dois andam para a direita. Créditos sobem.

Um latido feliz. Uma música de piano. Fim.

---

## 5. LISTA COMPLETA DE PUZZLES (~28)

| # | Nome | Tipo | Cena | Obrigatório |
|---|------|------|------|-------------|
| 1 | Baú do Quarto | Cadeado 3 dígitos (184) | Cômodo 0 | Sim |
| 2 | Guarda-roupa | Usar chave de osso | Cômodo 0 | Sim |
| 3 | Pilha + Lanterna | Combinar itens | Cômodo 0 | Sim |
| 4 | Grampo na Porta | Usar item | Cômodo 1 | Sim |
| 5 | Telefone + Disco | Moeda + 1804 | Cômodo 1 | Opcional |
| 6 | Chave Pequena | Encontrar + usar na estante | Cela 1 | Sim |
| 7 | Pena no Calendário | Usar item | Cela 1 | Opcional |
| 8 | Cadeado 18/04 | Cadeado 4 dígitos | Cela 1 | Sim |
| 9 | Cofre na Lareira | Cadeado 3 dígitos (1704) | Cômodo 2 | Sim |
| 10 | Lata de Sardinha | Encontrar pista | Cela 2 | Sim |
| 11 | Hidrante | Revelar sequência | Cela 2 | Sim |
| 12 | Marcas de Pata | Sequência 3-1-4-5-2 | Cela 2 | Sim |
| 13 | Fio + Ímã | Combinar (antena) | Cômodo 3 | Opcional |
| 14 | Relógio 15× | Clicar 15× até 3:05 | Cômodo 3 | Sim |
| 15 | Gaveta 375 | Puzzle deslizante 3×3 | Cela 3 | Sim |
| 16 | 3 Rádios | Sintonizar 87.5/91.3/104.7 | Cela 3 | Sim |
| 17 | Consertar Rato | Usar fio ou grampo | Cômodo 4 | Sim |
| 18 | Rato na Árvore | Usar rato | Cômodo 4 | Sim |
| 19 | Poço + Corda | Usar corda | Cômodo 4 | Opcional |
| 20 | Gaveta + Alavanca | Usar alavanca | Cela 4 | Sim |
| 21 | Rato na Estante | Usar rato de corda | Cela 4 | Sim |
| 22 | Ordenar Desenhos | SOL→LUA→ESTRELA→FOGO→CASA | Cela 4 | Sim |
| 23 | Cadeado CÃO | 3 letras (C-A-O) | Cômodo 5 | Sim |
| 24 | Painel D-S-S | 3 botões (Domingo, Sábado, Sexta) | Cômodo 5 | Sim |
| 25 | Preparar Velas | Usar fósforos | Cela 5 | Sim |
| 26 | Ordem das Velas | SÁB→SEX→QUI→QUA→TER→SEG→DOM | Cela 5 | Sim |
| 27 | Tochas 2-1-2 | Acender na ordem | Cômodo 6 | Sim |
| 28 | Papel + Lanterna | Usar lanterna | Cela 6 | Sim |
| 29 | Símbolos nas Lápides | Combinar 6 símbolos | Cela 6 | Sim |
| 30 | Três Oferendas | Vela + Espelho + Amuleto | Cômodo 7 | Sim |

**Total: ~30 puzzles (26 obrigatórios + 4 opcionais)**

---

## 6. INVENTÁRIO (~23 ITENS)

| # | Item | Onde | Função |
|---|------|------|--------|
| 1 | Lanterna | Cômodo 0 — após abajur | Iluminar, revelar itens ocultos |
| 2 | Pilha | Cômodo 0 — guarda-roupa | Combinar com lanterna |
| 3 | Chave de Osso | Cômodo 0 — baú (Puzzle 1) | Abrir guarda-roupa |
| 4 | Casaco | Cômodo 0 — guarda-roupa | Narrativo (proteção contra frio no túnel) |
| 5 | Moeda de Osso (cão 3 cabeças) | Cômodo 0 — bolso do casaco | Usar no telefone |
| 6 | Grampo | Cômodo 1 — silhueta | Abrir porta trancada / consertar rato |
| 7 | Moeda de Cobre | Cômodo 1 — vaso | (alternativa para telefone? reserva) |
| 8 | Recorte de Jornal | Cômodo 1 — porta esq | Pista (data 17/04) + lore |
| 9 | Pena Azul | Cela 1 — gaiola | Opcional (usar no calendário) |
| 10 | Chave Pequena | Cela 1 — cama | Abrir gaveta secreta na estante |
| 11 | Amuleto de Osso | Cela 1 — após Puzzle 8 | Proteção 1/5 + Oferenda no Túnel |
| 12 | Isqueiro | Cômodo 2 — lareira | Acender tochas, velas, fornalhas |
| 13 | Fio de Cobre | Cômodo 2 — cofre (Puzzle 9) | Consertar rato / fazer antena |
| 14 | Sal Grosso | Cela 2 — após Puzzle 12 | Proteção 2/5 |
| 15 | Chave de Fenda | Cômodo 3 — forno | Abrir armário trancado |
| 16 | Ímã | Cômodo 3 — panela | Fazer antena (opcional) |
| 17 | Antena (combinada) | Cômodo 3 — fio + ímã | Melhorar sinal do rádio (opcional) |
| 18 | Velas (3) | Cômodo 3 — armário | Levar para Cela 5? (tem 7 lá) |
| 19 | Pote com Olho | Cômodo 3 — geladeira | Opcional (Cela 6 atmosfera) |
| 20 | Fone de Ouvido | Cela 3 — gaveta (Puzzle 15) | Ouvir rádios com clareza |
| 21 | Giz de Cera | Cela 3 — após Puzzle 16 | Proteção 3/5 + escrever no quadro |
| 22 | Corda | Cômodo 4 — poço | Descer no poço (opcional) |
| 23 | Rato de Corda | Cômodo 4 — caixa | Usar na árvore + estante |
| 24 | Alavanca | Cômodo 4 — árvore (Puzzle 18) | Abrir gaveta emperrada |
| 25 | Ervas Secas | Cela 4 — após Puzzle 22 | Proteção 4/5 |
| 26 | Fósforos (7) | Cômodo 5 — prateleira | Acender velas |
| 27 | Garrafa de Vinho | Cômodo 5 — porão (Puzzle 23) | Usar no altar (atmosfera) |
| 28 | Espelho de Mão | Cela 5 — após Puzzle 26 | Proteção 5/5 + Oferenda no Túnel |
| 29 | Vela Branca | Cela 6 — após Puzzle 29 | Oferenda no Túnel |

---

## 7. ARQUITETURA DOS ARQUIVOS

```
doghouse/
├── index.html           # Estrutura + CSS (scanlines, overlays, HUD, transições)
├── engine.js            # Engine: renderizar dioramas, input mouse, inventário, transições
├── dioramas.js          # Dados das cenas: backgrounds, objetos, conexões (como JSON)
├── art.js               # Ilustrações: cada diorama é uma função que desenha no canvas
├── story.js             # Textos: prólogo, notas, descrições, finais
├── puzzles.js           # Lógica dos 30 puzzles + estado global
├── game.js              # Game loop, estado, navegação entre cenas, verificação de final
└── audio.js             # Sons ambientes + efeitos com Web Audio API
```

---

## 8. ESPECIFICAÇÕES TÉCNICAS

- **Canvas:** 640×480 ou 800×600 (escalado para encher a janela)
- **Renderização:** Cada diorama é uma imagem ou um conjunto de shapes desenhados no canvas via funções `drawScene()`. Cena é renderizada em camadas: fundo → objetos estáticos → objetos interativos → overlay de escuridão
- **Estado global:** Objeto `gameState` com cena atual, inventário, puzzles resolvidos, itens coletados
- **Transições:** Fade para preto em 500ms → carrega nova cena → fade in. Opcional: morph/dissolve entre cenas similares
- **Clique:** Hitbox de cada objeto definida por coordenadas x,y,w,h. Mouse hover muda o cursor para "mão"
- **Salvar:** localStorage com serialização do gameState

---

## 9. UI/HUD

```
┌─────────────────────────────────────────────┐
│ ☽ ⌵ ⌂ ☆ 🔥 ◇   DIA 7   LANTERNA ▓▓▓▓░░   │
│                                             │
│                                             │
│           [DIORAMA DA CENA]                 │
│                                             │
│           ┌─── objeto ───┐                  │
│           │  (clicável)  │                  │
│           └──────────────┘                  │
│                                             │
│   ◄                              ►          │
│                                             │
│  ┌─┬─┬─┬─┬─┬─┬─┐                           │
│  │█│█│█│█│█│█│ │   🕯️ Vela              │
│  └─┴─┴─┴─┴─┴─┴─┘              [💡 dica]   │
│  "Descrição do objeto sob o mouse"          │
└─────────────────────────────────────────────┘
```

---

*Fim do plano.*
