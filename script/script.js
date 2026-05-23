const formMatriz = document.getElementById("matrizForm");
let matriz = [];
let linha = []
let linhasUsuario = 0;
let colunasUsuario = 0;
let operacaoUsuario = "";
let continuar = true;

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

    document.getElementById("input-guiado").style.display = "block";
}
const btnProximo = document.getElementById("btn-proximo");

btnProximo.addEventListener("click", function(){
    const celulaValue = document.getElementById("valor-celula").value;

    if(!celulaValue){
        alert("Preencha um valor para ser adicionado na matriz");
        return;
    }

    linha.push(Number(celulaValue)); 

    if(linha.length === colunasUsuario){
        matriz.push(linha);
        linha = [];
    }

    if(matriz.length === linhasUsuario){
        document.getElementById("input-guiado").style.display = "none";
        exibirMatriz(matriz, colunasUsuario, "matriz1");
        if(operacaoUsuario === "transposta"){
            exibirTransposta();
        }
        return; // importante: sai antes de atualizar o label
    }

    // linha.length já reflete a posição atual corretamente
    const labelText = document.getElementById("posicao-label");
    labelText.innerText = `Digite o valor de [${matriz.length + 1}][${linha.length + 1}]`;

    document.getElementById("valor-celula").value = ''; // limpa o input
});
function exibirMatriz(matriz, colunas, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

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
}
function exibirTransposta(){
    const matrizTransposta = transporMatriz(matriz);

    exibirMatriz(matrizTransposta, matrizTransposta[0].length, "matriz2");
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