import json, os, hashlib

DIR = os.path.dirname(os.path.dirname(__file__))

def save(name, data):
    path = os.path.join(DIR, name)
    text = json.dumps(data, indent=2, ensure_ascii=False)
    lines = text.split('\n')
    result = []
    for i, line in enumerate(lines):
        result.append(line)
        stripped = line.strip()
        if stripped == '},' and i + 1 < len(lines) and lines[i+1].strip().startswith('{'):
            result.append('')
    with open(path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(result) + '\n')

def seed(name):
    return int(hashlib.md5(name.encode()).hexdigest(), 16)

def pick(arr, name):
    return arr[seed(name) % len(arr)]

# Custom reviews for top favorites
custom_jogos = {
    'Inscryption': 'MEU DEUS DO CÉU. Esse jogo é simplesmente a melhor experiência que eu já tive com um jogo na vida. A primeira vez que você descobre o que realmente tá rolando é uma sensação que eu nunca vou esquecer. Bagulho é genial do começo ao fim, jogo favorito disparado.',
    'Katana Zero': 'QUE JOGO INCRÍVEL. A história é foda, o combate é satisfatório, a trilha sonora é ABSURDA. Cada nível é um quebra-cabeça que você resolve no timing perfeito. A cena do final me pegou desprevenido, bagulho é cinema. Quero mais desse universo.',
    'Minecraft': 'Mano, Minecraft é simplesmente eterno. Não tem jeito, é um jogo que eu volto a jogar todo ano e sempre descubro algo novo. A calma de minerar depois de um dia estressante é terapia pura. Melhor jogo de todos os tempos e ponto final.',
    'Portal 2': 'GENIAL. A GLaDOS é a melhor vilã da história dos games, as piadas são afiadíssimas e os puzzles são perfeitamente balanceados. Cada câmara é uma lição de design de jogos. O final com a Wheatley é uma das coisas mais engraçadas que eu já vi num jogo.',
    'Omori': 'Esse jogo destruiu meu psicológico e eu agradeço por isso. A forma como ele aborda temas pesados com uma estética fofa é genial. Chorei, ri, fiquei desconfortável e no final terminei abraçado no monitor. Experiência necessária pra qualquer um.',
    'Persona 5 Royal': 'QUE JOGO. 200 horas que passaram voando. O estilo é o mais estiloso que existe, a trilha sonora é absurda de boa, e os personagens são tão carismáticos que você sente falta deles quando termina. Amei cada segundo.',
    'Tunic': 'Que experiência LINDA. A forma como o jogo te trata como uma criança descobrindo um mundo novo é mágico. As mecânicas que vão se revelando aos poucos, o manual em outra língua que você precisa decifrar... O final me fez chorar igual bebê.',
    'Catherine': 'MELHOR JOGO DE PUZZLE QUE EU JÁ JOGUEI NA MINHA VIDA. Sério, o conceito é genial demais. Subir blocos enquanto decide se trai ou não sua namorada? ISSO É CINEMA. A história é absurda e os puzzles são viciantes, platinei na raça.',
    'Fallout: New Vegas': 'SIMPLESMENTE O MELHOR FALLOUT. As escolhas importam de verdade, cada facção tem seus motivos e o deserto de Mojave é mais carismático que muito jogo por aí. O Mr. House é um dos melhores personagens já escritos.',
    'Alan Wake 2': 'QUE JOGO É ESSE? A Remedy simplesmente entregou uma obra prima do terror. A parte da Alan na cidade é tensa DEMAIS, e a Saga com as investigações é uma mecânica muito criativa. A música no estádio... cara, eu parei e só apreciei.',
    'Doki Doki Literature Club': 'HAHA... ha... que jogo inocente... NÃO. MONIKA ME TROUXE TRAUMAS. Todo mundo deveria jogar sem saber nada, é a experiência mais única que existe. Só não digo que é meu favorito porque me deixou maluco das ideias.',
    'Hollow Knight': 'SIMPLESMENTE O METROIDVANIA MAIS INCRÍVEL QUE JÁ FIZERAM. O mundo é enorme, a atmosfera é opressiva, os chefes são DESAFIADORES mas justos. A sensação de explorar Hallownest e descobrir cada segredo é algo que eu queria apagar da memória pra jogar de novo.',
    'Baldurs Gate 3': 'RPG DO JEITO QUE DEVE SER FEITO. A liberdade que o jogo te dá é absurda, cada decisão muda tudo. Amei criar meu personagem e me perder nas histórias. A Laezel é minha rainha, dane-se.',
    'BioShock': 'UM DOS JOGOS QUE MAIS ME MARCOU. Rapture é um personagem por si só. A chegada de avião, o farol, a batismal... "Would you kindly?" é um dos plots twists mais geniais da história. O final me deixou reflexivo por dias.',
    'Danganronpa': 'QUE FRANQUIA BOA DA PORRA. Os julgamentos são tensos, os personagens são malucos e as reviravoltas são INSANAS. Cada morte me deixava mais paranóico. Monokuma é um vilão PERFEITO. Recomendo pra todo mundo.',
    'Castlevania Sotn': 'CLÁSSICO ABSOLUTO. A cena inicial com o Dracula, o castelo inteiro pra explorar, as armas diferentes, a música... É o tipo de jogo que envelheceu que NEM VINHO. Melhor metroidvania da época e ainda hoje é referência.',
    'Dark Souls': 'PRIMEIRO SOULS QUE EU ZEREI E ME MARCOU PRA SEMPRE. A sensação de superar um chefe depois de morrer 50 vezes é algo que nenhum outro jogo me deu. O mundo interligado é uma obra de arte do level design.',
    'Metal Gear Solid 3': "QUE HISTÓRIA. A cena final com a Boss me fez chorar igual criança. O sigilo é tenso, os chefes são criativos e a ambientação na selva é incrível. O melhor MGS na minha opinião, e olha que sou fã da série.",
    'Mother 3': 'JOGO MAIS TRISTE QUE EU JÁ JOGUEI E AO MESMO TEMPO O MAIS ENGRAÇADO. A forma como ele lida com temas pesados usando humor é genial. Aquele final... só de pensar me arrepio. Nintendo, CADÊ O RELANÇAMENTO?',
    'Outer Wilds': 'NUNCA JOGUEI NADA PARECIDO. A curiosidade é o único motor do jogo e isso é PERFEITO. Cada descoberta, cada planeta, cada texto... a forma como tudo se conecta no final é uma das experiências mais bonitas que já tive com um jogo.',
    'Bayonetta': 'AÇÃO PURA E ESTILOSA. A Bayonetta é a protagonista mais badass que existe, as lutas são cinematográficas e a trilha sonora é PERFEITA. O combate é fluído, os chefes são épicos. Jogaço da porra.',
    'Celeste': 'PLATAFORMA PERFEITA. A Madeline sou eu, eu sou a Madeline. A história sobre ansiedade e auto-aceitação é linda, e os controles são os mais precisos que já vi num jogo de plataforma. Morri 5000 vezes e valeu cada uma.',
    'Hades': 'ROGUELIKE PERFEITO. A história avançar a cada morte é genial, os personagens são carismáticos e o combate é viciante. Zagreus é um protagonista foda demais. Joguei até platinar e ainda queria mais.',
    'Limbo': 'QUE ATMOSFERA. O jogo é tenso do começo ao fim, os puzzles são inteligentes e o final aberto me deixou pensando por dias. A aranha gigante me deu calafrios na primeira vez. Arte pura em forma de jogo.',
    'Metal Gear Rising': 'REGRAVARAM MINHA MÚSICA CORAÇÃO REGRAVARAM MINHA MÚSICA CORAÇÃO REGRAVARAM MINHA MÚSICA CORAÇÃO. This is a música de fundo enquanto escrevo essa review. O jogo é absurdo, a trilha é FODA e cortar tudo no estilo é terapêutico.',
    'Silent Hill 2': 'UM DOS JOGOS MAIS PESADOS QUE JÁ JOGUEI. A história do James é triste, perturbadora e linda ao mesmo tempo. A névoa, os monstros que representam seus traumas, a trilha sonora do Akira Yamaoka... OBRAPRIMA.',
    'NieR: Automata': "QUE EXPERIÊNCIA FILOSÓFICA. O que significa ser humano? O que é a vida? O jogo te faz refletir sobre tudo isso enquanto você luta com robôs em um mundo pós-apocalíptico. A trilha sonora é DEUS. O final E é uma das coisas mais lindas que já vi.",
    'Resident Evil 4': 'CLÁSSICO DOS CLÁSSICOS. O chefe de polícia mais foda do mundo chegando numa vila na Espanha pra resgatar a filha do presidente. Os ganados, as paródias, o merchant... "What are ya buyin?" ICÔNICO.',
    'Undertale': 'UM JOGO QUE MUDA SUA VIDA. A forma como ele te conhece e reage às suas ações é algo que NUNCA foi feito antes ou depois. Toriel é minha mãe agora. Papyrus é meu melhor amigo. Sans é... bem, Sans é Sans.',
    'Journey': 'PURO. SIMPLES. LINDO. Não tem o que falar sobre Journey, é uma experiência que todo mundo devia ter. Joguei do começo ao fim numa sentada e passei o resto do dia refletindo. A areia, o cachecol, os outros jogadores...',
    'The Legend of Zelda: Breath of the Wild': 'LIBERDADE TOTAL. Nunca me senti tão livre num jogo. Cada montanha é escalável, cada direção é uma aventura. A sensação de sair do santuário e ver Hyrule pela primeira vez é algo que eu nunca vou esquecer.',
    'What Remains of Edith Finch': 'QUE HISTÓRIA LINDA E TRISTE. Cada membro da família tem uma morte única e criativa. A cena do peixe é uma das coisas mais geniais que eu já vi num jogo. A narrativa é perfeita, me emocionei demais.',
    'Fire Emblem: Three Houses': 'RPG TÁTICO PERFEITO. Os personagens são tão bem escritos que você realmente se importa com eles. A escolha de qual casa seguir me deixou horas pensando. A Edelgard tem seus motivos, Claude é carismático, Dimitri é um trem desgovernado.',
    'Little Nightmares': 'QUE JOGO PERTURBADOR E LINDO. A atmosfera é tensa, os monstros são nojentos e a sensação de ser pequeno num mundo gigante é angustiante. A banheira, o chefe de cozinha... aff, me deu até calafrio de novo.',
    'Gris': 'BELEZA PURA. Esse jogo é uma obra de arte em movimento. A animação, a música, as cores que vão voltando aos poucos... a jornada da Gris é sobre luto e superação e me fez chorar litros. Perfeito do começo ao fim.',
    'God of War': 'KRATOS É PAI AGORA E EU AMO ISSO. A relação dele com o Atreus é o coração do jogo. A jogabilidade é PESADA do jeito que tem que ser, a história é envolvente e o mundo nórdico é lindo. Jogaço absoluto.',
    'Little Nightmares 2': 'MELHOR QUE O PRIMEIRO. O Mono e a Six juntos são uma dupla improvável mas funcionam. A perseguição do professor de olhos arregalados me deu uma ansiedade... E aquele final? AINDA TÔ DE LUTO.',
    'Everhood': 'QUE JOGO PSICODÉLICO E GENIAL. A música é INCRÍVEL, as lutas são criativas e a história é uma viagem completa. Cada chefão é uma experiência única. O final me deixou tipo "mano, o que ACABEI de jogar?"',
    'Braid': 'PUZZLE GENIAL. O tempo como mecânica principal é muito bem explorado, cada mundo é uma nova camada de complexidade. A história por trás é mais profunda do que parece. O final me deixou pensando por dias.',
    'Fez': 'QUE JOGO CHARMOSO. A mecânica de girar o mundo em 3D é simplesmente genial, os puzzles são engenhosos e a estética pixelada é linda. O Gomez é fofo, a trilha sonora é hipnotizante. Jogaço indie.',
    'Final Fantasy Vii': 'CLÁSSICO ABSOLUTO. O Sephiroth é um dos melhores vilões da história, o Cloud é um protagonista complexo e a história é épica. A cena da Aerith... NUNCA SUPEREI. Merece todo o hype que tem.',
    'Earthbound': 'QUE JOGO BIZARRO E PERFEITO. O humor é absurdo, os inimigos são criativos e a história é mais emocionante do que parece. A ambientação é única, não existe nada igual. O final me fez chorar.',
    'Hi Fi Rush': 'QUE JOGO ESTILOSO. A música dita o ritmo de tudo e é PERFEITO. O combate rítmico é criativo, os personagens são carismáticos e a animação é linda. Joguei com um sorriso no rosto do começo ao fim.',
    'Cyberpunk 2077': 'DEPOIS DE TODOS OS PATCHES, O JOGO FICOU INCRÍVEL. Night City é viva, as histórias são envolventes e o Johnny Silverhand é um personagem foda demais. A trilha sonora é ABSURDA de boa.',
    'Batman Arkham Knight': 'O MELHOR BATMAN QUE EXISTE. A jogabilidade é fluída, a história é envolvente e o mapa de Gotham é lindo. O Batmóvel é divertido pra caramba. O final do Arkham Knight me surpreendeu.',
    'Devil May Cry 5': 'AÇÃO PURA. O combate é o mais satisfatório que existe, cada arma é única e os estilos de luta são criativos. O Dante é simplesmente o personagem mais estiloso dos games. Motivação TOTAL.',
    'Jet Set Radio': 'QUE ESTILO. A vibe anos 2000, a trilha sonora, a arte cel-shaded... Tudo é PERFEITO. Andar de skate por Tóquio pintando grafite é uma das experiências mais únicas que existe. Jogaço da porra.',
    'Katamari Damacy': 'QUE JOGO ABSURDO E MARAVILHOSO. O conceito de enrolar tudo num katamari é genial, a trilha sonora é ALEATÓRIA e PERFEITA ao mesmo tempo. Não tem como ficar triste jogando Katamari.',
    'Kerbal Space Program': 'MANO, EU FIZ UM FOGUETE EXPLODIR PORQUE ESQUECI DE COLOCAR ASA. Esse jogo é genial, ensina física de forma divertida e as explosões são engraçadas demais. A satisfação de pousar na Lua é imensa.',
    'Kirby Super Star': 'KIRBY É FOFINHO E PODEROSO. As habilidades copiadas são criativas, os minigames são divertidos e a dificuldade é na medida certa. O jogo mais relaxante que existe, recomendo pra qualquer um.',
    'Monkey Island': 'PIRATAS, PUZZLES E HUMOR ABSURDO. O Guybrush Threepwood é o protagonista mais carismático que existe. Os diálogos são engraçados, os puzzles são criativos... "I am rubber, you are glue!" Clássico.',
}

