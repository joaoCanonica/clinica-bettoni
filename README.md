# Clínica Dr. Bettoni

Site estático com oito páginas, CSS e JavaScript compartilhados. Sem instalação ou build.

## Abrir e publicar

1. Extraia o ZIP e abra `index.html` para conhecer o site. Mantenha a pasta `assets` junto dos arquivos HTML.
2. Para servir localmente, use `python -m http.server 8080` nesta pasta e abra `http://localhost:8080`.
3. No GitHub, envie o conteúdo desta pasta para um repositório.
4. Na Vercel, importe o repositório, selecione **Other**, deixe Build Command vazio e use a raiz do projeto como diretório de saída. Não há dependências.
5. O site usa hoje a origem `https://clinica-bettoni.vercel.app` em canonical, Open Graph, JSON-LD, `sitemap.xml`, `robots.txt` e `site.webmanifest`.

## Trocar o domínio

Quando o domínio definitivo estiver apontado para a Vercel:

```
node scripts/definir-dominio.mjs https://novodominio.com.br
node scripts/check-site.mjs
```

O primeiro comando troca a origem em todos os `.html`, `sitemap.xml`, `robots.txt` e `site.webmanifest` e informa quantas trocas fez (atualize também `ORIGEM` em `scripts/check-site.mjs`). Depois, na Vercel (Project → Settings → Domains), configure o endereço `.vercel.app` para redirecionar ao domínio novo.

## Scripts (opcionais; o site não depende deles)

- `scripts/check-site.mjs`: verificação de títulos, metadados, cabeçalho e rodapé iguais entre páginas, links, JSON-LD, FAQ, regra CFM, sitemap e contraste AA (este último com Playwright e o site em `http://localhost:8000`).
- `scripts/definir-dominio.mjs`: troca de domínio.
- `scripts/lotus.py`: desenho vetorial da lótus (gera `assets/lotus-mark.svg` e `assets/favicon.svg` e imprime o SVG da abertura).
- `scripts/gerar-og.py`: favicons, `apple-touch-icon.png` e `assets/og-image.jpg` (requer `pillow` e `cairosvg`).

## Abertura (tela de entrada)

Somente em `index.html`. Aparece para quem chega de fora do site; não aparece ao voltar de uma página interna nem com `?sem-intro`. Pode ser pulada com clique, toque, Esc ou o botão "Pular". Tempos e curva de animação ficam nas variáveis `--intro-*` no fim de `site.css`.

## Incluído

- Abertura com a lótus vetorial desabrochando (cerca de 3,4 s, somente na home).
- Saúde mental, ultrassonografia, perfil do médico, clínica, convênios, conteúdos e privacidade.
- Fotos reais, vídeo H.264/AAC com poster e sem reprodução automática.
- Busca entre 15 convênios/parcerias, galeria ampliável, menu móvel e perguntas expansíveis.
- WhatsApp com mensagens por contexto, telefone, dois perfis de Instagram, Linktree e rotas.
- Mapa externo carregado sob escolha do visitante.
- Layouts adaptativos, foco visível, redução de movimento e dados estruturados locais.
- Favicon, ícones e imagem de compartilhamento a partir da lótus vetorial. Open Graph, Twitter card, canonical, sitemap e JSON-LD completos.

## Conteúdo e manutenção

Dados presentes nos HTML; estilos em `site.css`, comportamentos em `site.js`. Edite telefone, horários e endereço em todas as páginas quando houver mudanças. Imagens WebP em `assets`.

A foto de lótus é ilustrativa, gerada para a abertura. Todas as fotos de pessoas e ambientes são as fornecidas pelo cliente. Nenhum depoimento ou resultado foi inventado.

## Validação realizada e limites

Verificação automática de arquivos locais, âncoras, IDs, H1, textos alternativos e links WhatsApp; análise sintática do JavaScript aprovada. Codec, orientação, duração e tamanho do vídeo conferidos. Relatório em `VALIDACAO.json`.

Revisão de outubro de 2026: testado com Chromium (Playwright) em 320, 390, 768, 1024, 1440 px e largura equivalente a zoom de 200%, teclado, menu, galeria, abertura, movimento reduzido e sem JavaScript; Lighthouse mobile. Falta validar em Safari/iPhone e Android reais.

Os três sites de referência não abriram na ferramenta de consulta; o projeto foi orientado pelos materiais reais e pela direção solicitada, sem alegar análise visual dessas referências.

## Confirmações de conteúdo antes de publicação

- Conferir a grafia cadastral completa: alguns textos trazem Betoni, outros Bettoni. A marca e o nome predominante fornecido foram usados.
- Confirmar vigência, grafia e condições dos convênios, especialmente SINTRATUHL, transcrito do print.
- As formações são apresentadas como fornecidas. Não foi atribuído título de especialista nem RQE.
- Confirmar política de privacidade com os serviços de hospedagem que forem escolhidos.
- O vídeo enviado não traz legendas; incluir legendas revisadas amplia a acessibilidade.
- As fotos são capturas com resolução limitada. Arquivos originais podem melhorar a qualidade, especialmente em telas grandes.

Fontes tipográficas (DM Sans e Spectral, licença OFL) hospedadas no próprio site. WhatsApp, Instagram, Linktree e Google Maps dependem dos respectivos serviços externos. Botões de contato iniciam conversa; não confirmam agendamento automaticamente.
