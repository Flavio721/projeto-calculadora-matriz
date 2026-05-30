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
let aguardandoEscalar = false;
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
        exibirMatriz(resultado, resultado[0].length, "matriz-resultado");
        passoAPassoTransposta(matriz);
    },
    "determinante": () => {
        const resultado = determinante(matriz);
        exibirEscalar(resultado, "matriz-resultado", "Determinante:");
        passoAPassoDeterminante(matriz);
        
        exibirEscalar(resultado, "matriz2", "Determinante:");
    },
    "inversa": () => {
        const resultado = matrizInversa(matriz);
        if(resultado === null){ 
            alert("Matriz singular, inversa não existe!"); 
            return; 
        }
        exibirMatriz(resultado, resultado[0].length, "matriz-resultado");
        passoAPassoInversa(matriz);
    },
    "escalar": () => {}, // chamado direto no btnProximo
    "multiplicacao": () => {
        const resultado = multiplicarMatrizes(matriz, matriz2);
        exibirMatriz(resultado, resultado[0].length, "matriz-resultado");
        passoAPassoMultiplicacao(matriz, matriz2);
    },
    "soma": () => {
        const resultado = somarMatrizes(matriz, matriz2);
        exibirMatriz(resultado, resultado[0].length, "matriz-resultado");
        passoAPassoSoma(matriz, matriz2, "soma");
    },
    "subtracao": () => {
        const resultado = subtrairMatrizes(matriz, matriz2);
        exibirMatriz(resultado, resultado[0].length, "matriz-resultado");
        passoAPassoSoma(matriz, matriz2, "subtracao");
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
    if(aguardandoEscalar){
        const escalarValue = document.getElementById("valor-celula").value;

        if(!escalarValue){
             alert("Preencha o valor do escalar!"); return;
        
            }
        const escalar = Number(escalarValue);
        const resultado = multiplicacaoEscalar(matriz, escalar);

        exibirMatriz(resultado, resultado[0].length, "matriz-resultado");
        passoAPassoEscalar(matriz, escalar);

        document.getElementById("input-guiado").style.display = "none";
        aguardandoEscalar = false;
    if(!celulaValue){
        alert("Preencha um valor para ser adicionado na matriz");
        return;
    }
        const celulaValue = document.getElementById("valor-celula").value;

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

        if(operacaoUsuario === "escalar"){
            aguardandoEscalar = true;
            document.getElementById("posicao-label").innerText = "Digite o valor do escalar";
            document.getElementById("valor-celula").value = '';
            document.getElementById("input-guiado").style.display = "block";
            return;
        }

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
}
function exibirMatriz(matriz, colunas, containerId) {
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
    container.style.display = 'block';
    container.innerHTML = '';
    container.style.display = 'block';

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
    if(matriz.length !== matriz[0].length){
        alert("O determinante só pode ser calculado em matrizes quadradas!");
        return null;
    }
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
function multiplicacaoEscalar(matriz, escalar){
    return matriz.map(linha => linha.map(valor => valor * escalar));
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
// ================ FUNÇÕES DE PASSO A PASSO ================

function passoAPassoTransposta(matriz) {
    const container = document.getElementById("passo-a-passo");
    container.innerHTML = '';
    container.style.display = 'block';

    container.innerHTML = `
        <h3>Passo a passo — Matriz Transposta</h3>

        <div class="passo">
            <p class="passo-titulo">Passo 1 — Regra da transposta</p>
            <p class="passo-descricao">Para transpormos uma matriz, cada elemento 
            <strong>A[i][j]</strong> vai para a posição <strong>Aᵀ[j][i]</strong>. 
            Ou seja, a linha <strong>i</strong> vira a coluna <strong>i</strong> da transposta.</p>
        </div>

        <div class="passo">
            <p class="passo-titulo">Passo 2 — Mapeando cada elemento</p>
            <ul>
                ${matriz.map((linha, i) =>
                    linha.map((valor, j) =>
                        `<li>A[${i+1}][${j+1}] = <strong>${valor}</strong> → vai para Aᵀ[${j+1}][${i+1}]</li>`
                    ).join('')
                ).join('')}
            </ul>
        </div>

        <div class="passo">
            <p class="passo-titulo">Passo 3 — Resultado</p>
            <p class="passo-descricao">A matriz original era <strong>${matriz.length}×${matriz[0].length}</strong>, 
            a transposta é <strong>${matriz[0].length}×${matriz.length}</strong>.</p>
        </div>
    `;
    document.getElementById("div-exportar").style.display = "flex";
}

function passoAPassoDeterminante(matriz) {
    const container = document.getElementById("passo-a-passo");
    container.innerHTML = '';
    container.style.display = 'block';

    let passos = `
        <h3>Passo a passo — Determinante</h3>

        <div class="passo">
            <p class="passo-titulo">Passo 1 — O que é o determinante?</p>
            <p class="passo-descricao">O determinante é um número escalar calculado a partir 
            de uma matriz quadrada. Se o determinante for <strong>0</strong>, a matriz é 
            singular e não possui inversa.</p>
        </div>
    `;

    if(matriz.length === 2) {
        passos += `
        <div class="passo">
            <p class="passo-titulo">Passo 2 — Fórmula para matriz 2×2</p>
            <p class="passo-descricao">det(A) = (a×d) − (b×c)</p>
            <p class="passo-descricao">
                det(A) = (${matriz[0][0]} × ${matriz[1][1]}) − (${matriz[0][1]} × ${matriz[1][0]})
            </p>
            <p class="passo-descricao">
                det(A) = ${matriz[0][0] * matriz[1][1]} − ${matriz[0][1] * matriz[1][0]}
            </p>
            <p class="passo-descricao">
                det(A) = <strong>${determinante(matriz)}</strong>
            </p>
        </div>
        `;
    } else {
        passos += `
        <div class="passo">
            <p class="passo-titulo">Passo 2 — Expansão pela primeira linha</p>
            <p class="passo-descricao">Para matrizes maiores que 2×2, expandimos pelo 
            primeiro elemento de cada coluna da primeira linha, alternando os sinais 
            <strong>+ − + − ...</strong></p>
            <ul>
                ${matriz[0].map((valor, j) => {
                    const sinal = (-1) ** j >= 0 ? '+' : '−';
                    const sub = subMatriz(matriz, 0, j);
                    const detSub = determinante(sub);
                    return `<li>${sinal} ${valor} × det(submatriz removendo linha 1 e coluna ${j+1}) = ${sinal} ${valor} × ${detSub} = <strong>${((-1)**j) * valor * detSub}</strong></li>`;
                }).join('')}
            </ul>
            <p class="passo-descricao">det(A) = <strong>${determinante(matriz)}</strong></p>
        </div>
        `;
    }

    container.innerHTML = passos;
    document.getElementById("div-exportar").style.display = "flex";
}

function passoAPassoInversa(matriz) {
    const container = document.getElementById("passo-a-passo");
    container.innerHTML = '';
    container.style.display = 'block';

    const det = determinante(matriz);

    container.innerHTML = `
        <h3>Passo a passo — Matriz Inversa</h3>

        <div class="passo">
            <p class="passo-titulo">Passo 1 — Verificar se a inversa existe</p>
            <p class="passo-descricao">A inversa só existe se o determinante for diferente de zero.</p>
            <p class="passo-descricao">det(A) = <strong>${det}</strong> 
            → ${det !== 0 ? '✅ Inversa existe!' : '❌ Inversa não existe (matriz singular)'}</p>
        </div>

        <div class="passo">
            <p class="passo-titulo">Passo 2 — Calcular a matriz de cofatores</p>
            <p class="passo-descricao">Para cada elemento <strong>A[i][j]</strong>, calculamos o cofator 
            removendo a linha <strong>i</strong> e coluna <strong>j</strong>, calculamos o determinante 
            da submatriz resultante e aplicamos o sinal <strong>(−1)^(i+j)</strong>.</p>
        </div>

        <div class="passo">
            <p class="passo-titulo">Passo 3 — Transpor os cofatores (Adjunta)</p>
            <p class="passo-descricao">Transpomos a matriz de cofatores para obter a matriz adjunta.</p>
        </div>

        <div class="passo">
            <p class="passo-titulo">Passo 4 — Dividir pelo determinante</p>
            <p class="passo-descricao">Cada elemento da adjunta é dividido pelo determinante 
            <strong>${det}</strong> para obter a inversa.</p>
            <p class="passo-descricao">A⁻¹ = (1/${det}) × adj(A)</p>
        </div>
    `;
    document.getElementById("div-exportar").style.display = "flex";
}

function passoAPassoEscalar(matriz, escalar) {
    const container = document.getElementById("passo-a-passo");
    container.innerHTML = '';
    container.style.display = 'block';

    container.innerHTML = `
        <h3>Passo a passo — Multiplicação por Escalar</h3>

        <div class="passo">
            <p class="passo-titulo">Passo 1 — Regra da multiplicação por escalar</p>
            <p class="passo-descricao">Cada elemento da matriz é multiplicado pelo escalar 
            <strong>${escalar}</strong>.</p>
        </div>

        <div class="passo">
            <p class="passo-titulo">Passo 2 — Multiplicando cada elemento</p>
            <ul>
                ${matriz.map((linha, i) =>
                    linha.map((valor, j) =>
                        `<li>A[${i+1}][${j+1}] = ${valor} × ${escalar} = <strong>${valor * escalar}</strong></li>`
                    ).join('')
                ).join('')}
            </ul>
        </div>
    `;
    document.getElementById("div-exportar").style.display = "flex";
}

function passoAPassoSoma(A, B, operacao) {
    const container = document.getElementById("passo-a-passo");
    container.innerHTML = '';
    container.style.display = 'block';

    const simbolo = operacao === 'soma' ? '+' : '−';
    const titulo = operacao === 'soma' ? 'Soma' : 'Subtração';

    container.innerHTML = `
        <h3>Passo a passo — ${titulo} de Matrizes</h3>

        <div class="passo">
            <p class="passo-titulo">Passo 1 — Regra da ${titulo.toLowerCase()}</p>
            <p class="passo-descricao">Para somar ou subtrair matrizes, as dimensões devem ser 
            iguais. Cada elemento <strong>C[i][j] = A[i][j] ${simbolo} B[i][j]</strong>.</p>
        </div>

        <div class="passo">
            <p class="passo-titulo">Passo 2 — Calculando cada elemento</p>
            <ul>
                ${A.map((linha, i) =>
                    linha.map((valor, j) =>
                        `<li>C[${i+1}][${j+1}] = ${A[i][j]} ${simbolo} ${B[i][j]} = <strong>${operacao === 'soma' ? A[i][j] + B[i][j] : A[i][j] - B[i][j]}</strong></li>`
                    ).join('')
                ).join('')}
            </ul>
        </div>
    `;
    document.getElementById("div-exportar").style.display = "flex";
}

function passoAPassoMultiplicacao(A, B) {
    const container = document.getElementById("passo-a-passo");
    container.innerHTML = '';
    container.style.display = 'block';

    container.innerHTML = `
        <h3>Passo a passo — Multiplicação de Matrizes</h3>

        <div class="passo">
            <p class="passo-titulo">Passo 1 — Regra da multiplicação</p>
            <p class="passo-descricao">Cada elemento <strong>C[i][j]</strong> é a soma dos 
            produtos da linha <strong>i</strong> de A pela coluna <strong>j</strong> de B.</p>
            <p class="passo-descricao">A é <strong>${A.length}×${A[0].length}</strong> e 
            B é <strong>${B.length}×${B[0].length}</strong>, 
            o resultado será <strong>${A.length}×${B[0].length}</strong>.</p>
        </div>

        <div class="passo">
            <p class="passo-titulo">Passo 2 — Calculando cada elemento</p>
            <ul>
                ${A.map((_, i) =>
                    B[0].map((_, j) => {
                        const calculo = A[i].map((_, k) =>
                            `${A[i][k]} × ${B[k][j]}`
                        ).join(' + ');
                        const resultado = A[i].reduce((soma, _, k) => soma + A[i][k] * B[k][j], 0);
                        return `<li>C[${i+1}][${j+1}] = ${calculo} = <strong>${resultado}</strong></li>`;
                    }).join('')
                ).join('')}
            </ul>
        </div>
    `;
    document.getElementById("div-exportar").style.display = "flex";
}

// ================ FUNÇÕES DE EXPORTAÇÃO ================

document.getElementById("btn-exportar").onclick = function(){
    const elementosOcultos = document.querySelectorAll('.no-print');
    elementosOcultos.forEach(el => el.style.visibility = 'hidden');

    const elemento = document.getElementById("main-content");
    console.log(elemento)
    
    html2canvas(elemento, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY,
        windowHeight: document.getElementById("main-content").scrollHeight
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'resultado.png';
        link.href = canvas.toDataURL();
        link.click();

        // mostra novamente após captura
        elementosOcultos.forEach(el => el.style.visibility = 'visible');
    });
};