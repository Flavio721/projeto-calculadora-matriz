// no topo do arquivo, junto com as outras variáveis globais
const formMatriz = document.getElementById("matrizForm");
let matriz = [];
let linha = [];
let matriz2 = [];
let linha2 = [];
let linhasUsuario = 0;
let colunasUsuario = 0;
let operacaoUsuario = "";
let preenchendoMatriz = 1;
const operacoesDuasMatrizes = ["soma", "subtracao", "multiplicacao"];
const simbolos = {
    "soma": "+",
    "subtracao": "−",
    "multiplicacao": "×",
    "transposta": "ᵀ",
    "inversa": "⁻¹",
    "determinante": "det",
    "escalar": "×"
};

const operacoes = {
    "transposta": () => {
        const resultado = transporMatriz(matriz);
        exibirMatriz(resultado, resultado[0].length, "matriz2");
    },
    "determinante": () => {
    const resultado = determinante(matriz);
    exibirEscalar(resultado, "matriz2", "Determinante:");
    },
    "inversa": () => {
        const resultado = matrizInversa(matriz);
        exibirMatriz(resultado, resultado[0].length, "matriz2");
    },
    "escalar": () => {
        const resultado = multiplicacaoEscalar(matriz);
        exibirMatriz(resultado, resultado[0].length, "matriz2");
    },
    "multiplicacao": () => {
    const resultado = multiplicarMatrizes(matriz, matriz2);
    exibirMatriz(resultado, resultado[0].length, "matriz-resultado");
    },
    "soma": () => {
        const resultado = somarMatrizes(matriz, matriz2);
        exibirMatriz(resultado, resultado[0].length, "matriz-resultado");
    },
    "subtracao": () => {
        const resultado = subtrairMatrizes(matriz, matriz2);
        exibirMatriz(resultado, resultado[0].length, "matriz-resultado");
    },
};

formMatriz.addEventListener("submit", function(e){
    e.preventDefault();

    const linhasValue = document.getElementById("ilinhas").value;
    const colunasValue = document.getElementById("icolunas").value;
    const operacao = document.getElementById("operacao").value;

    if(!linhasValue || !colunasValue || !operacao){
        alert("Preencha todos os valores!");
        return;
    }

    if(linhasValue > 5 || colunasValue > 5){
        document.getElementById("overlay").style.display = "flex";

        document.getElementById("btn-confirmar").onclick = function(){
            document.getElementById("overlay").style.display = "none";
            iniciarPreenchimento(); // ✅ chama a função ao confirmar
        }

        document.getElementById("btn-cancelar").onclick = function(){
            document.getElementById("overlay").style.display = "none";
            document.getElementById("ilinhas").value = 0
            document.getElementById("icolunas").value = 0
            document.getElementById("operacao").value = ""
            
        }

        return;
    }
    iniciarPreenchimento();
});

function iniciarPreenchimento(){
    linhasUsuario = Number(document.getElementById("ilinhas").value);
    colunasUsuario = Number(document.getElementById("icolunas").value);
    operacaoUsuario = document.getElementById("operacao").value;

    preenchendoMatriz = 1;
    matriz = [];
    linha = [];
    matriz2 = [];
    linha2 = [];

    // atualiza o label para matriz A
    document.getElementById("posicao-label").innerText = "Digite o valor de A[1][1]";
    document.getElementById("input-guiado").style.display = "block";
}
const btnProximo = document.getElementById("btn-proximo");

btnProximo.onclick = function(){
    const celulaValue = document.getElementById("valor-celula").value;

    console.log("--- clique ---");
    console.log("preenchendoMatriz:", preenchendoMatriz);
    console.log("linha atual:", linha);
    console.log("matriz atual:", matriz);
    console.log("colunasUsuario:", colunasUsuario);
    console.log("linhasUsuario:", linhasUsuario);

    if(!celulaValue){
        alert("Preencha um valor para ser adicionado na matriz");
        return;
    }

    // empurra para a matriz correta
    if(preenchendoMatriz === 1){
        linha.push(Number(celulaValue));
        if(linha.length === colunasUsuario){
            matriz.push([...linha]); // ← spread para copiar a linha
            linha = [];
        }
    } else {
        linha2.push(Number(celulaValue));
        if(linha2.length === colunasUsuario){
            matriz2.push([...linha2]); // ← spread para copiar a linha
            linha2 = [];
        }
    }

    document.getElementById("valor-celula").value = '';

    // verifica se a matriz atual foi concluída
    const matrizAtual = preenchendoMatriz === 1 ? matriz : matriz2;
    const containerId = preenchendoMatriz === 1 ? "matriz1" : "matriz2";

    if(matrizAtual.length === linhasUsuario){

        exibirMatriz(matrizAtual, colunasUsuario, containerId);

        // precisa de segunda matriz e ainda não preencheu
        if(operacoesDuasMatrizes.includes(operacaoUsuario) && preenchendoMatriz === 1){
            preenchendoMatriz = 2;

            document.getElementById("posicao-label").innerText = "Digite o valor de B[1][1]";
            document.getElementById("input-guiado").style.display = "block";
            return;
        }

        // todas as matrizes preenchidas, executa a operação
        document.getElementById("input-guiado").style.display = "none";
        operacoes[operacaoUsuario]();
        return;
    }

    // atualiza o label para a próxima posição
    const matrizRef = preenchendoMatriz === 1 ? matriz : matriz2;
    const linhaRef = preenchendoMatriz === 1 ? linha : linha2;
    const letra = preenchendoMatriz === 1 ? "A" : "B";

    document.getElementById("posicao-label").innerText = 
        `Digite o valor de ${letra}[${matrizRef.length + 1}][${linhaRef.length + 1}]`;
};
function exibirMatriz(matriz, colunas, containerId) {
    console.log("colunas recebidas:", colunas);
    console.log("matriz recebida:", matriz);
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    // Configura o grid CORRETAMENTE
    container.style.display = 'grid'; // ← MUDEI de 'block' para 'grid'
    container.style.gridTemplateColumns = `repeat(${colunas}, 1fr)`;
    container.classList.add('grid-matriz');

    matriz.forEach((linha) => {
        linha.forEach((valor) => {
            const celula = document.createElement('div');
            celula.classList.add('celula-matriz');
            celula.textContent = valor;
            container.appendChild(celula);
        });
    });

    // Remove o display: 'block' que estava aqui
    // container.style.display = 'block'; // ← REMOVA ou comente esta linha

    if(containerId === 'matriz-resultado'){
        document.getElementById("simbolo-igual").style.display = "block";
    }

    if(containerId === 'matriz2'){
        document.getElementById("simbolo-operacao").style.display = "block";
        document.getElementById("simbolo-operacao").innerText = simbolos[operacaoUsuario];
    }
}
function exibirEscalar(valor, containerId, label) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    const div = document.createElement('div');
    div.classList.add('resultado-escalar');
    div.innerHTML = `<span class="escalar-label">${label}</span>
                     <span class="escalar-valor">${valor}</span>`;

    container.appendChild(div);
}
function transporMatriz(matriz) {
    const linhas = matriz.length;
    const colunas = matriz[0].length;
    let transposta = [];

    for(let i = 0; i < colunas; i++) {
        let linhaTransposta = []
        for(let c = 0; c < linhas; c++){
            linhaTransposta.push(matriz[c][i]);
        }
        transposta.push(linhaTransposta);
    }

    return transposta;
}

