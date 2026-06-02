const API_URL = "https://terraviva-backend.onrender.com/api/habitaciones";
const BASE_URL = "https://terraviva-backend.onrender.com";
let filtroPersonas = 0;
let habitacionesCargadas = [];

// ── API ──────────────────────────────────────────────────────────────────────

async function cargarHabitacionesDesdeAPI() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al conectar con el servidor");
    const datos = await response.json();
    const overrides = JSON.parse(localStorage.getItem("visibilidadHabitaciones") || "{}");
    return datos.map(h => ({
      id: h.idHabitacion,
      nombre: h.tipo,
      precio: parseFloat(h.precioNoche),
      imagen: h.imagen,
      descripcion: h.descripcion,
      url: h.urlDetalle,
      mostrar: overrides.hasOwnProperty(h.idHabitacion) ? overrides[h.idHabitacion] : h.visible,
      capacidad: h.capacidad || 2
    }));
  } catch (error) {
    console.error("Error al cargar habitaciones:", error);
    return [];
  }
}

// ── UTILIDADES ───────────────────────────────────────────────────────────────

function placeholderImagen() {
  return "https://placehold.co/300x200?text=Sin+imagen";
}

// ── FILTRO ───────────────────────────────────────────────────────────────────

function actualizarBotonesFiltro() {
  const botones = document.querySelectorAll(".btn-filtro-personas");
  for (let i = 0; i < botones.length; i++) {
    botones[i].classList.remove("active");
    if (parseInt(botones[i].dataset.personas) === filtroPersonas) {
      botones[i].classList.add("active");
    }
  }
}

// ── CATÁLOGO ─────────────────────────────────────────────────────────────────

function ajustarCatalogo() {
  const contenedor = document.getElementById("contenedorHabitaciones");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  let hayVisibles = false;

  for (let i = 0; i < habitacionesCargadas.length; i++) {
    const hab = habitacionesCargadas[i];

    if (hab.mostrar === false) continue;
    if (filtroPersonas === 2 && hab.capacidad > 2) continue;
    if (filtroPersonas === 4 && hab.capacidad < 3) continue;

    hayVisibles = true;

    const col = document.createElement("div");
    col.className = "col";

    const imagenSrc = hab.imagen || placeholderImagen();
    const capacidad = hab.capacidad || 2;

    col.innerHTML = `
      <div class="card card-habitacion h-100 shadow-sm">
        <img src="${imagenSrc}" class="img-habitacion" alt="${hab.nombre}" style="height: 180px; object-fit: cover;">
        <div class="card-texto text-center">
          <h6 class="mb-1">${hab.nombre}</h6>
          <p class="precio mb-1">$${hab.precio.toLocaleString("es-CO")} / noche</p>
          <p class="capacidad-badge mb-2"><i class="bi bi-people-fill me-1"></i>Hasta ${capacidad} persona${capacidad > 1 ? "s" : ""}</p>
          <p class="card-text texto-card-habitacion">${hab.descripcion || ""}</p>
          <button class="btn-reservar" data-id="${hab.id}">Reservar</button>
          <a href="${hab.url || "#"}" class="btn-reservar btn-ver-detalles">Ver detalles</a>
        </div>
      </div>
    `;
    contenedor.appendChild(col);
  }

  if (!hayVisibles) {
    contenedor.innerHTML =
      '<div class="col-12 text-center"><p class="text-muted">No hay habitaciones disponibles.</p></div>';
  }

  // Eventos botón Reservar
  const botones = document.querySelectorAll(".btn-reservar");
  for (let j = 0; j < botones.length; j++) {
    botones[j].addEventListener("click", function () {
      const idStr = this.dataset.id;
      if (!idStr) return;

      const idNum = parseInt(idStr);
      const hab = habitacionesCargadas.find(h => h.id === idNum);

      if (hab) {
        sessionStorage.setItem("habitacionSeleccionada", JSON.stringify(hab));

        if (sessionStorage.getItem("busquedaHabitaciones")) {
          window.location.href = "../html/detalleReserva.html";
        } else {
          Swal.fire({
            title: "¿Seleccionar fechas primero?",
            text: "Primero debes seleccionar fechas en el inicio. ¿Ir allá ahora?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#5FA62D",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ir al inicio",
            cancelButtonText: "Cancelar"
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "../index.html";
            }
          });
        }
      }
    });
  }
}

