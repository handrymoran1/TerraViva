const API_URL = "https://terraviva-backend.onrender.com/api/habitaciones";
let filtroPersonas = 0;
let habitacionesCargadas = [];

// ── API ──────────────────────────────────────────────────────────────────────

async function cargarHabitacionesDesdeAPI() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al conectar con el servidor");
    const datos = await response.json();
    return datos.map(h => ({
      id: h.idHabitacion,
      nombre: h.tipo,
      precio: parseFloat(h.precioNoche),
      imagen: h.imagen,
      descripcion: h.descripcion,
      url: h.urlDetalle,
      mostrar: h.visible,
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

      fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          tipo: hab.nombre,
          precioNoche: hab.precio,
          imagen: hab.imagen,
          descripcion: hab.descripcion,
          urlDetalle: hab.url,
          visible: nuevaVisibilidad,
          capacidad: hab.capacidad
        })
      })
      .then(res => {
        if (!res.ok) throw new Error("Error " + res.status);
        hab.mostrar = nuevaVisibilidad;
        pintarListaAdmin();
        ajustarCatalogo();
        actualizarTodosLosContadores();
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cambiar la visibilidad de la habitación.",
          confirmButtonColor: "#5FA62D"
        });
      });
    }
  });
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
  }

  // Cerrar sesión
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", function () {
      cerrarSesionManual();
    });
  }
});