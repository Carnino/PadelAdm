document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Obtener los valores del correo y contraseña
    var email = document.getElementById('email').value.trim();
    var password = document.getElementById('password').value.trim();

    // Verificar si el correo y la contraseña son correctos
    if (email === 'code.gym.team@gmail.com' && password === 'mariorinaldi1') {
        // Redireccionar a menu.html
        window.location.href = './html/menu.html';
    } else {
        // Mostrar un mensaje de error si las credenciales son incorrectas
        alert('Correo o contraseña incorrectos. Por favor, intente de nuevo.');
    }
});