// ── CONTADORES ───────────────────────────────────────────────────────────────

function actualizarTodosLosContadores() {
  const spanDisponibles = document.getElementById("contadorDisponible");
  const spanOcupadas = document.getElementById("contadorOcupadas");

  if (spanDisponibles) {
    spanDisponibles.textContent = habitacionesCargadas.filter(h => h.mostrar === true).length;
  }
  if (spanOcupadas) {
    spanOcupadas.textContent = habitacionesCargadas.filter(h => h.mostrar === false).length;
  }
}

// ── RESUMEN BÚSQUEDA ─────────────────────────────────────────────────────────

function limpiarBusqueda() {
  sessionStorage.removeItem("busquedaHabitaciones");
  window.location.href = "../index.html";
}

function mostrarResumenBusqueda() {
  const datosBusqueda = JSON.parse(sessionStorage.getItem("busquedaHabitaciones"));
  const divResumen = document.getElementById("resumenBusqueda");

  if (datosBusqueda && divResumen) {
    const opciones = { weekday: "short", month: "short", day: "numeric" };

    const fechaLlegada = new Date(datosBusqueda.llegada + "T00:00:00")
      .toLocaleDateString("es-CO", opciones);
    const fechaSalida = new Date(datosBusqueda.salida + "T00:00:00")
      .toLocaleDateString("es-CO", opciones);

    document.getElementById("resumenFechas").textContent = `${fechaLlegada} - ${fechaSalida}`;
    document.getElementById("resumenHuespedes").textContent = datosBusqueda.huespedes;

    divResumen.classList.remove("d-none");
    divResumen.classList.add("d-flex");

    const btnNueva = document.getElementById("btnNuevaBusqueda");
    if (btnNueva) btnNueva.addEventListener("click", limpiarBusqueda);

    const numeros = (datosBusqueda.huespedes || "").match(/\d+/g);
    const hues = numeros ? numeros.reduce((sum, n) => sum + parseInt(n), 0) : 0;

    if (!isNaN(hues) && hues >= 3) {
      filtroPersonas = 4;
      actualizarBotonesFiltro();
      ajustarCatalogo();
    }

    const filtroWrapper = document.getElementById("filtroPersonasWrapper");
    if (filtroWrapper && hues > 0) filtroWrapper.classList.add("d-none");
  }
}

// ── ADMIN ────────────────────────────────────────────────────────────────────

function pintarListaAdmin() {
  const contenedor = document.getElementById("listaHabitacionesAdmin");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  habitacionesCargadas.forEach(hab => {
    const estadoTexto = hab.mostrar ? "Visible" : "Oculto";
    const estadoColor = hab.mostrar ? "success" : "secondary";
    const imagenSrc = hab.imagen || placeholderImagen();

    const item = document.createElement("div");
    item.className = "list-group-item d-flex align-items-center";
    item.innerHTML = `
      <div class="me-3">
        <img src="${imagenSrc}" alt="${hab.nombre}" style="width:80px;height:60px;object-fit:cover;border-radius:5px;" onerror="this.src='${placeholderImagen()}'">
      </div>
      <div class="flex-grow-1">
        <strong>${hab.nombre}</strong> - $${hab.precio.toLocaleString("es-CO")} / noche<br>
        <small class="text-muted">${hab.descripcion || ""}</small><br>
        <span class="badge bg-${estadoColor}">${estadoTexto}</span>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-outline-warning btn-editar" data-id="${hab.id}">Editar</button>
        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${hab.id}">Eliminar</button>
        <button class="btn btn-sm btn-outline-primary toggle-visibilidad" data-id="${hab.id}" data-mostrar="${hab.mostrar}">
          ${hab.mostrar ? "Ocultar" : "Mostrar"}
        </button>
      </div>
    `;
    contenedor.appendChild(item);
  });
}

