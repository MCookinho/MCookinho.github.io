import json, os

DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'rankings')

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

musicas = json.load(open(os.path.join(DIR, 'musicas.json'), encoding='utf-8'))

new_songs = [
    # Linkin Park (7 more)
    {"name": "Numb", "artist": "Linkin Park", "spotify": "https://open.spotify.com/search/Numb%20Linkin%20Park", "rating": 5.0},
    {"name": "Crawling", "artist": "Linkin Park", "spotify": "https://open.spotify.com/search/Crawling%20Linkin%20Park", "rating": 4.9},
    {"name": "Breaking the Habit", "artist": "Linkin Park", "spotify": "https://open.spotify.com/search/Breaking%20the%20Habit%20Linkin%20Park", "rating": 4.9},
    {"name": "What I've Done", "artist": "Linkin Park", "spotify": "https://open.spotify.com/search/What%20I've%20Done%20Linkin%20Park", "rating": 4.8},
    {"name": "Faint", "artist": "Linkin Park", "spotify": "https://open.spotify.com/search/Faint%20Linkin%20Park", "rating": 4.8},
    {"name": "One Step Closer", "artist": "Linkin Park", "spotify": "https://open.spotify.com/search/One%20Step%20Closer%20Linkin%20Park", "rating": 4.7},
    {"name": "Somewhere I Belong", "artist": "Linkin Park", "spotify": "https://open.spotify.com/search/Somewhere%20I%20Belong%20Linkin%20Park", "rating": 4.7},

    # System of a Down (7)
    {"name": "Chop Suey!", "artist": "System of a Down", "spotify": "https://open.spotify.com/search/Chop%20Suey%20System%20of%20a%20Down", "rating": 4.9},
    {"name": "Toxicity", "artist": "System of a Down", "spotify": "https://open.spotify.com/search/Toxicity%20System%20of%20a%20Down", "rating": 4.9},
    {"name": "Aerials", "artist": "System of a Down", "spotify": "https://open.spotify.com/search/Aerials%20System%20of%20a%20Down", "rating": 4.8},
    {"name": "B.Y.O.B.", "artist": "System of a Down", "spotify": "https://open.spotify.com/search/BYOB%20System%20of%20a%20Down", "rating": 4.8},
    {"name": "Sugar", "artist": "System of a Down", "spotify": "https://open.spotify.com/search/Sugar%20System%20of%20a%20Down", "rating": 4.7},
    {"name": "Lonely Day", "artist": "System of a Down", "spotify": "https://open.spotify.com/search/Lonely%20Day%20System%20of%20a%20Down", "rating": 4.6},
    {"name": "Spiders", "artist": "System of a Down", "spotify": "https://open.spotify.com/search/Spiders%20System%20of%20a%20Down", "rating": 4.6},

    # Slipknot (7)
    {"name": "Psychosocial", "artist": "Slipknot", "spotify": "https://open.spotify.com/search/Psychosocial%20Slipknot", "rating": 4.8},
    {"name": "Duality", "artist": "Slipknot", "spotify": "https://open.spotify.com/search/Duality%20Slipknot", "rating": 4.8},
    {"name": "Before I Forget", "artist": "Slipknot", "spotify": "https://open.spotify.com/search/Before%20I%20Forget%20Slipknot", "rating": 4.7},
    {"name": "The Devil in I", "artist": "Slipknot", "spotify": "https://open.spotify.com/search/The%20Devil%20in%20I%20Slipknot", "rating": 4.7},
    {"name": "Wait and Bleed", "artist": "Slipknot", "spotify": "https://open.spotify.com/search/Wait%20and%20Bleed%20Slipknot", "rating": 4.6},
    {"name": "Snuff", "artist": "Slipknot", "spotify": "https://open.spotify.com/search/Snuff%20Slipknot", "rating": 4.5},
    {"name": "Unsainted", "artist": "Slipknot", "spotify": "https://open.spotify.com/search/Unsainted%20Slipknot", "rating": 4.5},

    # Yung Lixo (7)
    {"name": "Eu Vou Comer Pão de Alho", "artist": "Yung Lixo", "spotify": "https://open.spotify.com/search/Eu%20Vou%20Comer%20Pão%20de%20Alho%20Yung%20Lixo", "rating": 4.7},
    {"name": "Na Manha", "artist": "Yung Lixo", "spotify": "https://open.spotify.com/search/Na%20Manha%20Yung%20Lixo", "rating": 4.7},
    {"name": "Poeta do Lixo", "artist": "Yung Lixo", "spotify": "https://open.spotify.com/search/Poeta%20do%20Lixo%20Yung%20Lixo", "rating": 4.6},
    {"name": "Só Deus Pode Me Julgar", "artist": "Yung Lixo", "spotify": "https://open.spotify.com/search/Só%20Deus%20Pode%20Me%20Julgar%20Yung%20Lixo", "rating": 4.6},
    {"name": "Eu Te Amo pra Caralho", "artist": "Yung Lixo", "spotify": "https://open.spotify.com/search/Eu%20Te%20Amo%20pra%20Caralho%20Yung%20Lixo", "rating": 4.5},
    {"name": "Vou pro Carnaval", "artist": "Yung Lixo", "spotify": "https://open.spotify.com/search/Vou%20pro%20Carnaval%20Yung%20Lixo", "rating": 4.5},
    {"name": "Minha Vida é um Show", "artist": "Yung Lixo", "spotify": "https://open.spotify.com/search/Minha%20Vida%20é%20um%20Show%20Yung%20Lixo", "rating": 4.4},

    # Tim Maia (7)
    {"name": "Azul da Cor do Mar", "artist": "Tim Maia", "spotify": "https://open.spotify.com/search/Azul%20da%20Cor%20do%20Mar%20Tim%20Maia", "rating": 4.6},
    {"name": "Ela Partiu", "artist": "Tim Maia", "spotify": "https://open.spotify.com/search/Ela%20Partiu%20Tim%20Maia", "rating": 4.6},
    {"name": "Me Dê Motivo", "artist": "Tim Maia", "spotify": "https://open.spotify.com/search/Me%20Dê%20Motivo%20Tim%20Maia", "rating": 4.5},
    {"name": "Gostava Tanto de Você", "artist": "Tim Maia", "spotify": "https://open.spotify.com/search/Gostava%20Tanto%20de%20Você%20Tim%20Maia", "rating": 4.5},
    {"name": "Primavera", "artist": "Tim Maia", "spotify": "https://open.spotify.com/search/Primavera%20Tim%20Maia", "rating": 4.4},
    {"name": "Não Quero Dinheiro", "artist": "Tim Maia", "spotify": "https://open.spotify.com/search/Não%20Quero%20Dinheiro%20Tim%20Maia", "rating": 4.4},
    {"name": "Você", "artist": "Tim Maia", "spotify": "https://open.spotify.com/search/Você%20Tim%20Maia", "rating": 4.3},
]

musicas.extend(new_songs)
save('musicas.json', musicas)
print(f"Adicionadas {len(new_songs)} musicas. Total: {len(musicas)}")