function subMatriz(matriz, linhaRemover, colunaRemover) {
    return matriz
        .filter((_, i) => i !== linhaRemover) // remove a linha indicada pelo índice
        .map(linha => linha.filter((_, j) => j !== colunaRemover)); // em cada linha restante, remove a coluna indicada
}
function determinante(matriz) {
    if (matriz.length === 0) return 1; // ← para array vazio
    if (matriz.length === 1) return matriz[0][0]; // ← para 1x1
    if (matriz.length === 2) { // caso base da recursão
        return (matriz[0][0] * matriz[1][1]) - (matriz[0][1] * matriz[1][0]); // fórmula direta para 2x2
    }

    let det = 0;
    for (let j = 0; j < matriz[0].length; j++) { // percorre cada elemento da primeira linha
        const sinal = (-1) ** j; // alterna entre +1 e -1 conforme a posição
        const sub = subMatriz(matriz, 0, j); // remove linha 0 e coluna j, gerando matriz menor
        det += sinal * matriz[0][j] * determinante(sub); // acumula: sinal × elemento × determinante da submatriz
    }
    return det;
}
function matrizInversa(matriz) {
    const det = determinante(matriz);
    if (det === 0) return null; // matriz singular, inversa não existe

    const cofatores = matriz.map((linha, i) =>
        linha.map((_, j) => {
            const sinal = (-1) ** (i + j); // sinal do cofator baseado na posição
            return sinal * determinante(subMatriz(matriz, i, j)); // cofator = sinal × det da submatriz
        })
    );

    // transpõe a matriz de cofatores para obter a adjunta, depois divide cada elemento pelo determinante
    return transporMatriz(cofatores).map(linha =>
        linha.map(valor => valor / det)
    );
}
function multiplicacaoEscalar(matriz){
    const valorDeterminante = determinante(matriz);
    const linhas = matriz.length;
    const colunas = matriz[0].length;

    let matrizEscalar = [];
    let linhaEscalar = [];

    for(let i = 0; i < colunas; i++){
        for(let c = 0; c < linhas; c++){
            linhaEscalar.push(matriz[c][i] * valorDeterminante);
        }
        matrizEscalar.push(linhaEscalar);
        linhaEscalar = [];
    }

    return matrizEscalar;
}

function multiplicarMatrizes(A, B){
    if(A[0].length !== B.length){
        alert("Multiplicação impossível: colunas de A devem ser iguais às linhas de B!");
        return null;
    }
    let resultado = [];

    for(let i = 0; i < A.length; i++){
        let linha = [];
        for(let j = 0; j < B[0].length; j++){
            let soma = 0;
            for(let k = 0; k < A[0].length; k++){
                soma += A[i][k] * B[k][j];
            }
            linha.push(soma);
        }
        resultado.push(linha);
    }
    return resultado;
}

function somarMatrizes(A, B){
    if(A.length !== B.length || A[0].length !== B[0].length){
        alert("Soma impossível: colunas de A devem ser iguais às linhas de B!");
        return null;
    }

    let resultado = []

    for(let i = 0; i < A.length; i++){
        let linha = [];
        for(let j = 0; j < B[0].length; j++){
            linha.push(A[i][j] + B[i][j]);
        }
        resultado.push(linha);
        linha = [];
    }

    return resultado;
}
function subtrairMatrizes(A, B){
    if(A.length !== B.length || A[0].length !== B[0].length){
        alert("Soma impossível: colunas de A devem ser iguais às linhas de B!");
        return null;
    }

    let resultado = []

    for(let i = 0; i < A.length; i++){
        let linha = [];
        for(let j = 0; j < B[0].length; j++){
            linha.push(A[i][j] - B[i][j]);
        }
        resultado.push(linha);
        linha = [];
    }

    return resultado;
}