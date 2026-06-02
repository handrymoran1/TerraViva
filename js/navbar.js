function actualizarNavbar() {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("usuarioEmail");

  const divNoLogueado = document.getElementById("navNoLogueado");
  const divLogueado = document.getElementById("navLogueado");
  const navAvatar = document.getElementById("navAvatar");

  if (token && email) {
    if (divNoLogueado) divNoLogueado.style.display = "none";

    if (divLogueado) {
      divLogueado.classList.remove("d-none");
      divLogueado.style.display = "flex";
      divLogueado.style.gap = "8px";
      divLogueado.style.alignItems = "center";
    }

    if (navAvatar) {
      navAvatar.textContent = email.charAt(0).toUpperCase();
    }
  } else {
    if (divNoLogueado) divNoLogueado.style.display = "flex";

    if (divLogueado) {
      divLogueado.classList.add("d-none");
      divLogueado.style.display = "none";
    }
  }
}

function cerrarSesionManual() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuarioEmail");
  localStorage.removeItem("usuarioRol");
  sessionStorage.removeItem("habitacionSeleccionada");

  Swal.fire({
    icon: "success",
    title: "Sesión cerrada",
    text: "Has cerrado sesión correctamente.",
    confirmButtonColor: "#1B4015",
    timer: 1500,
    showConfirmButton: false
  }).then(() => {
    const enSubdirectorio = window.location.pathname.includes("/html/");
    window.location.href = enSubdirectorio ? "../index.html" : "./index.html";
  });
}

document.addEventListener("DOMContentLoaded", actualizarNavbar);