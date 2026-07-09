(function () {

  var CONFIG_KEY = 'mcookinho_professional_config'

  var THEMES = {
    professional: { name: 'Profissional', primary: '#1a1a2e', bg: '#f8f9fa', text: '#1a1a2e', accent: '#2563eb' },
    minimal:      { name: 'Minimal',      primary: '#333',    bg: '#fff',    text: '#333',    accent: '#666' },
    dark:         { name: 'Escuro',       primary: '#e0e0e0', bg: '#111',    text: '#ddd',    accent: '#00ffc8' },
    nature:       { name: 'Natureza',     primary: '#1a3a2a', bg: '#f5faf5', text: '#1a3a2a', accent: '#2d8a4e' },
    sunset:       { name: 'Pôr do Sol',   primary: '#2a1a1a', bg: '#faf5f0', text: '#2a1a1a', accent: '#c0392b' },
  }

  var FONTS = [
    { id: 'system', label: 'Sistema' },
    { id: 'serif',  label: 'Serif' },
    { id: 'mono',   label: 'Monoespaçada' },
  ]

  var FONT_SIZES = [
    { id: 'xs',     label: 'Extra pequena' },
    { id: 'sm',     label: 'Pequena' },
    { id: 'normal', label: 'Normal' },
    { id: 'lg',     label: 'Grande' },
    { id: 'xl',     label: 'Extra grande' },
  ]

  var TITLE_SIZES = [
    { id: 'small',  label: 'Pequeno' },
    { id: 'normal', label: 'Normal' },
    { id: 'large',  label: 'Grande' },
  ]

  var FONT_WEIGHTS = [
    { id: 'light',  label: 'Leve' },
    { id: 'normal', label: 'Normal' },
    { id: 'bold',   label: 'Negrito' },
  ]

  var PARA_SPACINGS = [
    { id: 'compact',  label: 'Compacto' },
    { id: 'normal',   label: 'Normal' },
    { id: 'spacious', label: 'Espaçoso' },
  ]

  var LINE_HEIGHTS = [
    { id: 'tight',   label: 'Compacto' },
    { id: 'normal',  label: 'Normal' },
    { id: 'relaxed', label: 'Espaçado' },
  ]

  var LETTER_SPACINGS = [
    { id: 'tight',  label: 'Estreito' },
    { id: 'normal', label: 'Normal' },
    { id: 'wide',   label: 'Largo' },
  ]

  var TEXT_ALIGNS = [
    { id: 'left',     label: 'Esquerda' },
    { id: 'justify',  label: 'Justificado' },
  ]

  var ANIMS = [
    { id: 'fade',  label: 'Fade In' },
    { id: 'slide', label: 'Slide In' },
    { id: 'none',  label: 'Sem animação' },
  ]

  var YES_NO = [
    { id: 'yes', label: 'Sim' },
    { id: 'no',  label: 'Não' },
  ]

  var HEADER_ALIGNS = [
    { id: 'left',   label: 'Esquerda' },
    { id: 'center', label: 'Centro' },
  ]

  var BG_PATTERNS = [
    { id: 'none',  label: 'Nenhum' },
    { id: 'dots',  label: 'Pontos' },
    { id: 'lines', label: 'Linhas' },
    { id: 'grid',  label: 'Grade' },
  ]

  var PROFILE_SIZES = [
    { id: '60',  label: 'Pequeno' },
    { id: '80',  label: 'Médio' },
    { id: '100', label: 'Grande' },
    { id: '120', label: 'Extra grande' },
  ]

  var BUTTON_STYLES = [
    { id: 'flat',    label: 'Plano' },
    { id: 'outline', label: 'Contorno' },
    { id: 'pill',    label: 'Pílula' },
  ]

  var LIST_STYLES = [
    { id: 'plain',  label: 'Simples' },
    { id: 'bullet', label: 'Bullet' },
    { id: 'icon',   label: 'Ícone' },
  ]

  var GAP_SIZES = [
    { id: 'compact',  label: 'Compacto' },
    { id: 'normal',   label: 'Normal' },
    { id: 'spacious', label: 'Espaçoso' },
  ]

  var PADDING_SIZES = [
    { id: 'compact',  label: 'Compacto' },
    { id: 'normal',   label: 'Normal' },
    { id: 'spacious', label: 'Espaçoso' },
  ]

  var CONTENT_WIDTHS = [
    { id: 'narrow', label: 'Estreita' },
    { id: 'normal', label: 'Normal' },
    { id: 'wide',   label: 'Larga' },
    { id: 'full',   label: 'Cheia' },
  ]

  var HEADER_STYLES = [
    { id: 'compact',  label: 'Compacto' },
    { id: 'detailed', label: 'Detalhado' },
    { id: 'minimal',  label: 'Minimal' },
  ]

  var SKILLS_LAYOUTS = [
    { id: 'grid2', label: '2 Colunas' },
    { id: 'grid3', label: '3 Colunas' },
    { id: 'list',  label: 'Lista' },
  ]

  var PROJ_LAYOUTS = [
    { id: 'grid2', label: '2 Colunas' },
    { id: 'grid3', label: '3 Colunas' },
    { id: 'list',  label: 'Lista' },
  ]

  var RADII = [
    { id: 'none',   label: 'Nenhum' },
    { id: 'small',  label: 'Pequeno' },
    { id: 'normal', label: 'Normal' },
    { id: 'large',  label: 'Grande' },
  ]

  var SHADOWS = [
    { id: 'none',   label: 'Nenhuma' },
    { id: 'light',  label: 'Suave' },
    { id: 'normal', label: 'Normal' },
    { id: 'strong', label: 'Forte' },
  ]

  var LANGUAGES = [
    { id: 'pt', label: 'Português' },
    { id: 'en', label: 'English' },
  ]

  var MARGINS = [
    { id: 'small',  label: 'Pequena' },
    { id: 'normal', label: 'Normal' },
    { id: 'large',  label: 'Grande' },
  ]

  var PDF_FONTS = [
    { id: 'small',  label: 'Pequena' },
    { id: 'normal', label: 'Normal' },
    { id: 'large',  label: 'Grande' },
  ]

  var PAGE_SIZES = [
    { id: 'a4',     label: 'A4' },
    { id: 'letter', label: 'Carta' },
  ]

  var PDF_COLORS = [
    { id: 'color',     label: 'Colorido' },
    { id: 'grayscale', label: 'Escala de cinza' },
  ]

  var SECTION_SPACINGS = [
    { id: 'compact',  label: 'Compacto' },
    { id: 'normal',   label: 'Normal' },
    { id: 'spacious', label: 'Espaçoso' },
  ]

  var SECTION_IDS = [
    { id: 'header',     label: 'Cabeçalho' },
    { id: 'about',      label: 'Sobre' },
    { id: 'experience', label: 'Experiência' },
    { id: 'education',  label: 'Formação' },
    { id: 'skills',     label: 'Habilidades' },
    { id: 'projects',   label: 'Projetos' },
    { id: 'contact',    label: 'Contato' },
  ]

  // ── Presets ──
  var PRESET_CATEGORIES = [
    {
      label: '🎮 Jogos', id: 'cat-gaming',
      presets: [
        { id: 'indie-studio', label: 'Indie Studio', desc: 'Escuro com laranja neon. Perfeito para dev de jogos indie.',
          c: { theme:'dark', cc:{accent:'#ff6b35', primary:'#e0e0e0'}, font:'mono', fw:'bold', fs:'sm', ts:'large', anim:'fade', bgp:'dots', bgpo:15, ha:'center', hs:'detailed', cw:'wide', ss:'spacious', pl:'grid3', bs:'pill', br:'small', bx:'light', asb:'yes' },
          s: ['header','about','experience','skills','projects','contact'],
          sample: {title: 'Desenvolvedor de Jogos Indie', about: 'Criador de experiências interativas com foco em gameplay e narrativa. Desenvolvo jogos utilizando Godot, Unity e engines próprias em C++.', location: 'São Paulo, SP',
            experience: [{id:'exp1', role:'Desenvolvedor de Jogos Indie', org:'Autônomo', date:'2020 — Presente', desc:'Criação e publicação de jogos indie para Steam e Itch.io. Desenvolvimento em Godot, Unity e C++. Gestão completa do ciclo de produção: conceito, arte, programação, áudio e distribuição.'},{id:'exp2', role:'Game Designer', org:'Estúdio Criativo — SP', date:'2018 — 2020', desc:'Design de níveis, mecânicas e sistemas de progressão para jogos mobile. Colaboração com equipe multidisciplinar de arte e programação.'}],
            skills: [{id:'godot',label:'Godot',pct:90},{id:'unity',label:'Unity',pct:80},{id:'csharp',label:'C#',pct:85},{id:'cpp',label:'C++',pct:75},{id:'gamedesign',label:'Game Design',pct:90},{id:'blender',label:'Blender',pct:70},{id:'git',label:'Git',pct:85},{id:'photoshop',label:'Photoshop',pct:60}],
            projects: [{id:'pg1',lang:'C# / Godot',label:'ECHOES OF THE VOID',desc:'Metroidvania com pixel art e trilha sonora original. Mais de 10 mil downloads na Steam Early Access.',url:'store.steampowered.com/app/echoesvoid'},{id:'pg2',lang:'C++ / OpenGL',label:'TINY KINGDOM',desc:'Simulador de colônia com geração procedural de mapas. Vencedor do prêmio Melhor Jogo Indie no SBGames 2023.',url:'itch.io/tiny-kingdom'},{id:'pg3',lang:'Unity / C#',label:'NEON RACER',desc:'Jogo de corrida futurista com trilha sonora synthwave. Otimizado para dispositivos mobile com mais de 100 mil instalações.',url:'play.google.com/neonracer'}]} },
        { id: 'game-publisher', label: 'Game Publisher', desc: 'Sóbrio com acentos verde-água. Para publishers profissionais.',
          c: { theme:'dark', cc:{accent:'#00ffc8', primary:'#e0e0e0'}, font:'system', fw:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'outline', ls:'icon', br:'normal', bx:'normal', asb:'no' },
          s: ['header','about','experience','skills','projects','contact'],
          sample: {title: 'Publisher de Jogos', about: 'Profissional especializado em publishing e distribuição de jogos digitais. Gerencia portfólios, parcerias com desenvolvedores e estratégias de lançamento multiplataforma.', location: 'São Paulo, SP',
            experience: [{id:'exp1', role:'Publisher de Jogos', org:'PixelHouse Publishing — SP', date:'2021 — Presente', desc:'Gestão de portfólio com mais de 30 títulos publicados. Responsável por estratégias de lançamento, marketing, localização e distribuição em Steam, Nintendo Switch e consoles.'},{id:'exp2', role:'Produtor de Jogos', org:'Indie Fund Brasil', date:'2019 — 2021', desc:'Seleção e aceleração de estúdios indie brasileiros. Mentoria em produção, financiamento coletivo e publishing.'}],
            skills: [{id:'prod',label:'Produção Executiva',pct:90},{id:'marketing',label:'Marketing Digital',pct:85},{id:'localizacao',label:'Localização',pct:80},{id:'negociacao',label:'Negociação',pct:90},{id:'steam',label:'Steamworks',pct:85},{id:'analytics',label:'Game Analytics',pct:75},{id:'contratos',label:'Gestão Contratual',pct:80},{id:'ingles',label:'Inglês Avançado',pct:95}],
            projects: [{id:'pg1',lang:'Multiplataforma',label:'PORTFÓLIO DE PUBLISHING',desc:'Catálogo de 30+ jogos publicados incluindo títulos premiados e best-sellers na Steam.',url:'pixelhouse.com/portfolio'},{id:'pg2',lang:'Consultoria',label:'INDIE FUND BRASIL',desc:'Programa de aceleração para estúdios independentes com mais de R$ 2 milhões captados.',url:'indiefund.com.br'},{id:'pg3',lang:'Distribuição',label:'SWITCH PUBLISHING',desc:'Publicação de 5 títulos no Nintendo Switch eShop com alcance internacional.',url:'pixelhouse.com/switch'}]} },
        { id: 'mobile-games', label: 'Mobile Games', desc: 'Colorido e vibrante. Para desenvolvedor de jogos mobile.',
          c: { theme:'nature', cc:{accent:'#7c3aed', primary:'#1a1a3e'}, font:'system', fw:'bold', fs:'normal', ts:'large', anim:'slide', bgp:'dots', bgpo:10, ha:'center', hs:'detailed', cw:'normal', pl:'grid3', bs:'pill', br:'large', bx:'light', asb:'yes' },
          s: ['header','about','experience','skills','projects','contact'],
          sample: {title: 'Desenvolvedor Mobile', about: 'Criador de jogos para dispositivos móveis com milhões de downloads. Especialista em Unity, otimização de performance e monetização freemium.', location: 'Belo Horizonte, MG',
            experience: [{id:'exp1', role:'Desenvolvedor Mobile', org:'AppWorks Studio — BH', date:'2022 — Presente', desc:'Desenvolvimento de jogos mobile em Unity e Kotlin. Otimização para dispositivos de baixo custo, integração de SDKs de anúncios e análise de métricas de retenção.'},{id:'exp2', role:'Game Developer', org:'PlayMobile Inc.', date:'2020 — 2022', desc:'Criação de protótipos e sistemas de monetização para jogos casuais. Gerenciamento de live operations e eventos sazonais.'}],
            skills: [{id:'unity',label:'Unity',pct:90},{id:'kotlin',label:'Kotlin',pct:75},{id:'csharp',label:'C#',pct:85},{id:'android',label:'Android SDK',pct:80},{id:'ads',label:'Monetização / Ads',pct:85},{id:'firebase',label:'Firebase',pct:75},{id:'git',label:'Git',pct:80},{id:'uiux',label:'UI/UX Mobile',pct:70}],
            projects: [{id:'pg1',lang:'Unity / C#',label:'FRUIT MANIA',desc:'Puzzle game casual com mais de 500 mil downloads na Google Play. Receita gerada via anúncios e compras in-app.',url:'play.google.com/fruitmania'},{id:'pg2',lang:'Kotlin',label:'SPEED RUNNER',desc:'Runner infinito com sistema de power-ups e leaderboards. 4.5 estrelas na App Store.',url:'apps.apple.com/speedrunner'},{id:'pg3',lang:'Unity / C#',label:'WORD MASTER',desc:'Jogo de palavras com multiplayer assíncrono e desafios diários. Mais de 1 milhão de partidas jogadas.',url:'play.google.com/wordmaster'}]} },
        { id: 'esports-team', label: 'Esports Team', desc: 'Agressivo e escuro. Ideal para perfil de jogador competitivo.',
          c: { theme:'dark', cc:{accent:'#ff0044', bg:'#0d0d0d', primary:'#e0e0e0'}, font:'mono', fw:'bold', fs:'sm', ts:'large', anim:'fade', bgp:'grid', bgpo:10, ha:'center', hs:'minimal', cw:'narrow', pl:'list', bs:'flat', ls:'plain', br:'none', bx:'none', asb:'no', ss:'compact', sb:'no' },
          s: ['header','about','experience','skills','projects','contact'],
          sample: {title: 'Atleta / Gestor de Esports', about: 'Jogador competitivo profissional com experiência em torneios nacionais e internacionais. Foco em estratégia, treinamento e análise de desempenho.', location: 'São Paulo, SP',
            experience: [{id:'exp1', role:'Jogador Profissional', org:'Team Fury — São Paulo', date:'2022 — Presente', desc:'Jogador profissional de Valorant e CS2. Participação em campeonatos nacionais e internacionais incluindo CBLOL, VCT e ESL.'},{id:'exp2', role:'Coach / Analista', org:'Academia Esports', date:'2020 — 2022', desc:'Treinamento de equipes competitivas, análise de partidas e desenvolvimento de estratégias. Preparação de atletas para tryouts e campeonatos.'}],
            skills: [{id:'valorant',label:'Valorant',pct:95},{id:'cs2',label:'CS2',pct:90},{id:'estrategia',label:'Estratégia Competitiva',pct:90},{id:'analise',label:'Análise de Partidas',pct:85},{id:'lideranca',label:'Liderança',pct:85},{id:'comunicacao',label:'Comunicação',pct:80},{id:'ingles',label:'Inglês',pct:90},{id:'streaming',label:'Streaming',pct:70}],
            projects: [{id:'pg1',lang:'Competitivo',label:'CBLOL 2024',desc:'Top 4 no Campeonato Brasileiro de League of Legends com premiação de R$ 50 mil.',url:'lolesports.com/cblol'},{id:'pg2',lang:'Competitivo',label:'ESL PRO LEAGUE',desc:'Participação na fase internacional da ESL Pro League representando o Brasil.',url:'eslgaming.com'},{id:'pg3',lang:'Conteúdo',label:'CANAL PRO PLAYER',desc:'Canal no YouTube com análises, guias e VODs comentados. Mais de 50 mil inscritos.',url:'youtube.com/@proplayer'}]} },
        { id: 'game-dev-portfolio', label: 'Game Dev Portfolio', desc: 'Escuro com verde matrix. Portfólio de game dev.',
          c: { theme:'dark', cc:{accent:'#00ff88', primary:'#e0e0e0'}, font:'mono', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'dots', bgpo:12, ha:'left', hs:'detailed', cw:'wide', pl:'grid3', bs:'outline', br:'small', bx:'light', asb:'yes' },
          s: ['header','about','experience','skills','projects','contact'],
          sample: {title: 'Game Developer', about: 'Desenvolvedor de jogos full-stack com experiência em engines 2D e 3D. Portfólio inclui jogos publicados em Steam, Itch.io e lojas mobile.', location: 'Rio de Janeiro, RJ',
            experience: [{id:'exp1', role:'Game Developer', org:'Portfólio Independente', date:'2021 — Presente', desc:'Desenvolvimento de jogos para portfólio abrangendo diversas engines e linguagens. Foco em mecânicas inovadoras, pixel art e narrativa emergente.'},{id:'exp2', role:'Estagiário em Desenvolvimento', org:'PlayTech Studio — RJ', date:'2020 — 2021', desc:'Implementação de sistemas de gameplay, debugging e otimização de performance em jogos mobile.'}],
            skills: [{id:'unity',label:'Unity',pct:85},{id:'godot',label:'Godot',pct:80},{id:'cpp',label:'C++',pct:75},{id:'csharp',label:'C#',pct:85},{id:'python',label:'Python',pct:70},{id:'pixelart',label:'Pixel Art',pct:65},{id:'git',label:'Git',pct:80},{id:'sfx',label:'Sound Design',pct:60}],
            projects: [{id:'pg1',lang:'Godot / GDScript',label:'DEEP SPACE',desc:'Shooter espacial com física newtoniana e geração procedural de asteroides. Desenvolvido em 6 meses como projeto de TCC.',url:'itch.io/deepspace'},{id:'pg2',lang:'Unity / C#',label:'PIXEL REALMS',desc:'RPG de ação com mundo aberto e sistema de crafting. Mais de 5 mil downloads na Itch.io.',url:'itch.io/pixelrealms'},{id:'pg3',lang:'C++ / SFML',label:'ROGUE LEGACY CLONE',desc:'Clone do clássico Rogue Legacy com mecânicas de hereditariedade e permadeath. Projeto de estudo.',url:'github.com/dev/rogueclone'}]} },
      ]
    },
    {
      label: '💼 Corporativo', id: 'cat-corporate',
      presets: [
        { id: 'corporate-exec', label: 'Executivo Corporativo', desc: 'Sóbrio, azul-marinho. Para cargos de liderança.',
          c: { theme:'professional', cc:{accent:'#1a365d'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no', sb:'yes', sd:'yes', ss:'normal' },
          s: ['header','about','experience','education','skills','contact'],
          sample: {title: 'Executivo Corporativo', about: 'Líder com mais de 15 anos de experiência em gestão estratégica e operacional. Especialista em transformação digital e otimização de processos corporativos.', location: 'São Paulo, SP',
            experience: [{id:'exp1', role:'Diretor Executivo', org:'Grupo Corporativo S.A. — SP', date:'2018 — Presente', desc:'Liderança estratégica de holding com 3 subsidiárias. Responsável por planejamento estratégico, governança corporativa, relações com investidores e expansão para novos mercados.'},{id:'exp2', role:'Gerente Geral', org:'Indústrias Unidas Ltda.', date:'2014 — 2018', desc:'Gestão de operações industriais com equipe de 200+ colaboradores. Implementação de sistema ERP e redução de 25% nos custos operacionais.'}],
            education: [{id:'ed1', course:'MBA em Gestão Executiva', inst:'FGV — São Paulo', date:'2012 — 2014', desc:'Especialização em liderança corporativa, finanças e estratégia empresarial.'},{id:'ed2', course:'Administração de Empresas', inst:'USP — São Paulo', date:'2008 — 2012', desc:'Formação em administração com ênfase em gestão de operações.'}],
            skills: [{id:'lideranca',label:'Liderança Executiva',pct:95},{id:'estrategia',label:'Planejamento Estratégico',pct:90},{id:'financas',label:'Finanças Corporativas',pct:85},{id:'negociacao',label:'Negociação',pct:90},{id:'rh',label:'Gestão de Pessoas',pct:85},{id:'gov',label:'Governança',pct:80},{id:'ingles',label:'Inglês Fluente',pct:95},{id:'erp',label:'ERP / SAP',pct:75}],
            projects: [{id:'pg1',lang:'Gestão',label:'REESTRUTURAÇÃO OPERACIONAL',desc:'Liderança de projeto de reestruturação que resultou em redução de 25% de custos e aumento de 40% de produtividade.',url:'linkedin.com/in/executivo'},{id:'pg2',lang:'Expansão',label:'EXPANSÃO NORDESTE',desc:'Abertura de 3 filiais na região Nordeste gerando 150 novos empregos diretos.',url:''},{id:'pg3',lang:'Digital',label:'TRANSFORMAÇÃO DIGITAL',desc:'Implementação de ERP corporativo e digitalização de processos administrativos e financeiros.',url:''}]} },
        { id: 'tech-startup', label: 'Tech Startup', desc: 'Moderno com azul vibrante. Para startups de tecnologia.',
          c: { theme:'professional', cc:{accent:'#2563eb'}, font:'system', fw:'normal', fs:'normal', ts:'large', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'wide', pl:'grid3', bs:'outline', br:'normal', bx:'light', asb:'no', ss:'spacious' },
          s: ['header','about','experience','education','skills','contact'],
          sample: {title: 'Founder & CEO', about: 'Empreendedor serial no ecossistema de startups. Fundador de duas startups de tecnologia com investimento-anjo e tração no mercado B2B.', location: 'Campinas, SP',
            experience: [{id:'exp1', role:'Founder & CEO', org:'TechFlow Startup — Campinas', date:'2020 — Presente', desc:'Fundador de startup B2B de automação de processos. Captação de R$ 2M em investimento anjo. Gestão de equipe de 15 pessoas entre tech, produto e vendas.'},{id:'exp2', role:'Product Manager', org:'InovaTech Ltda.', date:'2017 — 2020', desc:'Gestão de produto SaaS com mais de 10 mil usuários ativos. Definição de roadmap, priorização de features e análise de métricas de produto.'}],
            education: [{id:'ed1', course:'Engenharia da Computação', inst:'UNICAMP — Campinas', date:'2013 — 2017', desc:'Formação em engenharia com ênfase em empreendedorismo e inovação tecnológica.'}],
            skills: [{id:'produto',label:'Gestão de Produto',pct:90},{id:'negocios',label:'Modelagem de Negócios',pct:85},{id:'python',label:'Python',pct:75},{id:'react',label:'React / Node.js',pct:70},{id:'vendas',label:'Vendas B2B',pct:80},{id:'captacao',label:'Captação de Recursos',pct:75},{id:'lideranca',label:'Liderança',pct:85},{id:'agile',label:'Metodologias Ágeis',pct:90}],
            projects: [{id:'pg1',lang:'SaaS',label:'TECHFLOW PLATFORM',desc:'Plataforma SaaS de automação de processos empresariais. Mais de 200 clientes ativos e 98% de retenção mensal.',url:'techflow.io'},{id:'pg2',lang:'Produto',label:'MVP LAUNCH',desc:'Desenvolvimento e lançamento de MVP em 3 meses com validação de product-market fit.',url:''},{id:'pg3',lang:'Captação',label:'ROUND ANJO',desc:'Captação de R$ 2 milhões em rodada anjo com participação de fundos regionais.',url:''}]} },
        { id: 'financial', label: 'Financeiro', desc: 'Conservador, fontes serifadas. Para banco/consultoria financeira.',
          c: { theme:'minimal', cc:{accent:'#1a3a5c', primary:'#1a1a2e', bg:'#fafafa'}, font:'serif', fw:'normal', fs:'sm', ts:'normal', ta:'justify', anim:'none', bgp:'none', ha:'left', hs:'detailed', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no', ss:'compact' },
          s: ['header','about','experience','education','skills','contact'],
          sample: {title: 'Analista Financeiro', about: 'Profissional de finanças com expertise em modelagem financeira, valuation e gestão de risco. Experiência em bancos de investimento e consultoria financeira.', location: 'São Paulo, SP',
            experience: [{id:'exp1', role:'Analista Financeiro Sênior', org:'Banco Invest S.A. — SP', date:'2019 — Presente', desc:'Análise de crédito corporativo, estruturação de operações financeiras e modelagem de valuation para empresas de médio e grande porte.'},{id:'exp2', role:'Analista de Investimentos', org:'Consultoria Financeira ABC', date:'2016 — 2019', desc:'Gestão de carteira de clientes Private, análise de ativos e recomendações de investimento. Certificação CFA Nível 2.'}],
            education: [{id:'ed1', course:'Ciências Econômicas', inst:'FEA-USP — São Paulo', date:'2012 — 2016', desc:'Formação em economia com ênfase em finanças e econometria.'},{id:'ed2', course:'CFA Charterholder', inst:'CFA Institute', date:'2019', desc:'Certificação internacional em análise financeira e gestão de investimentos.'}],
            skills: [{id:'modelagem',label:'Modelagem Financeira',pct:95},{id:'valuation',label:'Valuation',pct:90},{id:'excel',label:'Excel Avançado',pct:95},{id:'risco',label:'Gestão de Risco',pct:85},{id:'powerbi',label:'Power BI',pct:80},{id:'ingles',label:'Inglês Fluente',pct:90},{id:'cfa',label:'CFA / ANBIMA',pct:90},{id:'credito',label:'Análise de Crédito',pct:85}],
            projects: [{id:'pg1',lang:'Finanças',label:'REESTRUTURAÇÃO DE DÍVIDA',desc:'Estruturação de operação de R$ 50 milhões em reestruturação de dívida corporativa.',url:''},{id:'pg2',lang:'Consultoria',label:'VALUATION TECH',desc:'Valuation de startup de tecnologia para rodada de investimento Série A.',url:''},{id:'pg3',lang:'Análise',label:'MODELO DE CRÉDITO',desc:'Desenvolvimento de modelo de scoring de crédito corporativo utilizando machine learning.',url:''}]} },
        { id: 'management-consulting', label: 'Consultoria de Gestão', desc: 'Clean, profissional, minimalista.',
          c: { theme:'minimal', cc:{accent:'#2d3748'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'compact', cw:'narrow', pl:'list', bs:'flat', br:'small', bx:'light', asb:'no', ss:'compact' },
          s: ['header','about','experience','education','skills','contact'],
          sample: {title: 'Consultor de Gestão', about: 'Consultor estratégico com histórico de entregas em grandes projetos de reestruturação e eficiência operacional. Especialista em metodologias ágeis e lean.', location: 'São Paulo, SP',
            experience: [{id:'exp1', role:'Consultor de Gestão', org:'McKinsey & Company — SP', date:'2020 — Presente', desc:'Consultoria estratégica para grandes empresas em projetos de transformação digital, eficiência operacional e growth strategy. Setores atendidos: varejo, finanças e tecnologia.'},{id:'exp2', role:'Analista de Estratégia', org:'Deloitte Consulting', date:'2017 — 2020', desc:'Participação em projetos de diagnóstico organizacional, desenho de processos e implementação de melhorias para clientes do setor público e privado.'}],
            education: [{id:'ed1', course:'Administração de Empresas', inst:'FGV-EAESP — São Paulo', date:'2013 — 2017', desc:'Graduação com intercâmbio na University of Pennsylvania. Destaque acadêmico em estratégia e operações.'}],
            skills: [{id:'estrategia',label:'Estratégia Corporativa',pct:90},{id:'processos',label:'Mapeamento de Processos',pct:85},{id:'analise',label:'Análise de Dados',pct:80},{id:'apresentacao',label:'Apresentação Executiva',pct:95},{id:'agile',label:'Metodologias Ágeis',pct:75},{id:'negociacao',label:'Negociação',pct:80},{id:'ingles',label:'Inglês Fluente',pct:95},{id:'excel',label:'Excel / PowerPoint',pct:95}],
            projects: [{id:'pg1',lang:'Estratégia',label:'TRANSFORMAÇÃO DIGITAL',desc:'Projeto de transformação digital para varejista nacional com implementação de omnichannel e CRM.',url:''},{id:'pg2',lang:'Operações',label:'EFICIÊNCIA OPERACIONAL',desc:'Programa de redução de custos que gerou economia de R$ 15 milhões/ano para cliente do setor industrial.',url:''},{id:'pg3',lang:'Growth',label:'GO-TO-MARKET',desc:'Estratégia de go-to-market para startup de fintech com projeção de captação de 50 mil usuários no primeiro ano.',url:''}]} },
        { id: 'enterprise-b2b', label: 'Enterprise B2B', desc: 'Profissional azul-escuro. Para vendas/parcerias B2B.',
          c: { theme:'professional', cc:{accent:'#1e40af', primary:'#0f172a'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'flat', br:'small', bx:'light', asb:'no' },
          s: ['header','about','experience','education','skills','contact'],
          sample: {title: 'Executivo de Vendas B2B', about: 'Profissional de vendas enterprise com track record de crescimento em SaaS B2B. Especialista em prospecção, fechamento de contratos de alto valor e gestão de contas-chave.', location: 'São Paulo, SP',
            experience: [{id:'exp1', role:'Executivo de Vendas B2B', org:'SalesForce Brasil — SP', date:'2021 — Presente', desc:'Gestão de contas enterprise com ticket médio de R$ 500k. Responsável por prospecção, negociação e fechamento de contratos com grandes empresas dos setores financeiro e industrial.'},{id:'exp2', role:'Account Executive', org:'Oracle Brasil', date:'2018 — 2021', desc:'Vendas de soluções de cloud computing e banco de dados para clientes corporativos. Superação de metas em 130% no último ano.'}],
            education: [{id:'ed1', course:'Administração de Empresas', inst:'ESPM — São Paulo', date:'2014 — 2018', desc:'Formação em administração com ênfase em vendas e negociação empresarial.'}],
            skills: [{id:'vendas',label:'Vendas Consultivas',pct:95},{id:'crm',label:'CRM / Salesforce',pct:90},{id:'negociacao',label:'Negociação Complexa',pct:90},{id:'prospeccao',label:'Prospecção',pct:85},{id:'apresentacao',label:'Apresentação Executiva',pct:85},{id:'cloud',label:'Cloud Computing',pct:70},{id:'ingles',label:'Inglês Fluente',pct:90},{id:'contratos',label:'Gestão de Contratos',pct:80}],
            projects: [{id:'pg1',lang:'Vendas',label:'CONTA ESTRATÉGICA',desc:'Fechamento de contrato de R$ 2 milhões/ano com banco de grande porte para migração para nuvem.',url:''},{id:'pg2',lang:'CRM',label:'PROCESSO DE VENDAS',desc:'Estruturação de processo de vendas B2B com metodologia MEDDIC e aumento de 40% na taxa de conversão.',url:''},{id:'pg3',lang:'Resultado',label:'TOP PERFORMER 2024',desc:'Reconhecido como top performer da região Sudeste com 150% da meta anual atingida.',url:''}]} },
      ]
    },
    {
      label: '📢 Marketing', id: 'cat-marketing',
      presets: [
        { id: 'creative-agency', label: 'Agência Criativa', desc: 'Cores ousadas e layout moderno. Para agências de publicidade.',
          c: { theme:'sunset', cc:{accent:'#e63946', primary:'#2a1a1a'}, font:'system', fw:'bold', fs:'normal', ts:'large', anim:'slide', bgp:'dots', bgpo:12, ha:'center', hs:'detailed', cw:'wide', pl:'grid3', bs:'pill', br:'large', bx:'light', asb:'yes', ss:'spacious' },
          s: ['header','about','experience','skills','projects','contact'],
          sample: {title: 'Diretor de Criação', about: 'Diretor criativo com experiência em campanhas multicanal para marcas nacionais e globais. Especialista em branding, storytelling e comunicação integrada.', location: 'Rio de Janeiro, RJ',
            experience: [{id:'exp1', role:'Diretor de Criação', org:'Agência Criativa Ltda. — RJ', date:'2019 — Presente', desc:'Direção criativa de campanhas para marcas nacionais e multinacionais. Gestão de equipe de 12 profissionais entre redatores, designers e produtores audiovisuais.'},{id:'exp2', role:'Redator Publicitário', org:'PubliBrasil Agência', date:'2016 — 2019', desc:'Criação de conceitos criativos, redação de peças publicitárias para TV, rádio, impresso e digital. Prêmio Colunistas 2018.'}],
            skills: [{id:'criacao',label:'Direção Criativa',pct:90},{id:'redacao',label:'Redação Publicitária',pct:95},{id:'branding',label:'Branding',pct:85},{id:'design',label:'Design Thinking',pct:80},{id:'midias',label:'Mídias Sociais',pct:75},{id:'apresentacao',label:'Apresentação de Campanhas',pct:90},{id:'lideranca',label:'Liderança Criativa',pct:85},{id:'pacote',label:'Pacote Adobe',pct:75}],
            projects: [{id:'pg1',lang:'Campanha',label:'CAMPANHA NACIONAL — MARCA DE BEBIDAS',desc:'Campanha 360° para marca de bebidas com veiculação em TV, rádio, OOH e digital. Alcance de 50 milhões de pessoas.',url:''},{id:'pg2',lang:'Branding',label:'REBRANDING REDE VAREJO',desc:'Rebranding completo de rede varejista com nova identidade visual, posicionamento e campanha de lançamento.',url:''},{id:'pg3',lang:'Digital',label:'CAMPANHA VIRAL TIKTOK',desc:'Campanha para TikTok que gerou 10 milhões de views orgânicos e trend nacional.',url:''}]} },
        { id: 'digital-marketing', label: 'Marketing Digital', desc: 'Moderno e vibrante. Para profissionais de marketing digital.',
          c: { theme:'professional', cc:{accent:'#f59e0b'}, font:'system', fw:'normal', fs:'normal', ts:'large', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid3', bs:'pill', br:'normal', bx:'light', asb:'yes', ss:'normal' },
          s: ['header','about','experience','skills','projects','contact'],
          sample: {title: 'Especialista em Marketing Digital', about: 'Estrategista digital com domínio em SEO, SEM, mídia paga e marketing de conteúdo. Gere audiências e ROI para marcas de médio e grande porte.', location: 'São Paulo, SP',
            experience: [{id:'exp1', role:'Especialista em Marketing Digital', org:'Agência Digital XYZ — SP', date:'2020 — Presente', desc:'Gestão de campanhas de mídia paga (Google Ads, Meta Ads, LinkedIn Ads) com orçamento mensal superior a R$ 500k. Otimização de ROI e geração de leads qualificados.'},{id:'exp2', role:'Analista de SEO', org:'WebMedia Agência', date:'2017 — 2020', desc:'Estratégia de SEO on-page e off-page para sites de alto tráfego. Implementação de link building e otimização técnica resultando em aumento de 200% no tráfego orgânico.'}],
            skills: [{id:'seo',label:'SEO',pct:90},{id:'sem',label:'Google Ads',pct:95},{id:'meta',label:'Meta Ads',pct:90},{id:'analytics',label:'Google Analytics',pct:85},{id:'conteudo',label:'Marketing de Conteúdo',pct:85},{id:'email',label:'Email Marketing',pct:75},{id:'data',label:'Análise de Dados',pct:80},{id:'crm',label:'CRM / Automação',pct:70}],
            projects: [{id:'pg1',lang:'Performance',label:'CAMPANHA DE ALTA PERFORMANCE',desc:'Gestão de campanha com ROAS médio de 8x e redução de 35% no CPA ao longo de 12 meses.',url:''},{id:'pg2',lang:'SEO',label:'AUMENTO DE TRÁFEGO ORGÂNICO',desc:'Estratégia de SEO que levou site de e-commerce de 50k para 500k visitas orgânicas mensais.',url:''},{id:'pg3',lang:'Inbound',label:'ESTRATÉGIA DE INBOUND MARKETING',desc:'Implementação de funil de inbound marketing com geração de 2 mil leads qualificados/mês.',url:''}]} },
        { id: 'social-media-mgr', label: 'Social Media Manager', desc: 'Clean com toque trendy. Para gestor de redes sociais.',
          c: { theme:'nature', cc:{accent:'#ec4899', primary:'#1a1a2e'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'slide', bgp:'dots', bgpo:8, ha:'center', hs:'detailed', cw:'normal', pl:'grid2', bs:'pill', br:'large', bx:'light', asb:'yes' },
          s: ['header','about','experience','skills','projects','contact'],
          sample: {title: 'Social Media Manager', about: 'Gestor de redes sociais com experiência em comunidades de mais de 500 mil seguidores. Estrategista de conteúdo orgânico e campanhas de influenciadores.', location: 'Curitiba, PR',
            experience: [{id:'exp1', role:'Social Media Manager', org:'Agência de Conteúdo Digital — SP', date:'2021 — Presente', desc:'Gestão de redes sociais para marcas de moda, beleza e lifestyle. Criação de calendário editorial, produção de conteúdo e análise de métricas de engajamento.'},{id:'exp2', role:'Social Media Analyst', org:'BrandUp Agência', date:'2019 — 2021', desc:'Produção de conteúdo orgânico e pago para Instagram, TikTok e LinkedIn. Growth de comunidades e gestão de crises.'}],
            skills: [{id:'instagram',label:'Instagram',pct:95},{id:'tiktok',label:'TikTok',pct:90},{id:'linkedin',label:'LinkedIn',pct:80},{id:'conteudo',label:'Produção de Conteúdo',pct:90},{id:'analytics',label:'Métricas / Analytics',pct:85},{id:'design',label:'Canva / Photoshop',pct:80},{id:'relacionamento',label:'Relacionamento com Seguidores',pct:85},{id:'crise',label:'Gestão de Crise',pct:75}],
            projects: [{id:'pg1',lang:'Redes Sociais',label:'CRESCIMENTO DE COMUNIDADE',desc:'Crescimento de 0 a 500 mil seguidores no Instagram em 18 meses para marca de moda.',url:''},{id:'pg2',lang:'TikTok',label:'TIKTOK VIRAL STRATEGY',desc:'Estratégia de conteúdo que gerou 20 milhões de views no TikTok e posicionamento como marca trendy.',url:''},{id:'pg3',lang:'Campanha',label:'LANÇAMENTO DE PRODUTO',desc:'Campanha de lançamento com reach orgânico de 2 milhões e mais de 50 mil interações em 24h.',url:''}]} },
        { id: 'brand-strategist', label: 'Estrategista de Marca', desc: 'Elegante e premium. Para branding e posicionamento.',
          c: { theme:'minimal', cc:{accent:'#b8860b', primary:'#2a1a0a'}, font:'serif', fw:'bold', fs:'sm', ts:'large', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no' },
          s: ['header','about','experience','skills','projects','contact'],
          sample: {title: 'Estrategista de Marca', about: 'Brand strategist especializado em posicionamento e branding estratégico. Desenvolvo identidades de marca que conectam empresas a seus públicos com propósito.', location: 'São Paulo, SP',
            experience: [{id:'exp1', role:'Estrategista de Marca', org:'Branding Lab — SP', date:'2020 — Presente', desc:'Desenvolvimento de estratégias de posicionamento de marca para empresas de médio e grande porte. Condução de workshops de branding e definição de identidade verbal e visual.'},{id:'exp2', role:'Analista de Branding', org:'Agência de Branding Premium', date:'2017 — 2020', desc:'Pesquisa de mercado, análise de concorrência e desenvolvimento de naming, taglines e brand guidelines para clientes nacionais.'}],
            skills: [{id:'branding',label:'Branding Estratégico',pct:95},{id:'posicionamento',label:'Posicionamento',pct:90},{id:'pesquisa',label:'Pesquisa de Mercado',pct:85},{id:'naming',label:'Naming',pct:80},{id:'storytelling',label:'Storytelling',pct:90},{id:'apresentacao',label:'Apresentação',pct:85},{id:'design',label:'Design Thinking',pct:75},{id:'ingles',label:'Inglês Avançado',pct:90}],
            projects: [{id:'pg1',lang:'Branding',label:'REPOSICIONAMENTO DE MARCA',desc:'Reposicionamento de marca centenária para atrair público jovem com aumento de 35% no brand awareness.',url:''},{id:'pg2',lang:'Identidade',label:'BRAND GUIDELINES',desc:'Criação de manual de marca completo para fintech incluindo identidade verbal, visual e tom de voz.',url:''},{id:'pg3',lang:'Pesquisa',label:'NET PROMOTER SCORE',desc:'Pesquisa de NPS e branding para rede varejista com mais de 5 mil respondentes.',url:''}]} },
        { id: 'content-creator', label: 'Criador de Conteúdo', desc: 'Layout largo e moderno. Para criadores digitais.',
          c: { theme:'sunset', cc:{accent:'#ff6b35', bg:'#fffaf5'}, font:'system', fw:'normal', fs:'normal', ts:'large', anim:'slide', bgp:'none', ha:'center', hs:'detailed', cw:'full', pl:'grid3', bs:'pill', br:'normal', bx:'light', asb:'yes', ss:'spacious' },
          s: ['header','about','experience','skills','projects','contact'],
          sample: {title: 'Criador de Conteúdo Digital', about: 'Criador de conteúdo multiplataforma com presença em YouTube, Instagram e TikTok. Produzo e edito vídeos, roteiros e campanhas para marcas e audiências digitais.', location: 'São Paulo, SP',
            experience: [{id:'exp1', role:'Criador de Conteúdo Digital', org:'Autônomo — SP', date:'2019 — Presente', desc:'Produção de conteúdo para YouTube, Instagram e TikTok sobre tecnologia, estilo de vida e cultura pop. Parcerias com marcas como Samsung, Intel e Spotify.'},{id:'exp2', role:'Produtor de Conteúdo', org:'Portal Digital ABC', date:'2017 — 2019', desc:'Roteirização e produção de vídeos para web. Cobertura de eventos e entrevistas com personalidades do mercado tech.'}],
            skills: [{id:'video',label:'Produção de Vídeo',pct:90},{id:'roteiro',label:'Roteiro',pct:85},{id:'edicao',label:'Edição (Premiere)',pct:80},{id:'youtube',label:'YouTube',pct:90},{id:'instagram',label:'Instagram / Reels',pct:85},{id:'tiktok',label:'TikTok',pct:80},{id:'marcas',label:'Parcerias com Marcas',pct:85},{id:'analytics',label:'YouTube Analytics',pct:75}],
            projects: [{id:'pg1',lang:'YouTube',label:'CANAL PRINCIPAL',desc:'Canal no YouTube com 300 mil inscritos e mais de 30 milhões de views acumulados.',url:'youtube.com/@criador'},{id:'pg2',lang:'Instagram',label:'PROJETO REELS',desc:'Série de reels educativos sobre tecnologia que gerou 10 milhões de visualizações em 3 meses.',url:''},{id:'pg3',lang:'Parceria',label:'CAMPANHA SAMSUNG',desc:'Campanha paga com Samsung para lançamento de novo smartphone com review e conteúdo sponsored.',url:''}]} },
      ]
    },
    {
      label: '💻 Programação', id: 'cat-programming',
      presets: [
        { id: 'fullstack-dev', label: 'Full-Stack Developer', desc: 'Dark mode com acentos azul. O clássico dev.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title:'Desenvolvedor Full-Stack',about:'Desenvolvedor full-stack com experiência em React, Node.js, Python e bancos de dados SQL/NoSQL. Construo aplicações web escaláveis do frontend ao backend.',location:'São Paulo, SP',
            experience:[{id:'exp1',role:'Desenvolvedor Full-Stack',org:'Tech Company — SP',date:'2021 — Presente',desc:'Desenvolvimento de aplicações web completas utilizando React, Node.js, TypeScript e PostgreSQL. Arquitetura de microsserviços e deploys em AWS. Liderança técnica de squad ágil.'},{id:'exp2',role:'Desenvolvedor Web',org:'Agência Digital XYZ',date:'2019 — 2021',desc:'Desenvolvimento de sites e sistemas web sob medida. Implementação de REST APIs, integração com serviços terceiros e otimização de performance.'}],
            education:[{id:'ed1',course:'Ciência da Computação',inst:'Universidade Federal — SP',date:'2015 — 2019',desc:'Bacharelado com ênfase em engenharia de software e sistemas distribuídos.'}],
            skills:[{id:'react',label:'React / Next.js',pct:90},{id:'node',label:'Node.js',pct:85},{id:'typescript',label:'TypeScript',pct:85},{id:'python',label:'Python',pct:80},{id:'sql',label:'SQL / PostgreSQL',pct:85},{id:'aws',label:'AWS',pct:75},{id:'docker',label:'Docker',pct:80},{id:'git',label:'Git / GitHub',pct:90}],
            projects:[{id:'pg1',lang:'React / Node.js',label:'SAAS PLATFORM',desc:'Plataforma SaaS de gestão empresarial com mais de 500 empresas clientes. Arquitetura serverless na AWS.',url:'saasplatform.io'},{id:'pg2',lang:'TypeScript',label:'API GATEWAY',desc:'API Gateway para microsserviços com autenticação, rate limiting e cache distribuído.',url:'github.com/dev/apigateway'},{id:'pg3',lang:'React Native',label:'MOBILE APP',desc:'Aplicativo mobile de delivery com React Native e Firebase. Mais de 10 mil usuários ativos.',url:'apps.apple.com/deliveryapp'}]},
          c: { theme:'dark', cc:{accent:'#3b82f6', primary:'#e0e0e0'}, font:'mono', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'dots', bgpo:12, ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'outline', br:'small', bx:'light', asb:'no' } },
        { id: 'frontend-spec', label: 'Frontend Specialist', desc: 'Moderno e colorido. Para especialista em frontend.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title:'Especialista Frontend',about:'Frontend engineer focado em React, TypeScript e design systems. Apaixonado por performance web, acessibilidade e experiência do usuário.',location:'São Paulo, SP',
            experience:[{id:'exp1',role:'Frontend Engineer',org:'Produto Digital S.A. — SP',date:'2022 — Presente',desc:'Desenvolvimento de interfaces complexas com React, TypeScript e design system próprio. Foco em performance web (Core Web Vitals), acessibilidade (WCAG AA) e testes automatizados.'},{id:'exp2',role:'Frontend Developer',org:'WebStudio Agência',date:'2020 — 2022',desc:'Criação de landing pages, dashboards e componentes reutilizáveis. Implementação de animações CSS e integração com APIs REST.'}],
            education:[{id:'ed1',course:'Sistemas para Internet',inst:'FIAP — São Paulo',date:'2016 — 2020',desc:'Tecnólogo com ênfase em desenvolvimento frontend e UX design.'}],
            skills:[{id:'react',label:'React',pct:95},{id:'typescript',label:'TypeScript',pct:90},{id:'css',label:'CSS / Sass',pct:90},{id:'nextjs',label:'Next.js',pct:85},{id:'jest',label:'Jest / Testing Library',pct:80},{id:'storybook',label:'Storybook',pct:75},{id:'figma',label:'Figma',pct:70},{id:'webpack',label:'Webpack / Vite',pct:80}],
            projects:[{id:'pg1',lang:'React / TypeScript',label:'DESIGN SYSTEM',desc:'Design system corporativo com 80+ componentes documentados no Storybook. Adotado por 5 squads de produto.',url:'storybook.designsystem.io'},{id:'pg2',lang:'Next.js',label:'E-COMMERCE PLATFORM',desc:'Loja virtual com Next.js, ISR e SEO otimizado. Core Web Vitals verdes e 95+ no Lighthouse.',url:'ecommerceplatform.com'},{id:'pg3',lang:'React',label:'DASHBOARD ANALYTICS',desc:'Dashboard interativo de analytics com gráficos em tempo real e exportação de dados.',url:'github.com/dev/dashboard'}]},
          c: { theme:'professional', cc:{accent:'#8b5cf6'}, font:'system', fw:'normal', fs:'normal', ts:'large', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'wide', pl:'grid3', bs:'pill', br:'normal', bx:'light', asb:'yes', ss:'spacious' } },
        { id: 'backend-engineer', label: 'Backend Engineer', desc: 'Minimalista e funcional. Sem firulas, só código.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title:'Engenheiro Backend',about:'Backend engineer especializado em arquitetura de microsserviços, APIs RESTful e sistemas distribuídos. Foco em performance, segurança e escalabilidade.',location:'Campinas, SP',
            experience:[{id:'exp1',role:'Backend Engineer',org:'TechCorp — SP',date:'2021 — Presente',desc:'Desenvolvimento de APIs RESTful e microsserviços em Node.js e Go. Modelagem de bancos de dados relacionais e NoSQL. Implementação de filas, caching e sistemas de mensageria.'},{id:'exp2',role:'Desenvolvedor Backend',org:'StartUp ABC',date:'2019 — 2021',desc:'Construção de backend para aplicação SaaS com Django e PostgreSQL. Deploy automatizado com Docker e CI/CD.'}],
            education:[{id:'ed1',course:'Engenharia de Software',inst:'UFSCAR — São Carlos',date:'2014 — 2019',desc:'Bacharelado com foco em sistemas distribuídos e arquitetura de software.'}],
            skills:[{id:'node',label:'Node.js',pct:90},{id:'go',label:'Go',pct:80},{id:'python',label:'Python',pct:85},{id:'postgres',label:'PostgreSQL',pct:90},{id:'redis',label:'Redis',pct:80},{id:'docker',label:'Docker / K8s',pct:85},{id:'aws',label:'AWS',pct:80},{id:'graphql',label:'GraphQL',pct:75}],
            projects:[{id:'pg1',lang:'Go / PostgreSQL',label:'MICROSSERVIÇO DE PAGAMENTOS',desc:'Microsserviço de processamento de pagamentos com alta disponibilidade e consistência eventual. 99.9% de uptime.',url:'github.com/dev/payment-ms'},{id:'pg2',lang:'Node.js',label:'API DE CATÁLOGO',desc:'API REST para catálogo de produtos com busca elástica e cache distribuído. 50ms de latência média.',url:'api.catalogo.io'},{id:'pg3',lang:'Python',label:'ETL PIPELINE',desc:'Pipeline de ETL processando 10 milhões de registros/dia com Apache Airflow e S3.',url:''}]},
          c: { theme:'dark', cc:{accent:'#10b981', primary:'#d1d5db'}, font:'mono', fw:'normal', fs:'sm', ts:'normal', anim:'none', bgp:'none', ha:'left', hs:'compact', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no', ss:'compact', sb:'no', sd:'no' } },
        { id: 'devops-engineer', label: 'DevOps / SRE', desc: 'Escuro com vermelho/âmbar. Estilo terminal/console.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title:'DevOps / SRE Engineer',about:'Profissional de infraestrutura com expertise em AWS, Kubernetes, Docker e CI/CD. Automatiza pipelines e garante disponibilidade de sistemas em produção.',location:'São Paulo, SP',
            experience:[{id:'exp1',role:'DevOps / SRE Engineer',org:'InfraTech Solutions — SP',date:'2021 — Presente',desc:'Gestão de infraestrutura em nuvem AWS e GCP para aplicações com milhões de usuários. Automação de pipelines CI/CD, monitoramento com Prometheus/Grafana e gestão de clusters Kubernetes.'},{id:'exp2',role:'Analista de Infraestrutura',org:'Hosting Provider S.A.',date:'2018 — 2021',desc:'Administração de servidores Linux, automação com Ansible e Terraform. Migração de infraestrutura on-premise para nuvem.'}],
            education:[{id:'ed1',course:'Redes de Computadores',inst:'IFSP — São Paulo',date:'2014 — 2018',desc:'Tecnólogo em redes com ênfase em infraestrutura cloud e segurança.'}],
            skills:[{id:'kubernetes',label:'Kubernetes',pct:90},{id:'aws',label:'AWS',pct:95},{id:'terraform',label:'Terraform',pct:85},{id:'docker',label:'Docker',pct:90},{id:'ci-cd',label:'CI/CD (Jenkins/GitHub Actions)',pct:90},{id:'linux',label:'Linux',pct:95},{id:'prometheus',label:'Prometheus / Grafana',pct:85},{id:'python',label:'Python (Scripting)',pct:80}],
            projects:[{id:'pg1',lang:'Terraform / AWS',label:'INFRA AS CODE',desc:'Infraestrutura completa como código utilizando Terraform e Terragrunt. Gerenciamento de 200+ recursos em múltiplas contas AWS.',url:'github.com/dev/terraform-infra'},{id:'pg2',lang:'Kubernetes',label:'K8S CLUSTER PRODUCTION',desc:'Cluster Kubernetes em produção com auto-scaling, service mesh e política de segurança zero-trust.',url:''},{id:'pg3',lang:'CI/CD',label:'PIPELINE AUTOMATION',desc:'Pipeline de CI/CD com GitHub Actions e ArgoCD para deploy contínuo em múltiplos ambientes.',url:''}]},
          c: { theme:'dark', cc:{accent:'#f59e0b', primary:'#e0e0e0'}, font:'mono', fw:'bold', fs:'sm', ts:'normal', anim:'fade', bgp:'grid', bgpo:15, ha:'left', hs:'detailed', cw:'normal', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no', ss:'compact' } },
        { id: 'mobile-dev', label: 'Mobile Developer', desc: 'Moderno e limpo. Para desenvolvedor iOS/Android.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title:'Desenvolvedor Mobile',about:'Desenvolvedor mobile nativo e híbrido com experiência em React Native e Flutter. Aplicações publicadas na App Store e Google Play.',location:'Belo Horizonte, MG',
            experience:[{id:'exp1',role:'Mobile Developer',org:'AppSolutions — SP',date:'2021 — Presente',desc:'Desenvolvimento de aplicativos mobile cross-platform com React Native e Flutter. Publicação e manutenção de apps na App Store e Google Play com mais de 100 mil usuários.'},{id:'exp2',role:'Desenvolvedor Mobile',org:'InovaMobile',date:'2019 — 2021',desc:'Desenvolvimento de apps Android nativos com Kotlin. Implementação de funcionalidades offline, push notifications e integração com REST APIs.'}],
            education:[{id:'ed1',course:'Ciência da Computação',inst:'UFMG — Belo Horizonte',date:'2015 — 2019',desc:'Bacharelado com ênfase em desenvolvimento mobile e computação móvel.'}],
            skills:[{id:'react-native',label:'React Native',pct:90},{id:'flutter',label:'Flutter',pct:85},{id:'kotlin',label:'Kotlin',pct:80},{id:'swift',label:'Swift',pct:70},{id:'firebase',label:'Firebase',pct:85},{id:'graphql',label:'GraphQL',pct:75},{id:'git',label:'Git',pct:85},{id:'uiux',label:'UI/UX Mobile',pct:75}],
            projects:[{id:'pg1',lang:'React Native',label:'SOCIAL APP',desc:'Aplicativo de rede social com chat em tempo real, stories e feed algorítmico. 100 mil downloads na Google Play.',url:'play.google.com/socialapp'},{id:'pg2',lang:'Flutter',label:'FITNESS TRACKER',desc:'App de tracking fitness com GPS, gráficos de progresso e integração com Apple Health / Google Fit.',url:'apps.apple.com/fitnesstracker'},{id:'pg3',lang:'Kotlin',label:'E-COMMERCE APP',desc:'Aplicativo de e-commerce com carrinho, pagamento integrado e rastreamento de pedidos.',url:'play.google.com/ecommerceapp'}]},
          c: { theme:'professional', cc:{accent:'#06b6d4'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid3', bs:'pill', br:'large', bx:'light', asb:'yes' } },
        { id: 'data-scientist', label: 'Cientista de Dados', desc: 'Clean com púrpura analítico. Para área de dados.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title:'Cientista de Dados',about:'Cientista de dados com expertise em machine learning, análise estatística e visualização de dados. Transforma dados brutos em insights acionáveis para negócios.',location:'São Paulo, SP',
            experience:[{id:'exp1',role:'Cientista de Dados',org:'DataDriven Analytics — SP',date:'2021 — Presente',desc:'Desenvolvimento de modelos de machine learning para predição de churn, segmentação de clientes e recomendação. Processamento de grandes volumes de dados com Spark e Airflow.'},{id:'exp2',role:'Analista de Dados',org:'Consultoria em Dados',date:'2018 — 2021',desc:'Análise exploratória de dados, criação de dashboards no Power BI e automatização de relatórios. SQL avançado e modelagem dimensional.'}],
            education:[{id:'ed1',course:'Estatística',inst:'UFPR — Curitiba',date:'2014 — 2018',desc:'Bacharelado em estatística com ênfase em aprendizado de máquina e ciência de dados.'},{id:'ed2',course:'MBA em Data Science',inst:'USP/Esalq',date:'2020 — 2022',desc:'Especialização em machine learning, big data e business analytics.'}],
            skills:[{id:'python',label:'Python',pct:95},{id:'ml',label:'Machine Learning',pct:90},{id:'sql',label:'SQL',pct:90},{id:'spark',label:'PySpark',pct:80},{id:'tensorflow',label:'TensorFlow / PyTorch',pct:85},{id:'powerbi',label:'Power BI',pct:85},{id:'stats',label:'Estatística',pct:90},{id:'airflow',label:'Airflow',pct:75}],
            projects:[{id:'pg1',lang:'Python / ML',label:'MODELO DE CHURN',desc:'Modelo preditivo de churn com precisão de 92%. Redução de 25% na taxa de cancelamento de clientes.',url:''},{id:'pg2',lang:'PySpark',label:'PIPELINE DE DADOS',desc:'Pipeline de processamento de dados com PySpark processando 50 TB/dia para análises de negócio.',url:''},{id:'pg3',lang:'Power BI',label:'DASHBOARD EXECUTIVO',desc:'Dashboard executivo com KPIs em tempo real para tomada de decisão da diretoria.',url:''}]},
          c: { theme:'minimal', cc:{accent:'#7c3aed'}, font:'system', fw:'normal', fs:'normal', ts:'normal', ta:'justify', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'list', bs:'flat', br:'small', bx:'light', asb:'no', ss:'normal' } },
        { id: 'oss-contributor', label: 'Open Source Contributor', desc: 'Verde-escuro estilo Git. Para contribuidor OSS.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title:'Desenvolvedor Open Source',about:'Contribuidor ativo de projetos open source com commits em repositórios como Linux, Python e Godot. Defensor do software livre e código aberto.',location:'São Paulo, SP',
            experience:[{id:'exp1',role:'Desenvolvedor Open Source',org:'Comunidade Open Source',date:'2020 — Presente',desc:'Contribuidor ativo de projetos como Python (CPython), Godot Engine e diversas bibliotecas JavaScript. Mais de 500 commits em repositórios de código aberto.'},{id:'exp2',role:'Mantenedor de Pacotes',org:'npm / PyPI',date:'2019 — Presente',desc:'Manutenção de 3 bibliotecas open source com milhões de downloads semanais. Revisão de PRs e gestão de releases.'}],
            education:[{id:'ed1',course:'Ciência da Computação',inst:'UNICAMP — Campinas',date:'2015 — 2020',desc:'Bacharelado com iniciação científica em linguagens de programação e compiladores.'}],
            skills:[{id:'python',label:'Python',pct:95},{id:'cpp',label:'C / C++',pct:80},{id:'javascript',label:'JavaScript',pct:85},{id:'git',label:'Git Avançado',pct:95},{id:'rust',label:'Rust',pct:70},{id:'compiladores',label:'Compiladores',pct:65},{id:'docs',label:'Documentação Técnica',pct:85},{id:'code-review',label:'Code Review',pct:90}],
            projects:[{id:'pg1',lang:'Python / C',label:'CPYTHON CONTRIBUTIONS',desc:'Contribuições para o CPython incluindo otimizações de performance e correções no parser.',url:'github.com/python/cpython'},{id:'pg2',lang:'GDScript',label:'GODOT ENGINE',desc:'Contribuidor da Godot Engine com implementações de novas funcionalidades e correções de bugs no core.',url:'github.com/godotengine/godot'},{id:'pg3',lang:'JavaScript',label:'NPM LIBRARY',desc:'Autor e mantenedor de biblioteca de utilitários JavaScript com 2 milhões de downloads/semana.',url:'npmjs.com/package/mylib'}]},
          c: { theme:'nature', cc:{accent:'#2d8a4e', bg:'#f0faf0'}, font:'mono', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'outline', br:'small', bx:'light', asb:'no' } },
        { id: 'tech-lead', label: 'Tech Lead', desc: 'Profissional e maduro. Para liderança técnica.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title:'Tech Lead',about:'Tech lead com experiência em liderança técnica de squads ágeis. Responsável por arquitetura, code reviews, mentoria e definição de padrões de engenharia.',location:'São Paulo, SP',
            experience:[{id:'exp1',role:'Tech Lead',org:'Plataforma Digital S.A. — SP',date:'2022 — Presente',desc:'Liderança técnica de squad com 8 desenvolvedores. Definição de arquitetura, code reviews, mentoria e planejamento de sprints. Responsável por decisões técnicas e qualidade do código.'},{id:'exp2',role:'Desenvolvedor Sênior',org:'ProdutoTech',date:'2019 — 2022',desc:'Desenvolvimento de features complexas, refatoração de sistemas legados e definição de padrões de engenharia. Participação em entrevistas técnicas e onboarding.'}],
            education:[{id:'ed1',course:'Engenharia da Computação',inst:'POLI-USP — São Paulo',date:'2013 — 2018',desc:'Bacharelado com ênfase em engenharia de software e gestão de projetos.'}],
            skills:[{id:'lideranca',label:'Liderança Técnica',pct:90},{id:'arquitetura',label:'Arquitetura de Software',pct:90},{id:'agile',label:'Metodologias Ágeis',pct:95},{id:'java',label:'Java / Spring',pct:85},{id:'react',label:'React',pct:80},{id:'cloud',label:'Cloud Architecture',pct:80},{id:'mentoria',label:'Mentoria',pct:85},{id:'comunicacao',label:'Comunicação Técnica',pct:90}],
            projects:[{id:'pg1',lang:'Java / Spring',label:'PLATAFORMA DE PAGAMENTOS',desc:'Arquitetura e liderança técnica de plataforma de pagamentos processando R$ 100 milhões/mês.',url:''},{id:'pg2',lang:'React / Node.js',label:'REFATORAÇÃO MONOLITO',desc:'Liderança de refatoração de monólito para microsserviços com aumento de 3x na velocidade de deploys.',url:''},{id:'pg3',lang:'Equipe',label:'MENTORIA INTERNA',desc:'Criação de programa de mentoria técnica interna com 15 mentorados promovidos em 2 anos.',url:''}]},
          c: { theme:'professional', cc:{accent:'#2563eb'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'flat', br:'small', bx:'light', asb:'no', ss:'normal' } },
        { id: 'cybersecurity', label: 'Cibersegurança', desc: 'Escuro com vermelho. Estilo hacker profissional.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title:'Analista de Cibersegurança',about:'Especialista em segurança ofensiva e defensiva. Expertise em pentest, análise de vulnerabilidades, SOC e conformidade com LGPD e ISO 27001.',location:'Brasília, DF',
            experience:[{id:'exp1',role:'Analista de Cibersegurança',org:'SecureTech Brasil — SP',date:'2021 — Presente',desc:'Realização de pentests em aplicações web e mobile, análise de vulnerabilidades e elaboração de relatórios técnicos. Gestão de programa de bug bounty.'},{id:'exp2',role:'Analista SOC',org:'Proteção Digital S.A.',date:'2019 — 2021',desc:'Monitoramento e resposta a incidentes de segurança em SIEM Splunk. Análise forense digital e contenção de ameaças.'}],
            education:[{id:'ed1',course:'Segurança da Informação',inst:'Fatec — São Paulo',date:'2015 — 2019',desc:'Tecnólogo em segurança da informação com certificações CEH e CompTIA Security+.'}],
            skills:[{id:'pentest',label:'Pentest',pct:90},{id:'redes',label:'Redes',pct:85},{id:'linux',label:'Linux',pct:90},{id:'python',label:'Python (Security)',pct:80},{id:'splunk',label:'Splunk / SIEM',pct:85},{id:'forense',label:'Análise Forense',pct:75},{id:'cloud-sec',label:'Cloud Security',pct:80},{id:'lgpd',label:'LGPD / ISO 27001',pct:70}],
            projects:[{id:'pg1',lang:'Segurança',label:'RESPOSTA A INCIDENTES',desc:'Coordenação de resposta a incidente de ransomware em empresa de médio porte com recuperação total de dados.',url:''},{id:'pg2',lang:'Pentest',label:'PENTEST WEB APP',desc:'Pentest em aplicação financeira com identificação de 12 vulnerabilidades críticas e relatório detalhado.',url:''},{id:'pg3',lang:'Automação',label:'AUTOMAÇÃO DE SEGURANÇA',desc:'Scripts automatizados de varredura e hardening para ambientes cloud utilizando Python e Terraform.',url:'github.com/sec/automation'}]},
          c: { theme:'dark', cc:{accent:'#dc2626', bg:'#0a0a0a', primary:'#e0e0e0'}, font:'mono', fw:'bold', fs:'sm', ts:'normal', anim:'none', bgp:'grid', bgpo:12, ha:'left', hs:'compact', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no' } },
        { id: 'ai-ml-engineer', label: 'Engenheiro AI/ML', desc: 'Futurista com púrpura neon. Para inteligência artificial.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title:'Engenheiro de IA / ML',about:'Engenheiro de inteligência artificial especializado em NLP, visão computacional e modelos generativos. Experiência com PyTorch, TensorFlow e LLMs.',location:'São Paulo, SP',
            experience:[{id:'exp1',role:'Engenheiro de IA',org:'AILab Solutions — SP',date:'2022 — Presente',desc:'Desenvolvimento de modelos de NLP e visão computacional para produtos de IA generativa. Fine-tuning de LLMs, implementação de RAG e deploys em produção com MLflow.'},{id:'exp2',role:'Pesquisador em ML',org:'Lab de IA — Universidade',date:'2020 — 2022',desc:'Pesquisa em deep learning aplicado a processamento de linguagem natural. Publicação de artigos em conferências nacionais.'}],
            education:[{id:'ed1',course:'Ciência da Computação',inst:'UFSC — Florianópolis',date:'2015 — 2020',desc:'Bacharelado com iniciação científica em inteligência artificial.'},{id:'ed2',course:'Mestrado em IA',inst:'UFSC',date:'2021 — 2023',desc:'Pesquisa em modelos generativos e NLP com publicação em conferência internacional.'}],
            skills:[{id:'python',label:'Python',pct:95},{id:'pytorch',label:'PyTorch',pct:90},{id:'tensorflow',label:'TensorFlow',pct:85},{id:'nlp',label:'NLP / LLMs',pct:90},{id:'cv',label:'Visão Computacional',pct:80},{id:'mlops',label:'MLOps',pct:75},{id:'docker',label:'Docker',pct:80},{id:'sql',label:'SQL',pct:70}],
            projects:[{id:'pg1',lang:'Python / PyTorch',label:'CHATBOT COM RAG',desc:'Chatbot com arquitetura RAG para suporte ao cliente utilizando LLM fine-tunado e busca vetorial.',url:'github.com/ai/rag-chatbot'},{id:'pg2',lang:'Python / TensorFlow',label:'DETECÇÃO DE OBJETOS',desc:'Modelo de detecção de objetos em tempo real para inspeção industrial com precisão de 97%.',url:''},{id:'pg3',lang:'NLP',label:'ANÁLISE DE SENTIMENTO',desc:'Sistema de análise de sentimento em redes sociais processando 1 milhão de posts/dia em português.',url:''}]},
          c: { theme:'dark', cc:{accent:'#a855f7', primary:'#e0e0e0'}, font:'system', fw:'normal', fs:'normal', ts:'large', anim:'fade', bgp:'dots', bgpo:10, ha:'center', hs:'detailed', cw:'wide', pl:'grid3', bs:'pill', br:'large', bx:'light', asb:'yes' } },
      ]
    },
    {
      label: '🎨 Design', id: 'cat-design',
      presets: [
        { id: 'ui-ux-designer', label: 'UI/UX Designer', desc: 'Limpo, espaçoso, minimalista. O padrão de design.',
          s: ['header','about','experience','skills','projects','contact'],
          sample: {title:'UI/UX Designer',about:'Designer de produto com foco em experiência do usuário e interfaces funcionais. Especialista em Figma, design systems e pesquisa com usuários.',location:'São Paulo, SP',
            experience:[{id:'exp1',role:'UI/UX Designer',org:'DesignStudio — SP',date:'2021 — Presente',desc:'Design de interfaces e experiência do usuário para produtos digitais. Criação de design systems, protótipos interativos no Figma e pesquisa com usuários. Testes de usabilidade e iterações baseadas em dados.'},{id:'exp2',role:'Product Designer',org:'StartupTech',date:'2019 — 2021',desc:'Design de produto para plataforma SaaS com foco em conversão e retenção. Condução de entrevistas com usuários e validação de hipóteses.'}],
            skills:[{id:'figma',label:'Figma',pct:95},{id:'ui',label:'UI Design',pct:90},{id:'ux',label:'UX Research',pct:85},{id:'prototype',label:'Prototipagem',pct:90},{id:'design-system',label:'Design Systems',pct:85},{id:'usabilidade',label:'Testes de Usabilidade',pct:80},{id:'html',label:'HTML / CSS',pct:75},{id:'ilustracao',label:'Ilustração',pct:70}],
            projects:[{id:'pg1',lang:'Figma',label:'APP DE FINANÇAS',desc:'Design de aplicativo financeiro com mais de 500 mil usuários. Responsável pelo redesign completo da interface.',url:'figma.com/community/financeapp'},{id:'pg2',lang:'Design System',label:'DS CORPORATIVO',desc:'Criação de design system completo com 100+ componentes, documentação e guia de estilos.',url:'designsystem.com'},{id:'pg3',lang:'UX',label:'PESQUISA UX',desc:'Pesquisa com 200 usuários para validação de novo fluxo de onboarding com 40% de aumento na conversão.',url:''}]},
          c: { theme:'minimal', cc:{accent:'#6366f1'}, font:'system', fw:'normal', fs:'normal', ts:'large', anim:'slide', bgp:'none', ha:'left', hs:'detailed', cw:'wide', pl:'grid3', bs:'pill', br:'normal', bx:'light', asb:'no', ss:'spacious' } },
        { id: 'graphic-designer', label: 'Designer Gráfico', desc: 'Criativo com cores fortes. Para portfólio visual.',
          s: ['header','about','experience','skills','projects','contact'],
          sample: {title:'Designer Gráfico',about:'Designer gráfico com portfólio em branding, editorial e identidade visual. Crio soluções visuais que comunicam e conectam marcas com seus públicos.',location:'Rio de Janeiro, RJ',
            experience:[{id:'exp1',role:'Designer Gráfico',org:'Agência Criativa — RJ',date:'2020 — Presente',desc:'Criação de identidades visuais, peças publicitárias e materiais editoriais. Direção de arte para campanhas impressas e digitais de marcas nacionais.'},{id:'exp2',role:'Designer Pleno',org:'Estúdio de Design',date:'2017 — 2020',desc:'Desenvolvimento de branding, embalagens e materiais promocionais. Atendimento a clientes dos segmentos de moda, alimentação e cultura.'}],
            skills:[{id:'photoshop',label:'Photoshop',pct:95},{id:'illustrator',label:'Illustrator',pct:90},{id:'indesign',label:'InDesign',pct:85},{id:'branding',label:'Branding',pct:90},{id:'tipografia',label:'Tipografia',pct:85},{id:'aftereffects',label:'After Effects',pct:70},{id:'figma',label:'Figma',pct:75},{id:'prepress',label:'Pré-impressão',pct:80}],
            projects:[{id:'pg1',lang:'Branding',label:'IDENTIDADE VISUAL — REDE DE CAFÉS',desc:'Criação de identidade visual completa para rede de cafeterias com 15 unidades.',url:'behance.net/project/coffee-brand'},{id:'pg2',lang:'Editorial',label:'REVISTA CULTURAL',desc:'Projeto gráfico e diagramação de revista cultural com tiragem mensal de 10 mil exemplares.',url:''},{id:'pg3',lang:'Embalagem',label:'LINHA DE PRODUTOS',desc:'Design de embalagens para linha de produtos naturais com premiação no Prêmio ABRE 2023.',url:''}]},
          c: { theme:'sunset', cc:{accent:'#f97316'}, font:'system', fw:'bold', fs:'normal', ts:'large', anim:'slide', bgp:'dots', bgpo:10, ha:'center', hs:'detailed', cw:'wide', pl:'grid3', bs:'pill', br:'large', bx:'light', asb:'yes' } },
        { id: 'product-designer', label: 'Product Designer', desc: 'Elegante, moderno, focado no produto.',
          s: ['header','about','experience','skills','projects','contact'],
          sample: {title:'Product Designer',about:'Product designer com pensamento estratégico e foco em resultados de negócio. Experiência em produtos digitais do discovery à entrega final.',location:'São Paulo, SP',
            experience:[{id:'exp1',role:'Product Designer',org:'Produto Digital S.A. — SP',date:'2021 — Presente',desc:'Design de produto digital focado em resultados de negócio. Condução de discovery, definição de métricas de sucesso e prototipação de soluções para plataforma SaaS B2B.'},{id:'exp2',role:'UX Designer',org:'Agência Digital',date:'2019 — 2021',desc:'Design de interfaces e fluxos de usuário para aplicativos mobile e web. Pesquisa qualitativa e testes A/B.'}],
            skills:[{id:'figma',label:'Figma',pct:95},{id:'product',label:'Product Design',pct:90},{id:'uxr',label:'UX Research',pct:85},{id:'prototype',label:'Prototipagem',pct:90},{id:'analytics',label:'Product Analytics',pct:80},{id:'agile',label:'Metodologias Ágeis',pct:85},{id:'design-thinking',label:'Design Thinking',pct:90},{id:'html-css',label:'HTML / CSS',pct:70}],
            projects:[{id:'pg1',lang:'Product Design',label:'PLATAFORMA B2B',desc:'Redesign de plataforma B2B com aumento de 35% na retenção de usuários e redução de 50% no tempo de tarefa.',url:''},{id:'pg2',lang:'UX Research',label:'DISCOVERY DE PRODUTO',desc:'Processo de discovery para novo produto digital com entrevistas, testes de conceito e validação com 100+ usuários.',url:''},{id:'pg3',lang:'Design System',label:'SISTEMA DE DESIGN',desc:'Evolução e manutenção de design system utilizado por 10 squads de produto.',url:''}]},
          c: { theme:'minimal', cc:{accent:'#0891b2'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'flat', br:'small', bx:'light', asb:'no' } },
        { id: 'motion-designer', label: 'Motion Designer', desc: 'Escuro com acento vibrante. Para animação/motion.',
          s: ['header','about','experience','skills','projects','contact'],
          sample: {title:'Motion Designer',about:'Motion designer especializado em animação 2D/3D, vinhetas e vídeos explicativos. Domínio de After Effects, Cinema 4D e animação para redes sociais.',location:'São Paulo, SP',
            experience:[{id:'exp1',role:'Motion Designer',org:'Estúdio de Animação — SP',date:'2021 — Presente',desc:'Criação de animações 2D e 3D para publicidade, branded content e redes sociais. Pós-produção com After Effects e Cinema 4D.'},{id:'exp2',role:'Animador',org:'Produtora Audiovisual',date:'2019 — 2021',desc:'Produção de vinhetas, aberturas de programas e vídeos explicativos animados para TV e web.'}],
            skills:[{id:'aftereffects',label:'After Effects',pct:95},{id:'cinema4d',label:'Cinema 4D',pct:85},{id:'premiere',label:'Premiere Pro',pct:80},{id:'ilustracao',label:'Ilustração Vetorial',pct:80},{id:'motion',label:'Motion Graphics',pct:95},{id:'3d',label:'Modelagem 3D',pct:70},{id:'som',label:'Sound Design',pct:65},{id:'projetos',label:'Gestão de Projetos',pct:75}],
            projects:[{id:'pg1',lang:'After Effects / C4D',label:'VINHETA REDE GLOBO',desc:'Produção de vinheta institucional para a Rede Globo com animação 3D e composição digital.',url:'vimeo.com/motion/vinheta'},{id:'pg2',lang:'Motion',label:'CAMPANHA PUBLICITÁRIA',desc:'Animação para campanha nacional de marca de bebidas com veiculação em TV aberta e digital.',url:''},{id:'pg3',lang:'Explicativo',label:'VÍDEO EXPLICATIVO SAAS',desc:'Série de vídeos explicativos animados para plataforma SaaS com roteiro e locução.',url:''}]},
          c: { theme:'dark', cc:{accent:'#f43f5e', primary:'#e0e0e0'}, font:'system', fw:'bold', fs:'normal', ts:'large', anim:'slide', bgp:'dots', bgpo:15, ha:'center', hs:'detailed', cw:'full', pl:'grid3', bs:'pill', br:'large', bx:'light', asb:'yes' } },
        { id: 'art-director', label: 'Diretor de Arte', desc: 'Premium com serifa. Para direção de arte.',
          s: ['header','about','experience','skills','projects','contact'],
          sample: {title:'Diretor de Arte',about:'Diretor de arte com experiência em campanhas publicitárias, direção criativa e produção visual. Direciono o conceito estético de marcas e projetos.',location:'São Paulo, SP',
            experience:[{id:'exp1',role:'Diretor de Arte',org:'Agência Full-service — SP',date:'2020 — Presente',desc:'Direção de arte para campanhas publicitárias 360°. Criação de conceitos visuais, direcionamento de equipes criativas e aprovação de peças para TV, impresso e digital.'},{id:'exp2',role:'Designer Sênior',org:'PubliBrasil',date:'2017 — 2020',desc:'Criação de peças gráficas e direção de arte para campanhas de grandes anunciantes nacionais.'}],
            skills:[{id:'direcao',label:'Direção de Arte',pct:95},{id:'photoshop',label:'Photoshop',pct:90},{id:'illustrator',label:'Illustrator',pct:85},{id:'branding',label:'Branding',pct:90},{id:'fotografia',label:'Direção de Fotografia',pct:80},{id:'tipografia',label:'Tipografia',pct:85},{id:'premiere',label:'Premiere',pct:70},{id:'lideranca',label:'Liderança Criativa',pct:85}],
            projects:[{id:'pg1',lang:'Arte',label:'CAMPANHA INSTITUCIONAL',desc:'Direção de arte de campanha institucional para banco com veiculação nacional em TV, OOH e digital.',url:''},{id:'pg2',lang:'Fotografia',label:'ENSAIO EDITORIAL',desc:'Direção de arte e fotografia para editorial de moda publicado em revista nacional.',url:''},{id:'pg3',lang:'Branding',label:'IDENTIDADE VISUAL MARCA DE LUXO',desc:'Criação de identidade visual para marca de luxo incluindo logo, papéis e materiais de ponto de venda.',url:''}]},
          c: { theme:'minimal', cc:{accent:'#1a1a2e', primary:'#000'}, font:'serif', fw:'bold', fs:'sm', ts:'large', anim:'fade', bgp:'none', ha:'center', hs:'detailed', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no' } },
      ]
    },
    {
      label: '🌐 Internet', id: 'cat-internet',
      presets: [
        { id: 'youtuber-streamer', label: 'YouTuber / Streamer', desc: 'Escuro com vermelho. Padrão para criador de conteúdo.',
          s: ['header','about','skills','projects','contact'],
          sample: {title: 'Criador de Conteúdo / Streamer', about: 'Criador de conteúdo com canal no YouTube e stream na Twitch. Produzo vídeos de games, tecnologia e lifestyle para uma comunidade de mais de 200 mil inscritos.', location: 'São Paulo, SP', skills: [{id:'edicao',label:'Edição de Vídeo',pct:95},{id:'youtube',label:'YouTube',pct:90},{id:'twitch',label:'Twitch',pct:85},{id:'roteiro',label:'Roteiro',pct:80},{id:'streaming',label:'Streaming (OBS)',pct:90},{id:'redes',label:'Redes Sociais',pct:85},{id:'marcas',label:'Parcerias com Marcas',pct:80},{id:'analytics',label:'YouTube Analytics',pct:75}], projects: [{id:'pg1',lang:'YouTube',label:'CANAL GAMING',desc:'Canal de gameplays e entretenimento com 500 mil inscritos e mais de 100 milhões de views.',url:'youtube.com/@gamer'},{id:'pg2',lang:'Twitch',label:'LIVE STREAMING',desc:'Live streams semanais de jogos e talk shows com comunidade engajada de mais de 10 mil seguidores.',url:'twitch.tv/streamer'},{id:'pg3',lang:'Conteúdo',label:'SÉRIE DOCUMENTAL',desc:'Série documental sobre história dos games com 5 episódios e parceria com serviço de streaming.',url:''}]},
          c: { theme:'dark', cc:{accent:'#ff0000', primary:'#e0e0e0'}, font:'system', fw:'bold', fs:'normal', ts:'large', anim:'slide', bgp:'dots', bgpo:12, ha:'center', hs:'detailed', cw:'wide', pl:'grid3', bs:'pill', br:'large', bx:'light', asb:'yes' } },
        { id: 'influencer', label: 'Influenciador Digital', desc: 'Moderno, clean, trendy. Para perfis de influência.',
          s: ['header','about','skills','projects','contact'],
          sample: {title: 'Influenciador Digital', about: 'Influenciador digital com presença em Instagram, TikTok e YouTube. Parcerias com marcas nacionais e internacionais em campanhas de moda, beleza e estilo de vida.', location: 'São Paulo, SP', skills: [{id:'instagram',label:'Instagram',pct:95},{id:'tiktok',label:'TikTok',pct:90},{id:'youtube',label:'YouTube',pct:80},{id:'conteudo',label:'Produção de Conteúdo',pct:90},{id:'fotografia',label:'Fotografia',pct:85},{id:'edicao',label:'Edição de Fotos/Vídeos',pct:85},{id:'marcas',label:'Negociação com Marcas',pct:90},{id:'relacionamento',label:'Relacionamento com Seguidores',pct:85}], projects: [{id:'pg1',lang:'Instagram',label:'PERFIL PRINCIPAL',desc:'Perfil no Instagram com 1 milhão de seguidores. Conteúdo de moda, beleza e lifestyle.',url:'instagram.com/influencer'},{id:'pg2',lang:'TikTok',label:'TIKTOK VIRAL',desc:'Perfil no TikTok com 3 milhões de seguidores e diversas trends virais criadas.',url:'tiktok.com/@influencer'},{id:'pg3',lang:'Campanha',label:'CAMPANHA NIKE',desc:'Campanha paga com Nike para lançamento de linha de sneakers com posts e stories.',url:''}]},
          c: { theme:'nature', cc:{accent:'#f472b6', bg:'#fff5f9'}, font:'system', fw:'normal', fs:'normal', ts:'large', anim:'slide', bgp:'none', ha:'center', hs:'detailed', cw:'normal', pl:'grid2', bs:'pill', br:'large', bx:'light', asb:'yes' } },
        { id: 'digital-nomad', label: 'Nômade Digital', desc: 'Claro e natural. Para quem trabalha viajando.',
          s: ['header','about','skills','projects','contact'],
          sample: {title: 'Nômade Digital', about: 'Profissional remoto que trabalha viajando o mundo. Experiência em trabalho distribuído, comunicação assíncrona e produtividade em movimento.', location: 'Nômade Digital', skills: [{id:'produtividade',label:'Produtividade Remota',pct:90},{id:'comunicacao',label:'Comunicação Assíncrona',pct:85},{id:'ingles',label:'Inglês Fluente',pct:95},{id:'freelancer',label:'Trabalho Freelancer',pct:85},{id:'tecnologia',label:'Ferramentas Digitais',pct:90},{id:'viagem',label:'Planejamento de Viagens',pct:80},{id:'financas',label:'Finanças Pessoais',pct:80},{id:'idiomas',label:'Idiomas (PT/EN/ES)',pct:85}], projects: [{id:'pg1',lang:'Estilo de Vida',label:'BLOG DE VIAGEM',desc:'Blog pessoal sobre estilo de vida nômade digital com relatos de mais de 30 países visitados.',url:'nomadblog.com'},{id:'pg2',lang:'Comunidade',label:'COMUNIDADE NÔMADE',desc:'Fundador de comunidade online com 5 mil nômades digitais brasileiros. Eventos e meetups organizados.',url:''},{id:'pg3',lang:'Curso',label:'CURSO TRABALHO REMOTO',desc:'Curso online sobre transição para trabalho remoto com mais de 2 mil alunos formados.',url:''}]},
          c: { theme:'nature', cc:{accent:'#2d8a4e', bg:'#f5faf5'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'flat', br:'small', bx:'light', asb:'no' } },
        { id: 'blogger-writer', label: 'Blogger / Escritor', desc: 'Serifado e elegante. Foco na leitura.',
          s: ['header','about','skills','projects','contact'],
          sample: {title: 'Blogger / Escritor', about: 'Escritor e blogger com textos publicados em veículos nacionais e internacionais. Autor de newsletter com mais de 10 mil assinantes sobre cultura e tecnologia.', location: 'São Paulo, SP', skills: [{id:'escrita',label:'Escrita Criativa',pct:95},{id:'edicao-texto',label:'Edição de Texto',pct:90},{id:'wordpress',label:'WordPress',pct:85},{id:'seo',label:'SEO',pct:80},{id:'pesquisa',label:'Pesquisa Jornalística',pct:85},{id:'newsletter',label:'Newsletter',pct:80},{id:'redes',label:'Redes Sociais',pct:75},{id:'fotografia',label:'Fotografia',pct:70}], projects: [{id:'pg1',lang:'Blog',label:'NEWSLETTER CULTURAL',desc:'Newsletter semanal sobre cultura e tecnologia com mais de 15 mil assinantes.',url:'substack.com/escritor'},{id:'pg2',lang:'Jornalismo',label:'REPORTAGEM PREMIADA',desc:'Série de reportagens sobre tecnologia e sociedade publicada em veículo nacional de grande circulação.',url:''},{id:'pg3',lang:'Livro',label:'LIVRO PUBLICADO',desc:'Autor de livro-reportagem sobre cultura digital lançado por editora universitária.',url:''}]},
          c: { theme:'minimal', cc:{accent:'#4a5568', bg:'#fefefe'}, font:'serif', fw:'normal', fs:'lg', ts:'normal', ta:'justify', lh:'relaxed', anim:'none', bgp:'none', ha:'left', hs:'detailed', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no' } },
        { id: 'podcaster', label: 'Podcaster', desc: 'Moderno e sonoro. Para perfis de podcast.',
          s: ['header','about','skills','projects','contact'],
          sample: {title: 'Podcaster', about: 'Podcaster e produtor de áudio com programa semanal sobre tecnologia e inovação. Mais de 100 episódios produzidos com convidados do mercado nacional.', location: 'São Paulo, SP', skills: [{id:'audio',label:'Produção de Áudio',pct:90},{id:'roteiro',label:'Roteiro',pct:85},{id:'edicao-audio',label:'Edição de Áudio',pct:90},{id:'entrevista',label:'Entrevista',pct:85},{id:'social',label:'Redes Sociais',pct:80},{id:'marcas',label:'Patrocínio / Marcas',pct:75},{id:'distribuicao',label:'Distribuição (Spotify/Apple)',pct:85},{id:'audiência',label:'Crescimento de Audiência',pct:80}], projects: [{id:'pg1',lang:'Podcast',label:'PODCAST SEMANAL',desc:'Podcast sobre tecnologia e inovação com mais de 150 episódios e 50 mil ouvintes por mês.',url:'open.spotify.com/podcast'},{id:'pg2',lang:'Conteúdo',label:'SÉRIE ESPECIAL',desc:'Série de 5 episódios sobre história da tecnologia no Brasil com convidados especiais.',url:''},{id:'pg3',lang:'Evento',label:'LIVE DE AUDIÊNCIA',desc:'Evento ao vivo com plateia e convidados para gravação de episódio especial de fim de ano.',url:''}]},
          c: { theme:'dark', cc:{accent:'#8b5cf6', bg:'#1a1a2e', primary:'#e0e0e0'}, font:'system', fw:'bold', fs:'normal', ts:'large', anim:'fade', bgp:'dots', bgpo:8, ha:'center', hs:'detailed', cw:'normal', pl:'grid2', bs:'pill', br:'normal', bx:'light', asb:'yes' } },
      ]
    },
    {
      label: '📱 Mídias Sociais', id: 'cat-social',
      presets: [
        { id: 'social-agency', label: 'Agência de Mídias Sociais', desc: 'Colorido e grade. Para agência de social media.',
          s: ['header','about','experience','skills','contact'],
          sample: {title: 'CEO - Agência de Mídias Sociais', about: 'CEO e fundador de agência de marketing digital com carteira de mais de 50 clientes. Especialista em estratégia de conteúdo, growth e gestão de equipes criativas.', location: 'São Paulo, SP', experience: [{id:'exp1',role:'CEO / Diretora de Estratégia',org:'Agência de Mídias Sociais — SP',date:'2019 — Presente',desc:'Fundadora e CEO de agência especializada em social media com carteira de mais de 50 marcas. Gestão de equipe de 20 profissionais entre criação, atendimento e estratégia.'},{id:'exp2',role:'Social Media Strategist',org:'Agência Full Service',date:'2016 — 2019',desc:'Estratégia de conteúdo para marcas de grande porte nos segmentos de moda, beleza e entretenimento.'}], skills: [{id:'estrategia',label:'Estratégia de Social Media',pct:95},{id:'gestao',label:'Gestão de Equipe',pct:90},{id:'instagram',label:'Instagram',pct:95},{id:'tiktok',label:'TikTok',pct:90},{id:'meta-ads',label:'Meta Ads',pct:85},{id:'analytics',label:'Social Analytics',pct:85},{id:'crise',label:'Gestão de Crise',pct:80},{id:'vendas',label:'Vendas Consultivas',pct:85}]},
          c: { theme:'sunset', cc:{accent:'#e1306c'}, font:'system', fw:'bold', fs:'normal', ts:'large', anim:'slide', bgp:'none', ha:'center', hs:'detailed', cw:'wide', pl:'grid3', bs:'pill', br:'normal', bx:'light', asb:'yes', ss:'spacious' } },
        { id: 'community-manager', label: 'Community Manager', desc: 'Acessível e amigável. Para gestão de comunidades.',
          s: ['header','about','experience','skills','contact'],
          sample: {title: 'Community Manager', about: 'Community manager com experiência em moderação, engajamento e crescimento de comunidades online. Gere comunidades de marcas com milhões de membros.', location: 'São Paulo, SP', experience: [{id:'exp1',role:'Community Manager',org:'Plataforma Digital — SP',date:'2021 — Presente',desc:'Gestão de comunidade online com mais de 500 mil membros em Discord, Telegram e Reddit. Criação de eventos, moderação e engajamento da comunidade.'},{id:'exp2',role:'Social Media Analyst',org:'Agência de Conteúdo',date:'2019 — 2021',desc:'Produção de conteúdo e moderação de comentários para marcas de grande porte. Atendimento ao cliente em redes sociais.'}], skills: [{id:'comunidade',label:'Gestão de Comunidades',pct:95},{id:'discord',label:'Discord',pct:90},{id:'moderacao',label:'Moderação',pct:85},{id:'eventos',label:'Organização de Eventos',pct:80},{id:'relacionamento',label:'Relacionamento',pct:90},{id:'analytics',label:'Community Analytics',pct:75},{id:'crise',label:'Gestão de Crise',pct:80},{id:'gamificacao',label:'Gamificação',pct:70}]},
          c: { theme:'nature', cc:{accent:'#3b82f6'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'pill', br:'normal', bx:'light', asb:'yes' } },
        { id: 'content-strategist', label: 'Estrategista de Conteúdo', desc: 'Organizado e profissional. Para estratégia digital.',
          s: ['header','about','experience','skills','contact'],
          sample: {title: 'Estrategista de Conteúdo', about: 'Estrategista de conteúdo digital com foco em marketing de conteúdo, SEO e brand journalism. Planejo e executo calendários editoriais para marcas e veículos.', location: 'São Paulo, SP', experience: [{id:'exp1',role:'Estrategista de Conteúdo',org:'Agência de Marketing Digital — SP',date:'2020 — Presente',desc:'Planejamento e execução de estratégias de conteúdo para marcas B2B e B2C. Definição de calendário editorial, SEO e distribuição multicanal.'},{id:'exp2',role:'Redator de Conteúdo',org:'Portal de Notícias',date:'2018 — 2020',desc:'Produção de artigos, reportagens e conteúdo para blog corporativo. SEO on-page e otimização de texto para mecanismos de busca.'}], skills: [{id:'conteudo',label:'Estratégia de Conteúdo',pct:95},{id:'seo',label:'SEO',pct:90},{id:'redacao',label:'Redação',pct:90},{id:'editorial',label:'Calendário Editorial',pct:85},{id:'analytics',label:'Content Analytics',pct:80},{id:'email',label:'Email Marketing',pct:75},{id:'linkedin',label:'LinkedIn',pct:80},{id:'vendas',label:'Conteúdo para Vendas',pct:75}]},
          c: { theme:'professional', cc:{accent:'#0ea5e9'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'flat', br:'small', bx:'light', asb:'no' } },
      ]
    },
    {
      label: '🏢 Outros', id: 'cat-other',
      presets: [
        { id: 'freelancer', label: 'Freelancer', desc: 'Versátil e moderno. Para profissionais autônomos.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title: 'Profissional Freelancer', about: 'Profissional autônomo com portfólio diversificado em desenvolvimento web, design gráfico e consultoria digital. Atendo clientes nacionais e internacionais.', location: 'São Paulo, SP', experience: [{id:'exp1',role:'Profissional Freelancer',org:'Autônomo',date:'2019 — Presente',desc:'Atendimento a clientes nacionais e internacionais em projetos de desenvolvimento web, design e consultoria. Gestão de pipeline de projetos e relacionamento com clientes.'},{id:'exp2',role:'Desenvolvedor Web',org:'Agência Digital',date:'2017 — 2019',desc:'Desenvolvimento de sites e landing pages sob medida. WordPress e HTML/CSS customizados.'}], education: [{id:'ed1',course:'Análise e Desenvolvimento de Sistemas',inst:'Fatec — SP',date:'2014 — 2018',desc:'Tecnólogo em desenvolvimento de sistemas com ênfase em web.'}], skills: [{id:'react',label:'React',pct:85},{id:'node',label:'Node.js',pct:80},{id:'wordpress',label:'WordPress',pct:90},{id:'design',label:'Web Design',pct:85},{id:'freela',label:'Gestão Freelancer',pct:80},{id:'clientes',label:'Relacionamento com Cliente',pct:85},{id:'git',label:'Git',pct:80},{id:'ingles',label:'Inglês',pct:75}], projects: [{id:'pg1',lang:'React / Node.js',label:'PORTFÓLIO FREELANCER',desc:'Portfólio com mais de 50 projetos entregues para clientes em todo o Brasil.',url:'freelancer.portfolio'},{id:'pg2',lang:'WordPress',label:'E-COMMERCE WORDPRESS',desc:'Loja virtual WordPress com WooCommerce para cliente do segmento de moda.',url:''},{id:'pg3',lang:'Landing Page',label:'LANDING PAGES CONVERSÃO',desc:'Landing pages otimizadas para conversão com taxa média de lead gen de 15%.',url:''}]},
          c: { theme:'professional', cc:{accent:'#6366f1'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'pill', br:'normal', bx:'light', asb:'no' } },
        { id: 'agency-owner', label: 'Dono de Agência', desc: 'Premium e confiável. Para donos de agência.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title: 'CEO - Agência Digital', about: 'Empreendedor e CEO de agência digital full-service. Lidero equipes de criação, tecnologia e marketing para entregar resultados para grandes marcas.', location: 'São Paulo, SP', experience: [{id:'exp1',role:'CEO / Fundador',org:'Agência Digital Full-service — SP',date:'2018 — Presente',desc:'Fundador e CEO de agência digital com equipe de 30 profissionais. Atendimento a marcas nacionais e internacionais em estratégia digital, criação e tecnologia.'},{id:'exp2',role:'Diretor de Negócios',org:'Agência de Publicidade',date:'2015 — 2018',desc:'Gestão de contas-chave e prospecção de novos negócios. Crescimento de carteira de R$ 500k para R$ 3M/ano.'}], education: [{id:'ed1',course:'Publicidade e Propaganda',inst:'ESPM — São Paulo',date:'2011 — 2015',desc:'Bacharelado com ênfase em negócios e comunicação integrada.'}], skills: [{id:'gestao',label:'Gestão Empresarial',pct:90},{id:'vendas',label:'Vendas B2B',pct:95},{id:'lideranca',label:'Liderança',pct:90},{id:'estratégia',label:'Estratégia Digital',pct:85},{id:'financas',label:'Gestão Financeira',pct:80},{id:'marketing',label:'Marketing Digital',pct:85},{id:'rh',label:'Gestão de Pessoas',pct:80},{id:'negociacao',label:'Negociação',pct:90}], projects: [{id:'pg1',lang:'Gestão',label:'EXPANSÃO AGÊNCIA',desc:'Crescimento da agência de 5 para 30 colaboradores em 4 anos com faturamento de R$ 5M anuais.',url:''},{id:'pg2',lang:'Resultados',label:'CLIENTES NACIONAIS',desc:'Atendimento a marcas como Nike, Itaú e Ambev em projetos de marketing digital e branding.',url:''},{id:'pg3',lang:'Inovação',label:'LABORATÓRIO DE INOVAÇÃO',desc:'Criação de laboratório interno de inovação com foco em IA aplicada ao marketing.',url:''}]},
          c: { theme:'professional', cc:{accent:'#1e3a5f'}, font:'system', fw:'bold', fs:'normal', ts:'large', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'narrow', pl:'list', bs:'flat', br:'small', bx:'light', asb:'no' } },
        { id: 'nonprofit', label: 'Terceiro Setor', desc: 'Acolhedor e natural. Para ONGs e projetos sociais.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title: 'Coordenador de Projetos Sociais', about: 'Profissional do terceiro setor dedicado a projetos de impacto social. Experiência em gestão de ONGs, captação de recursos e desenvolvimento comunitário.', location: 'São Paulo, SP', experience: [{id:'exp1',role:'Coordenador de Projetos Sociais',org:'ONG Transformar — SP',date:'2020 — Presente',desc:'Coordenação de projetos de impacto social nas áreas de educação e tecnologia. Gestão de equipe multidisciplinar e captação de recursos via editais e parcerias.'},{id:'exp2',role:'Assistente de Projetos',org:'Instituto Social ABC',date:'2017 — 2020',desc:'Apoio na implementação de programas sociais e elaboração de relatórios para financiadores.'}], education: [{id:'ed1',course:'Serviço Social',inst:'PUC — São Paulo',date:'2013 — 2017',desc:'Bacharelado com ênfase em gestão de projetos sociais e políticas públicas.'}], skills: [{id:'gestao-projetos',label:'Gestão de Projetos',pct:90},{id:'captacao',label:'Captação de Recursos',pct:85},{id:'relatorios',label:'Relatórios Sociais',pct:85},{id:'voluntarios',label:'Gestão de Voluntários',pct:80},{id:'comunidade',label:'Desenvolvimento Comunitário',pct:85},{id:'editais',label:'Editais / Leis de Incentivo',pct:80},{id:'lideranca',label:'Liderança',pct:80},{id:'comunicacao',label:'Comunicação Social',pct:85}], projects: [{id:'pg1',lang:'Social',label:'PROJETO INCLUSÃO DIGITAL',desc:'Programa de inclusão digital que atendeu mais de 2 mil jovens em comunidades periféricas.',url:''},{id:'pg2',lang:'Captação',label:'CAPTAÇÃO RECORDISTA',desc:'Campanha de captação que arrecadou R$ 500 mil em crowdfunding para projeto educacional.',url:''},{id:'pg3',lang:'Parceria',label:'PARCEIRIA ESTRATÉGICA',desc:'Firmamento de parceria com empresa de tecnologia para doação de equipamentos e bolsas de estudo.',url:''}]},
          c: { theme:'nature', cc:{accent:'#059669'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'flat', br:'small', bx:'light', asb:'no' } },
        { id: 'educator', label: 'Educador / Professor', desc: 'Sóbrio e acadêmico. Para currículo de professor.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title: 'Professor / Educador', about: 'Professor universitário e pesquisador com experiência em docência no ensino superior. Especialista em metodologias ativas e educação mediada por tecnologia.', location: 'Campinas, SP', experience: [{id:'exp1',role:'Professor Universitário',org:'Universidade Federal — SP',date:'2020 — Presente',desc:'Docência em cursos de graduação nas áreas de engenharia e computação. Orientação de TCC e iniciação científica.'},{id:'exp2',role:'Professor Ensino Técnico',org:'Instituto Federal',date:'2017 — 2020',desc:'Professor de programação e sistemas embarcados para cursos técnicos de informática.'}], education: [{id:'ed1',course:'Licenciatura em Computação',inst:'UNESP — Rio Claro',date:'2013 — 2017',desc:'Licenciatura com ênfase em educação mediada por tecnologia.'},{id:'ed2',course:'Mestrado em Educação',inst:'UNESP',date:'2018 — 2020',desc:'Pesquisa em metodologias ativas e gamificação no ensino de programação.'}], skills: [{id:'docencia',label:'Docência',pct:95},{id:'metodologias',label:'Metodologias Ativas',pct:90},{id:'programacao',label:'Programação',pct:80},{id:'ead',label:'EaD',pct:85},{id:'pesquisa',label:'Pesquisa Acadêmica',pct:80},{id:'orientacao',label:'Orientação',pct:85},{id:'avaliacao',label:'Avaliação',pct:90},{id:'extensao',label:'Extensão Universitária',pct:75}], projects: [{id:'pg1',lang:'Educação',label:'PROJETO DE EXTENSÃO',desc:'Projeto de extensão em escolas públicas com oficinas de programação para 500 alunos.',url:''},{id:'pg2',lang:'Pesquisa',label:'ARTIGO PUBLICADO',desc:'Artigo sobre gamificação no ensino publicado em revista Qualis A1.',url:''},{id:'pg3',lang:'Curso',label:'CURSO ONLINE ABERTO',desc:'Criação de curso online gratuito de lógica de programação com mais de 10 mil alunos matriculados.',url:''}]},
          c: { theme:'minimal', cc:{accent:'#4f46e5'}, font:'serif', fw:'normal', fs:'normal', ts:'normal', ta:'justify', anim:'none', bgp:'none', ha:'left', hs:'detailed', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no' } },
        { id: 'researcher', label: 'Pesquisador / Cientista', desc: 'Formal e limpo. Para publicações acadêmicas.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title: 'Pesquisador Científico', about: 'Pesquisador com artigos publicados em periódicos internacionais. Áreas de interesse incluem computação, sistemas complexos e ciência de dados aplicada.', location: 'São Paulo, SP', experience: [{id:'exp1',role:'Pesquisador Científico',org:'Laboratório de Pesquisa — SP',date:'2020 — Presente',desc:'Pesquisa em sistemas complexos e ciência de dados aplicada. Publicação de artigos em periódicos e conferências internacionais.'},{id:'exp2',role:'Cientista de Dados',org:'Centro de Pesquisa Aplicada',date:'2017 — 2020',desc:'Análise de grandes volumes de dados científicos e desenvolvimento de modelos preditivos para projetos de pesquisa.'}], education: [{id:'ed1',course:'Física Computacional',inst:'USP — São Carlos',date:'2012 — 2016',desc:'Bacharelado com iniciação científica em modelagem de sistemas complexos.'},{id:'ed2',course:'Doutorado em Ciência da Computação',inst:'USP',date:'2017 — 2022',desc:'Tese sobre aprendizado de máquina aplicado a sistemas dinâmicos não lineares.'}], skills: [{id:'python',label:'Python',pct:90},{id:'matlab',label:'MATLAB',pct:85},{id:'estatistica',label:'Estatística Avançada',pct:90},{id:'ml',label:'Machine Learning',pct:85},{id:'escrita',label:'Escrita Científica',pct:90},{id:'publicacoes',label:'Publicações',pct:85},{id:'apresentacao',label:'Apresentação Acadêmica',pct:85},{id:'ingles',label:'Inglês Científico',pct:95}], projects: [{id:'pg1',lang:'Pesquisa',label:'ARTIGO PERIÓDICO A1',desc:'Publicação de artigo em periódico internacional de alto impacto sobre aprendizado de máquina.',url:'sciencedirect.com/paper'},{id:'pg2',lang:'Conferência',label:'APRESENTAÇÃO INTERNACIONAL',desc:'Apresentação de trabalho no NeurIPS 2023 sobre modelos generativos aplicados à física.',url:''},{id:'pg3',lang:'Dados',label:'BASE DE DADOS PÚBLICA',desc:'Disponibilização de base de dados científicos de acesso aberto para a comunidade acadêmica.',url:''}]},
          c: { theme:'minimal', cc:{accent:'#1e40af'}, font:'serif', fw:'normal', fs:'sm', ts:'normal', ta:'justify', lh:'relaxed', anim:'none', bgp:'none', ha:'left', hs:'detailed', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no' } },
        { id: 'architect', label: 'Arquiteto', desc: 'Geométrico e minimalista. Para portfólio de arquitetura.',
          s: ['header','about','experience','skills','projects','contact'],
          sample: {title: 'Arquiteto', about: 'Arquiteto com projetos residenciais, comerciais e institucionais. Especialista em design sustentável, BIM e visualização arquitetônica 3D.', location: 'São Paulo, SP', experience: [{id:'exp1',role:'Arquiteto',org:'Escritório de Arquitetura — SP',date:'2020 — Presente',desc:'Projetos residenciais, comerciais e institucionais com foco em design sustentável. Modelagem BIM e coordenação de equipes multidisciplinares.'},{id:'exp2',role:'Arquiteto Júnior',org:'Estúdio de Arquitetura',date:'2017 — 2020',desc:'Elaboração de projetos executivos, maquetes eletrônicas e acompanhamento de obras.'}], skills: [{id:'autocad',label:'AutoCAD',pct:95},{id:'revit',label:'Revit (BIM)',pct:90},{id:'sketchup',label:'SketchUp',pct:85},{id:'lumion',label:'Lumion / Render',pct:80},{id:'sustentavel',label:'Arquitetura Sustentável',pct:85},{id:'obra',label:'Acompanhamento de Obra',pct:80},{id:'lideranca',label:'Coordenação de Equipe',pct:75},{id:'design',label:'Design de Interiores',pct:70}], projects: [{id:'pg1',lang:'BIM',label:'PROJETO RESIDENCIAL — ALTO PADRÃO',desc:'Projeto de residência de alto padrão com 800m², certificação LEED e sistema de energia solar.',url:''},{id:'pg2',lang:'Comercial',label:'ESPAÇO CORPORATIVO',desc:'Projeto de retrofit de edifício corporativo de 20 andares com conceito open office e áreas verdes.',url:''},{id:'pg3',lang:'Social',label:'HABITAÇÃO POPULAR',desc:'Projeto de conjunto habitacional com 200 unidades utilizando técnicas construtivas sustentáveis.',url:''}]},
          c: { theme:'minimal', cc:{accent:'#4a4a4a', primary:'#2d2d2d'}, font:'system', fw:'light', fs:'normal', ts:'large', anim:'fade', bgp:'grid', bgpo:8, ha:'left', hs:'compact', cw:'wide', pl:'grid3', bs:'flat', br:'none', bx:'none', asb:'no' } },
        { id: 'photographer', label: 'Fotógrafo', desc: 'Escuro com foco no conteúdo visual.',
          s: ['header','about','experience','skills','projects','contact'],
          sample: {title: 'Fotógrafo Profissional', about: 'Fotógrafo especializado em retratos, ensaios e fotografia de eventos. Portfólio com trabalhos para marcas, editoriais e coberturas de grandes eventos.', location: 'Rio de Janeiro, RJ', experience: [{id:'exp1',role:'Fotógrafo Profissional',org:'Autônomo — RJ',date:'2019 — Presente',desc:'Ensaios fotográficos, cobertura de eventos e produções editoriais para marcas e veículos. Pós-produção e direção de luz.'},{id:'exp2',role:'Assistente de Fotografia',org:'Estúdio Fotográfico',date:'2016 — 2019',desc:'Assistência em ensaios de moda e still. Organização de acervo e edição de imagens.'}], skills: [{id:'fotografia',label:'Fotografia',pct:95},{id:'lightroom',label:'Lightroom',pct:90},{id:'photoshop',label:'Photoshop',pct:85},{id:'iluminacao',label:'Iluminação',pct:90},{id:'composicao',label:'Composição',pct:90},{id:'video',label:'Vídeo',pct:70},{id:'negocios',label:'Gestão de Negócios',pct:75},{id:'redes',label:'Redes Sociais',pct:80}], projects: [{id:'pg1',lang:'Fotografia',label:'ENSAIO EDITORIAL VOGUE',desc:'Ensaio editorial publicado na Vogue Brasil com direção de moda e styling.',url:''},{id:'pg2',lang:'Evento',label:'COBERTURA ROCK IN RIO',desc:'Cobertura fotográfica oficial do Rock in Rio 2024 para revista de música.',url:''},{id:'pg3',lang:'Still',label:'PRODUÇÃO DE STILL',desc:'Fotografia de produtos para catálogo de marca de cosméticos com mais de 100 imagens.',url:''}]},
          c: { theme:'dark', cc:{accent:'#fbbf24', bg:'#0d0d0d', primary:'#e0e0e0'}, font:'system', fw:'light', fs:'sm', ts:'large', anim:'fade', bgp:'none', ha:'center', hs:'minimal', cw:'full', pl:'grid3', bs:'flat', br:'none', bx:'none', asb:'no', ss:'spacious' } },
        { id: 'consultant', label: 'Consultor', desc: 'Profissional e direto. Para consultorias diversas.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title: 'Consultor', about: 'Consultor empresarial com expertise em estratégia, processos e transformação digital. Atendo empresas de médio e grande porte em projetos de consultoria.', location: 'São Paulo, SP', experience: [{id:'exp1',role:'Consultor',org:'Consultoria Estratégica — SP',date:'2020 — Presente',desc:'Consultoria empresarial em estratégia, processos e transformação digital. Atendimento a empresas de médio e grande porte em diversos setores.'},{id:'exp2',role:'Analista de Estratégia',org:'Empresa de Consultoria',date:'2017 — 2020',desc:'Diagnóstico organizacional, mapeamento de processos e elaboração de planos de ação para melhoria de resultados.'}], education: [{id:'ed1',course:'Administração de Empresas',inst:'FGV — São Paulo',date:'2013 — 2017',desc:'Bacharelado com ênfase em consultoria empresarial e gestão estratégica.'}], skills: [{id:'diagnostico',label:'Diagnóstico Organizacional',pct:90},{id:'processos',label:'Mapeamento de Processos',pct:90},{id:'estrategia',label:'Planejamento Estratégico',pct:85},{id:'apresentacao',label:'Apresentação Executiva',pct:90},{id:'excel',label:'Excel Avançado',pct:85},{id:'projetos',label:'Gestão de Projetos',pct:80},{id:'negociacao',label:'Negociação',pct:80},{id:'data',label:'Análise de Dados',pct:75}], projects: [{id:'pg1',lang:'Consultoria',label:'REESTRUTURAÇÃO DE PROCESSOS',desc:'Projeto de reestruturação de processos que resultou em economia de R$ 5 milhões anuais.',url:''},{id:'pg2',lang:'Estratégia',label:'PLANO DE CRESCIMENTO',desc:'Elaboração de plano estratégico de crescimento para empresa do setor varejista com projeção de 30% de aumento de receita.',url:''},{id:'pg3',lang:'Digital',label:'TRANSFORMAÇÃO DIGITAL',desc:'Roadmap de transformação digital para indústria de médio porte com implementação de ERP e CRM.',url:''}]},
          c: { theme:'professional', cc:{accent:'#1a56db'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'list', bs:'flat', br:'small', bx:'light', asb:'no', ss:'compact' } },
        { id: 'remote-worker', label: 'Trabalhador Remoto', desc: 'Funcional e limpo. Para profissionais home office.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title: 'Profissional Remoto', about: 'Trabalhador remoto experiente em home office e equipes distribuídas. Domino ferramentas de colaboração remota, comunicação assíncrona e produtividade.', location: 'São Paulo, SP', experience: [{id:'exp1',role:'Profissional Remoto',org:'Empresa Global — Remoto',date:'2021 — Presente',desc:'Trabalho remoto para empresa internacional como desenvolvedor full-stack. Comunicação assíncrona com equipe distribuída em 10 fusos horários.'},{id:'exp2',role:'Desenvolvedor',org:'Startup Brasileira — Remoto',date:'2019 — 2021',desc:'Desenvolvimento remoto de aplicações web para startup em regime home office.'}], education: [{id:'ed1',course:'Ciência da Computação',inst:'Universidade Federal — SP',date:'2015 — 2019',desc:'Bacharelado com ênfase em trabalho remoto e ferramentas colaborativas.'}], skills: [{id:'comunicacao',label:'Comunicação Assíncrona',pct:90},{id:'react',label:'React',pct:85},{id:'node',label:'Node.js',pct:80},{id:'ingles',label:'Inglês Fluente',pct:95},{id:'produtividade',label:'Produtividade',pct:90},{id:'git',label:'Git',pct:90},{id:'agile',label:'Metodologias Ágeis',pct:85},{id:'ferramentas',label:'Ferramentas Remotas',pct:90}], projects: [{id:'pg1',lang:'Remoto',label:'PROJETO GLOBAL',desc:'Desenvolvimento de feature crítica para plataforma global com equipe distribuída em 4 continentes.',url:''},{id:'pg2',lang:'Ferramentas',label:'GUIA TRABALHO REMOTO',desc:'Criação de guia de boas práticas para trabalho remoto adotado por empresa de 500 funcionários.',url:''},{id:'pg3',lang:'Comunidade',label:'COMUNIDADE REMOTO BR',desc:'Fundador de comunidade de profissionais remotos brasileiros com 10 mil membros.',url:''}]},
          c: { theme:'professional', cc:{accent:'#6366f1'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'flat', br:'small', bx:'none', asb:'no' } },
        { id: 'junior-dev', label: 'Desenvolvedor Júnior', desc: 'Moderno e acessível. Para quem está começando.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title: 'Desenvolvedor Júnior', about: 'Desenvolvedor em início de carreira com entusiasmo por tecnologia e aprendizado contínuo. Conhecimentos em JavaScript, Python, React e Git.', location: 'São Paulo, SP', experience: [{id:'exp1',role:'Desenvolvedor Júnior',org:'TechCompany — SP',date:'2023 — Presente',desc:'Desenvolvimento de features para plataforma web utilizando React e Node.js. Participação em code reviews e squads ágeis.'},{id:'exp2',role:'Estagiário em Desenvolvimento',org:'Startup de Tecnologia',date:'2022 — 2023',desc:'Apoio no desenvolvimento de aplicações web e automação de testes. Aprendizado de React, TypeScript e Git.'}], education: [{id:'ed1',course:'Análise e Desenvolvimento de Sistemas',inst:'Fatec — São Paulo',date:'2021 — 2024',desc:'Tecnólogo em desenvolvimento de sistemas com projetos em React e Node.js.'}], skills: [{id:'javascript',label:'JavaScript',pct:80},{id:'react',label:'React',pct:75},{id:'node',label:'Node.js',pct:70},{id:'html',label:'HTML / CSS',pct:85},{id:'git',label:'Git',pct:80},{id:'typescript',label:'TypeScript',pct:65},{id:'sql',label:'SQL',pct:70},{id:'agile',label:'Scrum',pct:75}], projects: [{id:'pg1',lang:'React / Node.js',label:'PROJETO ACADÊMICO',desc:'Sistema de gestão de tarefas desenvolvido como TCC com React, Node.js e MongoDB.',url:'github.com/junior/taskmanager'},{id:'pg2',lang:'JavaScript',label:'PORTFÓLIO PESSOAL',desc:'Site portfólio pessoal com projetos, blog e integração com GitHub API.',url:'juniorportfolio.dev'},{id:'pg3',lang:'React',label:'CLONE DE APLICATIVO',desc:'Clone funcional do Trello com drag-and-drop, autenticação e persistência de dados.',url:'github.com/junior/trelloclone'}]},
          c: { theme:'professional', cc:{accent:'#3b82f6'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'dots', bgpo:10, ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'pill', br:'normal', bx:'light', asb:'yes' } },
        { id: 'senior-engineer', label: 'Engenheiro Sênior', desc: 'Maduro e refinado. Para experiência sênior.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title: 'Engenheiro de Software Sênior', about: 'Engenheiro de software sênior com mais de 10 anos de experiência em arquitetura de sistemas, liderança técnica e entrega de produtos de alta qualidade.', location: 'São Paulo, SP', experience: [{id:'exp1',role:'Engenheiro de Software Sênior',org:'Grande Empresa de Tecnologia — SP',date:'2019 — Presente',desc:'Arquitetura e desenvolvimento de sistemas de alta disponibilidade. Mentoria de desenvolvedores plenos e juniores. Liderança técnica em projetos estratégicos.'},{id:'exp2',role:'Desenvolvedor Sênior',org:'Plataforma Digital',date:'2015 — 2019',desc:'Desenvolvimento de features complexas e refatoração de sistemas legados. Participação em entrevistas técnicas.'}], education: [{id:'ed1',course:'Ciência da Computação',inst:'USP — São Paulo',date:'2009 — 2013',desc:'Bacharelado com ênfase em engenharia de software e sistemas distribuídos.'}], skills: [{id:'java',label:'Java',pct:95},{id:'spring',label:'Spring Boot',pct:90},{id:'cloud',label:'Cloud Computing',pct:85},{id:'micro-servicos',label:'Microsserviços',pct:90},{id:'sql',label:'SQL Avançado',pct:90},{id:'arquitetura',label:'Arquitetura de Software',pct:95},{id:'lideranca',label:'Liderança Técnica',pct:90},{id:'mentoria',label:'Mentoria',pct:85}], projects: [{id:'pg1',lang:'Java / Spring',label:'PLATAFORMA DE ALTA DISPONIBILIDADE',desc:'Arquitetura de plataforma com 99.99% de uptime processando 1 milhão de requisições/minuto.',url:''},{id:'pg2',lang:'Cloud',label:'MIGRAÇÃO PARA NUVEM',desc:'Migração de infraestrutura on-premise para AWS com redução de 40% nos custos operacionais.',url:''},{id:'pg3',lang:'Mentoria',label:'PROGRAMA DE MENTORIA',desc:'Mentoria de 20 desenvolvedores plenos para senioridade com taxa de promoção de 90%.',url:''}]},
          c: { theme:'minimal', cc:{accent:'#374151'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'none', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no', ss:'compact' } },
        { id: 'clevel-exec', label: 'C-Level Executivo', desc: 'Escuro premium com dourado. Para CEO/CTO/CFO.',
          s: ['header','about','experience','education','skills','projects','contact'],
          sample: {title: 'CEO / CTO', about: 'Executivo C-Level com experiência em liderança de empresas de tecnologia. Especialista em estratégia de negócios, captação de investimento e gestão de alta performance.', location: 'São Paulo, SP', experience: [{id:'exp1',role:'CEO',org:'Empresa de Tecnologia — SP',date:'2018 — Presente',desc:'CEO e fundador de empresa de tecnologia com faturamento de R$ 20M anuais. Gestão de equipe de 100 colaboradores. Captação de investimento Série A.'},{id:'exp2',role:'CTO',org:'Startup de Fintech',date:'2015 — 2018',desc:'CTO responsável pela estratégia tecnológica e equipe de engenharia. Construção do produto do zero ao market fit.'}], education: [{id:'ed1',course:'Engenharia da Computação',inst:'ITA — São José dos Campos',date:'2006 — 2010',desc:'Bacharelado em engenharia com ênfase em negócios e inovação.'},{id:'ed2',course:'MBA Executivo',inst:'Stanford Graduate School of Business',date:'2017 — 2019',desc:'MBA executivo com foco em liderança, estratégia e empreendedorismo.'}], skills: [{id:'lideranca',label:'Liderança Executiva',pct:95},{id:'estrategia',label:'Estratégia de Negócios',pct:95},{id:'captacao',label:'Captação de Investimento',pct:85},{id:'financas',label:'Finanças',pct:80},{id:'gestao',label:'Gestão de Pessoas',pct:90},{id:'produto',label:'Estratégia de Produto',pct:85},{id:'negociacao',label:'Negociação',pct:90},{id:'ingles',label:'Inglês Fluente',pct:95}], projects: [{id:'pg1',lang:'Negócios',label:'CAPTAÇÃO SÉRIE A',desc:'Captação de R$ 20 milhões em rodada Série A com fundos de venture capital nacionais e internacionais.',url:''},{id:'pg2',lang:'Crescimento',label:'EXPANSÃO NACIONAL',desc:'Expansão da operação para 5 estados brasileiros com crescimento de 300% em 2 anos.',url:''},{id:'pg3',lang:'Liderança',label:'CULTURA E PESSOAS',desc:'Construção de cultura organizacional com nota 95/100 no Great Place to Work.',url:''}]},
          c: { theme:'dark', cc:{accent:'#d4a017', bg:'#0a0a0a', primary:'#e0e0e0'}, font:'serif', fw:'bold', fs:'sm', ts:'large', anim:'fade', bgp:'none', ha:'center', hs:'detailed', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no' } },
      ]
    },
  ]

  // Expand shorthand preset config: apply non-undefined fields to a full config object
  function expandPresetConfig(shorthand) {
    var d = defaultConfig()
    var out = {
      theme: shorthand.theme !== undefined ? shorthand.theme : d.theme,
      font: shorthand.font || d.font,
      fontSize: shorthand.fs || d.fontSize,
      titleSize: shorthand.ts || d.titleSize,
      sectionTitleSize: shorthand.sts || d.sectionTitleSize,
      fontWeight: shorthand.fw || d.fontWeight,
      paragraphSpacing: shorthand.ps || d.paragraphSpacing,
      lineHeight: shorthand.lh || d.lineHeight,
      letterSpacing: shorthand.ls2 || d.letterSpacing,
      textAlign: shorthand.ta || d.textAlign,
      animation: shorthand.anim || d.animation,
      bgPattern: shorthand.bgp || d.bgPattern,
      bgPatternOpacity: shorthand.bgpo !== undefined ? shorthand.bgpo : d.bgPatternOpacity,
      customColors: {
        primary: (shorthand.cc && shorthand.cc.primary) || '',
        accent: (shorthand.cc && shorthand.cc.accent) || '',
        bg: (shorthand.cc && shorthand.cc.bg) || '',
        fontColor: (shorthand.cc && shorthand.cc.fontColor) || '',
        linkColor: (shorthand.cc && shorthand.cc.linkColor) || '',
        linkHoverColor: (shorthand.cc && shorthand.cc.linkHoverColor) || '',
        cardBg: (shorthand.cc && shorthand.cc.cardBg) || '',
        borderColor: (shorthand.cc && shorthand.cc.borderColor) || '',
      },
      header: {
        alignment: shorthand.ha || d.header.alignment,
        showLocation: shorthand.hsl || d.header.showLocation,
        showTitle: shorthand.hst || d.header.showTitle,
        showContact: shorthand.hsc || d.header.showContact,
      },
      layout: {
        contentWidth: shorthand.cw || d.layout.contentWidth,
        sectionSpacing: shorthand.ss || d.layout.sectionSpacing,
        gapSize: shorthand.gs || d.layout.gapSize,
        contentPadding: shorthand.cp || d.layout.contentPadding,
        headerStyle: shorthand.hs || d.layout.headerStyle,
        skillsLayout: shorthand.sl || d.layout.skillsLayout,
        projectsLayout: shorthand.pl || d.layout.projectsLayout,
        buttonStyle: shorthand.bs || d.layout.buttonStyle,
        listStyle: shorthand.ls || d.layout.listStyle,
        borderRadius: shorthand.br || d.layout.borderRadius,
        boxShadow: shorthand.bx || d.layout.boxShadow,
        altSectionBg: shorthand.asb || d.layout.altSectionBg,
        sectionBgColor: shorthand.sbgc || d.layout.sectionBgColor,
        showBorders: shorthand.sb !== undefined ? shorthand.sb : d.layout.showBorders,
        showDividers: shorthand.sd !== undefined ? shorthand.sd : d.layout.showDividers,
        showTopbar: shorthand.st !== undefined ? shorthand.st : d.layout.showTopbar,
        showFooter: shorthand.sf !== undefined ? shorthand.sf : d.layout.showFooter,
        showSkillPct: shorthand.ssp !== undefined ? shorthand.ssp : d.layout.showSkillPct,
      },
    }
    return out
  }

  function applyPresetConfig(presetFull) {
    if (presetFull.theme) {
      currentConfig.theme = presetFull.theme
      // Reset all custom colors so they fall back to new theme defaults.
      // Preset's explicit color overrides are re-applied below.
      var colorKeys = ['primary','accent','bg','fontColor','linkColor','linkHoverColor','cardBg','borderColor']
      colorKeys.forEach(function (k) { currentConfig.customColors[k] = '' })
    }
    var simple = ['font','fontSize','titleSize','sectionTitleSize','fontWeight','paragraphSpacing','lineHeight','letterSpacing','textAlign','animation','bgPattern','bgPatternOpacity']
    simple.forEach(function (f) {
      if (presetFull[f] !== undefined) currentConfig[f] = presetFull[f]
    })
    if (presetFull.customColors) {
      Object.keys(presetFull.customColors).forEach(function (k) {
        if (presetFull.customColors[k]) currentConfig.customColors[k] = presetFull.customColors[k]
      })
    }
    if (presetFull.header) {
      Object.keys(presetFull.header).forEach(function (k) {
        if (presetFull.header[k] !== undefined) currentConfig.header[k] = presetFull.header[k]
      })
    }
    if (presetFull.layout) {
      Object.keys(presetFull.layout).forEach(function (k) {
        if (presetFull.layout[k] !== undefined) currentConfig.layout[k] = presetFull.layout[k]
      })
    }
  }

  function applyPresetSections(ids) {
    currentConfig.sections.forEach(function (s) {
      s.visible = ids.indexOf(s.id) !== -1
    })
  }

  function applyPresetSample(sample) {
    if (sample.title !== undefined) currentConfig.content.title = sample.title
    if (sample.about !== undefined) currentConfig.content.about = sample.about
    if (sample.location !== undefined) currentConfig.content.location = sample.location
    if (sample.experience) currentConfig.content.experience = JSON.parse(JSON.stringify(sample.experience))
    if (sample.education) currentConfig.content.education = JSON.parse(JSON.stringify(sample.education))
    if (sample.skills) currentConfig.content.skills = JSON.parse(JSON.stringify(sample.skills))
    if (sample.projects) currentConfig.content.projects = JSON.parse(JSON.stringify(sample.projects))
  }

  var DEFAULT_SKILLS = [
    { id: 'python',     label: 'Python',       pct: 90 },
    { id: 'javascript', label: 'JavaScript',    pct: 85 },
    { id: 'typescript', label: 'TypeScript',    pct: 70 },
    { id: 'c',          label: 'C / C++',       pct: 65 },
    { id: 'java',       label: 'Java',          pct: 75 },
    { id: 'bash',       label: 'Bash',          pct: 80 },
    { id: 'git',        label: 'Git',           pct: 85 },
    { id: 'linux',      label: 'Linux',         pct: 85 },
    { id: 'docker',     label: 'Docker',        pct: 60 },
    { id: 'godot',      label: 'Godot',         pct: 55 },
    { id: 'arduino',    label: 'Arduino',       pct: 50 },
    { id: 'ncurses',    label: 'ncurses',       pct: 65 },
  ]

  // ── Default Config ──
  function defaultConfig() {
    return {
      theme: 'professional',
      customColors: { primary: '', accent: '', bg: '', fontColor: '', linkColor: '', linkHoverColor: '', cardBg: '', borderColor: '' },
      bgImage: '',
      bgPattern: 'none',
      bgPatternOpacity: 20,
      font: 'system',
      fontSize: 'normal',
      titleSize: 'normal',
      sectionTitleSize: 'normal',
      fontWeight: 'normal',
      paragraphSpacing: 'normal',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      textAlign: 'left',
      animation: 'fade',
      header: {
        alignment: 'left',
        showLocation: 'yes',
        showTitle: 'yes',
        showContact: 'yes',
        profileImage: '',
        profileImageSize: '80',
      },
      layout: {
        contentWidth: 'normal',
        sectionSpacing: 'normal',
        gapSize: 'normal',
        contentPadding: 'normal',
        headerStyle: 'detailed',
        skillsLayout: 'grid2',
        projectsLayout: 'grid2',
        buttonStyle: 'flat',
        listStyle: 'plain',
        borderRadius: 'none',
        boxShadow: 'none',
        altSectionBg: 'no',
        sectionBgColor: '#ffffff',
        showBorders: 'yes',
        showDividers: 'yes',
        showTopbar: 'yes',
        showFooter: 'yes',
        showSkillPct: 'yes',
      },
      sections: SECTION_IDS.map(function (s) { return { id: s.id, visible: true } }),
      content: {
        name: 'João Pedro Borges',
        title: 'Engenharia da Computação // Desenvolvedor Full-Stack // Criador de Jogos',
        location: 'Salvador, BA · 20 anos',
        about: 'Estudante de Engenharia da Computação e desenvolvedor full-stack com foco em Python, JavaScript e C. Construo desde ferramentas de terminal e bots até jogos e interfaces web. Apaixonado por tecnologia, código aberto e soluções criativas. Busco oportunidades onde possa aplicar minha versatilidade técnica e vontade de aprender para resolver problemas reais.',
        email: 'peuborges.dev@gmail.com',
        github: 'github.com/MCookinho',
        linkedin: 'linkedin.com/in/joaopedro',
        lang: 'pt',
        experience: [
          { id: 'exp1', role: 'Desenvolvedor Freelancer', org: 'Autônomo', date: '2022 — Presente', desc: 'Desenvolvimento de bots, scripts de automação, interfaces web e jogos indie. Clientes e projetos pessoais utilizando Python, JavaScript, C e GML.' },
          { id: 'exp2', role: 'Projetos Acadêmicos', org: 'Universidade — Eng. da Computação', date: '2023 — Presente', desc: 'Implementação de sistemas distribuídos com sockets e threads em Java, desenvolvimento de jogos em Godot e C++, e projetos de eletrônica com Arduino.' },
        ],
        education: [
          { id: 'edu1', course: 'Engenharia da Computação', inst: 'Universidade — Salvador, BA', date: '2023 — 2027', desc: 'Ênfase em desenvolvimento de software, sistemas embarcados e inteligência computacional.' },
        ],
        skills: JSON.parse(JSON.stringify(DEFAULT_SKILLS)),
        projects: [
          { id: 'hexfeed',    lang: 'Python',     label: 'HEXFEED',    desc: 'Rede social privada no terminal. Criptografado com Tor. TUI minimalista construída com ncurses.',        url: 'github.com/MCookinho/hexfeed' },
          { id: 'shellgame',  lang: 'C',          label: 'SHELLGAME',  desc: 'Coleção de jogos clássicos no terminal com ncurses. Port do FNAF incluído.',                            url: 'github.com/MCookinho/shellgame' },
          { id: 'mate-helper',lang: 'Python',     label: 'MATE-HELPER',desc: 'Desktop pet com IA. Um bichinho virtual inteligente que vive na sua tela.',                              url: 'github.com/MCookinho/mate-helper' },
          { id: 'letral',     lang: 'JavaScript', label: 'LETRAL',     desc: 'Wordle Battle Royale. Descubra a palavra secreta antes dos outros em pt-BR, en, es.',                    url: 'letral.wtf' },
          { id: 'catfishing', lang: 'GML',        label: 'CATFISHING', desc: 'Point & Click com combate por turno. Pesque e batalhe contra os peixes do aquário.',                    url: 'codecrusaders.itch.io/catfishing' },
        ],
        customSections: [],
      },
      pdf: {
        sections: SECTION_IDS.map(function (s) { return s.id }),
        margins: 'normal',
        fontSize: 'normal',
        pageSize: 'a4',
        color: 'color',
        includeTopbar: 'no',
      }
    }
  }

  // ── Load / Save / Encode ──
  function loadConfig() {
    var fromHash = loadConfigFromHash()
    if (fromHash) {
      saveConfig(fromHash)
      return fromHash
    }
    try {
      var raw = localStorage.getItem(CONFIG_KEY)
      if (raw) {
        var parsed = JSON.parse(raw)
        parsed = migrateConfig(parsed)
        return parsed
      }
    } catch (e) {}
    return defaultConfig()
  }

  function migrateConfig(cfg) {
    var d = defaultConfig()
    if (!cfg.customColors) cfg.customColors = d.customColors
    if (cfg.customColors && cfg.customColors.fontColor === undefined) cfg.customColors.fontColor = ''
    if (cfg.customColors && cfg.customColors.linkColor === undefined) cfg.customColors.linkColor = ''
    if (cfg.customColors && cfg.customColors.linkHoverColor === undefined) cfg.customColors.linkHoverColor = ''
    if (cfg.customColors && cfg.customColors.cardBg === undefined) cfg.customColors.cardBg = ''
    if (cfg.customColors && cfg.customColors.borderColor === undefined) cfg.customColors.borderColor = ''
    if (cfg.bgImage === undefined) cfg.bgImage = d.bgImage
    if (cfg.bgPattern === undefined) cfg.bgPattern = d.bgPattern
    if (cfg.bgPatternOpacity === undefined) cfg.bgPatternOpacity = d.bgPatternOpacity
    if (cfg.header) {
      var hd = d.header
      if (cfg.header.alignment === undefined) cfg.header.alignment = hd.alignment
      if (cfg.header.showLocation === undefined) cfg.header.showLocation = hd.showLocation
      if (cfg.header.showTitle === undefined) cfg.header.showTitle = hd.showTitle
      if (cfg.header.showContact === undefined) cfg.header.showContact = hd.showContact
      if (cfg.header.profileImage === undefined) cfg.header.profileImage = hd.profileImage
      if (cfg.header.profileImageSize === undefined) cfg.header.profileImageSize = hd.profileImageSize
    }
    if (cfg.titleSize === undefined) cfg.titleSize = d.titleSize
    if (cfg.sectionTitleSize === undefined) cfg.sectionTitleSize = d.sectionTitleSize
    if (cfg.fontWeight === undefined) cfg.fontWeight = d.fontWeight
    if (cfg.paragraphSpacing === undefined) cfg.paragraphSpacing = d.paragraphSpacing
    if (!cfg.header) cfg.header = JSON.parse(JSON.stringify(d.header))
    if (!cfg.layout) cfg.layout = JSON.parse(JSON.stringify(d.layout))
    if (cfg.layout.buttonStyle === undefined) cfg.layout.buttonStyle = d.layout.buttonStyle
    if (cfg.layout.listStyle === undefined) cfg.layout.listStyle = d.layout.listStyle
    if (cfg.layout.altSectionBg === undefined) cfg.layout.altSectionBg = d.layout.altSectionBg
    if (cfg.layout.sectionBgColor === undefined) cfg.layout.sectionBgColor = d.layout.sectionBgColor
    if (cfg.layout.gapSize === undefined) cfg.layout.gapSize = d.layout.gapSize
    if (cfg.layout.contentPadding === undefined) cfg.layout.contentPadding = d.layout.contentPadding
    if (cfg.layout.showBorders === undefined) cfg.layout.showBorders = d.layout.showBorders
    if (cfg.layout.showDividers === undefined) cfg.layout.showDividers = d.layout.showDividers
    if (!cfg.content) cfg.content = JSON.parse(JSON.stringify(d.content))
    if (!cfg.content.experience) cfg.content.experience = JSON.parse(JSON.stringify(d.content.experience))
    if (!cfg.content.education) cfg.content.education = JSON.parse(JSON.stringify(d.content.education))
    if (!cfg.content.skills) cfg.content.skills = JSON.parse(JSON.stringify(d.content.skills))
    if (!cfg.content.projects) cfg.content.projects = JSON.parse(JSON.stringify(d.content.projects))
    if (!cfg.content.customSections) cfg.content.customSections = []
    var existing = cfg.sections || []
    SECTION_IDS.forEach(function (s) {
      if (!existing.find(function (e) { return e.id === s.id })) {
        existing.push({ id: s.id, visible: true })
      }
    })
    cfg.sections = existing
    if (!cfg.pdf.sections) cfg.pdf.sections = SECTION_IDS.map(function (s) { return s.id })
    return cfg
  }

  function saveConfig(cfg) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg))
  }

  function encodeConfigToHash(cfg) {
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(cfg))))
    } catch (e) { return '' }
  }

  function decodeHashToConfig(hash) {
    try {
      return JSON.parse(decodeURIComponent(escape(atob(hash))))
    } catch (e) { return null }
  }

  function updateShareLink(cfg) {
    var encoded = encodeConfigToHash(cfg)
    if (encoded) {
      window.history.replaceState(null, '', '#' + encoded)
    }
  }

  function loadConfigFromHash() {
    var hash = window.location.hash.replace(/^#/, '')
    if (!hash) return null
    return decodeHashToConfig(hash)
  }

  // ── Apply Config ──
  function applyConfig(cfg) {
    var theme = THEMES[cfg.theme] || THEMES.professional
    document.body.className = document.body.className
      .replace(/theme-\w+/g, '')
      .replace(/font-\w+/g, '')
      .replace(/anim-\w+/g, '')
      .replace(/header-\w+/g, '')
      .replace(/skills-\w+/g, '')
      .replace(/proj-\w+/g, '')
      .replace(/hide-pct/g, '')
      .replace(/header-align-\w+/g, '')
      .replace(/bg-pattern-\w+/g, '')
      .replace(/has-bg-image/g, '')
      .replace(/button-\w+/g, '')
      .replace(/list-\w+/g, '')
      .trim()

    document.body.classList.add('theme-' + cfg.theme)
    document.body.classList.add('font-' + cfg.font)
    document.body.classList.add('anim-' + cfg.animation)
    document.body.classList.add('header-' + cfg.layout.headerStyle)
    document.body.classList.add('skills-' + cfg.layout.skillsLayout)
    document.body.classList.add('proj-' + cfg.layout.projectsLayout)
    document.body.classList.add('header-align-' + cfg.header.alignment)
    document.body.classList.add('bg-pattern-' + cfg.bgPattern)
    document.body.classList.add('button-' + cfg.layout.buttonStyle)
    document.body.classList.add('list-' + cfg.layout.listStyle)
    if (cfg.layout.showSkillPct === 'no') document.body.classList.add('hide-pct')
    if (cfg.bgImage) document.body.classList.add('has-bg-image')

    // Custom colors
    var p = cfg.customColors.primary || theme.primary
    var a = cfg.customColors.accent || theme.accent
    var b = cfg.customColors.bg || theme.bg
    var fc = cfg.customColors.fontColor || theme.text
    var lc = cfg.customColors.linkColor || ''
    var lhc = cfg.customColors.linkHoverColor || ''
    var cb = cfg.customColors.cardBg || ''
    var bc = cfg.customColors.borderColor || ''

    document.body.style.setProperty('--primary', p)
    document.body.style.setProperty('--accent', a)
    document.body.style.setProperty('--bg', b)
    document.body.style.setProperty('--text', fc)
    if (lc) document.body.style.setProperty('--link-color', lc)
    else document.body.style.removeProperty('--link-color')
    if (lhc) document.body.style.setProperty('--link-hover', lhc)
    else document.body.style.removeProperty('--link-hover')
    document.body.style.setProperty('--card', cb || lighten(b, 5))
    document.body.style.setProperty('--border', bc || lighten(p, 75))

    // Update link colors if custom
    if (lc) {
      document.querySelectorAll('.ph-contact a, .contact-item, .proj-link').forEach(function (el) {
        el.style.color = lc
      })
    } else {
      document.querySelectorAll('.ph-contact a, .contact-item, .proj-link').forEach(function (el) {
        el.style.color = ''
      })
    }

    // Background image
    if (cfg.bgImage) {
      document.body.style.setProperty('--bg-image-url', 'url(' + cfg.bgImage + ')')
    } else {
      document.body.style.removeProperty('--bg-image-url')
    }

    // Background pattern opacity
    document.body.style.setProperty('--bg-pattern-opacity', (cfg.bgPatternOpacity || 20) / 100)

    // Typography
    var fontSizeMap = { xs: '85%', sm: '93%', normal: '100%', lg: '108%', xl: '118%' }
    document.body.style.setProperty('--font-size', fontSizeMap[cfg.fontSize] || '100%')

    var titleSizeMap = { small: '24px', normal: '32px', large: '40px' }
    document.body.style.setProperty('--title-size', titleSizeMap[cfg.titleSize] || '32px')

    var secTitleSizeMap = { small: '11px', normal: '13px', large: '15px' }
    document.body.style.setProperty('--section-title-size', secTitleSizeMap[cfg.sectionTitleSize] || '13px')

    var fwMap = { light: '300', normal: '400', bold: '600' }
    document.body.style.setProperty('--font-weight', fwMap[cfg.fontWeight] || '400')

    var psMap = { compact: '0.5em', normal: '1em', spacious: '1.5em' }
    document.body.style.setProperty('--para-spacing', psMap[cfg.paragraphSpacing] || '1em')

    var lhMap = { tight: '1.4', normal: '1.6', relaxed: '1.9' }
    document.body.style.setProperty('--line-height', lhMap[cfg.lineHeight] || '1.6')

    var lsMap = { tight: '-0.02em', normal: '0', wide: '0.04em' }
    document.body.style.setProperty('--letter-spacing', lsMap[cfg.letterSpacing] || '0')

    document.body.style.setProperty('--text-align', cfg.textAlign || 'left')

    // Header
    document.body.style.setProperty('--header-show-location', cfg.header.showLocation === 'yes' ? 'block' : 'none')
    document.body.style.setProperty('--header-show-title', cfg.header.showTitle === 'yes' ? 'block' : 'none')
    document.body.style.setProperty('--header-show-contact', cfg.header.showContact === 'yes' ? 'flex' : 'none')
    document.body.style.setProperty('--profile-img-size', cfg.header.profileImageSize + 'px')

    // Profile image
    var existingImg = document.querySelector('.ph-profile-img')
    if (cfg.header.profileImage) {
      if (!existingImg) {
        var img = document.createElement('img')
        img.className = 'ph-profile-img'
        img.alt = 'Foto de perfil'
        var headerEl = document.getElementById('sec-header')
        var phTop = headerEl && headerEl.querySelector('.ph-top')
        if (phTop) phTop.insertBefore(img, phTop.firstChild)
      }
      var imgEl = document.querySelector('.ph-profile-img')
      if (imgEl) imgEl.src = cfg.header.profileImage
    } else if (existingImg) {
      existingImg.remove()
    }

    // Layout
    var cwMap = { narrow: '640px', normal: '720px', wide: '860px', full: '100%' }
    document.body.style.setProperty('--content-maxw', cwMap[cfg.layout.contentWidth] || '720px')

    var ssMap = { compact: '24px', normal: '40px', spacious: '60px' }
    document.body.style.setProperty('--sec-spacing', ssMap[cfg.layout.sectionSpacing] || '40px')

    var gapMap = { compact: '12px', normal: '24px', spacious: '36px' }
    document.body.style.setProperty('--gap-size', gapMap[cfg.layout.gapSize] || '24px')

    var padMap = { compact: '60px 24px 24px', normal: '80px 24px 40px', spacious: '100px 32px 60px' }
    document.body.style.setProperty('--content-padding', padMap[cfg.layout.contentPadding] || '80px 24px 40px')

    var brMap = { none: '0', small: '4', normal: '8', large: '12' }
    document.body.style.setProperty('--border-radius', brMap[cfg.layout.borderRadius] || '0')

    var shMap = { none: 'none', light: '0 1px 4px rgba(0,0,0,0.06)', normal: '0 2px 12px rgba(0,0,0,0.08)', strong: '0 4px 20px rgba(0,0,0,0.12)' }
    document.body.style.setProperty('--box-shadow', shMap[cfg.layout.boxShadow] || 'none')

    document.body.style.setProperty('--show-borders', cfg.layout.showBorders === 'yes' ? '1px' : '0px')
    document.body.style.setProperty('--show-dividers', cfg.layout.showDividers === 'yes' ? '1px' : '0px')

    // Alternate section backgrounds
    if (cfg.layout.altSectionBg === 'yes') {
      var bgColor = cfg.layout.sectionBgColor || lighten(b, 3)
      document.body.style.setProperty('--section-bg', bgColor)
      document.body.style.setProperty('--section-bg-padding', '16px 20px')
    } else {
      document.body.style.setProperty('--section-bg', 'transparent')
      document.body.style.setProperty('--section-bg-padding', '0')
    }

    // Topbar / Footer
    var topbar = document.getElementById('topbar')
    if (topbar) topbar.classList.toggle('hidden', cfg.layout.showTopbar === 'no')
    var footer = document.querySelector('.prof-footer')
    if (footer) footer.classList.toggle('hidden', cfg.layout.showFooter === 'no')

    // Sections visibility + order
    var main = document.getElementById('mainContent')
    var order = cfg.sections.filter(function (s) { return s.visible }).map(function (s) { return s.id })
    var sectionEls = {}
    SECTION_IDS.forEach(function (s) {
      var el = document.getElementById('sec-' + s.id)
      if (el) sectionEls[s.id] = el
    })
    order.forEach(function (id) {
      if (sectionEls[id]) main.appendChild(sectionEls[id])
    })
    cfg.sections.forEach(function (s) {
      var el = sectionEls[s.id]
      if (el) el.style.display = s.visible ? '' : 'none'
    })

    // Content
    applyContent(cfg.content)
  }

  function applyContent(content) {
    // Basic info
    var nameEl = document.getElementById('edit-name')
    if (nameEl) nameEl.textContent = content.name
    var titleEl = document.getElementById('edit-title')
    if (titleEl) titleEl.textContent = content.title
    var locEl = document.getElementById('edit-location')
    if (locEl) locEl.textContent = content.location
    var aboutEl = document.getElementById('edit-about')
    if (aboutEl) aboutEl.textContent = content.about

    // Contact links
    var fields = [
      { id: 'edit-email', field: 'email', isMail: true },
      { id: 'edit-email-link', field: 'email', isMail: true },
      { id: 'edit-github', field: 'github', isGithub: true },
      { id: 'edit-github-link', field: 'github', isGithub: true },
      { id: 'edit-linkedin', field: 'linkedin', isLinkedin: true },
      { id: 'edit-linkedin-link', field: 'linkedin', isLinkedin: true },
    ]
    fields.forEach(function (f) {
      var el = document.getElementById(f.id)
      if (!el) return
      var val = content[f.field] || ''
      el.textContent = val
      if (f.isMail) el.href = 'mailto:' + val
      else if (f.isGithub) el.href = 'https://' + val.replace(/^https?:\/\//, '')
      else if (f.isLinkedin) el.href = 'https://' + val.replace(/^https?:\/\//, '')
    })
    var wsEl = document.getElementById('edit-website')
    if (wsEl) wsEl.textContent = 'mcookinho.github.io'

    // Experience
    var expList = document.querySelector('.exp-list')
    if (expList && content.experience) {
      expList.innerHTML = ''
      content.experience.forEach(function (exp) {
        var item = document.createElement('div')
        item.className = 'exp-item'
        item.innerHTML =
          '<div class="exp-head"><span class="exp-role">' + escHtml(exp.role) + '</span><span class="exp-date">' + escHtml(exp.date) + '</span></div>' +
          '<span class="exp-org">' + escHtml(exp.org) + '</span>' +
          '<p class="exp-desc">' + escHtml(exp.desc) + '</p>'
        expList.appendChild(item)
      })
    }

    // Education
    var eduList = document.querySelector('.edu-list, #sec-education > div:not(.ps-title)')
    var eduContainer = document.querySelector('#sec-education')
    if (eduContainer && content.education) {
      var existingEduList = eduContainer.querySelector('.edu-list')
      if (!existingEduList) {
        existingEduList = document.createElement('div')
        existingEduList.className = 'edu-list'
        // insert after the title
        var title = eduContainer.querySelector('.ps-title')
        if (title) title.after(existingEduList)
        else eduContainer.appendChild(existingEduList)
      }
      existingEduList.innerHTML = ''
      content.education.forEach(function (edu) {
        var item = document.createElement('div')
        item.className = 'edu-item'
        item.innerHTML =
          '<div class="edu-head"><span class="edu-course">' + escHtml(edu.course) + '</span><span class="edu-date">' + escHtml(edu.date) + '</span></div>' +
          '<span class="edu-inst">' + escHtml(edu.inst) + '</span>' +
          '<p class="edu-desc">' + escHtml(edu.desc) + '</p>'
        existingEduList.appendChild(item)
      })
    }

    // Skills
    var skillsGrid = document.getElementById('skillsGrid')
    if (skillsGrid && content.skills) {
      var cats = [
        { title: 'LINGUAGENS', ids: ['python','javascript','typescript','c','java','bash'] },
        { title: 'FERRAMENTAS', ids: ['git','linux','docker','godot','arduino','ncurses'] },
      ]
      skillsGrid.innerHTML = ''
      cats.forEach(function (cat) {
        var div = document.createElement('div')
        div.className = 'skill-cat'
        var h3 = document.createElement('h3')
        h3.className = 'sc-title'
        h3.textContent = cat.title
        div.appendChild(h3)
        var list = document.createElement('div')
        list.className = 'skill-list'
        cat.ids.forEach(function (id) {
          var skill = content.skills.find(function (s) { return s.id === id })
          if (!skill) return
          var item = document.createElement('div')
          item.className = 'skill-item'
          item.innerHTML =
            '<span class="skill-name">' + escHtml(skill.label) + '</span>' +
            '<div class="skill-bar"><div class="skill-fill" style="width:' + skill.pct + '%"></div></div>' +
            '<span class="skill-pct">' + skill.pct + '%</span>'
          list.appendChild(item)
        })
        div.appendChild(list)
        skillsGrid.appendChild(div)
      })
    }

    // Custom sections
    var mainEl = document.getElementById('mainContent')
    if (mainEl && content.customSections) {
      mainEl.querySelectorAll('.prof-section[data-section^="custom-"]').forEach(function (el) { el.remove() })
      content.customSections.forEach(function (cs) {
        var div = document.createElement('section')
        div.className = 'prof-section'
        div.id = 'sec-custom-' + cs.id
        div.setAttribute('data-section', 'custom-' + cs.id)
        div.innerHTML = '<h2 class="ps-title">' + escHtml(cs.title || '') + '</h2><p class="ps-text">' + escHtml(cs.content || '') + '</p>'
        mainEl.appendChild(div)
      })
    }

    // Projects
    var projGrid = document.querySelector('.proj-grid')
    if (projGrid && content.projects) {
      projGrid.innerHTML = ''
      content.projects.forEach(function (proj) {
        var card = document.createElement('div')
        card.className = 'proj-card'
        card.innerHTML =
          '<div class="proj-head"><span class="proj-lang">' + escHtml(proj.lang) + '</span><span class="proj-name">' + escHtml(proj.label) + '</span></div>' +
          '<p class="proj-desc">' + escHtml(proj.desc) + '</p>' +
          '<a href="' + escAttr(proj.url) + '" target="_blank" class="proj-link">' + escHtml(proj.url) + '</a>'
        projGrid.appendChild(card)
      })
    }
  }

  function escHtml(str) {
    var d = document.createElement('div')
    d.textContent = str
    return d.innerHTML
  }
  function escAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  }

  function lighten(hex, pct) {
    if (!hex || hex[0] !== '#') return '#e0e0e0'
    var r = parseInt(hex.slice(1,3), 16)
    var g = parseInt(hex.slice(3,5), 16)
    var b = parseInt(hex.slice(5,7), 16)
    r = Math.min(255, r + Math.round((255 - r) * pct / 100))
    g = Math.min(255, g + Math.round((255 - g) * pct / 100))
    b = Math.min(255, b + Math.round((255 - b) * pct / 100))
    return 'rgb(' + r + ',' + g + ',' + b + ')'
  }

  // ── Animations ──
  function setupAnimations(cfg) {
    if (cfg.animation === 'none') {
      document.querySelectorAll('.prof-section, .prof-header, .prof-footer').forEach(function (el) {
        el.classList.add('visible')
      })
      return
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.prof-section, .prof-header, .prof-footer').forEach(function (el) {
      el.classList.remove('visible')
      observer.observe(el)
    })
  }

  // ── Topbar Toggle ──
  var topbarToggle = document.getElementById('topbarToggle')
  var topbarShowBtn = document.getElementById('topbarShowBtn')
  var topbarEl = document.getElementById('topbar')

  function syncTopbarToggle() {
    var hidden = topbarEl.classList.contains('hidden')
    topbarShowBtn.style.display = hidden ? 'block' : 'none'
  }
  if (topbarToggle) {
    topbarToggle.addEventListener('click', function () {
      var cfg = loadConfig()
      cfg.layout.showTopbar = 'no'
      saveConfig(cfg)
      config = cfg
      currentConfig = cfg
      topbarEl.classList.add('hidden')
      syncTopbarToggle()
    })
  }
  if (topbarShowBtn) {
    topbarShowBtn.addEventListener('click', function () {
      var cfg = loadConfig()
      cfg.layout.showTopbar = 'yes'
      saveConfig(cfg)
      config = cfg
      currentConfig = cfg
      topbarEl.classList.remove('hidden')
      syncTopbarToggle()
    })
  }

  // ── Init ──
  var config = loadConfig()
  applyConfig(config)
  setupAnimations(config)
  syncTopbarToggle()

  // ── Config Panel ──
  var overlay = document.getElementById('configOverlay')
  var currentConfig = loadConfig()

  function openPanel() {
    currentConfig = loadConfig()
    renderPanel(currentConfig)
    overlay.classList.add('open')
  }

  function closePanel() {
    overlay.classList.remove('open')
  }

  function renderPanel(cfg) {
    // Theme
    renderThemeGrid(cfg)
    document.getElementById('colorPrimary').value = cfg.customColors.primary || THEMES[cfg.theme].primary
    document.getElementById('colorAccent').value = cfg.customColors.accent || THEMES[cfg.theme].accent
    document.getElementById('colorBg').value = cfg.customColors.bg || THEMES[cfg.theme].bg
    document.getElementById('colorFont').value = cfg.customColors.fontColor || THEMES[cfg.theme].text
    document.getElementById('colorLink').value = cfg.customColors.linkColor || THEMES[cfg.theme].accent
    document.getElementById('colorLinkHover').value = cfg.customColors.linkHoverColor || THEMES[cfg.theme].accent
    document.getElementById('colorCard').value = cfg.customColors.cardBg || (THEMES[cfg.theme].bg ? lighten(THEMES[cfg.theme].bg, 5) : '#ffffff')
    document.getElementById('colorBorder').value = cfg.customColors.borderColor || lighten(THEMES[cfg.theme].primary, 75)
    document.getElementById('bgImageInput').value = cfg.bgImage || ''
    renderBtnGroup('bgPatternGroup', BG_PATTERNS, cfg.bgPattern, function (id) { currentConfig.bgPattern = id })
    document.getElementById('bgPatternOpacity').value = cfg.bgPatternOpacity || 20
    document.getElementById('bgPatternOpacityVal').textContent = (cfg.bgPatternOpacity || 20) + '%'
    renderBtnGroup('animGroup', ANIMS, cfg.animation, function (id) { currentConfig.animation = id })

    // Typography
    renderBtnGroup('fontGroup', FONTS, cfg.font, function (id) { currentConfig.font = id })
    renderBtnGroup('fontSizeGroup', FONT_SIZES, cfg.fontSize, function (id) { currentConfig.fontSize = id })
    renderBtnGroup('titleSizeGroup', TITLE_SIZES, cfg.titleSize, function (id) { currentConfig.titleSize = id })
    renderBtnGroup('sectionTitleSizeGroup', TITLE_SIZES, cfg.sectionTitleSize, function (id) { currentConfig.sectionTitleSize = id })
    renderBtnGroup('fontWeightGroup', FONT_WEIGHTS, cfg.fontWeight, function (id) { currentConfig.fontWeight = id })
    renderBtnGroup('paragraphSpacingGroup', PARA_SPACINGS, cfg.paragraphSpacing, function (id) { currentConfig.paragraphSpacing = id })
    renderBtnGroup('lineHeightGroup', LINE_HEIGHTS, cfg.lineHeight, function (id) { currentConfig.lineHeight = id })
    renderBtnGroup('letterSpacingGroup', LETTER_SPACINGS, cfg.letterSpacing, function (id) { currentConfig.letterSpacing = id })
    renderBtnGroup('textAlignGroup', TEXT_ALIGNS, cfg.textAlign, function (id) { currentConfig.textAlign = id })

    // Header
    renderBtnGroup('headerAlignGroup', HEADER_ALIGNS, cfg.header.alignment, function (id) { currentConfig.header.alignment = id })
    renderBtnGroup('showLocationGroup', YES_NO, cfg.header.showLocation, function (id) { currentConfig.header.showLocation = id })
    renderBtnGroup('showTitleGroup', YES_NO, cfg.header.showTitle, function (id) { currentConfig.header.showTitle = id })
    renderBtnGroup('showContactGroup', YES_NO, cfg.header.showContact, function (id) { currentConfig.header.showContact = id })
    document.getElementById('profileImageInput').value = cfg.header.profileImage || ''
    renderBtnGroup('profileImageSizeGroup', PROFILE_SIZES, cfg.header.profileImageSize, function (id) { currentConfig.header.profileImageSize = id })

    // Layout
    renderBtnGroup('contentWidthGroup', CONTENT_WIDTHS, cfg.layout.contentWidth, function (id) { currentConfig.layout.contentWidth = id })
    renderBtnGroup('sectionSpacingGroup', SECTION_SPACINGS, cfg.layout.sectionSpacing, function (id) { currentConfig.layout.sectionSpacing = id })
    renderBtnGroup('gapSizeGroup', GAP_SIZES, cfg.layout.gapSize, function (id) { currentConfig.layout.gapSize = id })
    renderBtnGroup('contentPaddingGroup', PADDING_SIZES, cfg.layout.contentPadding, function (id) { currentConfig.layout.contentPadding = id })
    renderBtnGroup('headerStyleGroup', HEADER_STYLES, cfg.layout.headerStyle, function (id) { currentConfig.layout.headerStyle = id })
    renderBtnGroup('skillsLayoutGroup', SKILLS_LAYOUTS, cfg.layout.skillsLayout, function (id) { currentConfig.layout.skillsLayout = id })
    renderBtnGroup('projectsLayoutGroup', PROJ_LAYOUTS, cfg.layout.projectsLayout, function (id) { currentConfig.layout.projectsLayout = id })
    renderBtnGroup('buttonStyleGroup', BUTTON_STYLES, cfg.layout.buttonStyle, function (id) { currentConfig.layout.buttonStyle = id })
    renderBtnGroup('listStyleGroup', LIST_STYLES, cfg.layout.listStyle, function (id) { currentConfig.layout.listStyle = id })
    renderBtnGroup('borderRadiusGroup', RADII, cfg.layout.borderRadius, function (id) { currentConfig.layout.borderRadius = id })
    renderBtnGroup('boxShadowGroup', SHADOWS, cfg.layout.boxShadow, function (id) { currentConfig.layout.boxShadow = id })
    renderBtnGroup('altSectionBgGroup', YES_NO, cfg.layout.altSectionBg, function (id) { currentConfig.layout.altSectionBg = id })
    document.getElementById('sectionBgColor').value = cfg.layout.sectionBgColor || '#ffffff'
    renderBtnGroup('showBordersGroup', YES_NO, cfg.layout.showBorders, function (id) { currentConfig.layout.showBorders = id })
    renderBtnGroup('showDividersGroup', YES_NO, cfg.layout.showDividers, function (id) { currentConfig.layout.showDividers = id })
    renderBtnGroup('showTopbarGroup', YES_NO, cfg.layout.showTopbar, function (id) { currentConfig.layout.showTopbar = id })
    renderBtnGroup('showFooterGroup', YES_NO, cfg.layout.showFooter, function (id) { currentConfig.layout.showFooter = id })
    renderBtnGroup('showSkillPctGroup', YES_NO, cfg.layout.showSkillPct, function (id) { currentConfig.layout.showSkillPct = id })

    // Sections
    renderSectionList(cfg.sections)

    // Content
    document.getElementById('editNameInput').value = cfg.content.name
    document.getElementById('editTitleInput').value = cfg.content.title
    document.getElementById('editLocationInput').value = cfg.content.location
    document.getElementById('editAboutInput').value = cfg.content.about
    document.getElementById('editEmailInput').value = cfg.content.email
    document.getElementById('editGithubInput').value = cfg.content.github
    document.getElementById('editLinkedinInput').value = cfg.content.linkedin
    renderBtnGroup('langGroup', LANGUAGES, cfg.content.lang, function (id) { currentConfig.content.lang = id })

    // Presets
    renderPresets()

    // Dynamic content editors
    renderContentEditors(cfg)
    renderCustomSectionEditors(cfg)

    // PDF
    renderPdfSectionList(cfg)
    renderBtnGroup('marginGroup', MARGINS, cfg.pdf.margins, function (id) { currentConfig.pdf.margins = id })
    renderBtnGroup('pdfFontGroup', PDF_FONTS, cfg.pdf.fontSize, function (id) { currentConfig.pdf.fontSize = id })
    renderBtnGroup('pageSizeGroup', PAGE_SIZES, cfg.pdf.pageSize, function (id) { currentConfig.pdf.pageSize = id })
    renderBtnGroup('pdfColorGroup', PDF_COLORS, cfg.pdf.color, function (id) { currentConfig.pdf.color = id })
    renderBtnGroup('pdfTopbarGroup', YES_NO, cfg.pdf.includeTopbar, function (id) { currentConfig.pdf.includeTopbar = id })
  }

  function renderContentEditors(cfg) {
    // Experience editor
    var expCont = document.getElementById('experienceEditContainer')
    if (expCont) {
      // Keep the label, add items after it
      var label = expCont.querySelector('.config-label')
      expCont.innerHTML = ''
      if (label) expCont.appendChild(label)
      cfg.content.experience.forEach(function (exp, i) {
        var box = document.createElement('div')
        box.className = 'config-content-item'
        box.innerHTML =
          '<div class="config-content-fields">' +
            '<div class="config-content-row"><span class="config-content-row-label">Cargo</span><input type="text" class="config-input exp-role-input" value="' + escAttr(exp.role) + '" /></div>' +
            '<div class="config-content-row"><span class="config-content-row-label">Empresa</span><input type="text" class="config-input exp-org-input" value="' + escAttr(exp.org) + '" /></div>' +
            '<div class="config-content-row"><span class="config-content-row-label">Data</span><input type="text" class="config-input exp-date-input" value="' + escAttr(exp.date) + '" /></div>' +
            '<div class="config-content-row"><span class="config-content-row-label">Descrição</span><input type="text" class="config-input exp-desc-input" value="' + escAttr(exp.desc) + '" /></div>' +
          '</div>'
        // Wire up inputs
        var inputs = box.querySelectorAll('input')
        inputs.forEach(function (input) {
          input.addEventListener('input', function () {
            var item = currentConfig.content.experience[i]
            if (!item) return
            var cls = input.className
            if (cls.indexOf('exp-role-input') !== -1) item.role = input.value
            else if (cls.indexOf('exp-org-input') !== -1) item.org = input.value
            else if (cls.indexOf('exp-date-input') !== -1) item.date = input.value
            else if (cls.indexOf('exp-desc-input') !== -1) item.desc = input.value
          })
        })
        expCont.appendChild(box)
      })
    }

    // Education editor
    var eduCont = document.getElementById('educationEditContainer')
    if (eduCont) {
      var label2 = eduCont.querySelector('.config-label')
      eduCont.innerHTML = ''
      if (label2) eduCont.appendChild(label2)
      cfg.content.education.forEach(function (edu, i) {
        var box = document.createElement('div')
        box.className = 'config-content-item'
        box.innerHTML =
          '<div class="config-content-fields">' +
            '<div class="config-content-row"><span class="config-content-row-label">Curso</span><input type="text" class="config-input edu-course-input" value="' + escAttr(edu.course) + '" /></div>' +
            '<div class="config-content-row"><span class="config-content-row-label">Instituição</span><input type="text" class="config-input edu-inst-input" value="' + escAttr(edu.inst) + '" /></div>' +
            '<div class="config-content-row"><span class="config-content-row-label">Data</span><input type="text" class="config-input edu-date-input" value="' + escAttr(edu.date) + '" /></div>' +
            '<div class="config-content-row"><span class="config-content-row-label">Descrição</span><input type="text" class="config-input edu-desc-input" value="' + escAttr(edu.desc) + '" /></div>' +
          '</div>'
        var inputs = box.querySelectorAll('input')
        inputs.forEach(function (input) {
          input.addEventListener('input', function () {
            var item = currentConfig.content.education[i]
            if (!item) return
            var cls = input.className
            if (cls.indexOf('edu-course-input') !== -1) item.course = input.value
            else if (cls.indexOf('edu-inst-input') !== -1) item.inst = input.value
            else if (cls.indexOf('edu-date-input') !== -1) item.date = input.value
            else if (cls.indexOf('edu-desc-input') !== -1) item.desc = input.value
          })
        })
        eduCont.appendChild(box)
      })
    }

    // Skills editor
    var skCont = document.getElementById('skillsEditContainer')
    if (skCont) {
      var label3 = skCont.querySelector('.config-label')
      skCont.innerHTML = ''
      if (label3) skCont.appendChild(label3)
      cfg.content.skills.forEach(function (skill, i) {
        var box = document.createElement('div')
        box.className = 'config-content-item'
        box.innerHTML =
          '<div class="config-content-fields">' +
            '<div class="config-content-row">' +
              '<span class="config-content-row-label-sm">' + escHtml(skill.label) + '</span>' +
              '<input type="range" class="config-range skill-pct-range" min="0" max="100" value="' + skill.pct + '" />' +
              '<span class="config-range-val skill-pct-val">' + skill.pct + '%</span>' +
            '</div>' +
          '</div>'
        var range = box.querySelector('.skill-pct-range')
        var val = box.querySelector('.skill-pct-val')
        if (range) {
          range.addEventListener('input', function () {
            var item = currentConfig.content.skills[i]
            if (!item) return
            item.pct = parseInt(range.value, 10)
            val.textContent = item.pct + '%'
          })
        }
        skCont.appendChild(box)
      })
    }

    // Projects editor
    var prCont = document.getElementById('projectsEditContainer')
    if (prCont) {
      var label4 = prCont.querySelector('.config-label')
      prCont.innerHTML = ''
      if (label4) prCont.appendChild(label4)
      cfg.content.projects.forEach(function (proj, i) {
        var box = document.createElement('div')
        box.className = 'config-content-item'
        box.innerHTML =
          '<div class="config-content-fields">' +
            '<div class="config-content-row"><span class="config-content-row-label">Linguagem</span><input type="text" class="config-input proj-lang-input" value="' + escAttr(proj.lang) + '" /></div>' +
            '<div class="config-content-row"><span class="config-content-row-label">Nome</span><input type="text" class="config-input proj-name-input" value="' + escAttr(proj.label) + '" /></div>' +
            '<div class="config-content-row"><span class="config-content-row-label">Descrição</span><input type="text" class="config-input proj-desc-input" value="' + escAttr(proj.desc) + '" /></div>' +
            '<div class="config-content-row"><span class="config-content-row-label">URL</span><input type="text" class="config-input proj-url-input" value="' + escAttr(proj.url) + '" /></div>' +
          '</div>'
        var inputs = box.querySelectorAll('input')
        inputs.forEach(function (input) {
          input.addEventListener('input', function () {
            var item = currentConfig.content.projects[i]
            if (!item) return
            var cls = input.className
            if (cls.indexOf('proj-lang-input') !== -1) item.lang = input.value
            else if (cls.indexOf('proj-name-input') !== -1) item.label = input.value
            else if (cls.indexOf('proj-desc-input') !== -1) item.desc = input.value
            else if (cls.indexOf('proj-url-input') !== -1) item.url = input.value
          })
        })
        prCont.appendChild(box)
      })
    }
  }

  function renderCustomSectionEditors(cfg) {
    var list = document.getElementById('customSectionsList')
    if (!list) return
    list.innerHTML = ''
    cfg.content.customSections.forEach(function (cs, i) {
      var box = document.createElement('div')
      box.className = 'config-custom-section'
      box.innerHTML =
        '<div class="config-cs-header">' +
          '<span class="config-cs-number">#' + (i + 1) + '</span>' +
          '<button class="config-cs-delete" data-index="' + i + '" title="Remover seção">✕</button>' +
        '</div>' +
        '<div class="config-cs-body">' +
          '<div class="config-content-row"><span class="config-content-row-label">Título</span><input type="text" class="config-input cs-title-input" value="' + escAttr(cs.title) + '" placeholder="Título da seção" /></div>' +
          '<div class="config-content-row"><span class="config-content-row-label">Conteúdo</span><textarea class="config-textarea cs-content-input" rows="4" placeholder="Escreva aqui o conteúdo da seção...">' + escAttr(cs.content) + '</textarea></div>' +
        '</div>'
      // Wire up inputs
      var titleInput = box.querySelector('.cs-title-input')
      var contentInput = box.querySelector('.cs-content-input')
      if (titleInput) {
        titleInput.addEventListener('input', function () {
          if (currentConfig.content.customSections[i]) currentConfig.content.customSections[i].title = titleInput.value
        })
      }
      if (contentInput) {
        contentInput.addEventListener('input', function () {
          if (currentConfig.content.customSections[i]) currentConfig.content.customSections[i].content = contentInput.value
        })
      }
      var delBtn = box.querySelector('.config-cs-delete')
      if (delBtn) {
        delBtn.addEventListener('click', function () {
          currentConfig.content.customSections.splice(i, 1)
          renderCustomSectionEditors(currentConfig)
        })
      }
      list.appendChild(box)
    })
  }

  function renderThemeGrid(cfg) {
    var grid = document.getElementById('themeGrid')
    grid.innerHTML = ''
    Object.keys(THEMES).forEach(function (key) {
      var t = THEMES[key]
      var div = document.createElement('div')
      div.className = 'theme-opt' + (cfg.theme === key ? ' active' : '')
      div.setAttribute('data-value', key)
      div.innerHTML = '<div class="theme-swatch" style="background:' + t.primary + '"></div><div>' + t.name + '</div>'
      div.addEventListener('click', function () {
        grid.querySelectorAll('.theme-opt').forEach(function (el) { el.classList.remove('active') })
        div.classList.add('active')
        currentConfig.theme = key
        var colEls = ['colorPrimary','colorAccent','colorBg','colorFont','colorLink','colorLinkHover','colorCard','colorBorder']
        var vals = [t.primary, t.accent, t.bg, t.text, t.accent, t.accent, lighten(t.bg, 5), lighten(t.primary, 75)]
        colEls.forEach(function (id, i) {
          document.getElementById(id).value = vals[i]
        })
      })
      grid.appendChild(div)
    })
  }

  function renderBtnGroup(containerId, items, activeId, onChange) {
    var container = document.getElementById(containerId)
    if (!container) return
    container.innerHTML = ''
    items.forEach(function (item) {
      var btn = document.createElement('button')
      btn.className = 'config-btn-opt' + (activeId === item.id ? ' active' : '')
      btn.textContent = item.label
      btn.addEventListener('click', function () {
        container.querySelectorAll('.config-btn-opt').forEach(function (el) { el.classList.remove('active') })
        btn.classList.add('active')
        onChange(item.id)
      })
      container.appendChild(btn)
    })
  }

  function renderSectionList(sections) {
    var list = document.getElementById('configSectionList')
    if (!list) return
    list.innerHTML = ''
    sections.forEach(function (sec, i) {
      var info = SECTION_IDS.find(function (s) { return s.id === sec.id })
      if (!info) return
      var item = document.createElement('div')
      item.className = 'config-section-item'
      item.draggable = true
      item.setAttribute('data-index', i)
      item.innerHTML =
        '<span class="drag-handle">⠿</span>' +
        '<input type="checkbox" ' + (sec.visible ? 'checked' : '') + ' />' +
        '<label>' + info.label + '</label>'
      item.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', i)
        item.classList.add('dragging')
      })
      item.addEventListener('dragend', function () { item.classList.remove('dragging') })
      item.addEventListener('dragover', function (e) { e.preventDefault() })
      item.addEventListener('drop', function (e) {
        e.preventDefault()
        var from = parseInt(e.dataTransfer.getData('text/plain'), 10)
        var to = i
        if (from === to) return
        var moved = currentConfig.sections.splice(from, 1)[0]
        currentConfig.sections.splice(to, 0, moved)
        renderSectionList(currentConfig.sections)
      })
      var cb = item.querySelector('input[type="checkbox"]')
      cb.addEventListener('change', function () {
        currentConfig.sections[i].visible = cb.checked
      })
      list.appendChild(item)
    })
  }

  function renderPdfSectionList(cfg) {
    var list = document.getElementById('pdfSectionList')
    if (!list) return
    list.innerHTML = ''
    SECTION_IDS.forEach(function (sec) {
      var checked = cfg.pdf.sections.indexOf(sec.id) !== -1
      var item = document.createElement('div')
      item.className = 'config-pdf-item'
      item.innerHTML =
        '<input type="checkbox" ' + (checked ? 'checked' : '') + ' />' +
        '<label>' + sec.label + '</label>'
      var cb = item.querySelector('input[type="checkbox"]')
      cb.addEventListener('change', function () {
        var idx = currentConfig.pdf.sections.indexOf(sec.id)
        if (cb.checked && idx === -1) currentConfig.pdf.sections.push(sec.id)
        else if (!cb.checked && idx !== -1) currentConfig.pdf.sections.splice(idx, 1)
      })
      list.appendChild(item)
    })
    ;(cfg.content.customSections || []).forEach(function (cs) {
      var checked = cfg.pdf.sections.indexOf('custom-' + cs.id) !== -1
      var item = document.createElement('div')
      item.className = 'config-pdf-item'
      item.innerHTML =
        '<input type="checkbox" ' + (checked ? 'checked' : '') + ' />' +
        '<label>' + escHtml(cs.title || 'Seção personalizada') + '</label>'
      var cb = item.querySelector('input[type="checkbox"]')
      cb.addEventListener('change', function () {
        var sid = 'custom-' + cs.id
        var idx = currentConfig.pdf.sections.indexOf(sid)
        if (cb.checked && idx === -1) currentConfig.pdf.sections.push(sid)
        else if (!cb.checked && idx !== -1) currentConfig.pdf.sections.splice(idx, 1)
      })
      list.appendChild(item)
    })
  }

  function renderPresets() {
    var container = document.getElementById('presetsContainer')
    if (!container) return
    container.innerHTML = ''
    var wrapper = document.createElement('div')
    wrapper.className = 'presets-container'
    PRESET_CATEGORIES.forEach(function (cat) {
      var catDiv = document.createElement('div')
      catDiv.className = 'presets-category'
      var title = document.createElement('div')
      title.className = 'presets-cat-title'
      title.textContent = cat.label
      catDiv.appendChild(title)
      var grid = document.createElement('div')
      grid.className = 'presets-grid'
      cat.presets.forEach(function (p) {
        var full = expandPresetConfig(p.c)
        var card = document.createElement('div')
        card.className = 'presets-card'
        card.setAttribute('data-preset-id', p.id)
        card.innerHTML =
          '<div class="presets-card-label">' + p.label + '</div>' +
          '<div class="presets-card-desc">' + p.desc + '</div>'
        var colorsDiv = document.createElement('div')
        colorsDiv.className = 'presets-card-colors'
        var tc = full.customColors
        var theme = THEMES[full.theme] || THEMES.professional
        var colorOpts = [
          tc.primary || theme.primary,
          tc.accent || theme.accent,
          tc.bg || theme.bg,
        ]
        colorOpts.forEach(function (c) {
          var dot = document.createElement('span')
          dot.className = 'presets-card-color'
          dot.style.background = c
          colorsDiv.appendChild(dot)
        })
        card.appendChild(colorsDiv)
        card.addEventListener('click', function () {
          container.querySelectorAll('.presets-card').forEach(function (el) { el.classList.remove('active') })
          card.classList.add('active')
          var expanded = expandPresetConfig(p.c)
          applyPresetConfig(expanded)
          if (p.s) applyPresetSections(p.s)
          if (p.sample) applyPresetSample(p.sample)
          renderPanel(currentConfig)
        })
        grid.appendChild(card)
      })
      catDiv.appendChild(grid)
      wrapper.appendChild(catDiv)
    })
    container.appendChild(wrapper)
  }

  // ── Info Overlay ──
  var infoOverlay = document.getElementById('infoOverlay')
  function openInfo() { infoOverlay.classList.add('open') }
  function closeInfo() { infoOverlay.classList.remove('open') }
  document.getElementById('infoTrigger').addEventListener('click', openInfo)
  document.getElementById('infoClose').addEventListener('click', closeInfo)
  infoOverlay.addEventListener('click', function (e) {
    if (e.target === infoOverlay) closeInfo()
  })
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && infoOverlay.classList.contains('open')) closeInfo()
  })

  // ── Panel Events ──
  document.getElementById('openConfig').addEventListener('click', openPanel)
  document.getElementById('configClose').addEventListener('click', closePanel)
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closePanel()
  })
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closePanel()
  })

  // Add custom section
  document.getElementById('addCustomSection').addEventListener('click', function () {
    var id = 'cs_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
    currentConfig.content.customSections.push({ id: id, title: 'Nova Seção', content: '' })
    renderCustomSectionEditors(currentConfig)
  })

  // Tab switching
  document.querySelectorAll('.config-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.config-tab').forEach(function (t) { t.classList.remove('active') })
      document.querySelectorAll('.config-tab-content').forEach(function (c) { c.classList.remove('active') })
      tab.classList.add('active')
      var content = document.getElementById('tab-' + tab.getAttribute('data-tab'))
      if (content) content.classList.add('active')
    })
  })

  // Range slider live value
  document.getElementById('bgPatternOpacity').addEventListener('input', function () {
    document.getElementById('bgPatternOpacityVal').textContent = this.value + '%'
  })

  // Save
  document.getElementById('configSave').addEventListener('click', function () {
    // Read content inputs
    currentConfig.content.name = document.getElementById('editNameInput').value
    currentConfig.content.title = document.getElementById('editTitleInput').value
    currentConfig.content.location = document.getElementById('editLocationInput').value
    currentConfig.content.about = document.getElementById('editAboutInput').value
    currentConfig.content.email = document.getElementById('editEmailInput').value
    currentConfig.content.github = document.getElementById('editGithubInput').value
    currentConfig.content.linkedin = document.getElementById('editLinkedinInput').value

    // Read custom colors
    currentConfig.customColors.primary = document.getElementById('colorPrimary').value
    currentConfig.customColors.accent = document.getElementById('colorAccent').value
    currentConfig.customColors.bg = document.getElementById('colorBg').value
    currentConfig.customColors.fontColor = document.getElementById('colorFont').value
    currentConfig.customColors.linkColor = document.getElementById('colorLink').value
    currentConfig.customColors.linkHoverColor = document.getElementById('colorLinkHover').value
    currentConfig.customColors.cardBg = document.getElementById('colorCard').value
    currentConfig.customColors.borderColor = document.getElementById('colorBorder').value

    // Background
    currentConfig.bgImage = document.getElementById('bgImageInput').value
    currentConfig.bgPatternOpacity = parseInt(document.getElementById('bgPatternOpacity').value, 10)

    // Header
    currentConfig.header.profileImage = document.getElementById('profileImageInput').value

    // Layout
    currentConfig.layout.sectionBgColor = document.getElementById('sectionBgColor').value

    saveConfig(currentConfig)
    config = currentConfig
    applyConfig(config)
    setupAnimations(config)
    syncTopbarToggle()
    updateShareLink(config)
    closePanel()
  })

  // Reset
  document.getElementById('configReset').addEventListener('click', function () {
    currentConfig = defaultConfig()
    renderPanel(currentConfig)
  })

  // ── Share Link ──
  function showCopyToast(msg) {
    var existing = document.getElementById('shareToast')
    if (existing) existing.remove()
    var toast = document.createElement('div')
    toast.id = 'shareToast'
    toast.style.cssText =
      'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
      'background:#1a1a2e;color:#fff;padding:12px 24px;font-size:13px;' +
      'z-index:3000;box-shadow:0 4px 20px rgba(0,0,0,0.2);' +
      'transition:opacity 0.3s;opacity:0;border-radius:4px;'
    toast.textContent = msg
    document.body.appendChild(toast)
    requestAnimationFrame(function () { toast.style.opacity = '1' })
    setTimeout(function () {
      toast.style.opacity = '0'
      setTimeout(function () { toast.remove() }, 400)
    }, 2500)
  }

  document.getElementById('configShare').addEventListener('click', function () {
    var cfg = JSON.parse(JSON.stringify(currentConfig))
    // Read content inputs
    cfg.content.name = document.getElementById('editNameInput').value
    cfg.content.title = document.getElementById('editTitleInput').value
    cfg.content.location = document.getElementById('editLocationInput').value
    cfg.content.about = document.getElementById('editAboutInput').value
    cfg.content.email = document.getElementById('editEmailInput').value
    cfg.content.github = document.getElementById('editGithubInput').value
    cfg.content.linkedin = document.getElementById('editLinkedinInput').value
    cfg.customColors.primary = document.getElementById('colorPrimary').value
    cfg.customColors.accent = document.getElementById('colorAccent').value
    cfg.customColors.bg = document.getElementById('colorBg').value
    cfg.customColors.fontColor = document.getElementById('colorFont').value
    cfg.customColors.linkColor = document.getElementById('colorLink').value
    cfg.customColors.linkHoverColor = document.getElementById('colorLinkHover').value
    cfg.customColors.cardBg = document.getElementById('colorCard').value
    cfg.customColors.borderColor = document.getElementById('colorBorder').value
    cfg.bgImage = document.getElementById('bgImageInput').value
    cfg.bgPatternOpacity = parseInt(document.getElementById('bgPatternOpacity').value, 10)
    cfg.header.profileImage = document.getElementById('profileImageInput').value
    cfg.layout.sectionBgColor = document.getElementById('sectionBgColor').value

    var encoded = encodeConfigToHash(cfg)
    if (!encoded) { showCopyToast('Erro ao gerar link'); return }
    var url = window.location.origin + window.location.pathname + '#' + encoded
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        showCopyToast('Link copiado! Envie para qualquer pessoa.')
      }).catch(function () { fallbackCopy(url) })
    } else {
      fallbackCopy(url)
    }
  })

  function fallbackCopy(url) {
    var ta = document.createElement('textarea')
    ta.value = url
    ta.style.position = 'fixed'; ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
      showCopyToast('Link copiado! Envie para qualquer pessoa.')
    } catch (e) {
      showCopyToast('Erro ao copiar. Link: ' + url)
    }
    ta.remove()
  }

  // ── Export PDF ──
  document.getElementById('exportPdf').addEventListener('click', function () {
    var cfg = loadConfig()

    var allSections = document.querySelectorAll('[data-section]')
    allSections.forEach(function (el) {
      var secId = el.getAttribute('data-section')
      el.style.display = (cfg.pdf.sections.indexOf(secId) === -1) ? 'none' : ''
    })

    var marginMap = { small: '0.3in', normal: '0.5in', large: '0.8in' }
    var margin = marginMap[cfg.pdf.margins] || '0.5in'
    var fontSizeMap = { small: '85%', normal: '100%', large: '115%' }
    var fs = fontSizeMap[cfg.pdf.fontSize] || '100%'
    var pageSizeMap = { a4: '210mm 297mm', letter: '216mm 279mm' }
    var ps = pageSizeMap[cfg.pdf.pageSize] || '210mm 297mm'
    var isGrayscale = cfg.pdf.color === 'grayscale'

    document.body.classList.add('is-printing')

    var style = document.createElement('style')
    style.id = 'pdf-temp-style'
    style.textContent =
      '@page { margin: ' + margin + '; size: ' + ps + '; }' +
      'body.is-printing { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: var(--bg) !important; color: var(--text) !important; font-size: ' + fs + '; }' +
      'body.is-printing .topbar, body.is-printing .topbar-show-btn, body.is-printing .config-overlay, body.is-printing .prof-footer { display: none !important; }' +
      'body.is-printing .topbar.printing-show { display: flex !important; }' +
      'body.is-printing .main-content { padding: 0; max-width: 100%; }' +
      'body.is-printing .prof-header { page-break-after: avoid; }' +
      'body.is-printing .prof-section { page-break-inside: avoid; }' +
      'body.is-printing .proj-card { box-shadow: none !important; break-inside: avoid; }' +
      'body.is-printing .contact-item { box-shadow: none !important; padding: 4px 8px; }' +
      'body.is-printing .skill-bar { border: 1px solid var(--border); }' +
      'body.is-printing .skill-fill { background: linear-gradient(90deg, var(--accent), var(--primary)) !important; }' +
      (isGrayscale ? 'body.is-printing .main-content { -webkit-filter: grayscale(100%); filter: grayscale(100%); }' : '') +
      (cfg.pdf.includeTopbar === 'yes' ? 'body.is-printing .topbar { display: flex !important; } body.is-printing .topbar .topbar-btn, body.is-printing .topbar .topbar-toggle { display: none; } body.is-printing .topbar .topbar-brand { font-size: 12px; }' : '')

    document.head.appendChild(style)

    window.print()

    setTimeout(function () {
      document.getElementById('pdf-temp-style').remove()
      document.body.classList.remove('is-printing')
      applyConfig(cfg)
      setupAnimations(cfg)
    }, 500)
  })

})()

