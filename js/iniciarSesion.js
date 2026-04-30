// const inputCorreo = document.getElementById("inputCorreo");
const inputPassword = document.getElementById("inputPassword");
const btnIniciarSesion = document.getElementById("btnIniciarSesion");

document.addEventListener("DOMContentLoaded", () => {
  // 1. Seleccionamos el input por su ID
  const inputCorreo = document.getElementById("inputCorreo");

  // 2. Definimos la expresión regular para validar correos
  const validarCorreo = (email) => {
    // Esta es una expresión regular estándar para validar emails
    const caracteres = /^[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,6}$/;
    return caracteres.test(email);
  };

  // 3. Agregamos el evento 'input' (se ejecuta al escribir)
  inputCorreo.addEventListener("input", (escucha) => {
    const valor = escucha.target.value;

    if (validarCorreo(valor)) {
      console.log("Correo válido");
      console.log("Correo de admin");

      inputCorreo.classList.remove("is-invalid");
      inputCorreo.classList.add("is-valid");

      if (validarCorreo(valor) === "admin@gmail.com") {
        console.log("Correo válido para admin");
      }
      
    } else {
      console.log("Correo inválido");
      inputCorreo.classList.remove("is-valid");
      inputCorreo.classList.add("is-invalid");
    }
  });
});

btnIniciarSesion.addEventListener("click", function () {
  console.log("vamos bien.");
});
