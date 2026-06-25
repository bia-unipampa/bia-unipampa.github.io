/* =========================================================================
   BIA — Dados da matriz curricular (PPC v1.4, 2026 · Campus Alegrete)
   Fonte: Figura 2 (matriz), Tabela 3 (CCOGs) e Tabela 7 (CCCGs) do PPC.
   Cada componente: eixo, créditos, carga horária (horas-relógio) e descrição
   curta trilíngue (pt/es/en). 1 crédito = 15 horas-relógio.
   ========================================================================= */

const AXES = {
  pi: {
    color: "#fb3b5c",
    name: { pt: "Projeto Integrador", es: "Proyecto Integrador", en: "Integrative Project" },
    short: { pt: "Resolução de Problemas & TCC", es: "Resolución de Problemas y TFC", en: "Problem Solving & Capstone" }
  },
  fm: {
    color: "#b366ff",
    name: { pt: "Fundamentos da Matemática", es: "Fundamentos de Matemática", en: "Mathematical Foundations" },
    short: { pt: "Base teórica essencial para a IA", es: "Base teórica esencial para la IA", en: "Core theory for AI" }
  },
  ia: {
    color: "#2ee6a6",
    name: { pt: "Inteligência Artificial", es: "Inteligencia Artificial", en: "Artificial Intelligence" },
    short: { pt: "Núcleo de técnicas e métodos de IA", es: "Núcleo de técnicas y métodos de IA", en: "Core AI techniques & methods" }
  },
  fc: {
    color: "#a3e635",
    name: { pt: "Fundamentos da Computação", es: "Fundamentos de Computación", en: "Computing Foundations" },
    short: { pt: "Bases computacionais e de dados", es: "Bases computacionales y de datos", en: "Computing & data foundations" }
  },
  cp: {
    color: "#ffb547",
    name: { pt: "Contexto Profissional", es: "Contexto Profesional", en: "Professional Context" },
    short: { pt: "Ética, sociedade e empreendedorismo", es: "Ética, sociedad y emprendimiento", en: "Ethics, society & entrepreneurship" }
  },
  cg: {
    color: "#4d8cff",
    name: { pt: "Complementares", es: "Complementarias", en: "Electives" },
    short: { pt: "Trilhas de aprofundamento eletivas", es: "Trayectos electivos de profundización", en: "Elective specialization tracks" }
  }
};

