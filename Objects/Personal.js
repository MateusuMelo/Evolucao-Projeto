const User = require('./User')
class Personal extends User{

    constructor(id, nome, senha, cpf, cref, salario) {
        super(id, nome, senha, cpf);
        this._senha = senha;
        this._cpf = cpf;
        this._cref = cref;
        this._salario = salario;
        this.id = id;
        this.nome = nome;
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

    get cref() {
        return this._cref;
    }

    set cref(value) {
        this._cref = value;
    }

    get salario() {
        return this._salario;
    }

    set salario(value) {
        this._salario = value;
    }
}
module.exports = Personal;