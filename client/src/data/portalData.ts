/**
 * Direção visual: Caderno de Campo Contemporâneo — dados editoriais claros, úteis e sem promessas comerciais.
 */

export const SITE_URL = "https://extensaofacil.com.br";
export const SITE_NAME = "Extensão Fácil";
export const STORAGE_PREFIX = "extensao-facil";

export type Course = {
  slug: string;
  name: string;
  short: string;
  summary: string;
  accent: string;
  ideas: string[];
  places: string[];
  ods: string[];
};

export const courses: Course[] = [
  {
    slug: "pedagogia",
    name: "Pedagogia",
    short: "Pedagogia",
    summary: "Ações de leitura, aprendizagem, inclusão e apoio à comunidade escolar.",
    accent: "#D6E862",
    ideas: ["roda de leitura", "oficina de jogos educativos", "apoio à alfabetização"],
    places: ["escolas", "creches", "bibliotecas comunitárias"],
    ods: ["ODS 4", "ODS 10"],
  },
  {
    slug: "enfermagem",
    name: "Enfermagem",
    short: "Enfermagem",
    summary: "Educação em saúde, prevenção e cuidado próximo dos diferentes públicos.",
    accent: "#F3B183",
    ideas: ["educação em saúde", "roda de prevenção", "orientação de autocuidado"],
    places: ["unidades de saúde", "centros comunitários", "ILPIs"],
    ods: ["ODS 3", "ODS 10"],
  },
  {
    slug: "administracao",
    name: "Administração",
    short: "Administração",
    summary: "Organização, planejamento e fortalecimento de pequenos negócios locais.",
    accent: "#A5D8CA",
    ideas: ["oficina de orçamento", "mapa de processos", "planejamento de vendas"],
    places: ["comércios", "associações", "empreendimentos locais"],
    ods: ["ODS 8", "ODS 12"],
  },
  {
    slug: "analise-e-desenvolvimento-de-sistemas",
    name: "Análise e Desenvolvimento de Sistemas",
    short: "ADS",
    summary: "Inclusão digital e soluções simples para necessidades reais da comunidade.",
    accent: "#95C8EA",
    ideas: ["oficina de cidadania digital", "diagnóstico de presença digital", "guia de segurança online"],
    places: ["escolas", "ONGs", "pequenos negócios"],
    ods: ["ODS 4", "ODS 8"],
  },
  {
    slug: "direito",
    name: "Direito",
    short: "Direito",
    summary: "Orientação cidadã e educação sobre direitos em linguagem acessível.",
    accent: "#D4C0F1",
    ideas: ["roda de direitos", "cartilha cidadã", "orientação para serviços públicos"],
    places: ["associações", "centros sociais", "escolas"],
    ods: ["ODS 10", "ODS 16"],
  },
  {
    slug: "recursos-humanos",
    name: "Recursos Humanos",
    short: "RH",
    summary: "Empregabilidade, desenvolvimento profissional e organização de equipes.",
    accent: "#F2CF7B",
    ideas: ["currículo e entrevista", "mapeamento de competências", "oficina de carreira"],
    places: ["escolas", "ONGs", "associações"],
    ods: ["ODS 8", "ODS 10"],
  },
  {
    slug: "biomedicina",
    name: "Biomedicina",
    short: "Biomedicina",
    summary: "Popularização científica, prevenção e informação de saúde com responsabilidade.",
    accent: "#B2DFC7",
    ideas: ["mitos e verdades em saúde", "ação de prevenção", "educação sanitária"],
    places: ["escolas", "unidades de saúde", "centros comunitários"],
    ods: ["ODS 3", "ODS 4"],
  },
  {
    slug: "servico-social",
    name: "Serviço Social",
    short: "Serviço Social",
    summary: "Acesso a direitos, informação social e mobilização comunitária.",
    accent: "#F0AFA5",
    ideas: ["mapa de serviços", "roda de acesso a direitos", "orientação comunitária"],
    places: ["CRAS", "associações", "instituições sociais"],
    ods: ["ODS 1", "ODS 10"],
  },
  {
    slug: "ciencias-contabeis",
    name: "Ciências Contábeis",
    short: "Contábeis",
    summary: "Educação financeira e organização básica para pessoas e pequenos negócios.",
    accent: "#C5DA8B",
    ideas: ["orçamento doméstico", "controle de caixa", "planejamento financeiro"],
    places: ["comércios", "associações", "escolas"],
    ods: ["ODS 8", "ODS 12"],
  },
];