/* Componentes Curriculares Obrigatórios (CCOGs), por semestre */
const SEMESTERS = [
  {
    n: 1,
    components: [
      { axis: "fm", credits: 4, hours: 60,
        name: { pt: "Matemática Básica para IA", es: "Matemática Básica para IA", en: "Basic Mathematics for AI" },
        desc: { pt: "Fundamentos matemáticos essenciais para iniciar a jornada em IA.", es: "Fundamentos matemáticos esenciales para iniciar el camino en IA.", en: "Essential math foundations to start the AI journey." } },
      { axis: "fc", credits: 4, hours: 60,
        name: { pt: "Engenharia de Dados I", es: "Ingeniería de Datos I", en: "Data Engineering I" },
        desc: { pt: "Coleta, modelagem e organização de dados para sistemas inteligentes.", es: "Recolección, modelado y organización de datos para sistemas inteligentes.", en: "Collecting, modeling and structuring data for intelligent systems." } },
      { axis: "fc", credits: 4, hours: 60,
        name: { pt: "Algoritmos e Programação para IA I", es: "Algoritmos y Programación para IA I", en: "Algorithms & Programming for AI I" },
        desc: { pt: "Lógica, algoritmos e programação com aplicações em IA desde o início.", es: "Lógica, algoritmos y programación con aplicaciones en IA desde el inicio.", en: "Logic, algorithms and programming with AI applications from day one." } },
      { axis: "ia", credits: 4, hours: 60,
        name: { pt: "Introdução à Inteligência Artificial", es: "Introducción a la Inteligencia Artificial", en: "Introduction to Artificial Intelligence" },
        desc: { pt: "Panorama dos paradigmas, história e fronteiras da IA contemporânea.", es: "Panorama de paradigmas, historia y fronteras de la IA contemporánea.", en: "Overview of paradigms, history and frontiers of modern AI." } },
      { axis: "pi", credits: 8, hours: 120,
        name: { pt: "Resolução de Problemas I", es: "Resolución de Problemas I", en: "Problem Solving I" },
        desc: { pt: "Trilha ABP: resolver problemas reais em equipe usando IA, com extensão.", es: "Trayecto ABP: resolver problemas reales en equipo usando IA, con extensión.", en: "PBL track: solving real problems in teams with AI, including outreach." } }
    ]
  },
  {
    n: 2,
    components: [
      { axis: "fm", credits: 4, hours: 60,
        name: { pt: "Cálculo para IA I", es: "Cálculo para IA I", en: "Calculus for AI I" },
        desc: { pt: "Cálculo diferencial e integral aplicado a modelos de IA.", es: "Cálculo diferencial e integral aplicado a modelos de IA.", en: "Differential & integral calculus applied to AI models." } },
      { axis: "fc", credits: 4, hours: 60,
        name: { pt: "Engenharia de Dados II", es: "Ingeniería de Datos II", en: "Data Engineering II" },
        desc: { pt: "Pipelines, bancos de dados e preparação de dados em escala.", es: "Pipelines, bases de datos y preparación de datos a escala.", en: "Pipelines, databases and data preparation at scale." } },
      { axis: "fc", credits: 4, hours: 60,
        name: { pt: "Algoritmos e Programação para IA II", es: "Algoritmos y Programación para IA II", en: "Algorithms & Programming for AI II" },
        desc: { pt: "Estruturas de dados e técnicas avançadas de programação para IA.", es: "Estructuras de datos y técnicas avanzadas de programación para IA.", en: "Data structures and advanced programming techniques for AI." } },
      { axis: "fc", credits: 4, hours: 60,
        name: { pt: "Ciência de Dados", es: "Ciencia de Datos", en: "Data Science" },
        desc: { pt: "Do dado bruto ao insight: análise exploratória e tomada de decisão.", es: "Del dato bruto al insight: análisis exploratorio y toma de decisiones.", en: "From raw data to insight: exploratory analysis and decision-making." } },
      { axis: "pi", credits: 8, hours: 120,
        name: { pt: "Resolução de Problemas II", es: "Resolución de Problemas II", en: "Problem Solving II" },
        desc: { pt: "Segundo ciclo da trilha de problemas reais com soluções baseadas em IA.", es: "Segundo ciclo del trayecto de problemas reales con soluciones de IA.", en: "Second cycle of the real-problem track with AI-based solutions." } }
    ]
  },
  {
    n: 3,
    components: [
      { axis: "fm", credits: 4, hours: 60,
        name: { pt: "Álgebra Linear e Geometria Analítica", es: "Álgebra Lineal y Geometría Analítica", en: "Linear Algebra & Analytic Geometry" },
        desc: { pt: "Vetores, matrizes e espaços: a linguagem matemática do aprendizado.", es: "Vectores, matrices y espacios: el lenguaje matemático del aprendizaje.", en: "Vectors, matrices and spaces: the math language of learning." } },
      { axis: "fm", credits: 4, hours: 60,
        name: { pt: "Cálculo para IA II", es: "Cálculo para IA II", en: "Calculus for AI II" },
        desc: { pt: "Cálculo multivariável e otimização — base do treino de modelos.", es: "Cálculo multivariable y optimización — base del entrenamiento de modelos.", en: "Multivariable calculus and optimization — the basis of model training." } },
      { axis: "fc", credits: 4, hours: 60,
        name: { pt: "Análise e Projeto de Sistemas Baseados em IA", es: "Análisis y Diseño de Sistemas Basados en IA", en: "Analysis & Design of AI-Based Systems" },
        desc: { pt: "Engenharia de software para projetar sistemas inteligentes confiáveis.", es: "Ingeniería de software para diseñar sistemas inteligentes confiables.", en: "Software engineering to design reliable intelligent systems." } },
      { axis: "ia", credits: 4, hours: 60,
        name: { pt: "Aprendizado de Máquina I", es: "Aprendizaje Automático I", en: "Machine Learning I" },
        desc: { pt: "Primeiros modelos: regressão, classificação e avaliação supervisionada.", es: "Primeros modelos: regresión, clasificación y evaluación supervisada.", en: "First models: regression, classification and supervised evaluation." } },
      { axis: "fc", credits: 4, hours: 60,
        name: { pt: "Visualização de Dados", es: "Visualización de Datos", en: "Data Visualization" },
        desc: { pt: "Contar histórias com dados por meio de visualizações claras e éticas.", es: "Contar historias con datos mediante visualizaciones claras y éticas.", en: "Telling stories with data through clear, ethical visualizations." } },
      { axis: "pi", credits: 8, hours: 120,
        name: { pt: "Resolução de Problemas III", es: "Resolución de Problemas III", en: "Problem Solving III" },
        desc: { pt: "Terceiro ciclo ABP, integrando aprendizado de máquina às soluções.", es: "Tercer ciclo ABP, integrando aprendizaje automático a las soluciones.", en: "Third PBL cycle, weaving machine learning into solutions." } }
    ]
  },
  {
    n: 4,
    components: [
      { axis: "fm", credits: 4, hours: 60,
        name: { pt: "Probabilidade e Estatística para IA", es: "Probabilidad y Estadística para IA", en: "Probability & Statistics for AI" },
        desc: { pt: "Incerteza, inferência e o raciocínio estatístico por trás dos modelos.", es: "Incertidumbre, inferencia y el razonamiento estadístico de los modelos.", en: "Uncertainty, inference and the statistical reasoning behind models." } },
      { axis: "fc", credits: 4, hours: 60,
        name: { pt: "Análise de Algoritmos para IA", es: "Análisis de Algoritmos para IA", en: "Algorithm Analysis for AI" },
        desc: { pt: "Eficiência, complexidade e escolha de algoritmos para problemas de IA.", es: "Eficiencia, complejidad y elección de algoritmos para problemas de IA.", en: "Efficiency, complexity and algorithm choice for AI problems." } },
      { axis: "ia", credits: 4, hours: 60,
        name: { pt: "Aprendizado de Máquina II", es: "Aprendizaje Automático II", en: "Machine Learning II" },
        desc: { pt: "Modelos avançados, ensembles e aprendizado não supervisionado.", es: "Modelos avanzados, ensembles y aprendizaje no supervisado.", en: "Advanced models, ensembles and unsupervised learning." } },
      { axis: "ia", credits: 4, hours: 60,
        name: { pt: "Processamento de Linguagem Natural", es: "Procesamiento de Lenguaje Natural", en: "Natural Language Processing" },
        desc: { pt: "Como máquinas entendem e geram linguagem — dos tokens aos LLMs.", es: "Cómo las máquinas entienden y generan lenguaje — de los tokens a los LLMs.", en: "How machines understand and generate language — from tokens to LLMs." } },
      { axis: "ia", credits: 4, hours: 60,
        name: { pt: "Sistemas Multiagentes", es: "Sistemas Multiagente", en: "Multi-Agent Systems" },
        desc: { pt: "Agentes autônomos que cooperam, negociam e raciocinam coletivamente.", es: "Agentes autónomos que cooperan, negocian y razonan colectivamente.", en: "Autonomous agents that cooperate, negotiate and reason collectively." } },
      { axis: "pi", credits: 8, hours: 120,
        name: { pt: "Resolução de Problemas IV", es: "Resolución de Problemas IV", en: "Problem Solving IV" },
        desc: { pt: "Quarto ciclo ABP, com soluções de IA mais sofisticadas e autônomas.", es: "Cuarto ciclo ABP, con soluciones de IA más sofisticadas y autónomas.", en: "Fourth PBL cycle, with more sophisticated, autonomous AI solutions." } }
    ]
  },
  {
    n: 5,
    components: [
      { axis: "ia", credits: 4, hours: 60,
        name: { pt: "Visão Computacional", es: "Visión por Computador", en: "Computer Vision" },
        desc: { pt: "Ensinar máquinas a enxergar: imagens, vídeo e percepção visual.", es: "Enseñar a las máquinas a ver: imágenes, video y percepción visual.", en: "Teaching machines to see: images, video and visual perception." } },
      { axis: "ia", credits: 4, hours: 60,
        name: { pt: "Aprendizado de Máquina III", es: "Aprendizaje Automático III", en: "Machine Learning III" },
        desc: { pt: "Tópicos avançados e fronteira do aprendizado de máquina aplicado.", es: "Temas avanzados y la frontera del aprendizaje automático aplicado.", en: "Advanced topics and the frontier of applied machine learning." } },
      { axis: "ia", credits: 4, hours: 60,
        name: { pt: "Aprendizado Profundo", es: "Aprendizaje Profundo", en: "Deep Learning" },
        desc: { pt: "Redes neurais profundas, transformers e IA generativa moderna.", es: "Redes neuronales profundas, transformers e IA generativa moderna.", en: "Deep neural networks, transformers and modern generative AI." } },
      { axis: "ia", credits: 4, hours: 60,
        name: { pt: "Inteligência Computacional Aplicada", es: "Inteligencia Computacional Aplicada", en: "Applied Computational Intelligence" },
        desc: { pt: "Metaheurísticas, computação bioinspirada e otimização inteligente.", es: "Metaheurísticas, computación bioinspirada y optimización inteligente.", en: "Metaheuristics, bio-inspired computing and intelligent optimization." } },
      { axis: "pi", credits: 8, hours: 120,
        name: { pt: "Resolução de Problemas V", es: "Resolución de Problemas V", en: "Problem Solving V" },
        desc: { pt: "Quinto ciclo ABP com forte componente de extensão na comunidade.", es: "Quinto ciclo ABP con fuerte componente de extensión en la comunidad.", en: "Fifth PBL cycle with strong community outreach component." } }
    ]
  },
  {
    n: 6,
    components: [
      { axis: "cp", credits: 4, hours: 60,
        name: { pt: "Inteligência Artificial, Equidade e Direitos", es: "Inteligencia Artificial, Equidad y Derechos", en: "AI, Equity & Rights" },
        desc: { pt: "Ética algorítmica, vieses, governança de dados e IA responsável.", es: "Ética algorítmica, sesgos, gobernanza de datos e IA responsable.", en: "Algorithmic ethics, bias, data governance and responsible AI." } },
      { axis: "fc", credits: 4, hours: 60,
        name: { pt: "Processamento de Grandes Volumes de Dados", es: "Procesamiento de Grandes Volúmenes de Datos", en: "Big Data Processing" },
        desc: { pt: "Computação distribuída e arquiteturas para dados em larga escala.", es: "Computación distribuida y arquitecturas para datos a gran escala.", en: "Distributed computing and architectures for large-scale data." } },
      { axis: "ia", credits: 4, hours: 60,
        name: { pt: "Cibersegurança em Inteligência Artificial", es: "Ciberseguridad en Inteligencia Artificial", en: "Cybersecurity in AI" },
        desc: { pt: "Ataques adversariais, robustez e segurança de sistemas de IA.", es: "Ataques adversariales, robustez y seguridad de sistemas de IA.", en: "Adversarial attacks, robustness and AI systems security." } },
      { axis: "pi", credits: 8, hours: 120,
        name: { pt: "Resolução de Problemas VI", es: "Resolución de Problemas VI", en: "Problem Solving VI" },
        desc: { pt: "Ciclo final da trilha ABP, consolidando seis semestres de prática real.", es: "Ciclo final del trayecto ABP, consolidando seis semestres de práctica real.", en: "Final PBL cycle, consolidating six semesters of real practice." } }
    ]
  },
  {
    n: 7,
    components: [
      { axis: "pi", credits: 10, hours: 150,
        name: { pt: "Trabalho de Conclusão de Curso I", es: "Trabajo de Fin de Curso I", en: "Capstone Project I" },
        desc: { pt: "Concepção e fundamentação de um projeto técnico-científico autoral.", es: "Concepción y fundamentación de un proyecto técnico-científico propio.", en: "Conceiving and grounding an original technical-scientific project." } },
      { axis: "cg", credits: 0, hours: 0, elective: true,
        name: { pt: "Trilhas Eletivas (CCCG)", es: "Trayectos Electivos (CCCG)", en: "Elective Tracks (CCCG)" },
        desc: { pt: "Personalize sua formação com as trilhas de IA aplicada (ver abaixo).", es: "Personaliza tu formación con los trayectos de IA aplicada (ver abajo).", en: "Tailor your degree with the applied-AI tracks (see below)." } }
    ]
  },
  {
    n: 8,
    components: [
      { axis: "pi", credits: 12, hours: 180,
        name: { pt: "Trabalho de Conclusão de Curso II", es: "Trabajo de Fin de Curso II", en: "Capstone Project II" },
        desc: { pt: "Desenvolvimento, validação e defesa do projeto final de curso.", es: "Desarrollo, validación y defensa del proyecto final de curso.", en: "Building, validating and defending the final degree project." } },
      { axis: "cg", credits: 0, hours: 0, elective: true,
        name: { pt: "Trilhas Eletivas (CCCG)", es: "Trayectos Electivos (CCCG)", en: "Elective Tracks (CCCG)" },
        desc: { pt: "Personalize sua formação com as trilhas de IA aplicada (ver abaixo).", es: "Personaliza tu formación con los trayectos de IA aplicada (ver abajo).", en: "Tailor your degree with the applied-AI tracks (see below)." } }
    ]
  }
];

