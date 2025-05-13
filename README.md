# Sorteios CESAM (raffle-app)

## Descrição do Projeto

Sorteios CESAM é um aplicativo web para realizar sorteios de forma simples e divertida. Ele permite que você faça sorteios baseados em uma lista de nomes ou em uma faixa de números, com múltiplos sorteios e contagem regressiva personalizável. O aplicativo também possui modo claro e escuro para melhor experiência do usuário.

## Funcionalidades

- Sorteio por nomes: insira uma lista de nomes (um por linha) com paginação para facilitar a visualização e gerenciamento.
- Sorteio por números: defina um intervalo de números e quantos serão sorteados por vez.
- Configuração do número de sorteios a serem realizados.
- Contagem regressiva personalizável antes do sorteio começar, com indicador visual de progresso.
- Exibição dos resultados de cada sorteio separadamente, tanto na interface principal quanto em um modal em tela cheia.
- Botão para refazer o sorteio (sortear novamente) no modal de resultados.
- Animação de confete ao final do sorteio para celebrar os vencedores.
- Suporte a modo claro e modo escuro, com interruptor para alternar entre os modos.
- Validações e alertas para entradas inválidas, como tentar sortear mais nomes do que os disponíveis.
- Interface construída com Material UI (MUI) para componentes e estilo.

## Instalação

1. Clone este repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd aplicativo-sorteio
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```

## Como Usar

1. Execute o aplicativo em modo de desenvolvimento:
   ```bash
   npm start
   ```
2. Abra o navegador e acesse `http://localhost:3000`.

3. Na interface do aplicativo:
   - Insira o nome do sorteio no campo "Nome do Sorteio".
   - Escolha o modo de sorteio: "Nomes" para inserir uma lista de nomes (um por linha) ou "Números" para definir um intervalo numérico.
   - Se escolher "Nomes", adicione nomes individualmente ou vários de uma vez, com paginação para facilitar a visualização.
   - Se escolher "Números", defina o total de números e quantos serão sorteados por vez.
   - Defina o número de sorteios que deseja realizar.
   - Ajuste o tempo da contagem regressiva (em segundos) usando o controle deslizante.
   - Clique no botão "Iniciar Sorteio" para começar. Durante a contagem regressiva, o botão ficará desabilitado e uma barra de progresso será exibida.

4. Após a contagem regressiva, os resultados do(s) sorteio(s) serão exibidos, listando os nomes ou números sorteados para cada sorteio na interface principal.

5. Você pode clicar no botão "Ver Resultados em Tela Cheia" para abrir um modal com os resultados detalhados e a opção de "Sortear Novamente".

6. Uma animação de confete será exibida para celebrar o sorteio.

7. Você pode alternar entre o modo claro e escuro usando o interruptor no canto superior direito, que exibe o estado atual ("Modo Claro" ou "Modo Escuro").

## Build para Produção

Para criar uma versão otimizada para produção, execute:

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `build`.

## Dependências Principais

- React 18
- Material UI (MUI) para componentes e estilo
- react-confetti para animação de confete

## Considerações Finais

Este aplicativo é ideal para eventos, sorteios rápidos e dinâmicos, facilitando a escolha aleatória de vencedores de forma visual e interativa.

---

Se tiver dúvidas ou sugestões, fique à vontade para abrir uma issue ou contribuir com o projeto.

## Customizando a Logo

Se desejar trocar a logo exibida no aplicativo, siga os passos abaixo:

1. Substitua o arquivo `logo.png` localizado na pasta `public` pelo seu arquivo de logo personalizado. Certifique-se de que o novo arquivo tenha o mesmo nome (`logo.png`) para que o aplicativo o reconheça automaticamente.

2. Caso queira usar um nome diferente para o arquivo da logo, atualize o caminho da imagem no arquivo `src/App.jsx`. Procure pela linha que contém:

```jsx
<img src="/logo.png" alt="Company Logo" style={{ maxHeight: 60, marginRight: 16 }} />
```

e altere o valor do atributo `src` para o caminho do seu novo arquivo.

3. Salve as alterações e reinicie o aplicativo, se necessário, para ver a nova logo em ação.
