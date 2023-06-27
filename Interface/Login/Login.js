//login
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        window.api.send('login', {username, password});

    });

    window.api.receive('login-response', (Response) => {
        if (Response == 2) { //personal return = 2
            window.location.pathname = '/Interface/Menu/Clientes.html';
            const username = document.getElementById('username').value;
            const table = 'personal';
            window.api.send('user_data', {username, table})

        } else if (Response == 1) {
            window.location.pathname = '/Interface/Menu/Dashboard.html';
            const username = document.getElementById('username').value;
            const table = 'usuario';
            window.api.send('user_data', {username, table});

        } else {
            loginMessage.textContent = 'Credenciais invalidas.';
        }


    })

});

