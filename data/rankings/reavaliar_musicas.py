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

musicas = json.load(open(os.path.join(DIR, 'musicas.json'), encoding='utf-8'))

artist_rating = {
    # TOP 5 - favorite bands
    'Linkin Park': 5.0,
    'System of a Down': 4.9,
    'Slipknot': 4.8,
    'Yung Lixo': 4.7,
    'Tim Maia': 4.6,

    # Metal / Hard Rock / Punk (high affinity)
    'Metallica': 4.5,
    'Nirvana': 4.5,
    'Green Day': 4.5,
    'Red Hot Chili Peppers': 4.5,
    'Queen': 4.5,
    'Guns N Roses': 4.5,
    "Guns N' Roses": 4.5,
    'Iron Maiden': 4.5,
    'AC/DC': 4.5,
    'Black Sabbath': 4.5,
    'Led Zeppelin': 4.5,

    # Classic / Alternative Rock (strong affinity)
    'Pink Floyd': 4.3,
    'The Beatles': 4.3,
    'The Rolling Stones': 4.3,
    'The Who': 4.3,
    'Aerosmith': 4.3,
    'Van Halen': 4.3,
    'Bon Jovi': 4.3,
    'Oasis': 4.3,
    'Radiohead': 4.3,
    'Jimi Hendrix': 4.3,
    'David Bowie': 4.3,
    'Deep Purple': 4.3,

    # Good Rock (solid)
    'The Doors': 4.0,
    'Fleetwood Mac': 4.0,
    'Tom Petty': 4.0,
    'The Police': 4.0,
    'R.E.M.': 4.0,
    'ZZ Top': 4.0,
    'Santana': 4.0,
    'U2': 4.0,
    'The Cranberries': 4.0,
    'The Smiths': 4.0,
    'The White Stripes': 4.0,
    'The Clash': 4.0,
    'Yeah Yeah Yeahs': 4.0,
    'The Killers': 4.0,
    'Journey': 4.0,
    'Coldplay': 3.8,

    # Rock-adjacent / Classic Icons
    'Elvis Presley': 3.8,
    'Johnny Cash': 3.8,
    'Bob Dylan': 3.8,
    'Prince': 3.8,
    'John Lennon': 3.8,
    'Survivor': 3.8,
    'Simon & Garfunkel': 3.5,
    'Jeff Buckley': 3.5,

    # Pop / Mainstream (neutral)
    'Michael Jackson': 3.5,
    'Madonna': 3.5,
    'Whitney Houston': 3.5,
    'Bruno Mars': 3.5,
    'Adele': 3.5,
    'Amy Winehouse': 3.5,
    'Billie Eilish': 3.5,
    'Lorde': 3.5,
    'Ed Sheeran': 3.5,
    'Maroon 5': 3.5,
    'Imagine Dragons': 3.5,
    'Tracy Chapman': 3.5,
    'Gotye': 3.5,
    'Ray Charles': 3.5,
    'Bee Gees': 3.5,
    'Stevie Wonder': 3.5,
    'Sam Cooke': 3.5,
    'Toto': 3.5,
    'Eagles': 3.5,
    'Gorillaz': 3.5,
    'a-ha': 3.0,

    # Lower interest
    'Sia': 3.0,
    'Frank Sinatra': 3.0,
    'John Denver': 3.0,
    'Eminem': 3.0,
    'Jay-Z': 3.0,
    'Kendrick Lamar': 3.0,
    'Tyler the Creator': 3.0,
    'Outkast': 3.0,
    'Daft Punk': 3.0,
    'Bob Marley': 3.0,
    'Aretha Franklin': 3.0,

    # Jazz / Blues (lowest affinity)
    'Miles Davis': 2.5,
    'Nina Simone': 2.5,
}

for m in musicas:
    artist = m.get('artist', '')
    if artist in artist_rating:
        m['rating'] = artist_rating[artist]
    else:
        m['rating'] = 3.0

save('musicas.json', musicas)
print(f"Reavaliadas {len(musicas)} musicas!")
