const inputCorreo = document.getElementById("inputCorreo");
const inputPassword = document.getElementById("inputPassword");
const btnIniciarSesion = document.getElementById("btnIniciarSesion");
const alertaLogin = document.getElementById("alerta-login");
const iconoAlerta = document.getElementById("icono-alerta");
const mensajeAlerta = document.getElementById("mensaje-alerta");
const toggleContrasena = document.getElementById("toggle-contrasena");
const iconoOjo = document.getElementById("icono-ojo");

// [CAMBIO] validar que tenga letras y numeros especificos.
const validarFormatoCorreo = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

// [CAMBIO] validar que tenga mayúscula, número, carácter especial y longitud
const validarFormatoPassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*/]).{8,35}$/;
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

  // Toggle visibilidad de contraseña
  toggleContrasena.addEventListener("click", function () {
    const tipo =
      inputPassword.getAttribute("type") === "password" ? "text" : "password";
    inputPassword.setAttribute("type", tipo);
    if (tipo === "password") {
      iconoOjo.className = "bi bi-eye-fill";
    } else {
      iconoOjo.className = "bi bi-eye-slash-fill";
    }
  });

  btnIniciarSesion.addEventListener("click", (e) => {
    e.preventDefault();

    const correoValor = inputCorreo.value;
    const passwordValor = inputPassword.value;

    const correoEsValido = validarFormatoCorreo(correoValor);
    const passwordEsValida = validarFormatoPassword(passwordValor);

    if (!correoEsValido || !passwordEsValida) {
      alert("Por favor, complete los campos correctamente.");
      if (!correoEsValido) inputCorreo.classList.add("is-invalid");
      if (!passwordEsValida) inputPassword.classList.add("is-invalid");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuarioEncontrado = null;
    let passwordCorrecta = false;

    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].email === correoValor) {
        usuarioEncontrado = usuarios[i];
        if (usuarios[i].password === passwordValor) {
          passwordCorrecta = true;
        }
        break;
      }
    }

    if (usuarioEncontrado && passwordCorrecta) {
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioEncontrado));
      alert("¡Te damos la bienvenida, " + usuarioEncontrado.nombre + "!");

      // [CAMBIO] verificar si hay redirección pendiente después del login
      const redirigir = sessionStorage.getItem("redirectAfterLogin");
      if (redirigir) {
        sessionStorage.removeItem("redirectAfterLogin");
        window.location.href = "../html/" + redirigir;  // p.ej. detalleReserva.html
      } else {
        // Admin por defecto o usuario normal
        if (correoValor === "admin@gmail.com" && passwordValor === "Admin123456789*") {
          console.log("¡Bienvenido Admin!");
          window.location.href = "../html/dashboard.html";
        } else {
          console.log("Usuario normal detectado.");
          // [CAMBIO] redirigir al perfil del usuario
          window.location.href = "../html/perfil_usuario.html";
        }
      }
    } else if (usuarioEncontrado && !passwordCorrecta) {
      alert("La contraseña es incorrecta.");
    } else {
      alert("El usuario no existe. Serás redirigido al registro.");
      window.location.href = "../html/registrar.html";
    }
  });
});