function activarEventosAdmin() {
  const contenedor = document.getElementById("listaHabitacionesAdmin");
  if (!contenedor) return;

  contenedor.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-eliminar")) {
      const id = parseInt(e.target.dataset.id);
      Swal.fire({
        title: "¿Eliminar habitación?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#5FA62D",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          habitacionesCargadas = habitacionesCargadas.filter(h => h.id !== id);
          pintarListaAdmin();
          ajustarCatalogo();
          actualizarTodosLosContadores();
        }
      });
    }

    if (e.target.classList.contains("toggle-visibilidad")) {
      const id = parseInt(e.target.dataset.id);
      const hab = habitacionesCargadas.find(h => h.id === id);
      if (!hab) return;

      const nuevaVisibilidad = !hab.mostrar;
      const token = localStorage.getItem("token");

      // Guardamos override local para que persista en habitaciones.html
      const overrides = JSON.parse(localStorage.getItem("visibilidadHabitaciones") || "{}");
      overrides[id] = nuevaVisibilidad;
      localStorage.setItem("visibilidadHabitaciones", JSON.stringify(overrides));

      // Actualizamos la UI siempre, sin esperar al backend
      hab.mostrar = nuevaVisibilidad;
      pintarListaAdmin();
      ajustarCatalogo();
      actualizarTodosLosContadores();

      // Intentamos persistir en el backend (sin bloquear)
      const bodyVisibilidad = {
        idHabitacion: id,
        tipo: hab.nombre,
        precioNoche: hab.precio,
        imagen: hab.imagen,
        descripcion: hab.descripcion,
        urlDetalle: hab.url,
        visible: nuevaVisibilidad,
        capacidad: hab.capacidad
      };
      console.log("PUT visibilidad →", `${API_URL}/${id}`, bodyVisibilidad);

      fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(bodyVisibilidad)
      })
      .then(async res => {
        const texto = await res.text().catch(() => "");
        if (!res.ok) {
          console.warn("PUT visibilidad falló:", res.status, texto);
        } else {
          // Backend guardó: limpiamos el override local, la BD es la fuente de verdad
          const ov = JSON.parse(localStorage.getItem("visibilidadHabitaciones") || "{}");
          delete ov[id];
          localStorage.setItem("visibilidadHabitaciones", JSON.stringify(ov));
          console.log("PUT visibilidad OK:", res.status);
        }
      })
      .catch(err => {
        console.warn("PUT visibilidad error de red:", err);
      });
    }
  });
}

// ── RESERVAS ADMIN ───────────────────────────────────────────────────────────

