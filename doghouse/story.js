/* ===== STORY.JS ===== */
/* Diálogos, notas, lore, textos dos 3 finais */

/* ===== SISTEMA DE DIÁLOGO ===== */
let _dialogueCallback = null;
let _dialogueLines = [];
let _dialogueIndex = 0;
let _dialogueCharIndex = 0;
let _dialogueInterval = null;
let _dialogueActive = false;

function showDialogue(lines, callback) {
  if (_dialogueActive) return;
  _dialogueActive = true;
  _dialogueLines = lines;
  _dialogueIndex = 0;
  _dialogueCallback = callback || null;
  if (window.engine) window.engine.state.phase = 'dialogue';

  const overlay = document.getElementById('dialogue-overlay');
  overlay.style.display = 'block';
  document.getElementById('dialogue-overlay').querySelector('.speaker').textContent = '';

  _typeLine();
}

function _typeLine() {
  if (_dialogueIndex >= _dialogueLines.length) {
    _finishDialogue();
    return;
  }

  const line = _dialogueLines[_dialogueIndex];
  const textEl = document.getElementById('dialogue-overlay').querySelector('.text');
  textEl.textContent = '';
  _dialogueCharIndex = 0;

  if (_dialogueInterval) clearInterval(_dialogueInterval);
  _dialogueInterval = setInterval(() => {
    if (_dialogueCharIndex < line.length) {
      textEl.textContent += line[_dialogueCharIndex];
      _dialogueCharIndex++;
    } else {
      clearInterval(_dialogueInterval);
      _dialogueInterval = null;
    }
  }, 30);
}

function _advanceDialogue() {
  if (_dialogueInterval) {
    // skip to end of current line
    clearInterval(_dialogueInterval);
    _dialogueInterval = null;
    const line = _dialogueLines[_dialogueIndex];
    document.getElementById('dialogue-overlay').querySelector('.text').textContent = line;
    return;
  }
  _dialogueIndex++;
  if (_dialogueIndex >= _dialogueLines.length) {
    _finishDialogue();
  } else {
    _typeLine();
  }
}

function _finishDialogue() {
  _dialogueActive = false;
  const overlay = document.getElementById('dialogue-overlay');
  overlay.style.display = 'none';
  if (window.engine) window.engine.state.phase = 'exploration';
  if (_dialogueCallback) {
    const cb = _dialogueCallback;
    _dialogueCallback = null;
    cb();
  }
}

// Enter avança diálogo
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'enter' && _dialogueActive) {
    e.preventDefault();
    _advanceDialogue();
  }
  if (key === 'enter' && _noteActive) {
    e.preventDefault();
    _closeNote();
  }
  if (key === 'enter' && _finalActive) {
    e.preventDefault();
    _advanceFinal();
  }
});

/* ===== SISTEMA DE ESCOLHA ===== */
function showChoice(question, options) {
  return new Promise((resolve) => {
    const lines = [question, '---'];
    options.forEach((opt, i) => {
      lines.push(`[${i+1}] ${opt.text}`);
    });
    showDialogue(lines, () => {
      // wait for keypress
      const handler = (e) => {
        const num = parseInt(e.key);
        if (num >= 1 && num <= options.length) {
          document.removeEventListener('keydown', handler);
          resolve(num - 1);
        }
      };
      document.addEventListener('keydown', handler);
    });
  });
}

/* ===== SISTEMA DE NOTAS ===== */
let _noteActive = false;

