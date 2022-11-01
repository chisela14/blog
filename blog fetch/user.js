// Creación de usuarios con validación de diferentes campos.

//recuperar elementos a validar
let userEl = document.querySelector("#username");
let passwordEl = document.querySelector("#password");
let emailEl = document.querySelector("#email");

let form = document.querySelector("form");

//métodos para validar los diferentes campos
const isRequired = value => value === '' ? false : true;
const isBetween = (length, min, max) => length < min || length > max ? false : true;
const isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};
const isPasswordSecure = (password) => {
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return re.test(password);
};

//comprobar los campos
function checkUsername(){
    let valid = false;
    const min = 3, max = 10;
    const username = userEl.value.trim();

    if (!isRequired(username)) {
        showError(userEl, 'El username no puede estar vacío');
    } else if (!isBetween(username.length, min, max)) {
        showError(userEl, `El username debe tener entre ${min} y ${max} caracteres`)
    } else {
        showSuccess(userEl);
        valid = true;
    }
    return valid;
}
function checkPassword(){
    let valid = false;
    const password = passwordEl.value.trim();

    if (!isRequired(password)) {
        showError(passwordEl, 'La contraseña no puede estar vacía');
    } else if (!isPasswordSecure(password)) {
        showError(passwordEl, 'La contraseña debe tener al menos 8 caracteres; incluyendo 1 minúscula, 1 mayúscula, 1 número, y 1 caracter especial(!@#$%^&*)');
    } else {
        showSuccess(passwordEl);
        valid = true;
    }

    return valid;
};
function checkEmail(){
    let valid = false;
    const email = emailEl.value.trim();
    if (!isRequired(email)) {
        showError(emailEl, 'El email no puede estar en blanco');
    } else if (!isEmailValid(email)) {
        showError(emailEl, 'El email no es válido')
    } else {
        showSuccess(emailEl);
        valid = true;
    }
    return valid;
}

//mostrar y eliminar mensaje de error
const showError = (input, message) => {
    const formField = input.parentElement;
    formField.classList.remove('success');
    formField.classList.add('error');

    const error = formField.querySelector('small');
    error.textContent = message;
};

const showSuccess = (input) => {
    const formField = input.parentElement;
    formField.classList.remove('error');
    formField.classList.add('success');

    const error = formField.querySelector('small');
    error.textContent = '';
}
//el formulario no se puede enviar si no están los campos válidos
form.addEventListener('submit', function (e) {
    e.preventDefault();
    let isUsernameValid = checkUsername(),
        isPasswordValid = checkPassword(),
        isEmailValid = checkEmail();
    let isFormValid = isUsernameValid &&
        isPasswordValid &&
        isEmailValid;
    //si el formulario es válido añado los datos al json
    if (isFormValid) {
        let data = {"username": userEl.value.trim(), "password": passwordEl.value.trim(), "email": emailEl.value.trim()};
        fetch('http://localhost:3000/users', {
            method: 'POST', 
            body: JSON.stringify(data), 
            headers:{
              'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
              return response.json();
            }
            return Promise.reject(response) 
          })
          .then(datos => datosServidor=datos)
          .catch(err => {
            console.log('Error en la petición HTTP: '+err.message);
          })
          
          
    }
});
