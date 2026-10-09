# Clínica Dr. Bettoni

Site estático com oito páginas, CSS e JavaScript compartilhados. Sem instalação ou build.

## Abrir e publicar

1. Extraia o ZIP e abra `index.html` para conhecer o site. Mantenha a pasta `assets` junto dos arquivos HTML.
2. Para servir localmente, use `python -m http.server 8080` nesta pasta e abra `http://localhost:8080`.
3. No GitHub, envie o conteúdo desta pasta para um repositório.
4. Na Vercel, importe o repositório, selecione **Other**, deixe Build Command vazio e use a raiz do projeto como diretório de saída. Não há dependências.
5. Depois de definir o domínio final, adicione canonical, og:url e sitemap.xml com as URLs reais. `robots.txt` já permite indexação.

## Incluído

- Abertura com lótus original gerada para o projeto e animação breve, sem tela de espera.
- Saúde mental, ultrassonografia, perfil do médico, clínica, convênios, conteúdos e privacidade.
- Fotos reais, vídeo H.264/AAC com poster e sem reprodução automática.
- Busca entre 15 convênios/parcerias, galeria ampliável, menu móvel e perguntas expansíveis.
- WhatsApp com mensagens por contexto, telefone, dois perfis de Instagram, Linktree e rotas.
- Mapa externo carregado sob escolha do visitante.
- Layouts adaptativos, foco visível, redução de movimento e dados estruturados locais.
- Favicon a partir da marca enviada. Metadados textuais Open Graph.

## Conteúdo e manutenção

Dados presentes nos HTML; estilos em `site.css`, comportamentos em `site.js`. Edite telefone, horários e endereço em todas as páginas quando houver mudanças. Imagens WebP em `assets`.

A foto de lótus é ilustrativa, gerada para a abertura. Todas as fotos de pessoas e ambientes são as fornecidas pelo cliente. Nenhum depoimento ou resultado foi inventado.

## Validação realizada e limites

Verificação automática de arquivos locais, âncoras, IDs, H1, textos alternativos e links WhatsApp; análise sintática do JavaScript aprovada. Codec, orientação, duração e tamanho do vídeo conferidos. Relatório em `VALIDACAO.json`.

Não havia navegador executável disponível nesta execução. Portanto, **não houve teste visual real em 390, 768, 1280 e 1920 px**, nem verificação real do menu, foco, galeria, reprodução de vídeo, conexão lenta, console ou métricas Core Web Vitals. Os breakpoints e tratamentos de acessibilidade estão implementados, mas esses testes permanecem necessários antes de considerar a versão final de produção. Validar também Safari/iPhone e Android.

Os três sites de referência não abriram na ferramenta de consulta; o projeto foi orientado pelos materiais reais e pela direção solicitada, sem alegar análise visual dessas referências.

## Confirmações de conteúdo antes de publicação

- Conferir a grafia cadastral completa: alguns textos trazem Betoni, outros Bettoni. A marca e o nome predominante fornecido foram usados.
- Confirmar vigência, grafia e condições dos convênios, especialmente SINTRATUHL, transcrito do print.
- As formações são apresentadas como fornecidas. Não foi atribuído título de especialista nem RQE.
- Confirmar política de privacidade com os serviços de hospedagem que forem escolhidos.
- O vídeo enviado não traz legendas; incluir legendas revisadas amplia a acessibilidade.
- As fotos são capturas com resolução limitada. Arquivos originais podem melhorar a qualidade, especialmente em telas grandes.

Fontes tipográficas usam Google Fonts, com fallback local. WhatsApp, Instagram, Linktree e Google Maps dependem dos respectivos serviços externos. Botões de contato iniciam conversa; não confirmam agendamento automaticamente.