const NOTES_DATA = {
  peu_bilhete: {
    title: '/// BILHETE NA PAREDE ///',
    text: '"Cuide dela pra mim, vou viajar. Passeia com ela todo dia, ela gosta. Volto semana que vem. — Peu"\n\nTEM UM NÚMERO RABISCADO: 18\nDEBAIXO TEM OUTRO: 04',
  },
  nota_joao: {
    title: '/// CELA 1 — JOÃO MARCELO ///',
    text: 'Eu não entendi no começo. Eu só via ela me olhando do canto.\n\nQuando eu abraçava o Peu, ela se sentava na porta. Quando eu ria, ela saía do quarto.\n\nNo dia do meu aniversário — 18 de abril — ela me encarou por uma hora sem piscar.\n\nNaquela noite, eu acordei aqui.\n\nPela fresta da porta, eu vi o rabo dela sumindo no escuro.\n\nEla não gostava de dividir.\n\nEu não era o problema. Eu era só o alvo.\n\nSÍMBOLO: ☽',
  },
  nota_sandalia: {
    title: '/// CELA 2 — SANDÁLIA ///',
    text: 'Eu era só um gato. Eu não sabia que tinha dono.\n\nEla me via todo dia na porta, recebendo carinho. Eu sentia o cheiro dela em tudo — mas ela nunca chegava perto. Só olhava. De longe.\n\nUm dia eu passei perto dela e ela rosnou. Eu corri.\n\nNão adiantou.\n\nAgora eu fico aqui, neste beco que não termina, andando em círculos.\n\nEu acho que ela quer que eu canse. Mas gato não cansa.\n\nSÍMBOLO: ⌵',
  },
  nota_ulisses: {
    title: '/// CELA 3 — SEU ULISSES ///',
    text: 'Eu nunca gostei de cachorro. Sempre tive medo.\n\nQuando o Peu apareceu com aquela golden, eu já sabia. Ela me olhava de um jeito que não era normal.\n\nUma noite eu xinguei o Peu na janela — o som do portão, o latido dele, a cara de assustado do menino.\n\nNo dia seguinte eu acordei aqui.\n\nOs rádios não param de tocar. Estático. Vozes.\n\nEu escuto ela latir às vezes. De longe.\n\nEla sabe que eu tenho medo. E ela se alimenta disso.\n\nSÍMBOLO: ⌂',
  },
  nota_enzo: {
    title: '/// CELA 4 — ENZO ///',
    text: 'Eu gosto de fazer barulho. Minha mãe fala que eu sou elétrico.\n\nEu corro, grito, bato palma, rio alto.\n\nEla não gostava. Eu via ela sair de perto quando eu chegava.\n\nAchar que cachorro não gosta de criança é normal. Mas ela não é normal.\n\nUma noite eu estava gritando no corredor e ela apareceu na minha frente. Não rosnou. Não latiu. Só olhou.\n\nEu acordei aqui.\n\nOs desenhos na parede mudam sozinhos. O sol sempre volta pro começo.\n\nSÍMBOLO: ☆',
  },
  nota_elaine: {
    title: '/// CELA 5 — ELAINE ///',
    text: 'Eu adoro a Shiva. Desde filhote.\n\nEu dava biscoito, petisco, um brinquedo novo toda semana. Ela comia tudo.\n\nNo começo ela abanava o rabo. Depois, ela só olhava.\n\nDepois, ela começou a virar de costas quando eu chegava. Eu achei que era enjoo.\n\nMas não. Ela estava ficando gorda. Lenta. Ela me culpava.\n\nEu vi nos olhos dela no dia em que ela me prendeu: "Você me deixou feia".\n\nEu juro, eu só queria agradar.\n\nSÍMBOLO: 🔥',
  },
  nota_giulia: {
    title: '/// CELA 6 — GIULIA L. ///',
    text: 'Eu não devia estar aqui. Eu não fiz nada.\n\nEu só vi.\n\nEra tarde da noite, eu tinha ido na casa do Peu buscar um livro. A luz do corredor estava apagada.\n\nMas tinha uma sombra.\n\nTrês cabeças. Seis olhos vermelhos.\n\nEla me olhou.\n\nEu gritei. Eu não gritei de medo — eu gritei porque eu sabia que não era pra eu ter visto.\n\nQuando eu abri os olhos, já estava aqui.\n\nEntre as lápides. Andando. Sempre andando. Procurando a saída que não existe.\n\nSÍMBOLO: ◇',
  },
};

function showNote(noteId) {
  const data = NOTES_DATA[noteId];
  if (!data) return;

  _noteActive = true;
  if (window.engine) window.engine.state.phase = 'note';

  const overlay = document.getElementById('note-overlay');
  overlay.querySelector('.note-title').textContent = data.title;
  // format text with line breaks
  const textEl = overlay.querySelector('.note-text');
  textEl.innerHTML = data.text.replace(/\n/g, '<br>');
  overlay.style.display = 'block';

  // mark as read in journal
  if (noteId.startsWith('nota_')) {
    const idx = ['joao','sandalia','ulisses','enzo','elaine','giulia'].indexOf(noteId.replace('nota_', ''));
    if (idx !== -1 && window.puzzleState && !window.puzzleState.notesRead[idx]) {
      window.puzzleState.notesRead[idx] = true;
      if (window.journal) window.journal.readCount++;
      // update HUD memories
      const memEl = document.getElementById('hud-memories');
      if (memEl && memEl.children[idx]) {
        memEl.children[idx].classList.add('filled');
      }
      // check all read
      if (window.journal && window.journal.readCount >= 6) {
        setTimeout(() => {
          showDialogue([
            'AS 6 CELAS ESTÃO ABERTAS.',
            'A porta dourada te espera no parque.'
          ]);
        }, 500);
      }
    }
  }
}

