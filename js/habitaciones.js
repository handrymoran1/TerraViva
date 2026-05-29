const CLAVE_HABITACIONES = "habitacionesHuellas";

const habitacionesIniciales = [
  {
    id: 1,
    nombre: "Suite Colonial",
    precio: 340000,
    imagen: "../assets/habitaciones/habitacion1.png",
    descripcion: "Elegante habitación con cama doble, decoración colonial y vista al patio interior.",
    mostrar: true,
  },
  {
    id: 2,
    nombre: "Habitación Doble Superior",
    precio: 250000,
    imagen: "../assets/habitaciones/habitacion4.png",
    descripcion: "Habitación amplia y elegante, con detalles modernos.",
    mostrar: true,
  },
  {
    id: 3,
    nombre: "Habitación Doble Jardín",
    precio: 200000,
    imagen: "../assets/habitaciones/habitacion2.png",
    descripcion: "Espacio acogedor con vista a zonas verdes y excelente iluminación natural.",
    mostrar: true,
  },
  {
    id: 4,
    nombre: "Habitación Doble Natural",
    precio: 210000,
    imagen: "../assets/habitaciones/habitacion5.png",
    descripcion: "Decoración cálida con elementos en madera y tonos suaves.",
    mostrar: true,
  },
  {
    id: 5,
    nombre: "Habitación Doble con Balcón",
    precio: 330000,
    imagen: "../assets/habitaciones/habitacion3.png",
    descripcion: "Cama doble y balcón privado para disfrutar del aire libre.",
    mostrar: true,
  },
  {
    id: 6,
    nombre: "Habitación Doble Ejecutiva",
    precio: 220000,
    imagen: "../assets/habitaciones/habitacion6.png",
    descripcion: "Incluye escritorio y buena iluminación, ideal para trabajar y descansar.",
    mostrar: true,
  },
  {
    id: 7,
    nombre: "Habitación Vista Exterior",
    precio: 240000,
    imagen: "../assets/habitaciones/habitacion7.png",
    descripcion: "Habitación luminosa con cama doble y vista exterior.",
    mostrar: true,
  },
  {
    id: 8,
    nombre: "Habitación Doble Romántica",
    precio: 260000,
    imagen: "../assets/habitaciones/habitacion8.png",
    descripcion: "Ambiente íntimo con iluminación cálida y decoración acogedora.",
    mostrar: true,
  },
  {
    id: 9,
    nombre: "Junior Suite",
    precio: 290000,
    imagen: "../assets/habitaciones/habitacion9.png",
    descripcion: "Espacio amplio con zona de descanso adicional.",
    mostrar: true,
  },
  {
    id: 10,
    nombre: "Suite Premium",
    precio: 330000,
    imagen: "../assets/habitaciones/habitacion10.png",
    descripcion: "La más exclusiva, con cama amplia y diseño moderno.",
    mostrar: true,
  },
];

// [CAMBIO] inicializar habitaciones si no existen en localStorage
function inicializarHabitaciones() {
  if (!localStorage.getItem(CLAVE_HABITACIONES)) {
    localStorage.setItem(CLAVE_HABITACIONES, JSON.stringify(habitacionesIniciales));
  }
}

function obtenerHabitaciones() {
  return JSON.parse(localStorage.getItem(CLAVE_HABITACIONES)) || [];
}

function guardarHabitaciones(habitaciones) {
  localStorage.setItem(CLAVE_HABITACIONES, JSON.stringify(habitaciones));
}

function generarId() {
  const habitaciones = obtenerHabitaciones();
  if (habitaciones.length === 0) return 1;
  return Math.max(...habitaciones.map((h) => h.id)) + 1;
}

function placeholderImagen() {
  return "https://placehold.co/300x200?text=Sin+imagen";
}

