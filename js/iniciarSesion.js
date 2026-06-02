// URL base del backend para autenticación
const API_AUTH = "https://terraviva-backend.onrender.com/api/auth";
// ── REFERENCIAS AL DOM ───────────────────────────────────────────────────────
const inputCorreo = document.getElementById("inputCorreo");
const inputPassword = document.getElementById("inputPassword");
const btnIniciarSesion = document.getElementById("btnIniciarSesion");

const alertaLogin = document.getElementById("alerta-login");       // contenedor alerta
const iconoAlerta = document.getElementById("icono-alerta");       // ícono ✓ o ⚠
const mensajeAlerta = document.getElementById("mensaje-alerta");   // texto del mensaje

const toggleContrasena = document.getElementById("toggle-contrasena"); // botón ojo
const iconoOjo = document.getElementById("icono-ojo");                 // ícono del ojo

// ── VALIDACIONES ─────────────────────────────────────────────────────────────
// Valida que el correo tenga formato válido (ejemplo@dominio.com)
const validarFormatoCorreo = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

// Valida que la contraseña tenga entre 8 y 35 caracteres
const validarFormatoPassword = (password) => {
  const regex = /^.{8,35}$/;
  return regex.test(password);
};

// ── MOSTRAR ALERTA ───────────────────────────────────────────────────────────
// Muestra alerta verde (éxito) o roja (error) según el resultado del login
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

// ── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  // Validación visual en tiempo real al escribir el correo
  inputCorreo.addEventListener("input", function () {
    if (validarFormatoCorreo(inputCorreo.value)) {
      inputCorreo.classList.remove("is-invalid");
      inputCorreo.classList.add("is-valid");
    } else {
      inputCorreo.classList.remove("is-valid");
      inputCorreo.classList.add("is-invalid");
    }
  });

  // Validación visual en tiempo real al escribir la contraseña
  inputPassword.addEventListener("input", function () {
    if (validarFormatoPassword(inputPassword.value)) {
      inputPassword.classList.remove("is-invalid");
      inputPassword.classList.add("is-valid");
    } else {
      inputPassword.classList.remove("is-valid");
      inputPassword.classList.add("is-invalid");
    }
  });

  // Toggle para mostrar u ocultar la contraseña
  toggleContrasena.addEventListener("click", function () {
    const tipo = inputPassword.getAttribute("type") === "password" ? "text" : "password";
    inputPassword.setAttribute("type", tipo);
    iconoOjo.className = tipo === "password" ? "bi bi-eye-fill" : "bi bi-eye-slash-fill";
  });

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  btnIniciarSesion.addEventListener("click", async (e) => {
    e.preventDefault();

    const correoValor = inputCorreo.value.trim().toLowerCase();
    const passwordValor = inputPassword.value;

    // 1. Validación del lado del cliente antes de llamar al backend
    const correoEsValido = validarFormatoCorreo(correoValor);
    const passwordEsValida = validarFormatoPassword(passwordValor);

    if (!correoEsValido || !passwordEsValida) {
      mostrarAlertaLogin(false, "Por favor, complete los campos correctamente.");
      if (!correoEsValido) inputCorreo.classList.add("is-invalid");
      if (!passwordEsValida) inputPassword.classList.add("is-invalid");
      return;
    }

    try {
      // 2. Enviamos email y password al backend vía POST → /api/auth/login
      //    El backend verifica las credenciales contra la BD en Supabase
      //    y si son correctas devuelve un token JWT
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

      // 3. Guardamos el token JWT y el email en localStorage
      //    El token se enviará en el header "Authorization: Bearer <token>"
      //    en todas las peticiones que requieran autenticación (reservas, perfil, etc.)
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuarioEmail", correoValor);

      mostrarAlertaLogin(true, "Inicio de sesión exitoso");

      // 4. Redirigimos según el rol y el contexto del usuario
      setTimeout(() => {
        if (correoValor === "admin@gmail.com") {
          // Admin siempre va al dashboard
          window.location.href = "../html/dashboard.html";

        } else if (sessionStorage.getItem("habitacionSeleccionada")) {
          // Venía del flujo de reserva (seleccionó habitación antes de loguearse)
          // → continuamos con la reserva donde la dejó
          window.location.href = "../html/detalleReserva.html";

        } else {
          // Inició sesión directo sin venir de una reserva
          // → lo mandamos al inicio, no tiene sentido mandarlo a detalleReserva
          window.location.href = "../index.html";
        }
      }, 1000);

    } catch (error) {
      console.error("Error en login:", error);
      mostrarAlertaLogin(false, error.message || "No se pudo iniciar sesión.");
    }
  });
});