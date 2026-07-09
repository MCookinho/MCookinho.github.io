import json, os

DIR = os.path.dirname(__file__)

def arred(r):
    return round(r * 2) / 2

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

jogos = json.load(open(os.path.join(DIR, 'jogos.json'), encoding='utf-8'))
filmes = json.load(open(os.path.join(DIR, 'filmes.json'), encoding='utf-8'))
series = json.load(open(os.path.join(DIR, 'series.json'), encoding='utf-8'))
musicas = json.load(open(os.path.join(DIR, 'musicas.json'), encoding='utf-8'))

# ==============================
# JOGOS - only modify favorites, keep original for rest
# ==============================
fav_map_jogos = {
    'Inscryption': 5.0, 'Katana Zero': 4.9, 'Minecraft': 4.9,
    'Portal 2': 4.9, 'Omori': 4.9, 'Persona 5 Royal': 4.9, 'Tunic': 4.9,
    'Catherine': 4.8, 'Fallout: New Vegas': 4.8,
    'Alan Wake 2': 4.8, 'Doki Doki Literature Club': 4.8,
    'Hollow Knight': 4.8, 'Baldurs Gate 3': 4.8,
    'BioShock': 4.7, 'Danganronpa': 4.7, 'Castlevania Sotn': 4.7,
    'Everhood': 4.7, 'Dark Souls': 4.7, 'Metal Gear Solid 3': 4.7,
    'Mother 3': 4.7, 'Outer Wilds': 4.7,
    'Bayonetta': 4.6, 'Celeste': 4.6, 'Hades': 4.6, 'Limbo': 4.6,
    'Metal Gear Rising': 4.6, 'Silent Hill 2': 4.6, 'NieR: Automata': 4.6,
    'Batman Arkham Knight': 4.5, 'Braid': 4.5, 'Cyberpunk 2077': 4.5,
    'Devil May Cry 5': 4.5, 'Fez': 4.5, 'Final Fantasy Vii': 4.5,
    'Earthbound': 4.5, 'Gris': 4.5, 'God of War': 4.5, 'Hi Fi Rush': 4.5,
    'Kirby Super Star': 4.5, 'Kerbal Space Program': 4.5,
    'Katamari Damacy': 4.5, 'Jet Set Radio': 4.5, 'Monkey Island': 4.5,
    'Little Nightmares 2': 4.5, 'Resident Evil 4': 4.5,
    'Undertale': 4.5, 'Journey': 4.5,
    'The Legend of Zelda: Breath of the Wild': 4.5,
    'What Remains of Edith Finch': 4.5,
    'Fire Emblem: Three Houses': 4.5, 'Little Nightmares': 4.5,
    'Darkest Dungeon': 4.4, 'Death Stranding': 4.3, 'Diablo Ii': 4.3,
    'Life is Strange': 4.3, 'L.A. Noire': 4.3, 'Mirror Edge': 4.3,
    'Hotline Miami 2': 4.3, 'Marble It Up': 4.2,
    'Final Fantasy Xiv': 4.0, 'Little Big Planet': 4.0, 'Mad Max': 3.8,
    'Inscryption': 5.0,
}

for g in jogos:
    name = g['name'].strip()
    if name in fav_map_jogos:
        g['rating'] = fav_map_jogos[name]
    else:
        g['rating'] = max(2.5, min(g['rating'], 4.0))

# ==============================
# FILMES - only Interestelar
# ==============================
for f in filmes:
    if f['name'] == 'Interestelar':
        f['rating'] = 5.0
    else:
        f['rating'] = max(2.5, min(f['rating'], 4.0))

# ==============================
# SÉRIES - top 5 favorites
# ==============================
fav_map_series = {
    'Dark': 5.0, 'Better Call Saul': 4.9, 'Breaking Bad': 4.8,
    'Ruptura': 4.8, 'O Mentalista': 4.7,
}
for s in series:
    if s['name'] in fav_map_series:
        s['rating'] = fav_map_series[s['name']]
    else:
        s['rating'] = max(2.5, min(s['rating'], 4.0))

# ==============================
# MÚSICAS - favorite bands boost, rock/metal boost
# ==============================
fav_bandas = {
    'Linkin Park': 5.0, 'System of a Down': 4.9, 'Slipknot': 4.8,
    'Yung Lixo': 4.7, 'Tim Maia': 4.6,
}
rock_metal = {
    'AC/DC', 'Aerosmith', 'Black Sabbath', 'Bon Jovi', 'Deep Purple',
    'Guns N Roses', "Guns N' Roses", 'Iron Maiden', 'Journey',
    'Led Zeppelin', 'Metallica', 'Nirvana', 'Pink Floyd', 'Queen',
    'R.E.M.', 'Radiohead', 'Red Hot Chili Peppers', 'Santana',
    'The Clash', 'The Cranberries', 'The Doors', 'The Killers',
    'The Rolling Stones', 'The Smiths', 'The White Stripes', 'The Who',
    'Tom Petty', 'U2', 'Van Halen', 'Yeah Yeah Yeahs', 'ZZ Top',
    'Green Day', 'Oasis', 'Survivor', 'Jimi Hendrix', 'Fleetwood Mac',
    'David Bowie', 'Prince', 'The Police', 'The Beatles',
    'Bob Dylan', 'John Lennon', 'Johnny Cash', 'Elvis Presley',
}

for m in musicas:
    artist = m.get('artist', '')
    if artist in fav_bandas:
        m['rating'] = fav_bandas[artist]
    elif artist in rock_metal:
        m['rating'] = arred(min(m['rating'] + 0.5, 5.0))
    else:
        m['rating'] = max(2.5, min(m['rating'], 4.0))

save('jogos.json', jogos)
save('filmes.json', filmes)
save('series.json', series)
save('musicas.json', musicas)
print("Feito!")