// [CAMBIO] CRUD de habitaciones
function agregarHabitacion(nombre, precio, descripcion, imagen) {
  const habitaciones = obtenerHabitaciones();
  const nueva = {
    id: generarId(),
    nombre: nombre,
    precio: parseFloat(precio),
    descripcion: descripcion || "",
    imagen: imagen || "",
    mostrar: true,
  };
  habitaciones.push(nueva);
  guardarHabitaciones(habitaciones);
  return nueva;
}

function editarHabitacion(id, nombre, precio, descripcion, imagen) {
  const habitaciones = obtenerHabitaciones();
  const index = habitaciones.findIndex((h) => h.id === id);
  if (index === -1) return false;
  habitaciones[index].nombre = nombre;
  habitaciones[index].precio = parseFloat(precio);
  habitaciones[index].descripcion = descripcion || "";
  if (imagen !== undefined) habitaciones[index].imagen = imagen;
  guardarHabitaciones(habitaciones);
  return true;
}

function eliminarHabitacion(id) {
  if (!confirm("¿Eliminar esta habitación?")) return false;
  let habitaciones = obtenerHabitaciones();
  habitaciones = habitaciones.filter((h) => h.id !== id);
  guardarHabitaciones(habitaciones);
  return true;
}

function actualizarVisibilidadHabitacion(id, mostrar) {
  const habitaciones = obtenerHabitaciones();
  const index = habitaciones.findIndex((h) => h.id === id);
  if (index !== -1) {
    habitaciones[index].mostrar = mostrar;
    guardarHabitaciones(habitaciones);
  }
}

// [CAMBIO] mostrar catálogo de habitaciones públicas
function ajustarCatalogo() {
  const contenedor = document.getElementById("contenedorHabitaciones");
  if (!contenedor) return;

  const todasLasHabitaciones = obtenerHabitaciones();
  contenedor.innerHTML = "";
  let hayHabitacionesVisibles = false;

  for (let i = 0; i < todasLasHabitaciones.length; i++) {
    const habitacion = todasLasHabitaciones[i];
    if (!habitacion.mostrar) continue;
    hayHabitacionesVisibles = true;

    const col = document.createElement("div");
    col.className = "col";
    const imagenSrc = habitacion.imagen || placeholderImagen();

    col.innerHTML = `
      <div class="card card-habitacion h-100 shadow-sm">
        <img src="${imagenSrc}" class="img-habitacion" alt="${habitacion.nombre}" style="height: 180px; object-fit: cover;">
        <div class="card-texto text-center">
          <h6 class="mb-1">${habitacion.nombre}</h6>
          <p class="precio mb-2">$${habitacion.precio.toLocaleString("es-CO")} / noche</p>
          <p class="card-text texto-card-habitacion">${habitacion.descripcion || ""}</p>
          <button class="btn-reservar" data-id="${habitacion.id}">Reservar</button>
        </div>
      </div>
    `;
    contenedor.appendChild(col);
  }

  if (!hayHabitacionesVisibles) {
    contenedor.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No hay habitaciones disponibles.</p></div>';
  }

  // [CAMBIO] añadir eventos a los botones "Reservar"
  const botones = document.querySelectorAll(".btn-reservar");
  for (let j = 0; j < botones.length; j++) {
    botones[j].addEventListener("click", function (e) {
      const idNum = parseInt(this.dataset.id);
      let habSeleccionada = null;
      for (let k = 0; k < todasLasHabitaciones.length; k++) {
        if (todasLasHabitaciones[k].id === idNum) {
          habSeleccionada = todasLasHabitaciones[k];
          break;
        }
      }
      if (habSeleccionada) {
        sessionStorage.setItem("habitacionSeleccionada", JSON.stringify(habSeleccionada));
        const datosBusqueda = sessionStorage.getItem("busquedaHabitaciones");
        if (datosBusqueda) {
          window.location.href = "../html/detalleReserva.html";
        } else {
          if (confirm("Primero debes seleccionar fechas en el inicio. ¿Ir allá ahora?")) {
            window.location.href = "../index.html";
          }
        }
      }
    });
  }
}

