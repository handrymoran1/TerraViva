// js/perfil_usuario.js – Perfil con reservas reales, estadísticas y edición de datos

function cerrarSesionManual() {
  localStorage.removeItem("usuarioLogueado");
  alert("Has cerrado sesión correctamente.");
  window.location.href = "../index.html";
}

function actualizarNavbar() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  const navAvatar = document.getElementById("navAvatar");
  if (navAvatar && usuario && usuario.nombre) {
    navAvatar.textContent = usuario.nombre.charAt(0).toUpperCase();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  actualizarNavbar();

  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  if (!usuario) {
    alert("Debes iniciar sesión para ver esta página.");
    window.location.href = "../html/iniciarSesion.html";
    return;
  }

  // Referencias
  const inputNombre = document.getElementById("inputNombre");
  const inputCorreo = document.getElementById("inputCorreo");
  const inputTelefono = document.getElementById("inputTelefono");
  const inputCiudad = document.getElementById("inputCiudad");
  const nombreDisplay = document.getElementById("nombreDisplay");
  const correoDisplay = document.getElementById("correoDisplay");
  const fotoPreview = document.getElementById("fotoPreview");

  // Rellenar campos
  inputNombre.value = usuario.nombre || "";
  inputCorreo.value = usuario.email || "";
  inputTelefono.value = usuario.telefono || "";
  if (inputCiudad) inputCiudad.value = usuario.ciudad || "";
  nombreDisplay.textContent = usuario.nombre || "Usuario";
  correoDisplay.textContent = usuario.email || "";

  const inicial = (usuario.nombre || "U").charAt(0).toUpperCase();
  fotoPreview.src = `https://ui-avatars.com/api/?name=${inicial}&background=1B4015&color=fff&size=200&font-size=0.4`;

  // Guardar cambios
  const btnGuardar = document.getElementById("btnGuardar");
  const toastGuardado = document.getElementById("toastGuardado");

  btnGuardar.addEventListener("click", function () {
    const nuevoNombre = inputNombre.value.trim();
    const nuevoTelefono = inputTelefono.value.trim();
    const nuevaCiudad = inputCiudad ? inputCiudad.value.trim() : "";

    if (!nuevoNombre) {
      alert("El nombre no puede estar vacío.");
      return;
    }

    usuario.nombre = nuevoNombre;
    usuario.telefono = nuevoTelefono;
    usuario.ciudad = nuevaCiudad;
    localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].email === usuario.email) {
        usuarios[i].nombre = nuevoNombre;
        usuarios[i].telefono = nuevoTelefono;
        usuarios[i].ciudad = nuevaCiudad;
        break;
      }
    }
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    nombreDisplay.textContent = nuevoNombre;
    const nuevaInicial = nuevoNombre.charAt(0).toUpperCase();
    fotoPreview.src = `https://ui-avatars.com/api/?name=${nuevaInicial}&background=1B4015&color=fff&size=200&font-size=0.4`;
    actualizarNavbar();

    toastGuardado.classList.add("show");
    setTimeout(() => toastGuardado.classList.remove("show"), 3000);
  });

  // Mostrar reservas
  const reservas = usuario.reservas || [];
  mostrarReservas(reservas);
  actualizarEstadisticas(reservas);
});

function mostrarReservas(reservas) {
  const contenedor = document.getElementById("listaReservas");
  const vacio = document.getElementById("reservasVacias");
  if (!contenedor) return;

  // Limpiar excepto el div de vacío
  Array.from(contenedor.children).forEach(child => {
    if (child !== vacio) contenedor.removeChild(child);
  });

  if (reservas.length === 0) {
    if (vacio) vacio.style.display = "block";
    return;
  }
  if (vacio) vacio.style.display = "none";

  reservas.forEach(reserva => {
    const card = document.createElement("div");
    card.className = "reserva-item card mb-3 p-3 shadow-sm";
    card.innerHTML = `
      <div class="row align-items-center">
        <div class="col-md-2">
          <img src="${reserva.imagen || 'https://placehold.co/150x100?text=Sin+imagen'}" 
               alt="${reserva.habitacion}" class="img-fluid rounded" style="max-height:80px; object-fit:cover;">
        </div>
        <div class="col-md-6">
          <h5 class="mb-1">${reserva.habitacion}</h5>
          <p class="mb-1"><i class="bi bi-calendar-check me-1"></i> 
            ${new Date(reserva.fechaLlegada + "T00:00:00").toLocaleDateString("es-CO")} 
            → ${new Date(reserva.fechaSalida + "T00:00:00").toLocaleDateString("es-CO")}
          </p>
          <p class="mb-0"><i class="bi bi-people-fill me-1"></i> ${reserva.huespedes} · ${reserva.noches} noches</p>
        </div>
        <div class="col-md-4 text-md-end mt-2 mt-md-0">
          <span class="badge bg-success fs-6">Total: $${reserva.total.toLocaleString("es-CO")}</span>
        </div>
      </div>`;
    contenedor.appendChild(card);
  });
}

function actualizarEstadisticas(reservas) {
  const totalReservas = reservas.length;
  let nochesHospedado = 0;
  for (let r of reservas) nochesHospedado += r.noches;

  const hoy = new Date();
  hoy.setHours(0,0,0,0);
  let activas = 0;
  for (let r of reservas) {
    const fSalida = new Date(r.fechaSalida + "T00:00:00");
    if (fSalida > hoy) activas++;
  }

  document.querySelectorAll(".stat-reservas").forEach(el => el.textContent = totalReservas);
  document.querySelectorAll(".stat-activa").forEach(el => el.textContent = activas);
  document.querySelectorAll(".stat-noches").forEach(el => el.textContent = nochesHospedado);
}