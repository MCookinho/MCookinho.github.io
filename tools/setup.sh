#!/usr/bin/env bash
# setup.sh — Configura o tileset e ambiente Tiled para o Doghouse
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== Doghouse - Setup Tiled ==="

# 1. Generate tileset + export maps via export-maps.js
echo ""
echo "[1/3] Gerando tileset PNG e exportando mapas..."
cd "$PROJECT_DIR"
node tools/export-maps.js
echo "  -> tileset e mapas atualizados"

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