custom_filmes = {
    'Interestelar': 'MEU FILME FAVORITO DA VIDA. Christopher Nolan é um gênio, a forma como ele mistura ciência, emoção e paisagens de tirar o fôlego é algo que só ele consegue. A cena do buraco negro, a mensagem da Murph, o "não vá suavemente"... Choro litros TODAS as vezes.',
}

custom_series = {
    'Dark': 'MELHOR SÉRIE QUE EU JÁ VI NA VIDA. A forma como as três linhas do tempo se conectam é genial. Cada ator interpretando os mesmos personagens em idades diferentes é um trabalho ABSURDO. A trilha sonora é PERFEITA, a fotografia é linda. Tudo é impecável.',
    'Better Call Saul': 'MELHOR QUE BREAKING BAD? SIM, EU DISSE ISSO. O desenvolvimento do Jimmy McGill até se tornar o Saul Goodman é a melhor jornada de personagem que eu já vi numa série. A Kim Wexler é uma das personagens mais bem escritas de todos os tempos.',
    'Breaking Bad': 'CLÁSSICO ABSOLUTO. Walter White se transformando no Heisenberg é uma das melhores coisas já feitas pra TV. Cada temporada é melhor que a anterior, e a última temporada é simplesmente PERFEITA. Jesse, me desculpe por tudo.',
    'Ruptura': 'QUE SÉRIE INCRÍVEL. O conceito é genial, a direção de arte é impecável, o elenco é absurdo. Cada episódio termina com você querendo mais. A fotografia, os corredores sem fim, o mistério por trás da Lumon... Quero a segunda temporada PRA ONTEM.',
    'O Mentalista': 'MELHOR SÉRIE PRA MARATONAR. O Patrick Jane é um dos personagens mais carismáticos que existem, os casos são interessantes e a história do Red John é uma das melhores tramas de investigação já feitas. Jane é simplesmente genial, amo o jeito dele.',
}

