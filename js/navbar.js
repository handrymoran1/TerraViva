function actualizarNavbar() {
  // Antes buscaba "usuarioLogueado" (objeto completo en localStorage)
  // Ahora busca "token" y "usuarioEmail" que guarda el backend tras el login
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("usuarioEmail");

  const divNoLogueado = document.getElementById("navNoLogueado");
  const divLogueado = document.getElementById("navLogueado");
  const navAvatar = document.getElementById("navAvatar");

  if (token && email) {
    // Usuario logueado: ocultamos botones de registro/login
    if (divNoLogueado) divNoLogueado.style.display = "none";
    if (divLogueado) {
      divLogueado.classList.remove("d-none");
      divLogueado.style.display = "flex";
      divLogueado.style.gap = "8px";
      divLogueado.style.alignItems = "center";
    }
    // Mostramos la primera letra del email como avatar (ej: "j" de joantriana7@gmail.com)
    if (navAvatar && email) {
      navAvatar.textContent = email.charAt(0).toUpperCase();
    }
  } else {
    // No logueado: mostramos botones de registro/login
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
  Swal.fire({
    icon: "success",
    title: "¡Hasta pronto!",
    text: "Has cerrado sesión correctamente.",
    confirmButtonColor: "#5FA62D",
    timer: 1500,
    showConfirmButton: false
  }).then(() => {
    const enSubdirectorio = window.location.pathname.includes("/html/");
    window.location.href = enSubdirectorio ? "../index.html" : "./index.html";
  });
}

document.addEventListener("DOMContentLoaded", actualizarNavbar);