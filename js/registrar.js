// [ARCHIVO] js/registrar.js – Registro de nuevos usuarios con validaciones y toggle de contraseña

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

// [CAMBIO] configurar el toggle de cualquier campo de contraseña
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

// [CAMBIO] toggles al cargar la página
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
  // [CAMBIO] también capturamos ciudad si existe el campo
  const ciudad = document.getElementById("inputCiudad")
    ? document.getElementById("inputCiudad").value
    : "";

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  //verificar el nombre primero que no exista
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].nombre === nombre) {
      textoAlerta.innerHTML = `<h5>Este nombre ya está registrado.</h5>`;
      return;
    }
  }
  //ahora que no esté vacío el campo.
  if (nombre.trim() === "") {
    alert("El nombre no puede estar vacío.");
    textoAlerta.innerHTML = "<h5>¡Ingrese su nombre completo primero! ⚠️<h5>";
    return;
  }
  //en esta verificamos que el correo no exista y despues que no esté vacío el campo
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === email) {
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

  // [CAMBIO] Se añade el array de reservas vacío y la ciudad
  usuarios.push({
    nombre: nombre,
    email: email,
    telefono: telefono,
    password: password,
    ciudad: ciudad,
    reservas: []   // <-- array vacío para guardar reservas futuras
  });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  textoAlerta.innerHTML = "";
  window.location.href = "../html/iniciarSesion.html";
}

// [CAMBIO] funciones compartidas de navegación (se duplican en varios JS)
function cerrarSesionManual() {
  localStorage.removeItem("usuarioLogueado");
  alert("Has cerrado sesión correctamente.");
  window.location.href = "../index.html";
}

function actualizarNavbar() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  const divNoLogueado = document.getElementById("navNoLogueado");
  const divLogueado = document.getElementById("navLogueado");
  const navAvatar = document.getElementById("navAvatar");
  if (usuario) {
    if (divNoLogueado) divNoLogueado.classList.add("d-none");
    if (divLogueado) divLogueado.classList.remove("d-none");
    if (navAvatar && usuario.nombre) {
      navAvatar.textContent = usuario.nombre.charAt(0).toUpperCase();
    }
  } else {
    if (divNoLogueado) divNoLogueado.classList.remove("d-none");
    if (divLogueado) divLogueado.classList.add("d-none");
  }
}
// [NOTA] No se llama a actualizarNavbar en esta página porque el registro no muestra el navbar de usuario logueado.