/* Componentes Curriculares Complementares (CCCGs) — trilhas eletivas (Tabela 7).
   "feature" marca as trilhas de IA aplicada que viram a constelação de destaque. */
const ELECTIVES = [
  { feature: true, icon: "🩺", name: { pt: "IA Aplicada à Saúde", es: "IA Aplicada a la Salud", en: "AI Applied to Health" } },
  { feature: true, icon: "🌱", name: { pt: "IA Aplicada ao Agronegócio", es: "IA Aplicada al Agronegocio", en: "AI Applied to Agribusiness" } },
  { feature: true, icon: "🤖", name: { pt: "IA Aplicada à Robótica", es: "IA Aplicada a la Robótica", en: "AI Applied to Robotics" } },
  { feature: true, icon: "🛡️", name: { pt: "IA Aplicada à Cibersegurança", es: "IA Aplicada a la Ciberseguridad", en: "AI Applied to Cybersecurity" } },
  { feature: true, icon: "🏛️", name: { pt: "IA Aplicada a Políticas Públicas", es: "IA Aplicada a Políticas Públicas", en: "AI Applied to Public Policy" } },
  { feature: true, icon: "🎮", name: { pt: "IA para Jogos Digitais", es: "IA para Juegos Digitales", en: "AI for Digital Games" } },
  { feature: true, icon: "⚛️", name: { pt: "Computação Quântica Aplicada à IA", es: "Computación Cuántica Aplicada a la IA", en: "Quantum Computing for AI" } },
  { feature: true, icon: "🎨", name: { pt: "IA em Computação Gráfica", es: "IA en Computación Gráfica", en: "AI in Computer Graphics" } },
  { feature: true, icon: "🏭", name: { pt: "IA Aplicada às Engenharias", es: "IA Aplicada a las Ingenierías", en: "AI Applied to Engineering" } },
  { feature: true, icon: "🎓", name: { pt: "IA Aplicada à Educação", es: "IA Aplicada a la Educación", en: "AI Applied to Education" } },
  { feature: true, icon: "🏢", name: { pt: "IA na Automação das Empresas", es: "IA en la Automatización de Empresas", en: "AI in Business Automation" } },
  { feature: true, icon: "🏗️", name: { pt: "IA na Automação no Governo", es: "IA en la Automatización del Gobierno", en: "AI in Government Automation" } },
  { feature: true, icon: "📐", name: { pt: "IA Aplicada à Matemática", es: "IA Aplicada a la Matemática", en: "AI Applied to Mathematics" } },
  { feature: true, icon: "🧳", name: { pt: "IA Aplicada ao Turismo", es: "IA Aplicada al Turismo", en: "AI Applied to Tourism" } },
  { feature: true, icon: "⚙️", name: { pt: "MLOps — Operações de ML", es: "MLOps — Operaciones de ML", en: "MLOps — ML Operations" } },
  { feature: false, name: { pt: "Linguagem de Programação para Ciência de Dados", es: "Lenguaje de Programación para Ciencia de Datos", en: "Programming Language for Data Science" } },
  { feature: false, name: { pt: "Pesquisa e Inovação", es: "Investigación e Innovación", en: "Research & Innovation" } },
  { feature: false, name: { pt: "Práticas de Leitura e Escrita em Inglês", es: "Prácticas de Lectura y Escritura en Inglés", en: "English Reading & Writing Practice" } },
  { feature: false, name: { pt: "Laboratório de Escrita e Revisão de Artigos", es: "Laboratorio de Escritura y Revisión de Artículos", en: "Paper Writing & Review Lab" } },
  { feature: false, name: { pt: "Ética e Dados", es: "Ética y Datos", en: "Ethics & Data" } },
  { feature: false, name: { pt: "Acessibilidade e Inclusão Digital", es: "Accesibilidad e Inclusión Digital", en: "Accessibility & Digital Inclusion" } },
  { feature: false, name: { pt: "Tecnologia em Contexto Social", es: "Tecnología en Contexto Social", en: "Technology in Social Context" } },
  { feature: false, name: { pt: "Relações Étnico-Raciais", es: "Relaciones Étnico-Raciales", en: "Ethnic-Racial Relations" } },
  { feature: false, name: { pt: "Libras", es: "Lengua de Señas (Libras)", en: "Brazilian Sign Language (Libras)" } },
  { feature: false, name: { pt: "Segurança no Trabalho e Gestão Ambiental", es: "Seguridad Laboral y Gestión Ambiental", en: "Workplace Safety & Environmental Management" } }
];

