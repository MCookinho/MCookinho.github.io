/* ===== PUZZLES.JS ===== */
/* Lógica dos 6 puzzles + estado global */

// helpers runtime (preenchidos pelo game.js)
const $e = () => window.engine;
const $p = () => window.player;
const $ps = () => window.puzzleState;

const PUZZLE_DATA = {
  cadeado_joao: {
    title: 'CADEADO — CELA 1',
    hint: 'Fotos na parede. Uma data marcada.',
    solution: [1,8,0,4],
    item: 'chave_praca',
    noteId: 'nota_joao',
    keyIndex: 0,
    protectionItem: null,
  },
  patas_sandalia: {
    title: 'MARCAS — CELA 2',
    hint: 'Siga o rastro. Do maior para o menor.',
    solution: ['grande','medio','pequeno1','pequeno2','menor'],
    item: 'amuleto_osso',
    noteId: 'nota_sandalia',
    keyIndex: 1,
    protectionItem: 'amuleto',
  },
  radios_ulisses: {
    title: 'RÁDIOS — CELA 3',
    hint: 'Números no pó dos móveis.',
    solution: [87.5, 91.3, 104.7],
    item: 'sal_grosso',
    noteId: 'nota_ulisses',
    keyIndex: 2,
    protectionItem: 'sal',
  },
  desenhos_enzo: {
    title: 'DESENHOS — CELA 4',
    hint: 'A ordem do dia.',
    solution: [0,1,2,3,4],
    item: 'giz_cera',
    noteId: 'nota_enzo',
    keyIndex: 3,
    protectionItem: 'giz',
  },
  velas_elaine: {
    title: 'VELAS — CELA 5',
    hint: 'Domingo ao contrário.',
    solution: [6,5,4,3,2,1,0],
    item: 'ervas',
    noteId: 'nota_elaine',
    keyIndex: 4,
    protectionItem: 'ervas',
  },
  lapides_giulia: {
    title: 'LÁPIDES — CELA 6',
    hint: 'Símbolos na ordem das celas.',
    solution: ['☽','⌵','⌂','☆','🔥','◇'],
    item: 'espelho',
    noteId: 'nota_giulia',
    keyIndex: 5,
    protectionItem: 'espelho',
  },
};

// Callback store
let _puzzleCallback = null;
let _currentPuzzleId = null;
let _puzzleActive = false;

/* ===== PUZZLE 1: Cadeado ===== */
function renderCadeado(container, solve) {
  const digits = [0,0,0,0];
  let selected = 0;

  container.innerHTML = '';
  const title = document.createElement('div');
  title.style.cssText = 'color:#a87850;font-size:10px;margin-bottom:12px;';
  title.textContent = 'DIGITE A SENHA:';
  container.appendChild(title);

  const digitRow = document.createElement('div');
  digitRow.style.cssText = 'display:flex;gap:8px;justify-content:center;margin-bottom:16px;';

  const digitEls = [];
  for (let i = 0; i < 4; i++) {
    const d = document.createElement('div');
    d.style.cssText = 'width:32px;height:40px;background:#1a0a0a;border:2px solid #3a1a1a;' +
      'display:flex;align-items:center;justify-content:center;font-size:16px;color:#aaa878;cursor:pointer;';
    d.textContent = '0';
    d.addEventListener('click', () => {
      selected = i;
      _highlightDigit(digitEls, selected);
    });
    digitRow.appendChild(d);
    digitEls.push(d);
  }
  container.appendChild(digitRow);
  _highlightDigit(digitEls, 0);

  // botoes +/-
  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:8px;justify-content:center;margin-bottom:16px;';
  const up = document.createElement('button');
  up.style.cssText = 'background:#2a1010;border:2px solid #5a2a2a;color:#aaa878;padding:4px 12px;font-family:inherit;cursor:pointer;';
  up.textContent = '+';
  up.addEventListener('click', () => {
    digits[selected] = (digits[selected] + 1) % 10;
    digitEls[selected].textContent = digits[selected];
  });
  const down = document.createElement('button');
  down.style.cssText = up.style.cssText;
  down.textContent = '-';
  down.addEventListener('click', () => {
    digits[selected] = (digits[selected] + 9) % 10;
    digitEls[selected].textContent = digits[selected];
  });
  btnRow.appendChild(down);
  btnRow.appendChild(up);
  container.appendChild(btnRow);

  // confirm
  const confirm = document.createElement('button');
  confirm.style.cssText = 'background:#3a1a1a;border:2px solid #5a2a2a;color:#aaa878;padding:8px 24px;font-family:inherit;cursor:pointer;';
  confirm.textContent = 'CONFIRMAR [ENTER]';
  confirm.addEventListener('click', () => solve(digits));
  container.appendChild(confirm);

  // keyboard
  const handler = (e) => {
    if (e.key === 'ArrowLeft') { selected = Math.max(0, selected-1); _highlightDigit(digitEls, selected); }
    if (e.key === 'ArrowRight') { selected = Math.min(3, selected+1); _highlightDigit(digitEls, selected); }
    if (e.key === 'ArrowUp') { digits[selected] = (digits[selected] + 1) % 10; digitEls[selected].textContent = digits[selected]; }
    if (e.key === 'ArrowDown') { digits[selected] = (digits[selected] + 9) % 10; digitEls[selected].textContent = digits[selected]; }
    if (e.key === 'Enter') { solve(digits); }
  };
  document.addEventListener('keydown', handler);
  container._handler = handler;
}

