const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const mysql = require('mysql');
const Aluno = require('./Objects/Aluno');
const Personal = require('./Objects/Personal');

let user_logged;

function createWindow() {
    const win = new BrowserWindow({
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    win.loadFile('interface/login/login.html');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // Verifique se a janela não está definida antes de criar uma nova
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

const dbConfig = {
    host: '127.0.0.1',
    port: '3306',
    user: 'Aplicativo',
    password: 'Admin123',
    database: 'evolucao_bd'
};

//Area de Login
ipcMain.on('login', (event, {username, password}) => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = `SELECT get_user('${username}','${password}')`; //Função que retorna se o usuario existe e em qual tabela ele se encontra atravez do dicionario {"Usuario nao encontrado":0 , "Tipo usuario":1, "Tipo personal":2}
    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            event.reply('login-response', 0);
        } else {
            let user_type = JSON.parse(JSON.stringify(results));
            event.reply('login-response', Object.values(user_type[0]));
        }
        connection.end();
    });

});

ipcMain.on('user_data', (event, {username, table}) => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = `SELECT *
                   FROM ${table}
                   WHERE nome LIKE '${username}'`;

    try {
        connection.query(query, (error, results) => {
            if (error) {
                throw error;
            } else {
                const user_data = JSON.parse(JSON.stringify(results));
                if (table === 'usuario') {
                    user_logged = new Aluno(user_data[0].idUsuario, user_data[0].Nome, user_data[0].Senha, user_data[0].Cpf, '123456', 'teste', user_data[0].Personal_idPersonal);
                } else if (table === 'personal') {
                    user_logged = new Personal(user_data[0].idPersonal, user_data[0].Nome, user_data[0].Senha, user_data[0].Cpf, user_data[0].CREF, user_data[0].Salario);
                }
                ipcMain.on('admOnlineId', (event) => {
                    event.reply('admOnlineId-reply', user_logged.id)
                });
            }
            connection.end();

        });
    } catch (e) {
        console.error(e)
    }

});

//Aba Clientes

ipcMain.on('users_list', (event) => {
    const query = `SELECT idUsuario, Nome, Cpf, n_celular, endereco, Personal_idPersonal
                   FROM usuario;`;
    const connection = mysql.createConnection(dbConfig);
    try {
        connection.connect();
        connection.query(query, (error, results) => {
            if (error) {
                throw error;
            } else {
                const user_list = JSON.parse(JSON.stringify(results));
                event.reply('user_list-response', user_list);
            }
            connection.end();
        });
    } catch (e) {
        console.error(e);
    }
});
ipcMain.on('Insert_user', (event, newUser) => {
    const query = `INSERT INTO usuario
                   VALUES (IdUsuario, '${newUser.nome}', '${newUser._cpf}', '${newUser._cpf}', '${newUser._endereco}',
                           '${newUser._senha}', '${newUser.id_personal}', null);`;
    const connection = mysql.createConnection(dbConfig);
    try {
        connection.connect();
        connection.query(query, (error) => {
            if (error) {
                error.message("Falha ao inserir no banco de dados");
                event.reply('Insert_user-reply', error);
                throw error;
            } else {
                event.reply('Insert_user-reply', "Sucess!");
                console.log(query);
            }
            connection.end();

        });
    } catch (e) {
        console.error(e);
    }
})

ipcMain.on('Delete_user', (event, id) => {
    const query = `DELETE
                   FROM usuario
                   WHERE '${id}' = idUsuario;`
    const connection = mysql.createConnection(dbConfig);
    try {
        connection.connect();
        connection.query(query, (error) => {
            if (error) {
                console.error(error)
                event.reply('Insert_user-reply', error);
                throw error;
            } else {
                event.reply('Delete_user-reply', "Deletado!");
            }
            connection.end();

        });
    } catch (e) {
        console.error(e);
    }
})
ipcMain.on('open_edit', (event, id) => {
    const edit = new BrowserWindow({
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    edit.loadFile('Interface/Menu/Edit.html');
    ipcMain.on('edit_id', (event) => {
        event.reply('edit_id-response', id);
    });
})

ipcMain.on('get_treinos', (event) => {
    const query = `SELECT idTreinos, nome_treino
                   FROM treinos;`
    const connection = mysql.createConnection(dbConfig);
    try {
        connection.connect();
        connection.query(query, (error, result) => {
            if (error) {
                error.message("Falha ao baixar os treinos");
                throw error;
            } else {
                event.reply('get_treino-names', result);
            }
            connection.end();

        });
    } catch (e) {
        console.error(e);
    }
})
ipcMain.on('get_rotinas', (event) => {
    const query = `SELECT *
                   FROM rotina;`
    const connection = mysql.createConnection(dbConfig);
    try {
        connection.connect();
        connection.query(query, (error, result) => {
            if (error) {
                error.message("Falha ao baixar as rotinas");
            } else {
                if (result != null) {
                    event.reply('get_rotinas-response', result);
                } else {
                    throw error;
                }
            }
            connection.end();

        });
    } catch (e) {
        console.error(e);
    }
})

ipcMain.on('insert_rotina', (event, rotinas) => {
    for (const rotina of rotinas) {

        const query = `INSERT INTO rotina
                       VALUES ('${rotina.id_rotina}', '${rotina.nome_rotina}', '${rotina.descricao}',
                               '${rotina.id_usuario}',
                               '${rotina.id_personal}');`;
        const connection = mysql.createConnection(dbConfig);
        try {
            connection.connect();
            connection.query(query, (error) => {
                if (error) {
                    throw error;
                } else {
                    console.log(query);
                }
                connection.end();

            });
        } catch (e) {
            console.error(e);
        }

    }
})

ipcMain.on('insert_treino_h_rotina', (event, treinos_rotinas) => {
    for (const t_h_r of treinos_rotinas) {

        const query = `INSERT INTO treinos_has_rotina
                       VALUES ('${t_h_r.id_treino}', '${t_h_r.id_rotina}', '${t_h_r.id_usuario}', '${t_h_r.series}',
                               '${t_h_r.repeticoes}');`;
        const connection = mysql.createConnection(dbConfig);
        try {
            connection.connect();
            connection.query(query, (error) => {
                if (error) {
                    error.message("Falha ao inserir no banco de dados");
                    event.reply('insert_treino_h_rotina-response', error);
                    throw error;
                } else {
                    event.reply('insert_treino_h_rotina-response', "Sucess!");
                    console.log(query);

                }
                connection.end();
            });
        } catch (e) {
            console.error(e);
        }

    }
})

ipcMain.on('get_treino_rotina', (event, id) => {
    const query = `SELECT r.Nome_rotina, t.nome_treino, tr.Series, tr.repeticoes
                   FROM Rotina r
                            JOIN Treinos_has_Rotina tr ON r.idRotina = tr.Rotina_idRotina AND
                                                          r.Usuario_idUsuario = tr.Rotina_Usuario_idUsuario
                            JOIN Treinos t ON tr.Treinos_idTreinos = t.idTreinos
                   WHERE r.Usuario_idUsuario = '${id}';`
    const connection = mysql.createConnection(dbConfig);
    try {
        connection.connect();
        connection.query(query, (error, result) => {
            if (error) {
                console.error(error)
                throw error;
            } else {
                event.reply('get_treino_rotina', JSON.parse(JSON.stringify(result)));
            }
            connection.end();
        });
    } catch (e) {
        console.error(e);
    }
})




