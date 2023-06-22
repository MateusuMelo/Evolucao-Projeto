const User = require('./User')
class aluno extends User{

    constructor(id, nome, senha, cpf, celular, endereco, id_personal) {
        super(id, nome, senha, cpf);
        this.id_personal = id_personal;
        this._senha = senha;
        this._cpf = cpf;
        this._celular = celular;
        this._endereco = endereco;
        this.TreinoHasrotina = [];
        this.mensalidade = [];
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
module.exports = aluno;