function _highlightDigit(els, idx) {
  els.forEach((el, i) => {
    el.style.borderColor = i === idx ? '#a87850' : '#3a1a1a';
  });
}

/* ===== PUZZLE 2: Patas ===== */
function renderPatas(container, solve) {
  container.innerHTML = '';
  const title = document.createElement('div');
  title.style.cssText = 'color:#a87850;font-size:10px;margin-bottom:12px;';
  title.textContent = 'PISE NAS PATAS NA ORDEM:';
  container.appendChild(title);

  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(5,1fr);gap:8px;max-width:300px;margin:0 auto;';

  const sizes = ['grande', 'medio', 'pequeno1', 'pequeno2', 'menor'];
  const order = [];
  const btns = [];

  sizes.forEach((s, i) => {
    const btnSize = [60, 48, 36, 36, 24][i];
    const btn = document.createElement('div');
    btn.style.cssText = `width:${btnSize}px;height:${btnSize}px;background:#3a1a1a;border:2px solid #5a2a2a;` +
      'border-radius:50%;cursor:pointer;margin:0 auto;display:flex;align-items:center;justify-content:center;' +
      'color:#aaa878;font-size:8px;';
    btn.textContent = s === 'grande' ? '1' : s === 'medio' ? '2' : '';
    btn.dataset.size = s;
    btn.addEventListener('click', () => {
      if (order.includes(i)) return;
      order.push(i);
      btn.style.borderColor = '#a87850';
      btn.textContent = order.length;
      if (order.length === 5) {
        const solution = sizes.map(s => s);
        const userOrder = order.map(idx => sizes[idx]);
        const correct = userOrder.every((s, j) => s === solution[j]);
        solve(userOrder);
      }
    });
    grid.appendChild(btn);
    btns.push(btn);
  });
  container.appendChild(grid);
}

/* ===== PUZZLE 3: Rádios ===== */
function renderRadios(container, solve) {
  container.innerHTML = '';
  const title = document.createElement('div');
  title.style.cssText = 'color:#a87850;font-size:10px;margin-bottom:12px;';
  title.textContent = 'SINTONIZE OS 3 RÁDIOS:';
  container.appendChild(title);

  const freqs = [87.0, 87.0, 87.0];
  const sliders = [];

  for (let i = 0; i < 3; i++) {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:12px;margin-bottom:8px;';

    const label = document.createElement('div');
    label.style.cssText = 'color:#5a5a3a;font-size:8px;width:40px;';
    label.textContent = `R ${i+1}`;
    row.appendChild(label);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 870;
    slider.max = 1080;
    slider.value = 870;
    slider.step = 1;
    slider.style.cssText = 'width:200px;';
    const valDisplay = document.createElement('div');
    valDisplay.style.cssText = 'color:#aaa878;font-size:8px;width:50px;';
    valDisplay.textContent = '87.0';

    slider.addEventListener('input', () => {
      freqs[i] = slider.value / 10;
      valDisplay.textContent = freqs[i].toFixed(1);
    });

    row.appendChild(slider);
    row.appendChild(valDisplay);
    container.appendChild(row);
    sliders.push(slider);
  }

  const confirm = document.createElement('button');
  confirm.style.cssText = 'margin-top:16px;background:#3a1a1a;border:2px solid #5a2a2a;color:#aaa878;padding:8px 24px;font-family:inherit;cursor:pointer;';
  confirm.textContent = 'CONFIRMAR [ENTER]';
  confirm.addEventListener('click', () => solve(freqs));
  container.appendChild(confirm);

  const handler = (e) => {
    if (e.key === 'Enter') solve(freqs);
  };
  document.addEventListener('keydown', handler);
  container._handler = handler;
}