jogos = json.load(open(os.path.join(DIR, 'jogos.json'), encoding='utf-8'))
filmes = json.load(open(os.path.join(DIR, 'filmes.json'), encoding='utf-8'))
series = json.load(open(os.path.join(DIR, 'series.json'), encoding='utf-8'))

for g in jogos:
    key = g['name'].strip()
    if key in custom_jogos:
        g['review'] = custom_jogos[key]
    else:
        r = round(g['rating'] * 2) / 2
        templates = {
            5.0: [
                f"QUE JOGO. {key} é simplesmente uma experiência que todo mundo devia ter. Bagulho é FODA.",
            ],
            4.9: [
                f"Sensacional. {key} é perto da perfeição, me prendeu do início ao fim e me deixou querendo mais.",
            ],
            4.8: [
                f"INCRÍVEL. {key} me conquistou de um jeito que eu não esperava. Jogaço da porra.",
            ],
            4.7: [
                f"Muito foda. {key} é daqueles jogos que você lembra com carinho. Recomendo demais.",
            ],
            4.6: [
                f"Jogaço. {key} me entreteu horrores, bagulho é bom demais.",
            ],
            4.5: [
                f"Jogasso. {key} é uma experiência daora que me marcou positivamente.",
                f"Que jogo bom. {key} acerta na proposta e me divertiu pacas.",
            ],
            4.4: [
                f"Jogo muito bom. {key} é sólido e bem feito, me agradou bastante.",
            ],
            4.3: [
                f"Bacana. {key} me entreteve mas não me marcou tanto.",
                f"Jogo bom. {key} é honesto e bem feito, gostei da experiência.",
            ],
            4.2: [
                f"Jogo legalzinho. {key} me divertiu mas nada de extraordinário.",
            ],
            4.0: [
                f"Daora. {key} me agradou, horas bem gastas.",
                f"Jogo maneiro. {key} é sólido, curti a experiência.",
                f"Bacana. {key} é um jogo honesto que cumpre o que promete.",
                f"Legal. {key} me entreteu, sem arrependimentos.",
                f"Bom jogo. {key} é consistente e divertido.",
            ],
            3.9: [
                f"Ok. {key} é legalzinho mas nada demais.",
            ],
            3.8: [
                f"Razoável. {key} é bonzinho, me diverti um pouco.",
            ],
            3.7: [
                f"Mais ou menos. {key} não me conquistou mas tem seus momentos.",
            ],
            3.6: [
                f"Meh. {key} tem coisas legais mas é meio esquecível.",
            ],
            3.5: [
                f"Fraquinho. {key} não me agradou tanto, esperava mais.",
                f"Tanto faz. {key} não é horrível mas também não é bom.",
            ],
            3.4: [
                f"Deixou a desejar. {key} não me pegou, tentei gostar mas não rolou.",
            ],
            3.3: [
                f"Chatinho. {key} tem seus problemas e não me entreteu.",
            ],
            3.2: [
                f"Não curti muito. {key} me decepcionou um pouco.",
            ],
            3.1: [
                f"Fracasso. {key} não funcionou pra mim.",
            ],
            3.0: [
                f"Não gostei. {key} me entediou, não recomendo.",
            ],
        }
        if r in templates:
            g['review'] = pick(templates[r], key)
        else:
            g['review'] = pick(templates[3.5], key)

