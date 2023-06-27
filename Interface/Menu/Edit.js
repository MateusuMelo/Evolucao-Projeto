import Treino from "./Objects/Treino.js";
import Rotina from "./Objects/Rotina.js";
import TreinosHasRotina from "./Objects/TreinosHasRotina.js";

let id;
let id_pers;
const rotinas = [];
const treinos = [];

document.addEventListener('DOMContentLoaded', () => {
    // Enviar solicitações para obter dados
    window.api.send('get_treinos');
    window.api.send('edit_id');
    window.api.send('admOnlineId');

    window.api.receive('get_treino-names', (Response) => {
        for (const train of Response) {
            treinos.push(new Treino(train.idTreinos, train.nome_treino));
        }
        preencherTreinos();
    });

    window.api.receive('edit_id-response', (Response) => {
        id = Response;
        window.api.send('get_rotinas', id);
    });

    window.api.receive('admOnlineId-reply', (Response) => {
        id_pers = Response;
        rotinas.push(new Rotina("Rotina A", null, id, id_pers));
        rotinas.push(new Rotina("Rotina B", null, id, id_pers));
        rotinas.push(new Rotina("Rotina C", null, id, id_pers));
    });


});


// Função para preencher os treinos disponíveis nas opções de seleção


function preencherTreinos() {
    const treinoTable = document.getElementById("treino-table");

    for (let i = 1; i < treinoTable.rows.length; i++) {
        const treinoRow = treinoTable.rows[i];
        const treinoSelect = treinoRow.querySelector('.treino');
        const treinoRotina = rotinas[i - 1];

        treinoSelect.innerHTML = ''; // Limpar as opções de seleção de treino

        // Adicionar uma opção vazia
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Selecione um treino';
        treinoSelect.appendChild(defaultOption);

        try {
            for (let j = 0; j < treinos.length; j++) {
                const option = document.createElement('option');
                option.value = treinos[j].id_treino;
                option.textContent = treinos[j].exercicio;
                treinoSelect.appendChild(option);
            }
        } catch (erro) {
            console.log("Ocorreu um erro ao preencher os treinos:", erro);
        }
    }
}


// Adicionar nova linha de treino
function adicionarTreino(row) {
    const treinoCell = row.insertCell(1);
    const seriesCell = row.insertCell(2);
    const repeticoesCell = row.insertCell(3);

    const treinoSelect = document.createElement('select');
    treinoSelect.classList.add('treino');
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Selecione um treino';
    treinoSelect.appendChild(defaultOption);
    for (let i = 0; i < treinos.length; i++) {
        const option = document.createElement('option');
        option.value = treinos[i].id_treino;
        option.textContent = treinos[i].exercicio;
        treinoSelect.appendChild(option);
    }
    treinoCell.appendChild(treinoSelect);

    const seriesInput = document.createElement('input');
    seriesInput.type = 'text';
    seriesInput.classList.add('series');
    seriesInput.placeholder = 'Digite a quantidade de séries';
    seriesCell.appendChild(seriesInput);

    const repeticoesInput = document.createElement('input');
    repeticoesInput.type = 'text';
    repeticoesInput.classList.add('repeticoes');
    repeticoesInput.placeholder = 'Digite a quantidade de repetições';
    repeticoesCell.appendChild(repeticoesInput);
}

// Associar o evento de salvar ao botão correspondente
const salvarButton = document.getElementById("salvar");
salvarButton.addEventListener("click", salvar);

// Salvar informações

function salvar() {
    const treinoTable = document.getElementById("treino-table");
    const treino_rot = [];
    let rotina_id;
    // Iterar sobre as 12 linhas da tabela
    for (let i = 1; i <= 12; i++) {
        if (i <= 4) {
            rotina_id = rotinas[0].id_rotina;
        } else if (i > 4 && i <= 8) {
            rotina_id = rotinas[1].id_rotina;
        } else
            rotina_id = rotinas[2].id_rotina;


        const treinoRow = treinoTable.rows[i];

        const treinoSelect = treinoRow.querySelector('.treino');
        const seriesInput = treinoRow.querySelector('.series');
        const repeticoesInput = treinoRow.querySelector('.repeticoes');

        const treinoValue = treinoSelect.value;
        const seriesValue = seriesInput.value;
        const repeticoesValue = repeticoesInput.value;

        if (treinoValue && seriesValue && repeticoesValue) {

            treino_rot.push(new TreinosHasRotina(treinoValue, rotina_id, id, seriesValue, repeticoesValue));
        }
    }

    if (treino_rot.length === 0) {
        alert("Nenhum treino foi adicionado. Preencha pelo menos uma linha antes de salvar.");
        return;
    }

    window.api.send('insert_rotina', rotinas);
    window.api.send('insert_treino_h_rotina', treino_rot);
    window.api.receive('insert_treino_h_rotina-response', (Response) => {
        alert(Response);
    });
}



