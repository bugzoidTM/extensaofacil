# Notas de validação

## Inspeção inicial — 21/08/2026

A homepage foi renderizada no ambiente de desenvolvimento com navegação, hero documental, blocos de início, ferramentas, cursos, faculdades, guias e rodapé visíveis. A experiência apresenta contraste adequado no hero e nenhuma falha visual crítica foi observada no primeiro viewport.

A rota `/ferramentas/gerador-de-ideias/` foi aberta diretamente e exibiu: breadcrumb, conteúdo explicativo indexável, seletor obrigatório de curso, filtros opcionais de local, público e ODS, controle de complexidade, mensagem de estado vazio e conteúdo de apoio. O formulário está acessível por controles nativos.

Pendências desta auditoria: testar resultados das três ferramentas, busca, checklist persistente, páginas de conteúdo e responsividade móvel; verificar metadados no DOM e executar a revisão visual final.

## Ferramenta — gerador de ideias

Com o curso Pedagogia selecionado, o gerador produziu cinco propostas de atividade. O primeiro cartão foi aberto e exibiu todos os campos previstos: problema identificado, público, local sugerido, atividade, ODS, materiais, evidências e resultado esperado, além de link para o guia de passo a passo. A entrega ocorreu sem API externa e sem login.

## Ferramenta — seletor de ODS

O seletor foi aberto diretamente e apresentou as quatro perguntas obrigatórias em grupos de rádio com rótulos clicáveis. A necessidade de prevenção em saúde e o público de empreendedores foram selecionados com sucesso; o preenchimento será concluído na etapa seguinte para confirmar a classificação e as relações complementares.

As opções de ação preventiva e unidade de saúde também foram selecionadas. Com isso, as quatro respostas obrigatórias do cenário de teste estão completas e o botão de classificação está disponível para a verificação do resultado.

Na primeira submissão, a validação amigável foi exibida porque o campo de tipo de ação não ficou selecionado. A inspeção dos controles confirmou que problema, público e ambiente estavam registrados; a próxima interação testará diretamente o controle de ação pendente antes de repetir a classificação.

Após selecionar diretamente o tipo de ação, o seletor apresentou ODS 3 — Saúde e bem-estar como relação principal, com justificativa em linguagem clara e ODS 8 e ODS 10 como relações complementares. A validação, a classificação determinística e a explicação de resultado foram confirmadas.

## Ferramenta — checklist do relatório

O checklist abriu com estado vazio, contador de 0 de 11 e indicador de 0%. Ao marcar o primeiro item, o contador atualizou para 1 de 11 e o progresso para 9%, confirmando o comportamento de atualização visual. O próximo passo valida que esse estado continua disponível após uma nova abertura da rota.

A reabertura da rota do checklist preservou 1 de 11 itens e 9% de andamento, comprovando o salvamento em localStorage. A busca estática também foi validada com a consulta “pedagogia”, retornando o hub Projeto de Extensão em Pedagogia e mantendo a página configurada como não indexável.

## Conteúdo e rotas

O hub `/cursos/pedagogia/` foi carregado diretamente com breadcrumb, ideias específicas do curso, sugestões de locais, evidências e três links editoriais relacionados. A página pilar `/projeto-de-extensao/` também foi validada com resposta rápida, sumário, autoria, data de atualização, seções semânticas, CTA contextual, fonte consultada e conteúdos relacionados.

## Revisão visual e responsividade

A revisão visual independente confirmou aderência à direção Caderno de Campo Contemporâneo e orientou um reforço do sistema de percurso. Foram aplicadas linhas de leitura, etapas numeradas de ferramenta, elementos de folha de campo, destaques de confirmação mais contidos e notas contextuais nos hubs. Em seguida, home, gerador de ideias e página pilar foram revisados a 390 px sem rolagem horizontal ou perda de legibilidade; o menu móvel, os formulários, os cards, o conteúdo longo e o rodapé se reorganizam em uma coluna legível.

## SEO técnico

A inspeção do documento da página pilar confirmou título exclusivo, description exclusiva, canonical absoluto `https://extensaofacil.com.br/projeto-de-extensao/`, diretiva `index,follow,max-image-preview:large` e dados estruturados `BreadcrumbList` e `Article`. O sitemap e o robots.txt foram incluídos na raiz pública do projeto; a rota de busca utiliza `noindex,follow`.

A homepage também foi inspecionada e apresentou canonical absoluto para a raiz, diretiva indexável e Organization Schema com nome, URL e logo da marca.

O título da homepage foi ajustado e confirmado como `Extensão Fácil | Projeto de Extensão sem complicação`, conforme o padrão previsto no PRD.

## Conteúdo P1 e testes E2E

Foram publicados dez guias P1 adicionais, incluindo resultados, percepção, depoimento, conclusão, evidências fotográficas, ideias por curso e escolha de local. A rota aninhada de relatório final foi verificada diretamente em `/relatorio-final/resultado-da-acao/` e apresenta conteúdo, metadados e recomendações internas corretas. A suíte Playwright cobre geração de cinco ideias, classificação de ODS e persistência do checklist; os três cenários concluíram com sucesso.

A rota P1 `/cursos/pedagogia/ideias/` também foi aberta diretamente e confirmou conteúdo específico de Pedagogia, navegação editorial, canonical absoluto, título exclusivo e diretiva de indexação correta.