/* ===== PUZZLE 4: Desenhos ===== */
function renderDesenhos(container, solve) {
  container.innerHTML = '';
  const title = document.createElement('div');
  title.style.cssText = 'color:#a87850;font-size:10px;margin-bottom:12px;';
  title.textContent = 'ORDENE OS DESENHOS:';
  container.appendChild(title);

  const symbols = ['☀️', '🌙', '⭐', '🔥', '🏠'];
  const names = ['SOL', 'LUA', 'ESTRELA', 'FOGO', 'CASA'];
  // ordem correta: 0,1,2,3,4 (sol, lua, estrela, fogo, casa)
  const order = [];
  const slots = [];

  const grid = document.createElement('div');
  grid.style.cssText = 'display:flex;gap:8px;justify-content:center;flex-wrap:wrap;max-width:300px;margin:0 auto;';

  symbols.forEach((sym, i) => {
    const btn = document.createElement('div');
    btn.style.cssText = 'width:48px;height:48px;background:#1a0a0a;border:2px solid #3a1a1a;' +
      'display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;';
    btn.textContent = sym;
    btn.title = names[i];
    btn.addEventListener('click', () => {
      order.push(i);
      btn.style.borderColor = '#a87850';
      btn.style.opacity = '0.5';
      slots.push(btn);
      // show order number
      btn.textContent = sym + '\n' + order.length;
      if (order.length === 5) {
        const correct = order.every((val, idx) => val === idx);
        solve(order);
      }
    });
    grid.appendChild(btn);
  });
  container.appendChild(grid);

  // reset button
  const reset = document.createElement('button');
  reset.style.cssText = 'margin-top:12px;background:#2a1010;border:1px solid #5a2a2a;color:#5a5a3a;padding:4px 12px;font-family:inherit;cursor:pointer;font-size:10px;';
  reset.textContent = 'REINICIAR';
  reset.addEventListener('click', () => {
    order.length = 0;
    Array.from(grid.children).forEach((el, i) => {
      el.style.borderColor = '#3a1a1a';
      el.style.opacity = '1';
      el.textContent = symbols[i];
    });
  });
  container.appendChild(reset);
}

/* ===== PUZZLE 5: Velas ===== */
function renderVelas(container, solve) {
  container.innerHTML = '';
  const title = document.createElement('div');
  title.style.cssText = 'color:#a87850;font-size:10px;margin-bottom:12px;';
  title.textContent = 'ACENDA AS VELAS NA ORDEM:';
  container.appendChild(title);

  const days = ['DOM', 'SÁB', 'SEX', 'QUI', 'QUA', 'TER', 'SEG'];
  const order = [];
  const velas = [];

  const grid = document.createElement('div');
  grid.style.cssText = 'display:flex;gap:6px;justify-content:center;flex-wrap:wrap;max-width:300px;margin:0 auto;';

  days.forEach((day, i) => {
    const vela = document.createElement('div');
    vela.style.cssText = 'width:36px;height:60px;background:#1a0a0a;border:2px solid #3a1a1a;' +
      'display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:8px;' +
      'cursor:pointer;font-size:6px;color:#5a5a3a;';
    vela.innerHTML = `<span style="font-size:16px;margin-bottom:4px;">🕯️</span>${day}`;

    vela.addEventListener('click', () => {
      if (order.includes(i)) return;
      order.push(i);
      vela.style.borderColor = '#a85a3a';
      vela.style.background = '#2a1010';
      vela.style.color = '#aaa878';
      if (order.length === 7) {
        // solution is reverse order: 6,5,4,3,2,1,0
        const correct = order.every((val, idx) => val === 6 - idx);
        solve(order);
      }
    });
    grid.appendChild(vela);
    velas.push(vela);
  });
  container.appendChild(grid);

  const reset = document.createElement('button');
  reset.style.cssText = 'margin-top:12px;background:#2a1010;border:1px solid #5a2a2a;color:#5a5a3a;padding:4px 12px;font-family:inherit;cursor:pointer;font-size:10px;';
  reset.textContent = 'REINICIAR';
  reset.addEventListener('click', () => {
    order.length = 0;
    velas.forEach((v, i) => {
      v.style.borderColor = '#3a1a1a';
      v.style.background = '#1a0a0a';
      v.style.color = '#5a5a3a';
    });
  });
  container.appendChild(reset);
}

