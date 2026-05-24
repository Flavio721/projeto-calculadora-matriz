# Função submatriz

 **return matriz** 
        **.filter((_, i) => i !== linhaRemover)**
        **.map(linha => linha.filter((_, j) => j !== colunaRemover));**

O .filter() percorre o array e mantém apenas os elementos onde a condição é true.
A assinatura do callback é (elemento, indice). O _ é uma convenção para dizer "não preciso do elemento, só do índice":
// Numa matriz 3x3 removendo linha 1:
matriz.filter((_, i) => i !== 1)
// i=0 → 0 !== 1 → true  ✅ mantém
// i=1 → 1 !== 1 → false ❌ remove
// i=2 → 2 !== 1 → true  ✅ mantém

**.map(linha => linha.filter((_, j) => j !== colunaRemover))**

O .map() transforma cada elemento do array. Aqui para cada linha que sobrou, aplica um novo .filter() removendo a coluna:
// Em cada linha, removendo coluna 2:
[1, 2, 3].filter((_, j) => j !== 2)
// j=0 → true  ✅ mantém 1
// j=1 → true  ✅ mantém 2
// j=2 → false ❌ remove 3
// resultado: [1, 2]

O fluxo completo numa 3x3 removendo linha 1, coluna 2:
// Original:
[[1, 2, 3],
 [4, 5, 6],  // ← removida pelo filter
 [7, 8, 9]]

// Após filter das linhas:
[[1, 2, 3],
 [7, 8, 9]]

// Após map+filter das colunas:
[[1, 2],   // 3 removido
 [7, 8]]   // 9 removido



 # Função determinante
  **if (matriz.length === 2) {**
      **return (matriz[0][0] * matriz[1][1]) - (matriz[0][1] * matriz[1][0]);**
  **}**

Toda função recursiva precisa de um ponto de parada — senão ela se chama infinitamente. Aqui quando a matriz chega em 2x2, calculamos diretamente pela fórmula que você já conhece e retornamos, sem mais recursão.

O loop de expansão
**for (let j = 0; j < matriz[0].length; j++)**
Percorre cada elemento da primeira linha. Para uma 4x4 seriam 4 iterações, para uma 3x3 seriam 3.

O sinal alternado
**const sinal = (-1) ** j;**
Padrão de sinais dos cofatores
+ - + -
- + - +
+ - + -
(-1) ** j gera exatamente isso:
j=0 → (-1)⁰ = +1
j=1 → (-1)¹ = -1
j=2 → (-1)² = +1
j=3 → (-1)³ = -1

A submatriz e a recursão
**const sub = subMatriz(matriz, 0, j);**
**det += sinal * matriz[0][j] * determinante(sub);**
Para cada elemento da primeira linha:

Remove a linha 0 e coluna j → gera uma matriz menor
Chama determinante nessa matriz menor — que vai se chamar novamente até chegar no caso base 2x2
Multiplica pelo elemento e pelo sinal, acumulando em det


Visualizando numa 3x3:
|1  2  3|
|4  5  6|
|7  8  9|

j=0: +1 × 1 × det|5 6|
                  |8 9|

j=1: -1 × 2 × det|4 6|
                  |7 9|

j=2: +1 × 3 × det|4 5|
                  |7 8|

det = soma dos três resultados