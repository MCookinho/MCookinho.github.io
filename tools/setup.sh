#!/usr/bin/env bash
# setup.sh — Configura o tileset e ambiente Tiled para o Doghouse
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== Doghouse - Setup Tiled ==="

# 1. Generate tileset PNG
echo ""
echo "[1/3] Gerando tileset PNG..."
cd "$PROJECT_DIR"
node -e "
const { createCanvas } = require('/tmp/test-canvas/node_modules/canvas');
const fs = require('fs');
const spritesCode = fs.readFileSync('doghouse/sprites.js', 'utf8');
const f = new Function(spritesCode + '\nreturn { PALETTE_16, T_SPRITES, empty, fill, set };');
const mod = f();
const { PALETTE_16, T_SPRITES, empty } = mod;
const COLS = 10, TILE_SIZE = 16, TOTAL_TILES = 73;
const ROWS = Math.ceil(TOTAL_TILES / COLS);
const canvas = createCanvas(COLS * TILE_SIZE, ROWS * TILE_SIZE);
const ctx = canvas.getContext('2d');
for (let y = 0; y < ROWS * TILE_SIZE; y += 8)
  for (let x = 0; x < COLS * TILE_SIZE; x += 8)
    ctx.fillStyle = ((Math.floor(x/8) + Math.floor(y/8)) % 2 === 0) ? '#ccc' : '#999',
    ctx.fillRect(x, y, 8, 8);
for (let id = 0; id < TOTAL_TILES; id++) {
  const col = id % COLS, row = Math.floor(id / COLS);
  const v = id === 0 ? empty(16,16) : T_SPRITES[id];
  const sprite = (Array.isArray(v) && Array.isArray(v[0])) ? v[0] : v;
  if (!sprite) continue;
  for (let r = 0; r < sprite.length; r++)
    for (let c = 0; c < sprite[r].length; c++) {
      const ci = sprite[r][c];
      if (ci && PALETTE_16[ci]) ctx.fillStyle = PALETTE_16[ci], ctx.fillRect(col*TILE_SIZE+c, row*TILE_SIZE+r, 1, 1);
    }
}
fs.writeFileSync('doghouse-tileset.png', canvas.toBuffer('image/png'));
"
echo "  -> doghouse-tileset.png gerado"

# 2. Install Tiled if not present
echo ""
echo "[2/3] Verificando Tiled..."
if command -v tiled &>/dev/null || [ -f ~/.local/bin/Tiled.AppImage ]; then
  echo "  -> Tiled ja disponivel"
else
  echo "  -> Baixando Tiled AppImage..."
  curl -sL "https://github.com/mapeditor/tiled/releases/download/v1.12.2/Tiled-1.12.2_Linux_x86_64.AppImage" \
    -o ~/.local/bin/Tiled.AppImage
  chmod +x ~/.local/bin/Tiled.AppImage
  echo "  -> Tiled baixado em ~/.local/bin/Tiled.AppImage"
fi

# 3. Create work directory
echo ""
echo "[3/3] Criando diretorio de trabalho tiled-maps/"
mkdir -p "$PROJECT_DIR/tiled-maps"
cp "$SCRIPT_DIR/doghouse-template.json" "$PROJECT_DIR/tiled-maps/"
echo "  -> Template copiado para tiled-maps/doghouse-template.json"

echo ""
echo "=== Setup completo ==="
echo ""
echo "Fluxo de trabalho:"
echo "  1. Abra o Tiled"
echo "     ~/.local/bin/Tiled.AppImage &"
echo "  2. Crie um tileset novo de doghouse-tileset.png (16x16)"
echo "  3. Edite/crie mapas em tiled-maps/"
echo "  4. Exporte como JSON: File > Export As > nome-do-mapa.json"
echo "  5. Converta para o jogo:"
echo "     node tools/tiled-to-map.js tiled-maps/nome-do-mapa.json id_do_mapa"
echo "  6. Substitua o bloco correspondente em doghouse/map.js"
