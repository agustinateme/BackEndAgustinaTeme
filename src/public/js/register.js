const form = document.getElementById('registerForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);
    console.log('Antes de la llamada a fetch');
    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        console.log('Después de la llamada a fetch');
        if (result.status === 201) {
            console.log('Redirigiendo a /login');
            window.location.replace('/login');
        } else {
            console.log('Error en el servidor:', result.status);
        }
    }).catch(error => {
        console.error('Error en la llamada a fetch:', error);
    });
})