export type Guide = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  updated: string;
  tags: string[];
  quickAnswer: string;
  sections: { title: string; paragraphs: string[]; bullets?: string[] }[];
  related: string[];
};

export const guides: Guide[] = [
  {
    slug: "projeto-de-extensao",
    title: "Projeto de Extensão: guia completo para entender e fazer o seu",
    description: "Entenda o que é projeto de extensão, como funciona e quais etapas ajudam a planejar, executar e registrar sua atividade.",
    eyebrow: "Guia essencial",
    updated: "21 de agosto de 2026",
    tags: ["começo", "planejamento", "extensão universitária"],
    quickAnswer: "Um projeto de extensão é uma atividade em que você aplica conhecimentos do seu curso em diálogo com uma necessidade real da comunidade. Normalmente, o processo envolve identificar um problema, escolher um público e um local, planejar uma ação viável, executá-la e registrar os resultados e as evidências no relatório final.",
    sections: [
      { title: "O que é projeto de extensão", paragraphs: ["A extensão aproxima a formação universitária da sociedade. Em vez de trabalhar apenas com um tema em sala, você observa uma necessidade concreta e propõe uma ação compatível com as competências do seu curso.", "O formato exato pode variar entre instituições e disciplinas. Por isso, o roteiro oficial da sua faculdade é sempre a referência para prazos, campos obrigatórios e critérios de avaliação."] },
      { title: "Para que serve", paragraphs: ["O objetivo não é apenas cumprir uma disciplina. Uma boa ação extensionista produz aprendizado aplicado, cria uma contribuição possível para o público atendido e deixa um registro claro do que foi feito."] },
      { title: "As etapas que deixam o projeto possível", paragraphs: ["Comece pequeno e concreto. A melhor escolha costuma ser uma necessidade que você consegue entender, uma atividade que cabe no tempo disponível e um resultado que pode ser observado."], bullets: ["Defina o problema e o público beneficiado.", "Escolha um local que aceite e facilite a ação.", "Relacione a proposta às competências do curso e ao ODS mais adequado.", "Planeje materiais, datas, responsáveis e evidências.", "Execute, registre e reflita sobre o resultado."] },
      { title: "Erros que vale evitar", paragraphs: ["Evite propor uma atividade grande demais, escolher ODS apenas pelo nome ou deixar fotos e depoimentos para a última hora. Planejamento simples, comunicação com o local e registro durante a ação reduzem os problemas mais comuns."] },
    ],
    related: ["como-fazer-projeto-de-extensao", "ideias-projeto-de-extensao", "onde-realizar"],
  },
  {
    slug: "como-fazer-projeto-de-extensao",
    title: "Como fazer projeto de extensão: passo a passo prático",
    description: "Veja como escolher tema, público, local, ODS, atividade e evidências para montar um projeto de extensão possível de executar.",
    eyebrow: "Planejamento",
    updated: "21 de agosto de 2026",
    tags: ["passo a passo", "plano de ação", "curso"],
    quickAnswer: "Para fazer um projeto de extensão, parta de uma necessidade simples de um público real. Depois, transforme essa necessidade em uma atividade compatível com seu curso, escolha onde ela pode acontecer, associe um ODS coerente e planeje como vai comprovar o que foi realizado.",
    sections: [
      { title: "1. Comece pelo problema, não pelo título", paragraphs: ["Em vez de procurar um nome bonito para o projeto, descreva uma situação que merece atenção: crianças com pouco acesso à leitura, idosos com dúvidas sobre prevenção, pequenos negócios sem organização financeira ou moradores sem informação sobre um serviço público."] },
      { title: "2. Escolha um público e um local", paragraphs: ["O público define a linguagem e o tamanho da ação. O local deve ser acessível, ter alguém responsável para conversar com você e permitir o registro das atividades de maneira ética."] },
      { title: "3. Desenhe uma atividade simples", paragraphs: ["Uma oficina, roda de conversa, orientação guiada, diagnóstico básico ou material educativo pode ter mais valor que uma ação complexa e difícil de concluir. Liste o que acontece do início ao fim e quais materiais são realmente necessários."] },
      { title: "4. Prepare o registro antes de executar", paragraphs: ["Defina quais fotos são pertinentes, como pedirá autorização, quem poderá dar um depoimento e quais resultados poderá observar. Essa preparação torna o relatório mais fiel e evita inventar detalhes depois."] },
    ],
    related: ["projeto-de-extensao", "ods", "evidencias"],
  },
  {
    slug: "ideias-projeto-de-extensao",
    title: "Ideias para projeto de extensão: como encontrar uma proposta viável",
    description: "Encontre critérios e exemplos para escolher ideias de extensão alinhadas ao curso, ao público, ao local e ao ODS.",
    eyebrow: "Inspiração com propósito",
    updated: "21 de agosto de 2026",
    tags: ["ideias", "curso", "ação"],
    quickAnswer: "Uma ideia de extensão fica mais forte quando combina quatro elementos: uma necessidade observável, um público definido, uma competência do seu curso e uma ação viável no local escolhido. Não procure a ideia perfeita; procure uma proposta que você consiga executar, registrar e explicar com honestidade.",
    sections: [
      { title: "Um filtro simples para escolher bem", paragraphs: ["Antes de se decidir, responda: qual problema vou enfrentar, para quem, com qual conhecimento do meu curso e em que contexto? Se uma resposta estiver vaga, a ideia ainda precisa amadurecer."] },
      { title: "Ideias que nascem do contexto", paragraphs: ["Em uma escola, uma atividade pode apoiar leitura, orientação profissional ou cidadania digital. Em um comércio, pode trabalhar organização, atendimento ou finanças. Em uma unidade de saúde, pode transformar informação técnica em orientação preventiva."] },
      { title: "Como adaptar sem copiar", paragraphs: ["Uma mesma modalidade de ação pode servir a cursos diferentes, mas o objetivo, a linguagem e a entrega precisam mudar. Uma oficina de orçamento feita por Administração não é igual a uma roda sobre finanças conduzida por Ciências Contábeis; cada uma mobiliza competências e resultados próprios."] },
    ],
    related: ["como-fazer-projeto-de-extensao", "onde-realizar", "ods"],
  },
  {
    slug: "relatorio-final",
    title: "Relatório final de atividades extensionistas: como organizar o seu",
    description: "Entenda como reunir objetivo, descrição da ação, resultados, conclusão, evidências e reflexão em um relatório final consistente.",
    eyebrow: "Documentação",
    updated: "21 de agosto de 2026",
    tags: ["relatório", "resultados", "conclusão"],
    quickAnswer: "O relatório final explica o que foi planejado, o que realmente aconteceu e o que a atividade gerou. Para preenchê-lo bem, use registros feitos durante a ação: datas, local, público, sequência da atividade, resultados observados, evidências permitidas e uma reflexão honesta sobre o processo.",
    sections: [
      { title: "Organize os dados antes de escrever", paragraphs: ["Separe roteiro da disciplina, anotações, fotos autorizadas, lista de materiais e mensagens importantes do local. Isso reduz a chance de omitir detalhes ou preencher campos de memória."] },
      { title: "Escreva o que aconteceu, sem exagerar", paragraphs: ["No campo sobre a ação, descreva a sequência de forma objetiva: recepção, apresentação, atividade realizada, participação do público e encerramento. Nos resultados, indique efeitos observáveis sem afirmar impacto que não foi medido."] },
      { title: "Conclusão e percepção não são repetição", paragraphs: ["A conclusão retoma o objetivo e avalia se ele foi atendido. Já a percepção mostra o que você aprendeu sobre a experiência, os limites encontrados e o que faria diferente em uma próxima ação."] },
    ],
    related: ["evidencias", "como-fazer-projeto-de-extensao", "ods"],
  },
  {
    slug: "ods",
    title: "ODS no projeto de extensão: como escolher o objetivo mais coerente",
    description: "Saiba como relacionar sua atividade extensionista aos Objetivos de Desenvolvimento Sustentável sem escolher apenas pelo título.",
    eyebrow: "Impacto e propósito",
    updated: "21 de agosto de 2026",
    tags: ["ODS", "impacto", "planejamento"],
    quickAnswer: "Para escolher um ODS, olhe primeiro para o problema que sua ação enfrenta e para o resultado que pretende apoiar. Depois, verifique qual objetivo descreve melhor essa contribuição. ODS não é enfeite no relatório: ele ajuda a explicar por que a atividade é socialmente relevante.",
    sections: [
      { title: "Do problema ao objetivo", paragraphs: ["Uma ação de prevenção em saúde costuma dialogar com o ODS 3. Atividades de aprendizagem e letramento podem se relacionar ao ODS 4. Projetos de orientação para trabalho e renda podem apontar para o ODS 8. A relação deve ser explicada com uma frase clara."] },
      { title: "Um ODS principal é suficiente", paragraphs: ["Você pode reconhecer relações secundárias, mas um ODS principal torna a justificativa mais precisa. Escolha dois ou três somente quando houver conexão real e explicável com a mesma atividade."] },
      { title: "Escrevendo a justificativa", paragraphs: ["Uma boa justificativa une ação e efeito esperado: 'A oficina de organização financeira se relaciona ao ODS 8 porque oferece conhecimentos básicos que podem apoiar decisões de trabalho e renda de pequenos empreendedores.'"] },
    ],
    related: ["ferramentas/seletor-de-ods", "projeto-de-extensao", "ideias-projeto-de-extensao"],
  },
  {
    slug: "onde-realizar",
    title: "Onde realizar projeto de extensão: como escolher um local adequado",
    description: "Veja como avaliar escolas, ONGs, comércios, associações e outras instituições para realizar uma atividade extensionista.",
    eyebrow: "Campo de ação",
    updated: "21 de agosto de 2026",
    tags: ["local", "instituição", "parceria"],
    quickAnswer: "Um bom local para projeto de extensão é aquele que tem relação com o problema, acesso ao público e abertura para a atividade. Escola, ONG, associação, comércio, unidade de saúde e instituição social podem funcionar, desde que a ação seja combinada previamente e respeite a rotina do espaço.",
    sections: [
      { title: "O que observar antes de combinar", paragraphs: ["Converse com um responsável, explique sua proposta em poucas frases e pergunte sobre horários, quantidade de pessoas, espaço disponível e cuidados necessários. Não trate o local como cenário: ele é parceiro da ação."] },
      { title: "Locais e ações possíveis", paragraphs: ["Escolas costumam acolher ações educativas; comércios e empreendedores podem se beneficiar de orientações de gestão; instituições sociais permitem atividades de informação e convivência; unidades de saúde podem apoiar educação preventiva quando há autorização e escopo apropriado."] },
      { title: "Respeito, autorização e privacidade", paragraphs: ["Peça autorização para usar imagem e depoimento conforme as regras do local e do seu roteiro. Quando não for possível fotografar pessoas, registre materiais, ambiente, cartazes produzidos ou momentos que não identifiquem participantes."] },
    ],
    related: ["ideias-projeto-de-extensao", "evidencias", "como-fazer-projeto-de-extensao"],
  },
  {
    slug: "evidencias",
    title: "Evidências do projeto de extensão: fotos, registros e cuidados",
    description: "Aprenda a organizar evidências éticas e úteis para mostrar o planejamento, a realização e os resultados da sua atividade extensionista.",
    eyebrow: "Registro responsável",
    updated: "21 de agosto de 2026",
    tags: ["fotos", "evidências", "registro"],
    quickAnswer: "Evidências são registros que ajudam a comprovar o que foi realizado: fotos autorizadas, materiais usados, lista de presença quando permitida, anotações da atividade, produções do público e depoimentos. Elas devem ser planejadas antes, respeitar a privacidade das pessoas e corresponder ao que você descreve no relatório.",
    sections: [
      { title: "O que pode servir como evidência", paragraphs: ["Fotos do ambiente, do material preparado, da atividade em andamento ou do resultado produzido podem ser úteis quando autorizadas. Também vale registrar roteiro, cartazes, planilhas, devolutivas e dados simples que não identifiquem participantes indevidamente."] },
      { title: "Uma sequência de fotos que conta a história", paragraphs: ["Em geral, três momentos ajudam: preparação, realização e resultado. Prefira registros que contextualizem a atividade a poses genéricas. Uma legenda curta com data, local e situação deixa o material mais compreensível."] },
      { title: "Cuidados indispensáveis", paragraphs: ["Não exponha menores, prontuários, dados pessoais ou pessoas que não autorizaram imagem. Siga o roteiro institucional e as orientações do local. Quando houver dúvida, priorize registros do espaço e dos materiais, não dos rostos."] },
    ],
    related: ["relatorio-final", "onde-realizar", "projeto-de-extensao"],
  },
];