async function cargarReservasAdmin() {
  const contenedor = document.getElementById("tablaReservasAdmin");
  if (!contenedor) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${BASE_URL}/api/reservas`, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) throw new Error("Status " + res.status);
    const reservas = await res.json();

    // Actualizar stats
    const activas = reservas.filter(r => r.estado === "RESERVADA");
    const canceladas = reservas.filter(r => r.estado === "CANCELADA");
    document.getElementById("adminTotalReservas").textContent = reservas.length;
    document.getElementById("adminReservasActivas").textContent = activas.length;
    document.getElementById("adminReservasCanceladas").textContent = canceladas.length;

    // Actualizar contadores de habitaciones según reservas activas
    const idsOcupadas = new Set(activas.map(r => r.habitacion?.idHabitacion).filter(Boolean));
    const spanDisponibles = document.getElementById("contadorDisponible");
    const spanOcupadas   = document.getElementById("contadorOcupadas");
    if (spanDisponibles) spanDisponibles.textContent = habitacionesCargadas.filter(h => h.mostrar && !idsOcupadas.has(h.id)).length;
    if (spanOcupadas)    spanOcupadas.textContent    = idsOcupadas.size;

    if (reservas.length === 0) {
      contenedor.innerHTML = `
        <div class="reservas-admin-empty">
          <div class="reservas-admin-empty-icon">
            <i class="bi bi-calendar-x"></i>
          </div>
          <h4 class="reservas-admin-empty-title">Sin reservas por ahora</h4>
          <p class="reservas-admin-empty-text">Cuando los huéspedes realicen reservas aparecerán aquí con todos los detalles.</p>
        </div>`;
      return;
    }

    contenedor.innerHTML = `
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="tabla-head-admin">
            <tr>
              <th>#</th>
              <th>Habitación</th>
              <th>Huésped</th>
              <th>Fechas</th>
              <th>Noches</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            ${reservas.map(r => {
              const fi = r.fechaInicio ? new Date(r.fechaInicio + "T00:00:00").toLocaleDateString("es-CO") : "-";
              const ff = r.fechaFin    ? new Date(r.fechaFin    + "T00:00:00").toLocaleDateString("es-CO") : "-";
              const color = r.estado === "RESERVADA" ? "success" : r.estado === "CANCELADA" ? "danger" : "secondary";
              const nombre = r.cliente ? `${r.cliente.nombre || ""} ${r.cliente.apellido || ""}`.trim() : "-";
              const emailCliente = r.cliente?.email || "";
              return `
                <tr>
                  <td><small class="text-muted">#${r.idReserva}</small></td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <img src="${r.habitacion?.imagen || "https://placehold.co/60x45?text=+"}"
                           width="60" height="45" class="rounded" style="object-fit:cover;">
                      <span class="fw-semibold">${r.habitacion?.tipo || "-"}</span>
                    </div>
                  </td>
                  <td>
                    <div class="fw-semibold">${nombre}</div>
                    <small class="text-muted">${emailCliente}</small>
                  </td>
                  <td><small>${fi} → ${ff}</small></td>
                  <td>${r.cantidadNoches || 0}</td>
                  <td>$${r.totalReserva?.toLocaleString("es-CO") || 0}</td>
                  <td><span class="badge bg-${color}">${r.estado}</span></td>
                  <td>
                    ${r.estado === "RESERVADA"
                      ? `<button class="btn btn-sm btn-outline-danger btn-cancelar-admin" data-id="${r.idReserva}">
                           <i class="bi bi-x-circle me-1"></i>Cancelar
                         </button>`
                      : `<span class="text-muted">—</span>`}
                  </td>
                </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>`;

    contenedor.querySelectorAll(".btn-cancelar-admin").forEach(btn => {
      btn.addEventListener("click", async function () {
        const id = this.dataset.id;
        const confirm = await Swal.fire({
          title: "¿Cancelar reserva?",
          text: "Esta acción no se puede deshacer.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#5FA62D",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Sí, cancelar",
          cancelButtonText: "No"
        });
        if (!confirm.isConfirmed) return;

        try {
          const r = await fetch(`${BASE_URL}/api/reservas/cancelar/${id}`, {
            method: "PUT",
            headers: { "Authorization": "Bearer " + token }
          });
          if (!r.ok) throw new Error();
          await Swal.fire({
            icon: "success", title: "¡Reserva cancelada!",
            confirmButtonColor: "#5FA62D", timer: 1500, showConfirmButton: false
          });
          cargarReservasAdmin();
        } catch {
          Swal.fire({ icon: "error", title: "Error", text: "No se pudo cancelar.", confirmButtonColor: "#5FA62D" });
        }
      });
    });

  } catch (err) {
    console.error("Error al cargar reservas admin:", err);
    contenedor.innerHTML = `
      <div class="reservas-admin-error">
        <i class="bi bi-wifi-off" style="font-size:2.2rem;"></i>
        <strong>No se pudieron cargar las reservas</strong>
        <small>${err.message}</small>
      </div>`;
  }
}

// ── RESERVAR DESDE DETALLE ───────────────────────────────────────────────────

function reservarDesdeDetalle(e, idHabitacion) {
  e.preventDefault();
  const hab = habitacionesCargadas.find(h => h.id === idHabitacion);

  if (!hab) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se encontró la información de esta habitación.",
      confirmButtonColor: "#5FA62D"
    });
    return;
  }

  sessionStorage.setItem("habitacionSeleccionada", JSON.stringify(hab));

  if (sessionStorage.getItem("busquedaHabitaciones")) {
    window.location.href = "./detalleReserva.html";
  } else {
    Swal.fire({
      title: "¿Seleccionar fechas primero?",
      text: "Primero debes seleccionar fechas en el inicio. ¿Ir allá ahora?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#5FA62D",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ir al inicio",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "../index.html";
      }
    });
  }
}

// ── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", async function () {
  actualizarNavbar();

  // Carga desde el backend
  habitacionesCargadas = await cargarHabitacionesDesdeAPI();

  ajustarCatalogo();
  actualizarTodosLosContadores();
  mostrarResumenBusqueda();

  // Filtros de capacidad
  const botonesFiltro = document.querySelectorAll(".btn-filtro-personas");
  for (let i = 0; i < botonesFiltro.length; i++) {
    botonesFiltro[i].addEventListener("click", function () {
      filtroPersonas = parseInt(this.dataset.personas);
      actualizarBotonesFiltro();
      ajustarCatalogo();
    });
  }

  // Admin
  if (document.getElementById("listaHabitacionesAdmin")) {
    pintarListaAdmin();
    activarEventosAdmin();
    cargarReservasAdmin();
  }

  // Cerrar sesión
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", function () {
      cerrarSesionManual();
    });
  }
});