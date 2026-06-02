const API_URL = "https://terraviva-backend.onrender.com/api/habitaciones";

let filtroPersonas = 0;
let habitacionesCargadas = [];

function placeholderImagen() {
  return "https://placehold.co/300x200?text=Sin+imagen";
}

async function cargarHabitacionesDesdeAPI() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al conectar con el servidor");

    const datos = await response.json();

    return datos.map(h => ({
      id: h.idHabitacion,
      nombre: h.tipo,
      precio: parseFloat(h.precioNoche) || 0,
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

function actualizarBotonesFiltro() {
  const botones = document.querySelectorAll(".btn-filtro-personas");

  botones.forEach(boton => {
    boton.classList.remove("active");
    if (parseInt(boton.dataset.personas) === filtroPersonas) {
      boton.classList.add("active");
    }
  });
}

function crearCardHabitacion(hab) {
  const col = document.createElement("div");
  col.className = "col";

  const imagenSrc = hab.imagen || placeholderImagen();
  const capacidad = hab.capacidad || 2;

  col.innerHTML = `
    <div class="card card-habitacion h-100 shadow-sm">
      <img
        src="${imagenSrc}"
        class="img-habitacion"
        alt="${hab.nombre}"
        style="height: 180px; object-fit: cover;"
        onerror="this.src='${placeholderImagen()}'"
      >
      <div class="card-texto text-center">
        <h6 class="mb-1">${hab.nombre}</h6>
        <p class="precio mb-1">$${hab.precio.toLocaleString("es-CO")} / noche</p>
        <p class="capacidad-badge mb-2">
          <i class="bi bi-people-fill me-1"></i>
          Hasta ${capacidad} persona${capacidad > 1 ? "s" : ""}
        </p>
        <p class="card-text texto-card-habitacion">${hab.descripcion || ""}</p>
        <button class="btn-reservar" data-id="${hab.id}">Reservar</button>
        <a href="${hab.url || "#"}" class="btn-reservar btn-ver-detalles">Ver detalles</a>
      </div>
    </div>
  `;

  return col;
}

function ajustarCatalogo() {
  const contenedor = document.getElementById("contenedorHabitaciones");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const habitacionesFiltradas = habitacionesCargadas.filter(hab => {
    if (hab.mostrar === false) return false;
    if (filtroPersonas === 2 && hab.capacidad > 2) return false;
    if (filtroPersonas === 4 && hab.capacidad < 3) return false;
    return true;
  });

  if (habitacionesFiltradas.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12 text-center">
        <p class="text-muted">No hay habitaciones disponibles.</p>
      </div>
    `;
    return;
  }

  habitacionesFiltradas.forEach(hab => {
    contenedor.appendChild(crearCardHabitacion(hab));
  });

  activarBotonesReservar();
}

function activarBotonesReservar() {
  const botones = document.querySelectorAll(".btn-reservar[data-id]");

  botones.forEach(boton => {
    boton.addEventListener("click", function () {
      const idNum = parseInt(this.dataset.id);
      const hab = habitacionesCargadas.find(h => h.id === idNum);

      if (!hab) return;

      sessionStorage.setItem("habitacionSeleccionada", JSON.stringify(hab));

      if (sessionStorage.getItem("busquedaHabitaciones")) {
        window.location.href = "../html/detalleReserva.html";
      } else {
        Swal.fire({
          icon: "info",
          title: "Selecciona fechas primero",
          text: "Primero debes seleccionar fechas en el inicio.",
          showCancelButton: true,
          confirmButtonText: "Ir al inicio",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#1B4015"
        }).then(result => {
          if (result.isConfirmed) {
            window.location.href = "../index.html";
          }
        });
      }
    });
  });
}

function actualizarTodosLosContadores() {
  const spanDisponibles = document.getElementById("contadorDisponible");
  const spanOcupadas = document.getElementById("contadorOcupadas");
  const spanTotal = document.getElementById("contadorTotalHabitaciones");

  const visibles = habitacionesCargadas.filter(h => h.mostrar === true).length;
  const ocultas = habitacionesCargadas.filter(h => h.mostrar === false).length;
  const total = habitacionesCargadas.length;

  if (spanDisponibles) spanDisponibles.textContent = visibles;
  if (spanOcupadas) spanOcupadas.textContent = ocultas;
  if (spanTotal) spanTotal.textContent = total;
}

function limpiarBusqueda() {
  sessionStorage.removeItem("busquedaHabitaciones");
  window.location.href = "../index.html";
}

function mostrarResumenBusqueda() {
  const datosBusqueda = JSON.parse(sessionStorage.getItem("busquedaHabitaciones"));
  const divResumen = document.getElementById("resumenBusqueda");

  if (!datosBusqueda || !divResumen) return;

  const opciones = { weekday: "short", month: "short", day: "numeric" };
  const fechaLlegada = new Date(datosBusqueda.llegada + "T00:00:00").toLocaleDateString("es-CO", opciones);
  const fechaSalida = new Date(datosBusqueda.salida + "T00:00:00").toLocaleDateString("es-CO", opciones);

  const resumenFechas = document.getElementById("resumenFechas");
  const resumenHuespedes = document.getElementById("resumenHuespedes");

  if (resumenFechas) resumenFechas.textContent = `${fechaLlegada} - ${fechaSalida}`;
  if (resumenHuespedes) resumenHuespedes.textContent = datosBusqueda.huespedes;

  divResumen.classList.remove("d-none");
  divResumen.classList.add("d-flex");

  const btnNueva = document.getElementById("btnNuevaBusqueda");
  if (btnNueva) {
    btnNueva.addEventListener("click", limpiarBusqueda);
  }

  const numeros = (datosBusqueda.huespedes || "").match(/\d+/g);
  const huespedes = numeros ? numeros.reduce((sum, n) => sum + parseInt(n), 0) : 0;

  if (!isNaN(huespedes) && huespedes >= 3) {
    filtroPersonas = 4;
    actualizarBotonesFiltro();
    ajustarCatalogo();
  }

  const filtroWrapper = document.getElementById("filtroPersonasWrapper");
  if (filtroWrapper && huespedes > 0) {
    filtroWrapper.classList.add("d-none");
  }
}

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
        <img
          src="${imagenSrc}"
          alt="${hab.nombre}"
          style="width:80px;height:60px;object-fit:cover;border-radius:5px;"
          onerror="this.src='${placeholderImagen()}'"
        >
      </div>
      <div class="flex-grow-1">
        <strong>${hab.nombre}</strong> - $${hab.precio.toLocaleString("es-CO")} / noche<br>
        <small class="text-muted">${hab.descripcion || ""}</small><br>
        <span class="badge bg-${estadoColor}">${estadoTexto}</span>
      </div>
      <div class="d-flex gap-2 flex-wrap">
        <button class="btn btn-sm btn-outline-warning btn-editar" data-id="${hab.id}">Editar</button>
        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${hab.id}">Eliminar</button>
        <button
          class="btn btn-sm btn-outline-primary toggle-visibilidad"
          data-id="${hab.id}"
          data-mostrar="${hab.mostrar}"
        >
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
        icon: "warning",
        title: "¿Eliminar habitación?",
        text: "Esta acción no se puede deshacer.",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#dc3545"
      }).then(result => {
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
      const habitacion = habitacionesCargadas.find(h => h.id === id);

      if (habitacion) {
        habitacion.mostrar = !habitacion.mostrar;
        pintarListaAdmin();
        ajustarCatalogo();
        actualizarTodosLosContadores();
      }
    }
  });
}

function reservarDesdeDetalle(e, idHabitacion) {
  e.preventDefault();

  const hab = habitacionesCargadas.find(h => h.id === idHabitacion);

  if (!hab) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se encontró la información de esta habitación.",
      confirmButtonColor: "#1B4015"
    });
    return;
  }

  sessionStorage.setItem("habitacionSeleccionada", JSON.stringify(hab));

  if (sessionStorage.getItem("busquedaHabitaciones")) {
    window.location.href = "./detalleReserva.html";
  } else {
    Swal.fire({
      icon: "info",
      title: "Selecciona fechas primero",
      text: "Primero debes seleccionar fechas en el inicio.",
      showCancelButton: true,
      confirmButtonText: "Ir al inicio",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#1B4015"
    }).then(result => {
      if (result.isConfirmed) {
        window.location.href = "../index.html";
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  if (typeof actualizarNavbar === "function") {
    actualizarNavbar();
  }

  habitacionesCargadas = await cargarHabitacionesDesdeAPI();

  actualizarBotonesFiltro();
  ajustarCatalogo();
  actualizarTodosLosContadores();
  mostrarResumenBusqueda();

  document.querySelectorAll(".btn-filtro-personas").forEach(boton => {
    boton.addEventListener("click", function () {
      filtroPersonas = parseInt(this.dataset.personas) || 0;
      actualizarBotonesFiltro();
      ajustarCatalogo();
    });
  });

  if (document.getElementById("listaHabitacionesAdmin")) {
    pintarListaAdmin();
    activarEventosAdmin();
  }

  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", function () {
      localStorage.removeItem("token");
      localStorage.removeItem("usuarioEmail");

      Swal.fire({
        icon: "success",
        title: "Sesión cerrada",
        text: "Has cerrado sesión correctamente.",
        confirmButtonColor: "#1B4015",
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        window.location.href = "../index.html";
      });
    });
  }
});