export const institutions = [
  { slug: "anhanguera", name: "Anhanguera", summary: "Orientações para organizar a atividade extensionista a partir do seu roteiro oficial.", tone: "#D3E681" },
  { slug: "unopar", name: "Unopar", summary: "Um guia de apoio para entender etapas, registros e documentação da extensão.", tone: "#F1BB94" },
  { slug: "uniderp", name: "Uniderp", summary: "Conteúdos gerais para planejar uma ação com contexto e evidências.", tone: "#BBD9D3" },
  { slug: "pitagoras", name: "Pitágoras", summary: "Pontos de partida para transformar um roteiro em um plano de ação possível.", tone: "#C8D6EE" },
];

export const odsList = [
  { id: "ODS 3", title: "Saúde e bem-estar", summary: "Prevenção, autocuidado, informação e promoção da saúde.", keywords: ["saúde", "prevenção", "idosos", "bem-estar", "autocuidado", "unidade"] },
  { id: "ODS 4", title: "Educação de qualidade", summary: "Aprendizagem, leitura, inclusão educacional e desenvolvimento de competências.", keywords: ["educação", "escola", "leitura", "crianças", "aprendizagem", "oficina"] },
  { id: "ODS 8", title: "Trabalho decente e crescimento econômico", summary: "Empregabilidade, pequenos negócios, renda, planejamento e carreira.", keywords: ["trabalho", "renda", "empresa", "empreendedores", "carreira", "negócio"] },
  { id: "ODS 10", title: "Redução das desigualdades", summary: "Acesso, inclusão, direitos e participação de públicos em situação de vulnerabilidade.", keywords: ["inclusão", "direitos", "comunidade", "acesso", "vulnerabilidade", "idosos"] },
  { id: "ODS 11", title: "Cidades e comunidades sustentáveis", summary: "Vida comunitária, território, convivência e cuidado com espaços locais.", keywords: ["bairro", "comunidade", "cidade", "território", "associação", "moradores"] },
  { id: "ODS 12", title: "Consumo e produção responsáveis", summary: "Consumo consciente, organização de recursos e práticas sustentáveis.", keywords: ["consumo", "resíduos", "financeiro", "recursos", "comércio", "sustentável"] },
  { id: "ODS 16", title: "Paz, justiça e instituições eficazes", summary: "Cidadania, acesso à informação, direitos e diálogo comunitário.", keywords: ["direito", "cidadania", "justiça", "serviços", "público", "orientação"] },
];

