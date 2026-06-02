const API_AUTH = "https://terraviva-backend.onrender.com/api/auth";
const API_ME = "https://terraviva-backend.onrender.com/api/clientes/me";

const inputCorreo = document.getElementById("inputCorreo");
const inputPassword = document.getElementById("inputPassword");
const btnIniciarSesion = document.getElementById("btnIniciarSesion");

const alertaLogin = document.getElementById("alerta-login");
const iconoAlerta = document.getElementById("icono-alerta");
const mensajeAlerta = document.getElementById("mensaje-alerta");

const toggleContrasena = document.getElementById("toggle-contrasena");
const iconoOjo = document.getElementById("icono-ojo");

const validarFormatoCorreo = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

const validarFormatoPassword = (password) => {
  const regex = /^.{8,35}$/;
  return regex.test(password);
};

function mostrarAlertaLogin(exito, mensaje) {
  if (!alertaLogin || !iconoAlerta || !mensajeAlerta) {
    alert(mensaje);
    return;
  }

  alertaLogin.classList.remove("d-none");
  mensajeAlerta.textContent = mensaje;

  if (exito) {
    iconoAlerta.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
  } else {
    iconoAlerta.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i>';
  }
}

document.addEventListener("DOMContentLoaded", () => {
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

  toggleContrasena.addEventListener("click", function () {
    const tipo = inputPassword.getAttribute("type") === "password" ? "text" : "password";
    inputPassword.setAttribute("type", tipo);
    iconoOjo.className = tipo === "password" ? "bi bi-eye-fill" : "bi bi-eye-slash-fill";
  });

  btnIniciarSesion.addEventListener("click", async (e) => {
    e.preventDefault();

    const correoValor = inputCorreo.value.trim().toLowerCase();
    const passwordValor = inputPassword.value;

    const correoEsValido = validarFormatoCorreo(correoValor);
    const passwordEsValida = validarFormatoPassword(passwordValor);

    if (!correoEsValido || !passwordEsValida) {
      mostrarAlertaLogin(false, "Por favor, complete los campos correctamente.");
      if (!correoEsValido) inputCorreo.classList.add("is-invalid");
      if (!passwordEsValida) inputPassword.classList.add("is-invalid");
      return;
    }

    try {
      const response = await fetch(`${API_AUTH}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: correoValor,
          password: passwordValor
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Credenciales incorrectas");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuarioEmail", correoValor);

      const meResponse = await fetch(API_ME, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + data.token,
          "Content-Type": "application/json"
        },
        cache: "no-store"
      });

      if (!meResponse.ok) {
        throw new Error("No se pudo obtener el perfil del usuario");
      }

      const usuario = await meResponse.json();
      localStorage.setItem("usuarioRol", usuario.rol || "");

      mostrarAlertaLogin(true, "Inicio de sesión exitoso");

      setTimeout(() => {
        if (usuario.rol === "ADMIN") {
          window.location.href = "../html/habitacionesAdmin.html";
        } else if (sessionStorage.getItem("habitacionSeleccionada")) {
          window.location.href = "../html/detalleReserva.html";
        } else {
          window.location.href = "../index.html";
        }
      }, 1000);
    } catch (error) {
      console.error("Error en login:", error);
      mostrarAlertaLogin(false, error.message || "No se pudo iniciar sesión.");
    }
  });
});