/* ===== PUZZLE 6: Lápides ===== */
function renderLapides(container, solve) {
  container.innerHTML = '';
  const title = document.createElement('div');
  title.style.cssText = 'color:#a87850;font-size:10px;margin-bottom:12px;';
  title.textContent = 'COLOQUE OS SÍMBOLOS NAS LÁPIDES:';
  container.appendChild(title);

  const symbols = ['☽', '⌵', '⌂', '☆', '🔥', '◇'];
  const lapideSlots = [];
  const placements = [null, null, null, null, null, null];
  let selectedSymbol = 0;

  const mainRow = document.createElement('div');
  mainRow.style.cssText = 'display:flex;gap:8px;justify-content:center;margin-bottom:16px;';

  // lapides 1-6
  for (let i = 0; i < 6; i++) {
    const lap = document.createElement('div');
    lap.style.cssText = 'width:48px;height:64px;background:#1a0a0a;border:2px solid #3a1a1a;' +
      'display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:16px;' +
      'cursor:pointer;font-size:8px;color:#5a5a3a;';
    lap.innerHTML = `<span style="font-size:10px;">${i+1}</span><span style="font-size:16px;margin-top:4px;">⬜</span>`;
    lap.addEventListener('click', () => {
      if (placements[i] !== null) return;
      placements[i] = selectedSymbol;
      lap.innerHTML = `<span style="font-size:10px;">${i+1}</span><span style="font-size:16px;margin-top:4px;">${symbols[selectedSymbol]}</span>`;
      lap.style.borderColor = '#a87850';
      // check if all placed
      if (placements.every(p => p !== null)) {
        const correct = placements.every((p, idx) => p === idx);
        solve(placements);
      }
    });
    mainRow.appendChild(lap);
    lapideSlots.push(lap);
  }
  container.appendChild(mainRow);

  // symbol selector
  const symRow = document.createElement('div');
  symRow.style.cssText = 'display:flex;gap:8px;justify-content:center;';
  const symEls = [];
  symbols.forEach((sym, i) => {
    const s = document.createElement('div');
    s.style.cssText = 'width:32px;height:32px;background:#1a0a0a;border:2px solid #3a1a1a;' +
      'display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;';
    s.textContent = sym;
    s.addEventListener('click', () => {
      selectedSymbol = i;
      symEls.forEach((el, j) => {
        el.style.borderColor = j === i ? '#a87850' : '#3a1a1a';
      });
    });
    symRow.appendChild(s);
    symEls.push(s);
  });
  container.appendChild(symRow);
  symEls[0].style.borderColor = '#a87850';

  const reset = document.createElement('button');
  reset.style.cssText = 'margin-top:12px;background:#2a1010;border:1px solid #5a2a2a;color:#5a5a3a;padding:4px 12px;font-family:inherit;cursor:pointer;font-size:10px;';
  reset.textContent = 'REINICIAR';
  reset.addEventListener('click', () => {
    for (let i = 0; i < 6; i++) placements[i] = null;
    lapideSlots.forEach((lap, i) => {
      lap.innerHTML = `<span style="font-size:10px;">${i+1}</span><span style="font-size:16px;margin-top:4px;">⬜</span>`;
      lap.style.borderColor = '#3a1a1a';
    });
  });
  container.appendChild(reset);
}

/* ===== PUZZLE RENDER MAP ===== */
const PUZZLE_RENDERERS = {
  cadeado_joao: renderCadeado,
  patas_sandalia: renderPatas,
  radios_ulisses: renderRadios,
  desenhos_enzo: renderDesenhos,
  velas_elaine: renderVelas,
  lapides_giulia: renderLapides,
};

/* ===== OPEN PUZZLE ===== */
function openPuzzle(puzzleId, callback) {
  if (_puzzleActive) return;
  const data = PUZZLE_DATA[puzzleId];
  if (!data) return;

  _puzzleActive = true;
  _currentPuzzleId = puzzleId;
  _puzzleCallback = callback;
  if (window.engine && window.engine.state) {
    window.engine.state.phase = 'puzzle';
  }

  const overlay = document.getElementById('puzzle-overlay');
  if (!overlay) { _puzzleActive = false; return; }
  const titleEl = overlay.querySelector('.puzzle-title');
  const hintEl = overlay.querySelector('.puzzle-hint');
  if (titleEl) titleEl.textContent = data.title;
  if (hintEl) hintEl.textContent = data.hint;
  overlay.style.display = 'block';

  const content = document.getElementById('puzzle-content');
  if (!content) { _puzzleActive = false; return; }
  content.innerHTML = '';

  const renderer = PUZZLE_RENDERERS[puzzleId];
  if (renderer) {
    try {
      renderer(content, (userSolution) => {
        _checkPuzzleSolution(puzzleId, userSolution);
      });
    } catch(e) {
      console.error('Puzzle render error:', e);
      _closePuzzle(false);
    }
  }
}