function _closeNote() {
  _noteActive = false;
  if (window.engine) window.engine.state.phase = 'exploration';
  document.getElementById('note-overlay').style.display = 'none';
}

// expoe globalmente
window.showNote = showNote;

/* ===== FINAIS ===== */
let _finalActive = false;
let _finalLines = [];
let _finalIndex = 0;
let _finalInterval = null;

function showFinal(type) {
  _finalActive = true;
  if (window.engine) window.engine.state.phase = 'final';

  const texts = {
    bad: {
      title: '/// O OSSO ///',
      lines: [
        'Você parou.',
        'O palácio é grande demais.',
        'Você senta no chão.',
        'O eco dos próprios passos te engole.',
        'Você nunca vai sair daqui.',
        'Ela está em toda parte.',
        'E em nenhuma.',
        'Você prometeu. Não cumpriu.',
        'Aqui não existe tempo.',
        'Não existe porta.',
        'Só o silêncio.',
        'E o peso de uma promessa quebrada.',
      ],
    },
    neutral: {
      title: '/// A COLEIRA ///',
      lines: [
        'A porta se abriu.',
        'Você voltou pro mundo real.',
        'Mas algo mudou.',
        'Você sente quando alguém mente.',
        'Sente o medo das pessoas como um gosto.',
        'Você virou o novo porteiro.',
        'Agora Shiva usa você.',
        'Pra sentir quem merece ser preso.',
        'Ela não precisa mais do palácio.',
        'Ela tem você.',
        'E você nunca mais vai dormir tranquilo.',
      ],
    },
    good: {
      title: '/// O PASSEIO ///',
      lines: [
        'O sol nasceu.',
        'Você sentiu o vento no rosto pela primeira vez em dias.',
        'Shiva está na sua frente.',
        'Não deusa. Não monstro.',
        'Só uma golden retriever.',
        'Ela abaixa a cabeça.',
        'Você entende.',
        'Você se ajoelha. Prende a coleira.',
        'O palácio se desfaz ao redor de vocês.',
        'Vocês acordam no mundo real.',
        'Na calçada de casa.',
        'O sol está nascendo de verdade.',
        'Uma senhora acena do portão.',
        'Um gato cruza o caminho.',
        'Shiva olha. Mas não persegue.',
        'Ela lambe sua mão.',
        'Você cumpriu.',
        'O Passeio.',
      ],
    },
  };

  const data = texts[type];
  if (!data) return;

  _finalLines = data.lines;
  _finalIndex = 0;

  const overlay = document.getElementById('final-overlay');
  overlay.querySelector('.final-title').textContent = data.title;
  overlay.querySelector('.final-text').textContent = '';
  overlay.style.display = 'block';

  const canvas = document.getElementById('game-canvas');
  canvas.style.display = 'none';

  _typeFinalLine();
}

function _typeFinalLine() {
  if (_finalIndex >= _finalLines.length) return;

  const textEl = document.getElementById('final-overlay').querySelector('.final-text');
  textEl.textContent = '';
  let ci = 0;
  const line = _finalLines[_finalIndex];

  if (_finalInterval) clearInterval(_finalInterval);
  _finalInterval = setInterval(() => {
    if (ci < line.length) {
      textEl.textContent += line[ci];
      ci++;
    } else {
      clearInterval(_finalInterval);
      _finalInterval = null;
      _finalIndex++;
    }
  }, 40);
}

function _advanceFinal() {
  if (_finalInterval) {
    // skip
    clearInterval(_finalInterval);
    _finalInterval = null;
    const textEl = document.getElementById('final-overlay').querySelector('.final-text');
    textEl.textContent = _finalLines[_finalIndex];
    _finalIndex++;
    return;
  }
  if (_finalIndex >= _finalLines.length) return;
  _typeFinalLine();
}

window.showFinal = showFinal;