for f in filmes:
    key = f['name']
    if key in custom_filmes:
        f['review'] = custom_filmes[key]
    else:
        r = round(f['rating'] * 2) / 2
        type_templates = {
            'Ficcao Cientifica': 'Filme de ficção científica brabo. ',
            'Ficção Científica': 'Filme de ficção científica brabo. ',
            'Terror': 'Terrorzinho bom. ',
            'Suspense': 'Suspense legal. ',
            'Animacao': 'Animação linda. ',
            'Animação': 'Animação linda. ',
        }
        prefix = type_templates.get(f['type'], '')
        templates = {
            5.0: [f"{prefix}{key} é simplesmente perfeito, obra prima do cinema."],
            4.0: [
                f"{prefix}{key} me agradou bastante, filme sólido.",
                f"{prefix}{key} é bom, curti a experiência.",
                f"{prefix}{key} me entreteve, recomendo.",
            ],
            3.9: [f"{prefix}{key} é legalzinho mas podia ser melhor."],
            3.8: [f"{prefix}{key} é ok, me diverti mas nada demais."],
            3.7: [f"{prefix}{key} é mais ou menos, tem seus momentos."],
            3.6: [f"{prefix}{key} meh, esperava mais."],
            3.5: [f"{prefix}{key} não me agradou tanto, fraquinho."],
            3.4: [f"{prefix}{key} deixou a desejar."],
            3.3: [f"{prefix}{key} é chatinho, não curti muito."],
            3.2: [f"{prefix}{key} me decepcionou."],
            3.1: [f"{prefix}{key} não funcionou pra mim."],
            3.0: [f"{prefix}{key} não gostei, me entediou."],
        }
        if r in templates:
            f['review'] = pick(templates[r], key)
        else:
            f['review'] = pick(templates[3.5], key)

