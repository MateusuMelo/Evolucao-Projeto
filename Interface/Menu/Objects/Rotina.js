class rotina{
    static id = 1;
    constructor(nome_rotina, descricao, id_usuario, id_personal) {
        this.id_rotina =rotina.id;
        this.nome_rotina = nome_rotina;
        this.descricao = descricao;
        this.id_usuario = id_usuario;
        this.id_personal = id_personal;
        rotina.id ++;
    }
}
export default rotina;