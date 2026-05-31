// URL base del backend para autenticación
const API_AUTH = "http://localhost:8081/api/auth";

// ── REFERENCIAS AL DOM ───────────────────────────────────────────────────────
// Capturamos los elementos del HTML para mostrar mensajes de error o éxito
const btnRegistrar = document.getElementById("btnRegistrar");
const textoAlerta = document.getElementById("textoAlerta");           // error nombre
const textoEmail = document.getElementById("textoEmail");             // error email
const textoTelefono = document.getElementById("textoTelefono");       // error teléfono
const textoPassword = document.getElementById("textoPassword");       // error contraseña
const confirmarPassword = document.getElementById("textoConfirmarPassword"); // error confirmación

const alertaRegistro = document.getElementById("alerta-registro");         // contenedor alerta final
const iconoAlertaReg = document.getElementById("icono-alerta-reg");        // ícono ✓ o ⚠
const mensajeAlertaReg = document.getElementById("mensaje-alerta-reg");    // texto del mensaje

// ── MOSTRAR ALERTA FINAL ─────────────────────────────────────────────────────
// Muestra una alerta verde (éxito) o roja (error) según el resultado del registro
function mostrarAlertaRegistro(exito, mensaje) {
  if (!alertaRegistro || !iconoAlertaReg || !mensajeAlertaReg) {
    alert(mensaje); // fallback si los elementos no existen en el HTML
    return;
  }

  alertaRegistro.classList.remove("d-none");
  mensajeAlertaReg.textContent = mensaje;

  if (exito) {
    iconoAlertaReg.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
  } else {
    iconoAlertaReg.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i>';
  }
}

// ── LIMPIAR MENSAJES DE ERROR ────────────────────────────────────────────────
// Borra todos los mensajes de validación antes de una nueva validación
function limpiarMensajes() {
  if (textoAlerta) textoAlerta.innerHTML = "";
  if (textoEmail) textoEmail.innerHTML = "";
  if (textoTelefono) textoTelefono.innerHTML = "";
  if (textoPassword) textoPassword.innerHTML = "";
  if (confirmarPassword) confirmarPassword.innerHTML = "";
}

// ── TOGGLE MOSTRAR/OCULTAR CONTRASEÑA ───────────────────────────────────────
// Permite ver u ocultar la contraseña al hacer clic en el ícono del ojo
function configurarToggleContrasena(idToggle, idInput, idIcono) {
  const toggle = document.getElementById(idToggle);
  const input = document.getElementById(idInput);
  const icono = document.getElementById(idIcono);

  if (!toggle || !input || !icono) return;

  toggle.addEventListener("click", function () {
    const tipo = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", tipo);
    icono.className = tipo === "password" ? "bi bi-eye-fill" : "bi bi-eye-slash-fill";
  });
}

// ── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  configurarToggleContrasena("toggle-contrasena-reg", "inputPassword", "icono-ojo-reg");
  configurarToggleContrasena("toggle-confirmar-reg", "inputPasswordDos", "icono-ojo-confirmar");
});

// Dispara el registro al hacer clic en el botón
btnRegistrar.addEventListener("click", async function (e) {
  e.preventDefault();
  await registrarUsuario();
});

// ── REGISTRO EN EL BACKEND ───────────────────────────────────────────────────
async function registrarUsuario() {
  limpiarMensajes();

  // 1. Leemos los valores del formulario
  const nombreCompleto = document.getElementById("inputNombre").value.trim();
  const email = document.getElementById("inputCorreo").value.trim().toLowerCase();
  const telefono = document.getElementById("inputTelefono").value.trim();
  const password = document.getElementById("inputPassword").value;
  const passwordDos = document.getElementById("inputPasswordDos").value;

  // 2. Validaciones del lado del cliente antes de enviar al backend
  if (nombreCompleto === "") {
    textoAlerta.innerHTML = "<h5>¡Ingrese su nombre completo primero! ⚠️</h5>";
    return;
  }
  if (email === "") {
    textoEmail.innerHTML = "<h5>¡Ingrese su correo! ⚠️</h5>";
    return;
  }
  if (telefono === "" || telefono.length < 10) {
    textoTelefono.innerHTML = "<h5>¡Ingrese su teléfono completo! ⚠️</h5>";
    return;
  }
  if (password.trim() === "" || password.length < 8) {
    textoPassword.innerHTML = "<h5>¡La contraseña debe tener al menos 8 caracteres! ⚠️</h5>";
    return;
  }
  if (passwordDos !== password) {
    confirmarPassword.innerHTML = "<h5>Las contraseñas no coinciden ⚠️</h5>";
    return;
  }

  // 3. Separamos nombre y apellido del nombre completo
  const partes = nombreCompleto.split(" ");
  const nombre = partes[0] || "";
  const apellido = partes.slice(1).join(" ") || "Sin apellido";

  // 4. Armamos el objeto que espera el backend (RegisterRequestDTO)
  const body = {
    nombre: nombre,
    apellido: apellido,
    documento: "DOC-" + Date.now(), // documento temporal único
    email: email,
    password: password,
    telefono: telefono,
    rol: "HUESPED" // por defecto todo usuario nuevo es HUESPED
  };

  try {
    // 5. Enviamos los datos al backend vía POST → /api/auth/register
    //    El backend guarda el cliente en PostgreSQL/Supabase y devuelve un token JWT
    const response = await fetch(`${API_AUTH}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "No se pudo registrar el usuario");
    }

    // 6. Guardamos el token JWT y el email en localStorage
    //    El token se usará en futuras peticiones que requieran autenticación
    //    (reservas, perfil, etc.) enviándolo en el header Authorization: Bearer <token>
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuarioEmail", email);

    // 7. Mostramos éxito y redirigimos al login
    mostrarAlertaRegistro(true, "Registro exitoso. Ahora puedes continuar.");
    setTimeout(() => {
      window.location.href = "../html/iniciarSesion.html";
    }, 1200);

  } catch (error) {
    console.error("Error en registro:", error);
    mostrarAlertaRegistro(false, error.message || "Ocurrió un error al registrar.");
  }
}