for s in series:
    key = s['name']
    if key in custom_series:
        s['review'] = custom_series[key]
    else:
        r = round(s['rating'] * 2) / 2
        type_templates = {
            'Ficcao Cientifica': 'Série de ficção científica foda. ',
            'Ficção Científica': 'Série de ficção científica foda. ',
            'Terror': 'Série de terror pesada. ',
            'Suspense': 'Série de suspense boa. ',
            'Drama': 'Série drama envolvente. ',
            'Comedia': 'Série de comédia leve. ',
            'Comédia': 'Série de comédia leve. ',
        }
        prefix = type_templates.get(s['type'], '')
        templates = {
            5.0: [f"{prefix}{key} é a melhor série que já vi, PERFEITA."],
            4.9: [f"{prefix}{key} é quase perfeita, me marcou demais."],
            4.8: [f"{prefix}{key} é INCRÍVEL, melhor que muita coisa por aí."],
            4.0: [
                f"{prefix}{key} me agradou, série sólida.",
                f"{prefix}{key} é boa, curti maratonar.",
                f"{prefix}{key} me prendeu legal, recomendo.",
            ],
            3.9: [f"{prefix}{key} é legalzinha mas nada demais."],
            3.8: [f"{prefix}{key} é ok, me diverti."],
            3.7: [f"{prefix}{key} é mais ou menos."],
            3.6: [f"{prefix}{key} meh, esperava mais."],
            3.5: [f"{prefix}{key} não me agradou tanto."],
            3.4: [f"{prefix}{key} deixou a desejar."],
            3.3: [f"{prefix}{key} é chatinha, não curti."],
            3.2: [f"{prefix}{key} me decepcionou."],
            3.1: [f"{prefix}{key} não funcionou pra mim."],
            3.0: [f"{prefix}{key} não gostei, entediante."],
        }
        if r in templates:
            s['review'] = pick(templates[r], key)
        else:
            s['review'] = pick(templates[3.5], key)

save('jogos.json', jogos)
save('filmes.json', filmes)
save('series.json', series)
print("Reviews reescritas com estilo personalizado!")
