class User {
    constructor(id, nome, senha, cpf) {
        this.id = id;
        this.nome = nome;
        this._senha = senha;
        this._cpf = cpf;
    }

    get senha() {
        return this._senha;
    }

    set senha(value) {
        this._senha = value;
    }

    get cpf() {
        return this._cpf;
    }

    set cpf(value) {
        this._cpf = value;
    }
}

class Aluno extends User {
    constructor(id, nome, senha, cpf, celular, endereco, id_personal) {
        super(id, nome, senha, cpf);
        this.id_personal = id_personal;
        this._celular = celular;
        this._endereco = endereco;
        this.TreinoHasrotina = [];
        this.mensalidade = [];
    }

    get celular() {
        return this._celular;
    }

    set celular(value) {
        this._celular = value;
    }

    get endereco() {
        return this._endereco;
    }

    set endereco(value) {
        this._endereco = value;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const users = [];

    window.api.send('users_list');
    window.api.receive('user_list-response', (Response) => {
        for (let i = 0; i < Response.length; i++) {
            users.push(new Aluno(Response[i].idUsuario, Response[i].Nome, null, Response[i].Cpf, Response[i].n_celular, Response[i].endereco, Response[i].Personal_idPersonal));
        }
        showUsers(users);
    });

    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', searchUserByName);

    function searchUserByName() {
        const searchInput = document.getElementById("searchInput");
        const searchValue = searchInput.value.trim().toLowerCase();

        const filteredUsers = users.filter(user => user.nome.toLowerCase().includes(searchValue));
        showUsers(filteredUsers);
    }

    function showUsers(users) {
        const userTableContainer = document.getElementById("userTableContainer");
        userTableContainer.innerHTML = "";

        const table = document.createElement("table");

        // Cabeçalho da tabela
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        const idHeader = document.createElement("th");
        idHeader.textContent = "ID";
        const nomeHeader = document.createElement("th");
        nomeHeader.textContent = "Nome";
        const cpfHeader = document.createElement("th");
        cpfHeader.textContent = "CPF";
        const celularHeader = document.createElement("th");
        celularHeader.textContent = "Celular";
        const enderecoHeader = document.createElement("th");
        enderecoHeader.textContent = "Endereço";
        const actionsHeader = document.createElement("th");
        actionsHeader.textContent = "Ações";

        headerRow.appendChild(idHeader);
        headerRow.appendChild(nomeHeader);
        headerRow.appendChild(cpfHeader);
        headerRow.appendChild(celularHeader);
        headerRow.appendChild(enderecoHeader);
        headerRow.appendChild(actionsHeader);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Linhas da tabela
        const tbody = document.createElement("tbody");
        for (const user of users) {
            const row = document.createElement("tr");
            const idCell = document.createElement("td");
            idCell.textContent = user.id;
            const nomeCell = document.createElement("td");
            nomeCell.textContent = user.nome;
            const cpfCell = document.createElement("td");
            cpfCell.textContent = user.cpf;
            const celularCell = document.createElement("td");
            celularCell.textContent = user.celular;
            const enderecoCell = document.createElement("td");
            enderecoCell.textContent = user.endereco;
            const actionsCell = document.createElement("td");
            const editButton = document.createElement("button");
            editButton.textContent = "Editar";
            editButton.addEventListener("click", () => editUser(user.id));
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Excluir";
            deleteButton.addEventListener("click", () => deleteUser(user.id));

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);

            row.appendChild(idCell);
            row.appendChild(nomeCell);
            row.appendChild(cpfCell);
            row.appendChild(celularCell);
            row.appendChild(enderecoCell);
            row.appendChild(actionsCell);

            tbody.appendChild(row);
        }
        table.appendChild(tbody);
        userTableContainer.appendChild(table);
    }

    const adduserbutton = document.getElementById('addUser-form');
    adduserbutton.addEventListener('submit', (event) => {
        event.preventDefault();

        window.api.send('admOnlineId');

        let nomeInput = document.getElementById("nomeInput").value;
        let cpfInput = document.getElementById("cpfInput").value;
        let n_cellInput = document.getElementById("n_cellInput").value;
        let enderecoInput = document.getElementById("enderecoInput").value;
        let adm_id;
        if (nomeInput.value === "" || cpfInput === "" || n_cellInput === "" || enderecoInput === "") {
            alert("Por favor, preencha todos os campos.");
        } else {
            try {
                window.api.receive('admOnlineId-reply', (Response) => {
                    adm_id = Response;
                    const newUser_id = users[(users.length) - 1].id + 1;
                    console.log(newUser_id);

                    const newUser = new Aluno(newUser_id, nomeInput, cpfInput, cpfInput, n_cellInput, enderecoInput, adm_id);
                    window.api.send('Insert_user', newUser);
                    users.push(newUser);
                    window.api.receive('Insert_user-reply', (Response) => {
                        alert(Response);
                    })

                    showUsers(users);
                    nomeInput = "";
                    cpfInput = "";
                    enderecoInput = "";
                    n_cellInput = "";
                })
            } catch (e) {
                console.error(e);
            } finally {
                document.getElementById("nomeInput").value = "";
                document.getElementById("cpfInput").value = "";
                document.getElementById("n_cellInput").value = "";
                document.getElementById("enderecoInput").value = "";

            }
        }
    });

    function editUser(id) {
        // Implemente a função de edição do usuário aqui
        window.api.send('open_edit', id);
    }

    function deleteUser(id) {
        if (confirm("O usuario sera deletado do banco de dados. Deseja continuar ?") == true) {
            window.api.send('Delete_user', id);
            window.api.receive('Delete_user-reply', (Response) => {
                alert(Response);
                location.reload();
            })
        }
    }
});

