const inputCorreo = document.getElementById("inputCorreo");
const inputPassword = document.getElementById("inputPassword");
const btnIniciarSesion = document.getElementById("btnIniciarSesion");

// validar que tenga letras y numeros especificos.
const validarFormatoCorreo = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

// validar que tenga letras y numeros especificos y caracteres mínimos.

const validarFormatoPassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*/]).{8,16}$/;
  return regex.test(password);
};

document.addEventListener("DOMContentLoaded", () => {
  // validar Correo mientras se escribe
  inputCorreo.addEventListener("input", function () {
    if (validarFormatoCorreo(inputCorreo.value)) {
      inputCorreo.classList.remove("is-invalid");
      inputCorreo.classList.add("is-valid");
    } else {
      inputCorreo.classList.remove("is-valid");
      inputCorreo.classList.add("is-invalid");
    }
  });

  inputPassword.addEventListener("input", function () {
    if (validarFormatoPassword(inputPassword.value)) {
      inputPassword.classList.remove("is-invalid");
      inputPassword.classList.add("is-valid");
    } else {
      inputPassword.classList.remove("is-valid");
      inputPassword.classList.add("is-invalid");
    }
  });

  btnIniciarSesion.addEventListener("click", (e) => {
    // prevenimos el comportamiento por defecto del botón (si estuviera en un form)
    e.preventDefault();

    const correoValor = inputCorreo.value;
    const passwordValor = inputPassword.value;

    // verificamos si los formatos son correctos
    const correoEsValido = validarFormatoCorreo(correoValor);
    const passwordEsValida = validarFormatoPassword(passwordValor);

    // si alguno falla, mostramos error y detenemos todo
    if (!correoEsValido || !passwordEsValida) {
      alert("Por favor, complete los campos correctamente.");

      if (!correoEsValido) {
        inputCorreo.classList.add("is-invalid");
      }
      if (!passwordEsValida) {
        inputPassword.classList.add("is-invalid");
      }

      return;
    }

    //lógica para usuarios normales
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let usuarioEncontrado = null;
    let passwordCorrecta = false;

    // Buscamos el correo en la lista
    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].email === correoValor) {
        usuarioEncontrado = usuarios[i];

        // Verificamos la contraseña
        if (usuarios[i].password === passwordValor) {
          passwordCorrecta = true;
        }
        break; // Salimos del ciclo porque ya encontramos el correo
      }
    }

    if (usuarioEncontrado && passwordCorrecta) {
      localStorage.setItem(
        "usuarioLogueado",
        JSON.stringify(usuarioEncontrado),
      );
      alert("¡Te damos la bienvenida, " + usuarioEncontrado.nombre + "!");

      if (
        correoValor === "admin@gmail.com" &&
        passwordValor === "Admin123456789*"
      ) {
        console.log("¡Bienvenido Admin!");
        window.location.href = "../html/dashboard.html";
      } else {
        console.log("Usuario normal detectado.");
        window.location.href = "../html/perfil_usuario.html";
      }
    } else if (usuarioEncontrado && !passwordCorrecta) {
      alert("La contraseña es incorrecta.");
    } else {
      alert("El usuario no existe. Serás redirigido al registro.");
      window.location.href = "../html/registrar.html";
    }
  });
});