# Cartinha digital romântica

Um site estático, responsivo e premium de carta digital romântica feito para funcionar diretamente no GitHub Pages, sem backend e com caminhos relativos.

## Arquivos principais

- `index.html`: estrutura da página, carta, galeria, linha do tempo, contador e QR Code.
- `style.css`: visual, responsividade, animações, envelope 3D, partículas visuais e suporte a `prefers-reduced-motion`.
- `script.js`: configurações editáveis, animações em JavaScript, contador, QR Code, partículas, parallax e interações.
- `fotos/`: pasta versionada apenas com README; coloque suas fotos manualmente depois, sem adicioná-las ao PR.

## Como trocar nomes, texto, data e frases

Abra o arquivo `script.js` e edite o bloco `CONFIG` no começo do arquivo:

```js
const CONFIG = {
  personName: "Lupyta",
  authorName: "Vitor",
  counterStartDate: "2024-01-01T00:00:00",
  typingPhrases: [
    "Eu queria que você sentisse meu abraço daqui.",
    "Então transformei saudade em uma cartinha."
  ],
  timelinePhrases: [
    "O dia que eu percebi que você era diferente",
    "As conversas que me acalmam",
    "A saudade que aperta, mas também mostra o quanto você importa",
    "O dia que a gente ainda vai rir disso tudo juntos"
  ],
  particleIntensity: 1,
  animationSpeed: 1
};
```

### O que cada campo faz

- `personName`: nome da pessoa que recebe a carta.
- `authorName`: nome de quem fez a carta.
- `counterStartDate`: data inicial do contador. Use o formato `AAAA-MM-DDT00:00:00`.
- `typingPhrases`: frases que aparecem com efeito de digitação no começo da carta.
- `timelinePhrases`: textos dos cards da linha do tempo.
- `particleIntensity`: intensidade das partículas do fundo. Diminua para `0.6` se quiser algo mais leve.
- `animationSpeed`: velocidade das animações controladas por JavaScript. Use `1` como padrão.

Para alterar o texto completo da carta, edite a seção com a classe `letter-content` no arquivo `index.html`.

## Como trocar as fotos

Depois de baixar/publicar o projeto, coloque manualmente suas imagens na pasta `fotos` com estes nomes:

- `fotos/foto1.jpg`
- `fotos/foto2.jpg`
- `fotos/foto3.jpg`
- `fotos/foto4.jpg`
- `fotos/foto5.jpg`

Se quiser usar outros nomes ou mais fotos, edite os cards dentro da seção `Nossos momentos` no arquivo `index.html`. Não versionei imagens reais para manter o PR composto apenas por arquivos de texto/código.

## QR Code e biblioteca externa

O QR Code é gerado automaticamente com o link atual da página usando a biblioteca leve `qrcodejs` via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
```

Ela foi usada porque evita backend, funciona no GitHub Pages e permite gerar e baixar o QR Code no navegador. Se a CDN não carregar, o site continua funcionando e o usuário ainda pode copiar o link.

## Como publicar no GitHub Pages

1. Envie os arquivos deste projeto para um repositório no GitHub.
2. No GitHub, abra **Settings** do repositório.
3. Vá em **Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**.
5. Escolha a branch principal, geralmente `main`, e a pasta `/root`.
6. Salve e aguarde o GitHub gerar o link.
7. Abra o link publicado e teste no celular.

## Dicas de performance

- Use fotos otimizadas, preferencialmente com até 1 MB cada.
- Em celulares, o site reduz automaticamente a quantidade de partículas.
- Pessoas com `prefers-reduced-motion` ativo recebem uma versão com animações reduzidas.
