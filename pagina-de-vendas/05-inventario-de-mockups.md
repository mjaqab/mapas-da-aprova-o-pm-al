# Inventário de mockups

| ID | Seção | Desktop | Mobile | Proporção | Área segura e ponto focal | Implementação |
|---|---|---|---|---|---|---|
| MOCK-01 | Hero | 640 × 390 | 360 × 270 | adaptativa | 8%; capa geral central, três páginas em leque e celular à direita | CSS com arquivos reais |
| MOCK-02 | Mecanismo | 720 × 510 | 340 × 255 | 4:3 | página inteira, centro, sem corte | imagem real |
| MOCK-03 | Comparador | 720 × 510 | 340 × 255 | 4:3 | ambas as fontes inteiras | comparador interativo |
| MOCK-04 | Pitch | 500 × 360 | 340 × 270 | adaptativa | capa e duas páginas dentro de 10% | CSS com arquivos reais |
| MOCK-05 | Coleção | 760 × 430 | 340 × 300 | adaptativa | coleção central, sem selo raster | CSS com arquivos reais |
| MOCK-06 | Bônus 1 | 240 × 210 | 300 × 240 | adaptativa | capa dominante e página real atrás | CSS com arquivos reais |
| MOCK-07 | Bônus 2 | 240 × 210 | 300 × 240 | adaptativa | capa dominante e página real atrás | CSS com arquivos reais |
| MOCK-08 | Bônus 3 | 240 × 210 | 300 × 240 | adaptativa | capa dominante e página real atrás | CSS com arquivos reais |
| MOCK-09 | Oferta | 430 × 250 | 320 × 220 | adaptativa | composição compacta, sem invadir preço | CSS com arquivos reais |

## Regras de encaixe

- Capas e páginas: `object-fit: contain`.
- Fotos: não utilizadas.
- Hero e oferta têm composições próprias; não são simples redimensionamentos.
- A variante móvel reduz o número de páginas secundárias antes de reduzir a legibilidade da capa.
- Textos comerciais, preço, CTA, garantia e quantidades ficam em HTML.

