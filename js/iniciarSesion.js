// js/iniciarSesion.js – Inicio de sesión con validación, toggle y redirección inteligente

const inputCorreo = document.getElementById("inputCorreo");
const inputPassword = document.getElementById("inputPassword");
const btnIniciarSesion = document.getElementById("btnIniciarSesion");
const toggleContrasena = document.getElementById("toggle-contrasena");
const iconoOjo = document.getElementById("icono-ojo");

const validarFormatoCorreo = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validarFormatoPassword = (password) => password.length >= 8;

document.addEventListener("DOMContentLoaded", () => {
  inputCorreo.addEventListener("input", function () {
    if (validarFormatoCorreo(this.value)) {
      this.classList.remove("is-invalid");
      this.classList.add("is-valid");
    } else {
      this.classList.remove("is-valid");
      this.classList.add("is-invalid");
    }
  });

  inputPassword.addEventListener("input", function () {
    if (validarFormatoPassword(this.value)) {
      this.classList.remove("is-invalid");
      this.classList.add("is-valid");
    } else {
      this.classList.remove("is-valid");
      this.classList.add("is-invalid");
    }
  });

  toggleContrasena.addEventListener("click", function () {
    const tipo = inputPassword.getAttribute("type") === "password" ? "text" : "password";
    inputPassword.setAttribute("type", tipo);
    iconoOjo.className = tipo === "password" ? "bi bi-eye-fill" : "bi bi-eye-slash-fill";
  });

  btnIniciarSesion.addEventListener("click", (e) => {
    e.preventDefault();
    const correo = inputCorreo.value.trim();
    const password = inputPassword.value;

    if (!validarFormatoCorreo(correo) || !validarFormatoPassword(password)) {
      alert("Por favor, complete los campos correctamente.");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuarioEncontrado = null;

    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].email === correo && usuarios[i].password === password) {
        usuarioEncontrado = usuarios[i];
        break;
      }
    }

    if (usuarioEncontrado) {
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioEncontrado));
      alert(`¡Bienvenido, ${usuarioEncontrado.nombre}!`);

      // Redirección después de login
      const redirigir = sessionStorage.getItem("redirectAfterLogin");
      if (redirigir) {
        sessionStorage.removeItem("redirectAfterLogin");
        window.location.href = "../html/" + redirigir;
      } else {
        if (correo === "admin@gmail.com" && password === "Admin123456789*") {
          window.location.href = "../html/dashboard.html";
        } else {
          window.location.href = "../html/perfil_usuario.html";
        }
      }
    } else {
      alert("Correo o contraseña incorrectos.");
    }
  });
});