/* =========================================================================
   Parceiros do BIA
   - strong: parceiros estratégicos com contrapartida firmada (destaque)
   - supporters: instituições signatárias de cartas/moções de apoio
   Fonte: cartas e moções de apoio reunidas em apoio/ (não publicadas).
   ========================================================================= */
const PARTNERS = {
  strong: [
    {
      name: "PampaTec",
      url: "https://bia-unipampa.github.io",
      full: {
        pt: "Parque Científico e Tecnológico do Pampa",
        es: "Parque Científico y Tecnológico del Pampa",
        en: "Pampa Science & Technology Park"
      },
      note: {
        pt: "Ecossistema de inovação vizinho ao campus. Parceiro estratégico com compromisso de contrapartida firmado ao curso.",
        es: "Ecosistema de innovación vecino al campus. Socio estratégico con compromiso de contrapartida firmado con el curso.",
        en: "An innovation ecosystem next to the campus. A strategic partner with a committed contribution to the program."
      }
    },
    {
      name: "Prefeitura Municipal de Alegrete",
      url: "https://www.alegrete.rs.gov.br",
      full: {
        pt: "Prefeitura Municipal de Alegrete",
        es: "Municipalidad de Alegrete",
        en: "Municipality of Alegrete"
      },
      note: {
        pt: "Parceira estratégica do curso, com apoio e contrapartida firmados para viabilizar o BIA no município.",
        es: "Socia estratégica del curso, con apoyo y contrapartida firmados para viabilizar el BIA en el municipio.",
        en: "A strategic partner, with committed support and contribution to bring BIA to the city."
      }
    }
  ],
  supporters: [
    { mark: "CV", name: "Câmara de Vereadores de Alegrete", full: "Câmara Municipal de Vereadores de Alegrete" },
    { mark: "CO", name: "COREDE Fronteira Oeste", full: "Conselho Regional de Desenvolvimento da Fronteira Oeste" },
    { mark: "AM", name: "AMFRO", full: "Associação dos Municípios da Fronteira Oeste" },
    { mark: "UL", name: "ULFRO", full: "União dos Legislativos da Fronteira Oeste" },
    { mark: "SB", name: "SEBRAE", full: "Serviço Brasileiro de Apoio às Micro e Pequenas Empresas" },
    { mark: "CE", name: "Centro Empresarial de Alegrete", full: "Centro Empresarial de Alegrete (CEA)" },
    { mark: "SL", name: "Sindilojas Alegrete", full: "Sindicato do Comércio Varejista de Alegrete" },
    { mark: "SI", name: "Sicredi", full: "Sicredi Essência" },
    { mark: "PN", name: "Grupo Pilecco Nobre", full: "Grupo Pilecco Nobre Alimentos" },
    { mark: "FM", name: "Fundação Maronna", full: "Fundação Maronna" },
    { mark: "KB", name: "Kabongo", full: "Kabongo Grupo" },
    { mark: "DP", name: "DevPampa", full: "DevPampa" },
    { mark: "AG", name: "Agrare", full: "Agrare Desenvolvimento de Sistemas" },
    { mark: "DW", name: "Dwtec", full: "Dwtec Consultoria" },
    { mark: "EG", name: "EGD Energia", full: "EGD Tecnologia em Energia" },
    { mark: "DL", name: "EIXO Data Lab", full: "EIXO Data Lab Tecnologia e Consultoria" },
    { mark: "CC", name: "Controll Customs", full: "Controll Customs Systems Consulting" },
    { mark: "LS", name: "Lite SaaS", full: "Lite SaaS Soluções Tecnológicas" },
    { mark: "VE", name: "Venda ERP", full: "Venda ERP" },
    { mark: "AQ", name: "Agendei Quadras", full: "Agendei Quadras" },
    { mark: "FF", name: "Fontoura e Fontoura", full: "Fontoura e Fontoura" },
    { mark: "SG", name: "SEAC Gestão", full: "Saúde Empresarial, Assessoria e Consultoria em Gestão" },
    { mark: "SE", name: "Sendas Equipamentos", full: "Sendas Equipamentos" },
    { mark: "RT", name: "Rádio Tchê Alegrete", full: "Rádio Tchê Alegrete" },
    { mark: "VV", name: "Vanessa M. P. Vargas", full: "Vanessa Machado Poltozi Vargas" }
  ]
};

window.BIA_DATA = { AXES, SEMESTERS, ELECTIVES, PARTNERS };
