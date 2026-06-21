// no topo do arquivo, junto com as outras variáveis globais
// Elementos do DOM
const formMatriz = document.getElementById("matrizForm");
const btnProximo = document.getElementById("btn-proximo");
const formCelula = document.getElementById("formGuiado");

const operacoesDuasMatrizes = ["soma", "subtracao", "multiplicacao"];

const matrizConfig = {
    'matriz1': {
        containerId: 'matriz1',
        displaySymbol: null,
        symbolElementId: null
    },
    'matriz2': {
        containerId: 'matriz2',
        displaySymbol: true,
        symbolElementId: 'simbolo-operacao',
        getSymbolText: () => simbolos[appState.operacaoUsuario]
    },
    'matriz-resultado': {
        containerId: 'matriz-resultado',
        displaySymbol: true,
        symbolElementId: 'simbolo-igual'
    }
};

const simbolos = {
    "soma": "+",
    "subtracao": "−",
    "multiplicacao": "×",
    "transposta": "ᵀ",
    "inversa": "⁻¹",
    "determinante": "det",
    "escalar": "×"
};

// Estado centralizado da aplicação (unificado)
const appState = {
    matriz: [],
    linha: [],
    matriz2: [],
    linha2: [],
    linhasUsuario: 0,
    colunasUsuario: 0,
    operacaoUsuario: "",
    preenchendoMatriz: 1,
    aguardandoEscalar: false
};

const operacoes = {
    "transposta": () => {
        const resultado = transporMatriz(appState.matriz);
        exibirMatriz(resultado, resultado[0].length, "matriz-resultado");
        passoAPassoTransposta(appState.matriz);
    },
    "determinante": () => {
        const resultado = determinante(appState.matriz);
        if (resultado !== null) {
            exibirEscalar(resultado, "matriz-resultado", "Determinante:");
            passoAPassoDeterminante(appState.matriz);        
        }
    },
    "inversa": () => {
        const resultado = matrizInversa(appState.matriz);
        if(resultado === null){ 
            mostrarErro("Matriz singular, inversa não existe!"); 
            return; 
        }
        exibirMatriz(resultado, resultado[0].length, "matriz-resultado");
        passoAPassoInversa(appState.matriz);
    },
    "escalar": () => {
        // Agora o fluxo de término do preenchimento aciona o estado do escalar corretamente
        appState.aguardandoEscalar = true;
        document.getElementById("posicao-label").innerText = "Digite o valor do escalar";
        document.getElementById("valor-celula").value = '';
        document.getElementById("input-guiado").style.display = "block";
    },
    "multiplicacao": () => {
        const resultado = multiplicarMatrizes(appState.matriz, appState.matriz2);
        if (resultado) {
            exibirMatriz(resultado, resultado[0].length, "matriz-resultado");
            passoAPassoMultiplicacao(appState.matriz, appState.matriz2);
        }
    },
    "soma": () => {
        const resultado = somarMatrizes(appState.matriz, appState.matriz2);
        if (resultado) {
            exibirMatriz(resultado, resultado[0].length, "matriz-resultado");
            passoAPassoSoma(appState.matriz, appState.matriz2, "soma");
        }
    },
    "subtracao": () => {
        const resultado = subtrairMatrizes(appState.matriz, appState.matriz2);
        if (resultado) {
            exibirMatriz(resultado, resultado[0].length, "matriz-resultado");
            passoAPassoSoma(appState.matriz, appState.matriz2, "subtracao");
        }
    },
};

formMatriz.addEventListener("submit", function(e){
    e.preventDefault();

    const linhasValue = document.getElementById("ilinhas").value;
    const colunasValue = document.getElementById("icolunas").value;
    const operacao = document.getElementById("operacao").value;

    if(!linhasValue || !colunasValue || !operacao){
        mostrarErro("Preencha todos os valores!");
        return;
    }

    if(Number(linhasValue) > 5 || Number(colunasValue) > 5){
        document.getElementById("overlay").style.display = "flex";

        document.getElementById("btn-confirmar").onclick = function(){
            document.getElementById("overlay").style.display = "none";
            iniciarPreenchimento();
        }

        document.getElementById("btn-cancelar").onclick = function(){
            document.getElementById("overlay").style.display = "none";
            document.getElementById("ilinhas").value = 0;
            document.getElementById("icolunas").value = 0;
            document.getElementById("operacao").value = "";   
        }
        return;
    }
    iniciarPreenchimento();
});

function iniciarPreenchimento(){
    appState.linhasUsuario = Number(document.getElementById("ilinhas").value);
    appState.colunasUsuario = Number(document.getElementById("icolunas").value);
    appState.operacaoUsuario = document.getElementById("operacao").value;

    appState.preenchendoMatriz = 1;
    appState.matriz = [];
    appState.linha = [];
    appState.matriz2 = [];
    appState.linha2 = [];
    appState.aguardandoEscalar = false;

    document.getElementById("posicao-label").innerText = "Digite o valor de A[1][1]";
    document.getElementById("input-guiado").style.display = "block";
}

