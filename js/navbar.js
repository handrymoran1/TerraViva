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

    // Botón Dashboard para admin
    const existingDash = document.getElementById('btnDashboard');
    const enSubdirectorio = window.location.pathname.includes('/html/');
    const hrefDash = enSubdirectorio ? 'dashboard.html' : 'html/dashboard.html';
    if (email === 'admin02@gmail.com') {
      if (!existingDash) {
        const a = document.createElement('a');
        a.id = 'btnDashboard';
        a.className = 'btn custom-btn-primary btn-sm';
        a.href = hrefDash;
        a.textContent = 'Dashboard';
        if (divLogueado) {
          const btnCerrar = divLogueado.querySelector("button[onclick='cerrarSesionManual()']");
          if (btnCerrar) divLogueado.insertBefore(a, btnCerrar);
          else divLogueado.appendChild(a);
        }
      } else {
        existingDash.href = hrefDash;
        existingDash.style.display = '';
      }
    } else if (existingDash) {
      existingDash.style.display = 'none';
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
  const enSubdirectorio = window.location.pathname.includes("/html/");
  const destino = enSubdirectorio ? "../index.html" : "./index.html";

  if (typeof Swal === "undefined") {
    window.location.href = destino;
    return;
  }

  Swal.fire({
    icon: "success",
    title: "¡Hasta pronto!",
    text: "Has cerrado sesión correctamente.",
    confirmButtonColor: "#5FA62D",
    timer: 1500,
    showConfirmButton: false
  }).then(() => {
    window.location.href = destino;
  });
}

document.addEventListener("DOMContentLoaded", actualizarNavbar);