function _checkPuzzleSolution(puzzleId, userSolution) {
  try {
    const data = PUZZLE_DATA[puzzleId];
    if (!data) return;

    let correct = false;

    if (puzzleId === 'cadeado_joao') {
      correct = JSON.stringify(userSolution) === JSON.stringify(data.solution);
    } else if (puzzleId === 'patas_sandalia') {
      const solution = data.solution;
      correct = userSolution.length === 5 && userSolution.every((s, i) => s === solution[i]);
    } else if (puzzleId === 'radios_ulisses') {
      correct = Math.abs(userSolution[0] - 87.5) < 0.2 &&
                Math.abs(userSolution[1] - 91.3) < 0.2 &&
                Math.abs(userSolution[2] - 104.7) < 0.2;
    } else if (puzzleId === 'desenhos_enzo') {
      correct = userSolution.length === 5 && userSolution.every((v, i) => v === i);
    } else if (puzzleId === 'velas_elaine') {
      correct = userSolution.length === 7 && userSolution.every((v, i) => v === 6 - i);
    } else if (puzzleId === 'lapides_giulia') {
      correct = userSolution.length === 6 && userSolution.every((p, i) => p === i);
    }

    if (correct) {
      _puzzleSolved(puzzleId);
    } else {
      if (window.engine && window.engine.audio) {
        window.engine.audio.playNoise(200, 0.3, 'noise');
      }
      const hint = document.getElementById('puzzle-overlay').querySelector('.puzzle-hint');
      hint.textContent = 'NÃO É ISSO. TENTE NOVAMENTE.';
      setTimeout(() => {
        hint.textContent = data.hint;
      }, 1500);
    }
  } catch(e) {
    console.error('Puzzle check error:', e);
  }
}

function _puzzleSolved(puzzleId) {
  try {
    const data = PUZZLE_DATA[puzzleId];
    if (!data) return;
    const keyIndex = data.keyIndex;

    const ps = window.puzzleState || {};
    if (ps.solved) ps.solved[keyIndex] = true;
    if (ps.keys) ps.keys[keyIndex] = true;

    if (data.protectionItem && ps.protectionItems && !ps.protectionItems.includes(data.protectionItem)) {
      ps.protectionItems.push(data.protectionItem);
      if (window.player && window.player.inventory) {
        window.player.inventory.push(data.protectionItem);
        if (window.player._updateInventoryHUD) window.player._updateInventoryHUD(window.engine);
      }
    }

    if (data.noteId && data.item) {
      if (window.player && window.player.inventory) {
        window.player.inventory.push(data.item);
        if (window.player._updateInventoryHUD) window.player._updateInventoryHUD(window.engine);
      }
      setTimeout(() => {
        if (window.showNote) window.showNote(data.noteId);
      }, 300);
    }

    if (window.engine) {
      if (window.engine.audio) window.engine.audio.playPuzzleSolved();
      if (window.engine.camera) window.engine.camera.shake(3, 0.3);
    }

    _closePuzzle(true);

    if (window.shivaSystem && window.shivaSystem.onPuzzleSolved) {
      window.shivaSystem.onPuzzleSolved(window.engine);
    }

    setTimeout(() => {
      showDialogue([
        'A cela se abriu.',
        'Uma chave. Uma memória.',
        `${(data.item || '').replace('_', ' ')} — coletado.`,
        'Você entendeu um pouco mais.',
      ]);
    }, 600);
  } catch(e) {
    console.error('Puzzle solved error:', e);
    _closePuzzle(false);
  }
}

function _closePuzzle(solved) {
  _puzzleActive = false;
  const overlay = document.getElementById('puzzle-overlay');
  if (overlay) overlay.style.display = 'none';
  // cleanup keyboard handlers
  const content = document.getElementById('puzzle-content');
  if (content && content._handler) {
    document.removeEventListener('keydown', content._handler);
    delete content._handler;
  }

  if (_puzzleCallback) {
    const cb = _puzzleCallback;
    _puzzleCallback = null;
    _currentPuzzleId = null;
    try { cb(solved); } catch(e) { console.error('Puzzle callback error:', e); }
  }

  // only restore if not in note/dialogue
  if (window.engine && window.engine.state && window.engine.state.phase === 'puzzle') {
    window.engine.state.phase = 'exploration';
  }
}

// close puzzle with Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && _puzzleActive) {
    _closePuzzle(false);
  }
});

// expose
window.openPuzzle = openPuzzle;
window.onPuzzleSolved = (puzzleId) => {
  // called from game.js when puzzle object is interacted with
  // handled internally now
};
