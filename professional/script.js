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
          c: { theme:'dark', cc:{accent:'#ff6b35'}, font:'mono', fw:'bold', fs:'sm', ts:'large', anim:'fade', bgp:'dots', bgpo:15, ha:'center', hs:'detailed', cw:'wide', ss:'spacious', pl:'grid3', bs:'pill', br:'small', bx:'light', asb:'yes' } },
        { id: 'game-publisher', label: 'Game Publisher', desc: 'Sóbrio com acentos verde-água. Para publishers profissionais.',
          c: { theme:'dark', cc:{accent:'#00ffc8'}, font:'system', fw:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'outline', ls:'icon', br:'normal', bx:'normal', asb:'no' } },
        { id: 'mobile-games', label: 'Mobile Games', desc: 'Colorido e vibrante. Para desenvolvedor de jogos mobile.',
          c: { theme:'nature', cc:{accent:'#7c3aed', primary:'#1a1a3e'}, font:'system', fw:'bold', fs:'normal', ts:'large', anim:'slide', bgp:'dots', bgpo:10, ha:'center', hs:'detailed', cw:'normal', pl:'grid3', bs:'pill', br:'large', bx:'light', asb:'yes' } },
        { id: 'esports-team', label: 'Esports Team', desc: 'Agressivo e escuro. Ideal para perfil de jogador competitivo.',
          c: { theme:'dark', cc:{accent:'#ff0044', bg:'#0d0d0d'}, font:'mono', fw:'bold', fs:'sm', ts:'large', anim:'fade', bgp:'grid', bgpo:10, ha:'center', hs:'minimal', cw:'narrow', pl:'list', bs:'flat', ls:'plain', br:'none', bx:'none', asb:'no', ss:'compact', sb:'no' } },
        { id: 'game-dev-portfolio', label: 'Game Dev Portfolio', desc: 'Escuro com verde matrix. Portfólio de game dev.',
          c: { theme:'dark', cc:{accent:'#00ff88'}, font:'mono', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'dots', bgpo:12, ha:'left', hs:'detailed', cw:'wide', pl:'grid3', bs:'outline', br:'small', bx:'light', asb:'yes' } },
      ]
    },
    {
      label: '💼 Corporativo', id: 'cat-corporate',
      presets: [
        { id: 'corporate-exec', label: 'Executivo Corporativo', desc: 'Sóbrio, azul-marinho. Para cargos de liderança.',
          c: { theme:'professional', cc:{accent:'#1a365d'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no', sb:'yes', sd:'yes', ss:'normal' } },
        { id: 'tech-startup', label: 'Tech Startup', desc: 'Moderno com azul vibrante. Para startups de tecnologia.',
          c: { theme:'professional', cc:{accent:'#2563eb'}, font:'system', fw:'normal', fs:'normal', ts:'large', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'wide', pl:'grid3', bs:'outline', br:'normal', bx:'light', asb:'no', ss:'spacious' } },
        { id: 'financial', label: 'Financeiro', desc: 'Conservador, fontes serifadas. Para banco/consultoria financeira.',
          c: { theme:'minimal', cc:{accent:'#1a3a5c', primary:'#1a1a2e', bg:'#fafafa'}, font:'serif', fw:'normal', fs:'sm', ts:'normal', ta:'justify', anim:'none', bgp:'none', ha:'left', hs:'detailed', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no', ss:'compact' } },
        { id: 'management-consulting', label: 'Consultoria de Gestão', desc: 'Clean, profissional, minimalista.',
          c: { theme:'minimal', cc:{accent:'#2d3748'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'compact', cw:'narrow', pl:'list', bs:'flat', br:'small', bx:'light', asb:'no', ss:'compact' } },
        { id: 'enterprise-b2b', label: 'Enterprise B2B', desc: 'Profissional azul-escuro. Para vendas/parcerias B2B.',
          c: { theme:'professional', cc:{accent:'#1e40af', primary:'#0f172a'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'flat', br:'small', bx:'light', asb:'no' } },
      ]
    },
    {
      label: '📢 Marketing', id: 'cat-marketing',
      presets: [
        { id: 'creative-agency', label: 'Agência Criativa', desc: 'Cores ousadas e layout moderno. Para agências de publicidade.',
          c: { theme:'sunset', cc:{accent:'#e63946', primary:'#2a1a1a'}, font:'system', fw:'bold', fs:'normal', ts:'large', anim:'slide', bgp:'dots', bgpo:12, ha:'center', hs:'detailed', cw:'wide', pl:'grid3', bs:'pill', br:'large', bx:'light', asb:'yes', ss:'spacious' } },
        { id: 'digital-marketing', label: 'Marketing Digital', desc: 'Moderno e vibrante. Para profissionais de marketing digital.',
          c: { theme:'professional', cc:{accent:'#f59e0b'}, font:'system', fw:'normal', fs:'normal', ts:'large', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid3', bs:'pill', br:'normal', bx:'light', asb:'yes', ss:'normal' } },
        { id: 'social-media-mgr', label: 'Social Media Manager', desc: 'Clean com toque trendy. Para gestor de redes sociais.',
          c: { theme:'nature', cc:{accent:'#ec4899', primary:'#1a1a2e'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'slide', bgp:'dots', bgpo:8, ha:'center', hs:'detailed', cw:'normal', pl:'grid2', bs:'pill', br:'large', bx:'light', asb:'yes' } },
        { id: 'brand-strategist', label: 'Estrategista de Marca', desc: 'Elegante e premium. Para branding e posicionamento.',
          c: { theme:'minimal', cc:{accent:'#b8860b', primary:'#2a1a0a'}, font:'serif', fw:'bold', fs:'sm', ts:'large', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no' } },
        { id: 'content-creator', label: 'Criador de Conteúdo', desc: 'Layout largo e moderno. Para criadores digitais.',
          c: { theme:'sunset', cc:{accent:'#ff6b35', bg:'#fffaf5'}, font:'system', fw:'normal', fs:'normal', ts:'large', anim:'slide', bgp:'none', ha:'center', hs:'detailed', cw:'full', pl:'grid3', bs:'pill', br:'normal', bx:'light', asb:'yes', ss:'spacious' } },
      ]
    },
    {
      label: '💻 Programação', id: 'cat-programming',
      presets: [
        { id: 'fullstack-dev', label: 'Full-Stack Developer', desc: 'Dark mode com acentos azul. O clássico dev.',
          c: { theme:'dark', cc:{accent:'#3b82f6'}, font:'mono', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'dots', bgpo:12, ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'outline', br:'small', bx:'light', asb:'no' } },
        { id: 'frontend-spec', label: 'Frontend Specialist', desc: 'Moderno e colorido. Para especialista em frontend.',
          c: { theme:'professional', cc:{accent:'#8b5cf6'}, font:'system', fw:'normal', fs:'normal', ts:'large', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'wide', pl:'grid3', bs:'pill', br:'normal', bx:'light', asb:'yes', ss:'spacious' } },
        { id: 'backend-engineer', label: 'Backend Engineer', desc: 'Minimalista e funcional. Sem firulas, só código.',
          c: { theme:'dark', cc:{accent:'#10b981', primary:'#d1d5db'}, font:'mono', fw:'normal', fs:'sm', ts:'normal', anim:'none', bgp:'none', ha:'left', hs:'compact', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no', ss:'compact', sb:'no', sd:'no' } },
        { id: 'devops-engineer', label: 'DevOps / SRE', desc: 'Escuro com vermelho/âmbar. Estilo terminal/console.',
          c: { theme:'dark', cc:{accent:'#f59e0b'}, font:'mono', fw:'bold', fs:'sm', ts:'normal', anim:'fade', bgp:'grid', bgpo:15, ha:'left', hs:'detailed', cw:'normal', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no', ss:'compact' } },
        { id: 'mobile-dev', label: 'Mobile Developer', desc: 'Moderno e limpo. Para desenvolvedor iOS/Android.',
          c: { theme:'professional', cc:{accent:'#06b6d4'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid3', bs:'pill', br:'large', bx:'light', asb:'yes' } },
        { id: 'data-scientist', label: 'Cientista de Dados', desc: 'Clean com púrpura analítico. Para área de dados.',
          c: { theme:'minimal', cc:{accent:'#7c3aed'}, font:'system', fw:'normal', fs:'normal', ts:'normal', ta:'justify', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'list', bs:'flat', br:'small', bx:'light', asb:'no', ss:'normal' } },
        { id: 'oss-contributor', label: 'Open Source Contributor', desc: 'Verde-escuro estilo Git. Para contribuidor OSS.',
          c: { theme:'nature', cc:{accent:'#2d8a4e', bg:'#f0faf0'}, font:'mono', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'outline', br:'small', bx:'light', asb:'no' } },
        { id: 'tech-lead', label: 'Tech Lead', desc: 'Profissional e maduro. Para liderança técnica.',
          c: { theme:'professional', cc:{accent:'#2563eb'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'flat', br:'small', bx:'light', asb:'no', ss:'normal' } },
        { id: 'cybersecurity', label: 'Cibersegurança', desc: 'Escuro com vermelho. Estilo hacker profissional.',
          c: { theme:'dark', cc:{accent:'#dc2626', bg:'#0a0a0a'}, font:'mono', fw:'bold', fs:'sm', ts:'normal', anim:'none', bgp:'grid', bgpo:12, ha:'left', hs:'compact', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no' } },
        { id: 'ai-ml-engineer', label: 'Engenheiro AI/ML', desc: 'Futurista com púrpura neon. Para inteligência artificial.',
          c: { theme:'dark', cc:{accent:'#a855f7'}, font:'system', fw:'normal', fs:'normal', ts:'large', anim:'fade', bgp:'dots', bgpo:10, ha:'center', hs:'detailed', cw:'wide', pl:'grid3', bs:'pill', br:'large', bx:'light', asb:'yes' } },
      ]
    },
    {
      label: '🎨 Design', id: 'cat-design',
      presets: [
        { id: 'ui-ux-designer', label: 'UI/UX Designer', desc: 'Limpo, espaçoso, minimalista. O padrão de design.',
          c: { theme:'minimal', cc:{accent:'#6366f1'}, font:'system', fw:'normal', fs:'normal', ts:'large', anim:'slide', bgp:'none', ha:'left', hs:'detailed', cw:'wide', pl:'grid3', bs:'pill', br:'normal', bx:'light', asb:'no', ss:'spacious' } },
        { id: 'graphic-designer', label: 'Designer Gráfico', desc: 'Criativo com cores fortes. Para portfólio visual.',
          c: { theme:'sunset', cc:{accent:'#f97316'}, font:'system', fw:'bold', fs:'normal', ts:'large', anim:'slide', bgp:'dots', bgpo:10, ha:'center', hs:'detailed', cw:'wide', pl:'grid3', bs:'pill', br:'large', bx:'light', asb:'yes' } },
        { id: 'product-designer', label: 'Product Designer', desc: 'Elegante, moderno, focado no produto.',
          c: { theme:'minimal', cc:{accent:'#0891b2'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'flat', br:'small', bx:'light', asb:'no' } },
        { id: 'motion-designer', label: 'Motion Designer', desc: 'Escuro com acento vibrante. Para animação/motion.',
          c: { theme:'dark', cc:{accent:'#f43f5e'}, font:'system', fw:'bold', fs:'normal', ts:'large', anim:'slide', bgp:'dots', bgpo:15, ha:'center', hs:'detailed', cw:'full', pl:'grid3', bs:'pill', br:'large', bx:'light', asb:'yes' } },
        { id: 'art-director', label: 'Diretor de Arte', desc: 'Premium com serifa. Para direção de arte.',
          c: { theme:'minimal', cc:{accent:'#1a1a2e', primary:'#000'}, font:'serif', fw:'bold', fs:'sm', ts:'large', anim:'fade', bgp:'none', ha:'center', hs:'detailed', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no' } },
      ]
    },
    {
      label: '🌐 Internet', id: 'cat-internet',
      presets: [
        { id: 'youtuber-streamer', label: 'YouTuber / Streamer', desc: 'Escuro com vermelho. Padrão para criador de conteúdo.',
          c: { theme:'dark', cc:{accent:'#ff0000'}, font:'system', fw:'bold', fs:'normal', ts:'large', anim:'slide', bgp:'dots', bgpo:12, ha:'center', hs:'detailed', cw:'wide', pl:'grid3', bs:'pill', br:'large', bx:'light', asb:'yes' } },
        { id: 'influencer', label: 'Influenciador Digital', desc: 'Moderno, clean, trendy. Para perfis de influência.',
          c: { theme:'nature', cc:{accent:'#f472b6', bg:'#fff5f9'}, font:'system', fw:'normal', fs:'normal', ts:'large', anim:'slide', bgp:'none', ha:'center', hs:'detailed', cw:'normal', pl:'grid2', bs:'pill', br:'large', bx:'light', asb:'yes' } },
        { id: 'digital-nomad', label: 'Nômade Digital', desc: 'Claro e natural. Para quem trabalha viajando.',
          c: { theme:'nature', cc:{accent:'#2d8a4e', bg:'#f5faf5'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'flat', br:'small', bx:'light', asb:'no' } },
        { id: 'blogger-writer', label: 'Blogger / Escritor', desc: 'Serifado e elegante. Foco na leitura.',
          c: { theme:'minimal', cc:{accent:'#4a5568', bg:'#fefefe'}, font:'serif', fw:'normal', fs:'lg', ts:'normal', ta:'justify', lh:'relaxed', anim:'none', bgp:'none', ha:'left', hs:'detailed', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no' } },
        { id: 'podcaster', label: 'Podcaster', desc: 'Moderno e sonoro. Para perfis de podcast.',
          c: { theme:'dark', cc:{accent:'#8b5cf6', bg:'#1a1a2e'}, font:'system', fw:'bold', fs:'normal', ts:'large', anim:'fade', bgp:'dots', bgpo:8, ha:'center', hs:'detailed', cw:'normal', pl:'grid2', bs:'pill', br:'normal', bx:'light', asb:'yes' } },
      ]
    },
    {
      label: '📱 Mídias Sociais', id: 'cat-social',
      presets: [
        { id: 'social-agency', label: 'Agência de Mídias Sociais', desc: 'Colorido e grade. Para agência de social media.',
          c: { theme:'sunset', cc:{accent:'#e1306c'}, font:'system', fw:'bold', fs:'normal', ts:'large', anim:'slide', bgp:'none', ha:'center', hs:'detailed', cw:'wide', pl:'grid3', bs:'pill', br:'normal', bx:'light', asb:'yes', ss:'spacious' } },
        { id: 'community-manager', label: 'Community Manager', desc: 'Acessível e amigável. Para gestão de comunidades.',
          c: { theme:'nature', cc:{accent:'#3b82f6'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'pill', br:'normal', bx:'light', asb:'yes' } },
        { id: 'content-strategist', label: 'Estrategista de Conteúdo', desc: 'Organizado e profissional. Para estratégia digital.',
          c: { theme:'professional', cc:{accent:'#0ea5e9'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'flat', br:'small', bx:'light', asb:'no' } },
      ]
    },
    {
      label: '🏢 Outros', id: 'cat-other',
      presets: [
        { id: 'freelancer', label: 'Freelancer', desc: 'Versátil e moderno. Para profissionais autônomos.',
          c: { theme:'professional', cc:{accent:'#6366f1'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'pill', br:'normal', bx:'light', asb:'no' } },
        { id: 'agency-owner', label: 'Dono de Agência', desc: 'Premium e confiável. Para donos de agência.',
          c: { theme:'professional', cc:{accent:'#1e3a5f'}, font:'system', fw:'bold', fs:'normal', ts:'large', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'narrow', pl:'list', bs:'flat', br:'small', bx:'light', asb:'no' } },
        { id: 'nonprofit', label: 'Terceiro Setor', desc: 'Acolhedor e natural. Para ONGs e projetos sociais.',
          c: { theme:'nature', cc:{accent:'#059669'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'flat', br:'small', bx:'light', asb:'no' } },
        { id: 'educator', label: 'Educador / Professor', desc: 'Sóbrio e acadêmico. Para currículo de professor.',
          c: { theme:'minimal', cc:{accent:'#4f46e5'}, font:'serif', fw:'normal', fs:'normal', ts:'normal', ta:'justify', anim:'none', bgp:'none', ha:'left', hs:'detailed', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no' } },
        { id: 'researcher', label: 'Pesquisador / Cientista', desc: 'Formal e limpo. Para publicações acadêmicas.',
          c: { theme:'minimal', cc:{accent:'#1e40af'}, font:'serif', fw:'normal', fs:'sm', ts:'normal', ta:'justify', lh:'relaxed', anim:'none', bgp:'none', ha:'left', hs:'detailed', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no' } },
        { id: 'architect', label: 'Arquiteto', desc: 'Geométrico e minimalista. Para portfólio de arquitetura.',
          c: { theme:'minimal', cc:{accent:'#4a4a4a', primary:'#2d2d2d'}, font:'system', fw:'light', fs:'normal', ts:'large', anim:'fade', bgp:'grid', bgpo:8, ha:'left', hs:'compact', cw:'wide', pl:'grid3', bs:'flat', br:'none', bx:'none', asb:'no' } },
        { id: 'photographer', label: 'Fotógrafo', desc: 'Escuro com foco no conteúdo visual.',
          c: { theme:'dark', cc:{accent:'#fbbf24', bg:'#0d0d0d'}, font:'system', fw:'light', fs:'sm', ts:'large', anim:'fade', bgp:'none', ha:'center', hs:'minimal', cw:'full', pl:'grid3', bs:'flat', br:'none', bx:'none', asb:'no', ss:'spacious' } },
        { id: 'consultant', label: 'Consultor', desc: 'Profissional e direto. Para consultorias diversas.',
          c: { theme:'professional', cc:{accent:'#1a56db'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'list', bs:'flat', br:'small', bx:'light', asb:'no', ss:'compact' } },
        { id: 'remote-worker', label: 'Trabalhador Remoto', desc: 'Funcional e limpo. Para profissionais home office.',
          c: { theme:'professional', cc:{accent:'#6366f1'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'flat', br:'small', bx:'none', asb:'no' } },
        { id: 'junior-dev', label: 'Desenvolvedor Júnior', desc: 'Moderno e acessível. Para quem está começando.',
          c: { theme:'professional', cc:{accent:'#3b82f6'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'fade', bgp:'dots', bgpo:10, ha:'left', hs:'detailed', cw:'normal', pl:'grid2', bs:'pill', br:'normal', bx:'light', asb:'yes' } },
        { id: 'senior-engineer', label: 'Engenheiro Sênior', desc: 'Maduro e refinado. Para experiência sênior.',
          c: { theme:'minimal', cc:{accent:'#374151'}, font:'system', fw:'normal', fs:'normal', ts:'normal', anim:'none', bgp:'none', ha:'left', hs:'detailed', cw:'normal', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no', ss:'compact' } },
        { id: 'clevel-exec', label: 'C-Level Executivo', desc: 'Escuro premium com dourado. Para CEO/CTO/CFO.',
          c: { theme:'dark', cc:{accent:'#d4a017', bg:'#0a0a0a'}, font:'serif', fw:'bold', fs:'sm', ts:'large', anim:'fade', bgp:'none', ha:'center', hs:'detailed', cw:'narrow', pl:'list', bs:'flat', br:'none', bx:'none', asb:'no' } },
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
    // Merge presetFull into currentConfig (visual fields only, preserve content)
    if (presetFull.theme) currentConfig.theme = presetFull.theme
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
          renderPanel(currentConfig)
        })
        grid.appendChild(card)
      })
      catDiv.appendChild(grid)
      wrapper.appendChild(catDiv)
    })
    container.appendChild(wrapper)
  }

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

