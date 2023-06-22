const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const mysql = require('mysql');
const Personal = require('./Objects/Personal');
const Aluno = require('./Objects/Aluno')

let user_logged;

function createWindow() {
    const win = new BrowserWindow({
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
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
    database: 'evolucao_BD'
};


ipcMain.on('login', (event, {username, password}) => {
    const connection = mysql.createConnection(dbConfig);
    connection.connect();
    const query = `SELECT get_user('${username}','${password}')`; //Função que retorna se o usuario existe e em qual tabela ele se encontra atravez do dicionario {"Usuario nao encontrado":0 , "Tipo usuario":1, "Tipo personal":2}
    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            event.reply('login-response', 0)
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

    connection.query(query, (error, results) => {
        if (error) {
            console.error(error);
            //event.reply('user_data_response', 0)
        } else {
            const user_data = JSON.parse(JSON.stringify(results))
            console.log(user_data);
            if (table === 'usuario') {
                user_logged = new Aluno(user_data[0].idUsuario, user_data[0].Nome, user_data[0].Senha,user_data[0].Cpf,'123456','teste', user_data[0].Personal_idPersonal);
            }else if (table === 'personal'){
                user_logged = new Personal(user_data[0].idPersonal,user_data[0].Nome, user_data[0].Senha,user_data[0].Cpf,user_data[0].CREF,user_data[0].Salario);
            }

        }
        connection.end();
    });

})