export const checklistItems = [
  "Dados da instituição e do local confirmados",
  "Objetivo da ação explicado com clareza",
  "ODS escolhido e justificado",
  "Descrição do que aconteceu durante a ação",
  "Resultados observados registrados",
  "Conclusão conectada ao objetivo",
  "Percepção pessoal escrita com honestidade",
  "Depoimento ou devolutiva autorizado, se aplicável",
  "Evidências organizadas e revisadas",
  "Referências ou materiais consultados citados",
  "Revisão final de datas, nomes e coerência",
];

export type SearchEntry = { title: string; description: string; href: string; category: string; tags: string[] };

export const getGuide = (slug: string) => guides.find((guide) => guide.slug === slug);
export const getCourse = (slug: string) => courses.find((course) => course.slug === slug);
export const getInstitution = (slug: string) => institutions.find((institution) => institution.slug === slug);

export const searchIndex: SearchEntry[] = [
  ...guides.map((guide) => ({ title: guide.title, description: guide.description, href: `/${guide.slug}/`, category: guide.eyebrow, tags: guide.tags })),
  ...courses.map((course) => ({ title: `Projeto de Extensão em ${course.name}`, description: course.summary, href: `/cursos/${course.slug}/`, category: "Curso", tags: [course.name, ...course.ideas, ...course.ods] })),
  ...institutions.map((institution) => ({ title: `Projeto de Extensão ${institution.name}`, description: institution.summary, href: `/faculdades/${institution.slug}/`, category: "Faculdade", tags: [institution.name, "roteiro", "atividade extensionista"] })),
  { title: "Gerador de ideias", description: "Sugestões de atividades por curso, público, local e complexidade.", href: "/ferramentas/gerador-de-ideias/", category: "Ferramenta", tags: ["ideias", "curso", "atividade"] },
  { title: "Seletor de ODS", description: "Encontre o ODS mais coerente para sua ação.", href: "/ferramentas/seletor-de-ods/", category: "Ferramenta", tags: ["ODS", "impacto", "objetivo"] },
  { title: "Checklist do relatório", description: "Acompanhe os itens essenciais antes de entregar o relatório final.", href: "/ferramentas/checklist-relatorio/", category: "Ferramenta", tags: ["relatório", "evidências", "conclusão"] },
  { title: "Sobre o Extensão Fácil", description: "Conheça o propósito editorial e como usamos informações neste portal.", href: "/sobre/", category: "Institucional", tags: ["sobre", "metodologia"] },
];