// [CAMBIO] actualizar contadores de dashboard
function actualizarTodosLosContadores() {
  const spanDisponibles = document.getElementById("contadorDisponible");
  const spanOcupadas = document.getElementById("contadorOcupadas");
  const habitaciones = obtenerHabitaciones();
  if (spanDisponibles) {
    spanDisponibles.textContent = habitaciones.filter(h => h.mostrar).length;
  }
  if (spanOcupadas) {
    spanOcupadas.textContent = habitaciones.filter(h => !h.mostrar).length;
  }
}

// [CAMBIO] pintar lista en panel de administración
function pintarListaAdmin() {
  const contenedor = document.getElementById("listaHabitacionesAdmin");
  if (!contenedor) return;
  const habitaciones = obtenerHabitaciones();
  contenedor.innerHTML = "";
  for (let i = 0; i < habitaciones.length; i++) {
    const hab = habitaciones[i];
    const estadoTexto = hab.mostrar ? "Visible" : "Oculto";
    const estadoColor = hab.mostrar ? "success" : "secondary";
    const textoBtnAccion = hab.mostrar ? "Ocultar" : "Mostrar";
    const imagenSrc = hab.imagen || placeholderImagen();

    const item = document.createElement("div");
    item.className = "list-group-item d-flex align-items-center";
    item.innerHTML = `
      <div class="me-3">
        <img src="${imagenSrc}" alt="${hab.nombre}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 5px;">
      </div>
      <div class="flex-grow-1">
        <strong>${hab.nombre}</strong> - $${hab.precio.toLocaleString("es-CO")} / noche<br>
        <small class="text-muted">${hab.descripcion || ""}</small><br>
        <span class="badge bg-${estadoColor}">${estadoTexto}</span>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-outline-warning btn-editar" data-id="${hab.id}">Editar</button>
        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${hab.id}">Eliminar</button>
        <button class="btn btn-sm btn-outline-primary toggle-visibilidad" data-id="${hab.id}" data-mostrar="${hab.mostrar}">${textoBtnAccion}</button>
      </div>
    `;
    contenedor.appendChild(item);
  }
}

// [CAMBIO] activar eventos de botones del admin (delegación)
function activarEventosAdmin() {
  const contenedor = document.getElementById("listaHabitacionesAdmin");
  if (!contenedor) return;
  contenedor.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-eliminar")) {
      const id = parseInt(e.target.dataset.id);
      if (eliminarHabitacion(id)) {
        pintarListaAdmin();
        ajustarCatalogo();
        actualizarTodosLosContadores();
      }
    }
    if (e.target.classList.contains("btn-editar")) {
      const id = parseInt(e.target.dataset.id);
      cargarFormularioEdicion(id);  // definida más abajo
    }
    if (e.target.classList.contains("toggle-visibilidad")) {
      const id = parseInt(e.target.dataset.id);
      const estadoActual = e.target.dataset.mostrar === "true";
      actualizarVisibilidadHabitacion(id, !estadoActual);
      pintarListaAdmin();
      ajustarCatalogo();
      actualizarTodosLosContadores();
    }
  });
}

// [CAMBIO] variable para almacenar imagen en base64
let imagenBase64 = null;

// [CAMBIO] cargar formulario de edición
function cargarFormularioEdicion(id) {
  const habitaciones = obtenerHabitaciones();
  const hab = habitaciones.find(h => h.id === id);
  if (!hab) return;
  document.getElementById("habitacionId").value = hab.id;
  document.getElementById("nombre").value = hab.nombre;
  document.getElementById("precio").value = hab.precio;
  document.getElementById("descripcion").value = hab.descripcion || "";
  // no se puede asignar un File a un input file, así que reseteamos
  document.getElementById("imagenInput").value = "";
  imagenBase64 = hab.imagen; // guardamos la actual por si no se elige nueva
  document.getElementById("tituloFormulario").textContent = "Editar habitación";
}

