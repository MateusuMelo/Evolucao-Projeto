class User {
    constructor(id,nome,senha, cpf) {
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
module.exports = User;