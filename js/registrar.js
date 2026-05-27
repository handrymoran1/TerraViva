const btnRegistrar = document.getElementById("btnRegistrar");
const textoAlerta = document.getElementById("textoAlerta");
const textoEmail = document.getElementById("textoEmail");
const inputEmail = document.getElementById("inputCorreo");
const textoTelefono = document.getElementById("textoTelefono");
const textoPassword = document.getElementById("textoPassword");
const confirmarPassword = document.getElementById("textoConfirmarPassword");
// alerta visual y toggles de contraseña
const alertaRegistro = document.getElementById("alerta-registro");
const iconoAlertaReg = document.getElementById("icono-alerta-reg");
const mensajeAlertaReg = document.getElementById("mensaje-alerta-reg");

function mostrarAlertaRegistro(exito, mensaje) {
  alertaRegistro.classList.remove("d-none");
  mensajeAlertaReg.textContent = mensaje;
  if (exito) {
    iconoAlertaReg.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
  } else {
    iconoAlertaReg.innerHTML =
      '<i class="bi bi-exclamation-triangle-fill"></i>';
  }
}

// configurar el toggle de cualquier campo de contraseña
function configurarToggleContrasena(idToggle, idInput, idIcono) {
  const toggle = document.getElementById(idToggle);
  const input = document.getElementById(idInput);
  const icono = document.getElementById(idIcono);
  toggle.addEventListener("click", function () {
    const tipo =
      input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", tipo);
    if (tipo === "password") {
      icono.className = "bi bi-eye-fill";
    } else {
      icono.className = "bi bi-eye-slash-fill";
    }
  });
}

// toggles al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  configurarToggleContrasena(
    "toggle-contrasena-reg",
    "inputPassword",
    "icono-ojo-reg",
  );
  configurarToggleContrasena(
    "toggle-confirmar-reg",
    "inputPasswordDos",
    "icono-ojo-confirmar",
  );
});

btnRegistrar.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("vamos bien.");
  registrarUsuario();
});

function registrarUsuario() {
  const nombre = document.getElementById("inputNombre").value;
  const email = document.getElementById("inputCorreo").value;
  const telefono = document.getElementById("inputTelefono").value;
  const password = document.getElementById("inputPassword").value;
  const inputPasswordDos = document.getElementById("inputPasswordDos").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  let existeNombre = false;
  let existeEmail = false;
  let existeTelefono = false;

  //verificar el nombre primero que no exista
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].nombre === nombre) {
      existeNombre = true;
      textoAlerta.innerHTML = `<h5>Este nombre ya está registrado.</h5>`;
      return;
    }
  }
  //ahora que no esté vacío el campo.
  if (nombre.trim() === "") {
    alert("El nombre ome.");
    textoAlerta.innerHTML = "<h5>¡Ingrese su nombre completo primero! ⚠️<h5>";
    return;
  }
  //en esta verificamos que el correo no exista y despues que no esté vacío el campo
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === email) {
      existeEmail = true;
      textoEmail.innerHTML = `<h5>Este correo ya está registrado.</h5>`;
      return;
    }
  }

  if (email.trim() === "") {
    textoEmail.innerHTML = "<h5>¡Ingrese su correo! ⚠️<h5>";
    return;
  }
  //esta es la misma lógica para el numero de telefono
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].telefono === telefono) {
      existeTelefono = true;
      textoTelefono.innerHTML = `<h5>Este teléfono ya está registrado.</h5>`;
      return;
    }
  }

  if (telefono.trim() === "" || telefono.length < 10) {
    textoTelefono.innerHTML = "<h5>¡Ingrese su telefono completo! ⚠️<h5>";
    return;
  }

  if (password.trim() === "" || password.length < 10) {
    textoPassword.innerHTML =
      "<h5>¡La contraseña debe tener al menos 10 caracteres! ⚠️<h5>";
    return;
  }

  if (inputPasswordDos !== password) {
    confirmarPassword.innerHTML = "<h5>Las contraseñas no coinciden ⚠️</h5>";
    confirmarPassword.focus();
    return;
  }

  usuarios.push({
    nombre: nombre,
    email: email,
    telefono: telefono,
    password: password,
  });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  textoAlerta.innerHTML = "";
  window.location.href = "../html/iniciarSesion.html";
}