export const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function findRelated(slugs: string[]) {
  return slugs.map(getGuide).filter((guide): guide is Guide => Boolean(guide));
}

export function getIdeas(course: Course, place: string, audience: string, ods: string, complexity: string) {
  const contextPlace = place && place !== "nao-sei" ? place : course.places[0];
  const contextAudience = audience || "a comunidade atendida";
  const selectedOds = ods || course.ods[0];
  const level = complexity === "simples" ? "em formato direto e de fácil organização" : complexity === "intermediaria" ? "com uma etapa adicional de acompanhamento" : "com escopo adaptável à sua disponibilidade";
  const verbs = ["Conhecer e orientar", "Mapear e propor", "Aprender fazendo", "Dialogar e compartilhar", "Organizar para continuar"];
  const actions = course.ideas;
  return verbs.map((verb, index) => ({
    title: `${verb}: ${actions[index % actions.length]}`,
    problem: `Há uma oportunidade de apoiar ${contextAudience.toLowerCase()} com informação prática relacionada a ${course.name.toLowerCase()}.`,
    audience: contextAudience,
    place: contextPlace,
    activity: `Realize ${actions[index % actions.length]} ${level}. Comece com uma conversa breve, desenvolva uma atividade principal e encerre com uma devolutiva simples.`,
    ods: selectedOds,
    materials: index % 2 === 0 ? "Folhas, canetas, material de apoio e espaço combinado com antecedência." : "Roteiro simples, cartaz ou apresentação curta, registros autorizados e materiais do contexto.",
    evidence: "Foto do material e do ambiente, registro da sequência da atividade e devolutiva autorizada do local.",
    result: "Participantes com acesso a uma orientação clara, material prático ou atividade aplicável ao seu contexto.",
  }));
}

export function rankOds(problem: string, audience: string, action: string, environment: string) {
  const text = normalize(`${problem} ${audience} ${action} ${environment}`);
  return odsList
    .map((ods) => ({ ...ods, score: ods.keywords.reduce((total, keyword) => total + (text.includes(normalize(keyword)) ? 2 : 0), 0) + (ods.id === "ODS 4" && /oficina|orientacao|atividade/.test(text) ? 1 : 0) }))
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}
