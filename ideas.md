# Direção de design — Extensão Fácil

## Três abordagens consideradas

### Tema: Caderno de Campo Contemporâneo
**Introdução breve:** Um portal que combina a clareza de um material didático com a energia prática de um kit de campo. A estética é acolhedora, organizada e orientada à ação.
**Probabilidade:** 0,06

### Tema: Sinalização de Impacto
**Introdução breve:** Uma linguagem inspirada em sistemas de orientação e placas de serviços comunitários, com informações diretas e uma navegação extremamente legível. A sensação é de orientação segura em um percurso desconhecido.
**Probabilidade:** 0,03

### Tema: Editorial Comunitário
**Introdução breve:** Um portal de conteúdo com ritmo de revista independente, fotografias documentais e blocos de leitura generosos. A estética valoriza histórias, contexto e a dimensão humana da extensão.
**Probabilidade:** 0,08

## Abordagem escolhida: Caderno de Campo Contemporâneo

### Movimento de design
**Caderno de campo editorial**: uma interpretação digital de folhas organizadas, notas de estudo e sinais de progresso, unindo credibilidade acadêmica a uma presença humana e prática.

### Princípios centrais
1. A informação deve parecer guiada, nunca intimidante: cada tela mostra um próximo passo claro.
2. A estrutura editorial deve facilitar leitura rápida e aprofundamento gradual.
3. Elementos de campo — marcações, linhas de rota, etiquetas e checkmarks — materializam o processo de realizar uma ação extensionista.
4. A sobriedade acadêmica é suavizada por calor visual e ilustrações documentais, sem recorrer a estéticas genéricas de SaaS.

### Filosofia de cor
O fundo será um **papel mineral claro**, oferecendo conforto em leituras longas. O verde petróleo comunica orientação e confiança; o coral terracota aponta para ação e impacto social. Um amarelo-lima discreto funciona como marcação de caderno, reservada para descobertas e progresso. O objetivo não é decorar: cada cor faz o usuário entender em que etapa está.

### Paradigma de layout
Em vez de centralizar tudo em uma grade uniforme, o portal terá uma **linha de percurso**: a hero apresenta a pergunta e os blocos seguintes se distribuem em faixas editoriais, cartões com ligeira sobreposição e trilhas laterais. Em conteúdos longos, um trilho de leitura contextual orienta o próximo passo.

### Elementos de assinatura
1. Uma linha de rota pontilhada em verde petróleo, conectando decisões e etapas do projeto.
2. Etiquetas com contorno coral para curso, ODS e estágio da atividade.
3. Cartões de papel com uma dobra discreta no canto, usados para ferramentas e guias essenciais.

### Filosofia de interação
Cada interação deve reforçar progresso e domínio: seleções mostram uma confirmação clara, ferramentas devolvem orientação explicável e botões indicam a próxima ação concreta. Não há urgência artificial, pop-ups comerciais nem elementos que pareçam uma fábrica de trabalhos.

### Animação
Movimentos sutis de 160–240 ms com `cubic-bezier(0.23, 1, 0.32, 1)`. Cartões sobem 2–4 px no hover, os trajetos pontilhados revelam-se com opacidade e as seções entram em cadência curta. O conteúdo respeita `prefers-reduced-motion` e nenhuma animação deve atrasar leitura ou navegação.

### Sistema tipográfico
**DM Serif Display** cria títulos editoriais, com personalidade acadêmica e humana. **Manrope** dá precisão às interfaces, formulários e textos de apoio. Títulos principais usam pesos marcados e quebras intencionais; a leitura longa usa 16–18 px com altura de linha ampla; rótulos usam caixa alta moderada e rastreamento ampliado.

### Essência da marca
**Extensão Fácil transforma o roteiro acadêmico em um caminho prático para estudantes que querem realizar sua atividade extensionista com clareza e autonomia.**

Personalidade: **clara, acolhedora, organizada**.

### Voz da marca
A voz é direta, útil e respeitosa: explica o próximo passo sem prometer atalhos. Títulos falam de ação; CTAs descrevem o resultado que entregam; microcopy reduz insegurança.

> “Você não precisa começar sabendo tudo. Comece escolhendo um problema que vale resolver.”

> “Transforme a ideia em um plano simples, possível e bem documentado.”

### Wordmark e logo
O wordmark deve combinar o nome em serif editorial com um ícone de **marcador de rota que também lembra uma folha aberta**. A marca gráfica será usada sozinha em espaços pequenos e o wordmark integra cabeçalho e rodapé.

### Cor de assinatura
**Verde Rota — `#135D57`**. Um verde petróleo próprio, usado em navegação, percursos e elementos de confiança.

## Style Decisions

- A linha pontilhada **Verde Rota** aparece em toda página principal como sinal de leitura, avanço ou decisão; não fica restrita à homepage.
- O amarelo-lima funciona como marca-texto de descoberta, progresso e confirmação. Superfícies hero permanecem prioritariamente em papel mineral e Verde Rota.
- Ferramentas são tratadas como folhas de campo guiadas: etapas numeradas, conectores de percurso, notas de apoio e blocos de decisão claros substituem a aparência de formulário genérico.