formCelula.addEventListener('submit', function(e){
    e.preventDefault();
    
    if(appState.aguardandoEscalar){
        const escalarValue = document.getElementById("valor-celula").value;
        const escalar = validarEntradaNumerica(escalarValue);
        if(escalar === null) return; // já alertou dentro da função

        const resultado = multiplicacaoEscalar(appState.matriz, escalar);
        
        exibirMatriz(resultado, resultado[0].length, "matriz-resultado");
        passoAPassoEscalar(appState.matriz, escalar);
        
        document.getElementById("posicao-label").innerText = "";
        document.getElementById("valor-celula").value = '';
        document.getElementById("input-guiado").style.display = "none";
        appState.aguardandoEscalar = false;
        return;
    }

    const celulaValue = document.getElementById("valor-celula").value;
    const valorNumerico = validarEntradaNumerica(celulaValue);
    if(valorNumerico === null) return;

    if(appState.preenchendoMatriz === 1){
        appState.linha.push(valorNumerico);
        if(appState.linha.length === appState.colunasUsuario){
            appState.matriz.push([...appState.linha]);
            appState.linha = [];
        }
    } else {
        appState.linha2.push(valorNumerico);
        if(appState.linha2.length === appState.colunasUsuario){
            appState.matriz2.push([...appState.linha2]);
            appState.linha2 = [];
        }
    }

    document.getElementById("valor-celula").value = '';
    // resto continua igual...

    const matrizAtual = appState.preenchendoMatriz === 1 ? appState.matriz : appState.matriz2;
    const containerId = appState.preenchendoMatriz === 1 ? "matriz1" : "matriz2";

    if(matrizAtual.length === appState.linhasUsuario){
        exibirMatriz(matrizAtual, appState.colunasUsuario, containerId);

        // Se precisa de duas matrizes e terminou a primeira
        if(operacoesDuasMatrizes.includes(appState.operacaoUsuario) && appState.preenchendoMatriz === 1){
            appState.preenchendoMatriz = 2;
            document.getElementById("posicao-label").innerText = "Digite o valor de B[1][1]";
            document.getElementById("input-guiado").style.display = "block";
            return;
        }

        // Executa a operação mapeada
        document.getElementById("input-guiado").style.display = "none";
        operacoes[appState.operacaoUsuario]();
        return;
    }

    const matrizRef = appState.preenchendoMatriz === 1 ? appState.matriz : appState.matriz2;
    const linhaRef = appState.preenchendoMatriz === 1 ? appState.linha : appState.linha2;
    const letra = appState.preenchendoMatriz === 1 ? "A" : "B";

    document.getElementById("posicao-label").innerText = 
        `Digite o valor de ${letra}[${matrizRef.length + 1}][${linhaRef.length + 1}]`;
});

// ... (Mantenha as suas funções exibirMatriz, transporMatriz, determinante, etc. iguais)
function exibirMatriz(matriz, colunas, containerId) {
    const config = matrizConfig[containerId];
    if (!config) return; // safety check

    const container = document.getElementById(config.containerId);
    container.innerHTML = '';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${colunas}, 1fr)`;
    container.classList.add('grid-matriz');

    // Rendering das células
    matriz.forEach((linha) => {
        linha.forEach((valor) => {
            const celula = document.createElement('div');
            celula.classList.add('celula-matriz');
            celula.textContent = formatarValor(valor);
            container.appendChild(celula);
        });
    });

    // Controlar símbolos
    if (config.displaySymbol) {
        const symbolEl = document.getElementById(config.symbolElementId);
        if (symbolEl) {
            symbolEl.style.display = 'block';
            if (config.getSymbolText) {
                symbolEl.innerText = config.getSymbolText();
            }
        }
    }
}
function exibirEscalar(valor, containerId, label) {
    const container = document.getElementById(containerId);
    container.style.display = 'block';
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
    if(matriz.length !== matriz[0].length){
        mostrarErro("O determinante só pode ser calculado em matrizes quadradas!");
        return null;
    }
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
        mostrarErro("Multiplicação impossível: colunas de A devem ser iguais às linhas de B!");
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
    const verificacao = verificacaoSomaSubtracao(A, B);

    if(!verificacao) return null;
    
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
    const verificacao = verificacaoSomaSubtracao(A, B);

    if(!verificacao) return null;

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

document.getElementById("btn-exportar").onclick = function () {
    const elementosOcultos = document.querySelectorAll('.no-print');
    elementosOcultos.forEach(el => el.style.visibility = 'hidden');

    const elemento = document.body;

    const options = {
        margin: 10,
        filename: 'resultado.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            windowScroll: true
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        }
    };

    html2pdf()
        .set(options)
        .from(elemento)
        .save()
        .then(() => {
            elementosOcultos.forEach(el => el.style.visibility = 'visible');
        })
        .catch(() => {
            elementosOcultos.forEach(el => el.style.visibility = 'visible');
        });
};

// ================ FUNÇÕES AUXILIARES ================

function verificacaoSomaSubtracao(A, B){
    if(A.length !== B.length || A[0].length !== B[0].length){
        mostrarErro("Impossível de se realizar a operação com matrizes desiguais")
        return false;
    }
    return true;
}

function validarEntradaNumerica(valorBruto) {
    const valor = valorBruto.trim().replace(',', '.'); // aceita vírgula como decimal também

    if (valor === "") {
        mostrarErro("Preencha um valor!");
        return null;
    }

    if (isNaN(valor) || valor === "." || valor === "-") {
        mostrarErro("Digite um número válido (ex: 2, -3.5, 0.25)");
        return null;
    }

    return Number(valor);
}

function formatarValor(valor) {
    const arredondado = Math.round(valor * 1000) / 1000; // corrige erro de float
    return Number.isInteger(arredondado) ? arredondado.toString() : arredondado.toFixed(2);
}

function mostrarErro(mensagem) {
    const toast = document.getElementById("toast-erro");
    const texto = document.getElementById("toast-erro-texto");

    texto.textContent = mensagem;
    toast.classList.add("show");

    clearTimeout(toast._timeout); // evita sobrepor timeouts se chamado várias vezes
    toast._timeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}