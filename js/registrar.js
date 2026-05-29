// js/registrar.js – Registro con validaciones, toggle de contraseña y array de reservas

const btnRegistrar = document.getElementById("btnRegistrar");
const textoAlerta = document.getElementById("textoAlerta");
const textoEmail = document.getElementById("textoEmail");
const inputEmail = document.getElementById("inputCorreo");
const textoTelefono = document.getElementById("textoTelefono");
const textoPassword = document.getElementById("textoPassword");
const confirmarPassword = document.getElementById("textoConfirmarPassword");
const alertaRegistro = document.getElementById("alerta-registro");
const iconoAlertaReg = document.getElementById("icono-alerta-reg");
const mensajeAlertaReg = document.getElementById("mensaje-alerta-reg");

function mostrarAlertaRegistro(exito, mensaje) {
  alertaRegistro.classList.remove("d-none");
  mensajeAlertaReg.textContent = mensaje;
  if (exito) {
    iconoAlertaReg.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
  } else {
    iconoAlertaReg.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i>';
  }
}

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

document.addEventListener("DOMContentLoaded", function () {
  configurarToggleContrasena("toggle-contrasena-reg", "inputPassword", "icono-ojo-reg");
  configurarToggleContrasena("toggle-confirmar-reg", "inputPasswordDos", "icono-ojo-confirmar");
});

btnRegistrar.addEventListener("click", function (e) {
  e.preventDefault();
  registrarUsuario();
});

function registrarUsuario() {
  const nombre = document.getElementById("inputNombre").value.trim();
  const email = document.getElementById("inputCorreo").value.trim();
  const telefono = document.getElementById("inputTelefono").value.trim();
  const password = document.getElementById("inputPassword").value;
  const inputPasswordDos = document.getElementById("inputPasswordDos").value;
  const ciudad = document.getElementById("inputCiudad") ? document.getElementById("inputCiudad").value.trim() : "";

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Validaciones
  if (nombre === "") {
    textoAlerta.innerHTML = "<h5>Ingrese su nombre completo ⚠️</h5>";
    return;
  }
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].nombre.toLowerCase() === nombre.toLowerCase()) {
      textoAlerta.innerHTML = "<h5>Este nombre ya está registrado.</h5>";
      return;
    }
  }
  if (email === "") {
    textoEmail.innerHTML = "<h5>Ingrese su correo ⚠️</h5>";
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    textoEmail.innerHTML = "<h5>Correo no válido ⚠️</h5>";
    return;
  }
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === email) {
      textoEmail.innerHTML = "<h5>Este correo ya está registrado.</h5>";
      return;
    }
  }
  if (telefono === "" || telefono.length < 10) {
    textoTelefono.innerHTML = "<h5>Ingrese un teléfono válido (mín. 10 dígitos) ⚠️</h5>";
    return;
  }
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].telefono === telefono) {
      textoTelefono.innerHTML = "<h5>Este teléfono ya está registrado.</h5>";
      return;
    }
  }
  if (password.length < 10) {
    textoPassword.innerHTML = "<h5>La contraseña debe tener al menos 10 caracteres ⚠️</h5>";
    return;
  }
  if (inputPasswordDos !== password) {
    confirmarPassword.innerHTML = "<h5>Las contraseñas no coinciden ⚠️</h5>";
    return;
  }

  // Crear usuario
  usuarios.push({
    nombre: nombre,
    email: email,
    telefono: telefono,
    password: password,
    ciudad: ciudad,
    reservas: []
  });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Registro exitoso. Ahora inicia sesión.");
  window.location.href = "../html/iniciarSesion.html";
}

// Funciones de navbar (innecesarias en esta página pero se mantienen por consistencia)
function cerrarSesionManual() {
  localStorage.removeItem("usuarioLogueado");
  window.location.href = "../index.html";
}
function actualizarNavbar() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  const divNoLogueado = document.getElementById("navNoLogueado");
  const divLogueado = document.getElementById("navLogueado");
  const navAvatar = document.getElementById("navAvatar");
  if (usuario) {
    if(divNoLogueado) divNoLogueado.classList.add("d-none");
    if(divLogueado) divLogueado.classList.remove("d-none");
    if(navAvatar && usuario.nombre) navAvatar.textContent = usuario.nombre.charAt(0).toUpperCase();
  } else {
    if(divNoLogueado) divNoLogueado.classList.remove("d-none");
    if(divLogueado) divLogueado.classList.add("d-none");
  }
}