// [CAMBIO] resetear formulario
function resetFormulario() {
  document.getElementById("habitacionId").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("imagenInput").value = "";
  imagenBase64 = null;
  document.getElementById("tituloFormulario").textContent = "Agregar nueva habitación";
}

// [CAMBIO] manejar envío del formulario (crear o editar)
function manejarEnvioFormulario(e) {
  e.preventDefault();
  const id = document.getElementById("habitacionId").value;
  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const descripcion = document.getElementById("descripcion").value;
  // la imagen se toma de imagenBase64 (actualizada al seleccionar archivo)
  if (!nombre || !precio) {
    alert("Nombre y precio son obligatorios.");
    return;
  }
  if (id) {
    // editar
    editarHabitacion(parseInt(id), nombre, precio, descripcion, imagenBase64);
  } else {
    // agregar
    agregarHabitacion(nombre, precio, descripcion, imagenBase64);
  }
  resetFormulario();
  pintarListaAdmin();
  ajustarCatalogo();
  actualizarTodosLosContadores();
}

// [CAMBIO] mostrar resumen de búsqueda en habitaciones.html
function mostrarResumenBusqueda() {
  const datosBusqueda = JSON.parse(sessionStorage.getItem("busquedaHabitaciones"));
  const divResumen = document.getElementById("resumenBusqueda");
  if (datosBusqueda && divResumen) {
    const opcionesFecha = { weekday: "short", month: "short", day: "numeric" };
    const fechaLlegada = new Date(datosBusqueda.llegada + "T00:00:00").toLocaleDateString("es-CO", opcionesFecha);
    const fechaSalida = new Date(datosBusqueda.salida + "T00:00:00").toLocaleDateString("es-CO", opcionesFecha);
    document.getElementById("resumenFechas").textContent = `${fechaLlegada} - ${fechaSalida}`;
    document.getElementById("resumenHuespedes").textContent = datosBusqueda.huespedes;
    divResumen.classList.remove("d-none");
    divResumen.classList.add("d-flex");
  }
}

// [CAMBIO] Inicialización cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  actualizarNavbar();
  inicializarHabitaciones();
  ajustarCatalogo();
  actualizarTodosLosContadores();
  mostrarResumenBusqueda();

  // Panel de administración
  if (document.getElementById("listaHabitacionesAdmin")) {
    pintarListaAdmin();
    activarEventosAdmin();

    const form = document.getElementById("formularioHabitacion");
    if (form) form.addEventListener("submit", manejarEnvioFormulario);

    const btnCancelar = document.getElementById("btnCancelar");
    if (btnCancelar) btnCancelar.addEventListener("click", resetFormulario);

    const inputImagen = document.getElementById("imagenInput");
    if (inputImagen) {
      inputImagen.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (ev) {
          imagenBase64 = ev.target.result;
        };
        reader.readAsDataURL(file);
      });
    }
  }

  // Cerrar sesión desde el dashboard (si existe el botón)
  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", function () {
      localStorage.removeItem("usuarioLogueado");
      alert("Has cerrado sesión correctamente.");
      window.location.href = "../index.html";
    });
  }
});

// [CAMBIO] funciones compartidas de navbar
function actualizarNavbar() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  const divNoLogueado = document.getElementById("navNoLogueado");
  const divLogueado = document.getElementById("navLogueado");
  const navAvatar = document.getElementById("navAvatar");
  if (usuario) {
    if(divNoLogueado) divNoLogueado.classList.add("d-none");
    if(divLogueado) divLogueado.classList.remove("d-none");
    if(navAvatar && usuario.nombre) {
      navAvatar.textContent = usuario.nombre.charAt(0).toUpperCase();
    }
  } else {
    if(divNoLogueado) divNoLogueado.classList.remove("d-none");
    if(divLogueado) divLogueado.classList.add("d-none");
  }
}

function cerrarSesionManual() {
  localStorage.removeItem("usuarioLogueado");
  alert("Has cerrado sesión correctamente.");
  window.location.href = "../index.html";
}