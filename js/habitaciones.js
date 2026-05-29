const CLAVE_HABITACIONES = "habitacionesHuellas";

const habitacionesIniciales = [
  {
    id: 1,
    nombre: "Habitación Suite Colonial",
    precio: 180000,
    imagen: "../assets/habitaciones/habitacion1.png",
    descripcion:
      "Decoración cálida con elementos en madera y tonos suaves, ambiente relajante y armonioso.",
    url: "../html/habit_suite_colonial.html",
    mostrar: true,
    capacidad: 2,
  },
  {
    id: 2,
    nombre: "Habitación con Balcón",
    precio: 330000,
    imagen: "../assets/habitaciones/habitacion3.png",
    descripcion:
      "Habitación con cama doble y balcón privado, perfecta para disfrutar del aire libre y una vista agradable.",
    url: "../html/habit_doble_balcon.html",
    mostrar: true,
    capacidad: 2,
  },
  {
    id: 3,
    nombre: "Habitación Doble Ejecutiva",
    precio: 320000,
    imagen: "../assets/habitaciones/habitacion6.png",
    descripcion:
      "Incluye escritorio y buena iluminación, ideal para trabajar y descansar con comodidad. Espacio práctico y funcional.",
    url: "../html/habit_doble_ejecutiva.html",
    mostrar: true,
    capacidad: 2,
  },
  {
    id: 4,
    nombre: "Habitación Doble Jardín",
    precio: 200000,
    imagen: "../assets/habitaciones/habitacion2.png",
    descripcion:
      "Espacio acogedor con vista a zonas verdes y excelente iluminación natural. Perfecta para relajarse.",
    url: "../html/habit_doble_jardin.html",
    mostrar: true,
    capacidad: 2,
  },
  {
    id: 5,
    nombre: "Habitación Doble Natural",
    precio: 200000,
    imagen: "../assets/habitaciones/habitacion5.png",
    descripcion:
      "Decoración cálida con elementos en madera y tonos suaves. Un ambiente relajante y armonioso.",
    url: "../html/habit_doble_natural.html",
    mostrar: true,
    capacidad: 2,
  },
  {
    id: 6,
    nombre: "Habitación Doble Plus",
    precio: 350000,
    imagen: "../assets/habitaciones/habitacion9.png",
    descripcion:
      "Habitación amplia con 2 camas dobles, ideal para familias o grupos que buscan mayor comodidad en su estadía.",
    url: "../html/habit_doble_plus.html",
    mostrar: true,
    capacidad: 4,
  },
  {
    id: 7,
    nombre: "Habitación Romántica",
    precio: 250000,
    imagen: "../assets/habitaciones/habitacion8.png",
    descripcion:
      "Ambiente íntimo con iluminación cálida y decoración acogedora, ideal para parejas. Espacio romántico y relajante.",
    url: "../html/habit_doble_romantica.html",
    mostrar: true,
    capacidad: 2,
  },
  {
    id: 8,
    nombre: "Habitación Suite Premium",
    precio: 450000,
    imagen: "../assets/habitaciones/habitacion10.png",
    descripcion:
      "La opción más exclusiva, con diseño moderno, cama amplia y detalles elegantes.",
    url: "../html/habit_premium.html",
    mostrar: true,
    capacidad: 2,
  },
  {
    id: 9,
    nombre: "Habitación Doble Superior",
    precio: 220000,
    imagen: "../assets/habitaciones/habitacion4.png",
    descripcion:
      "Habitación amplia y elegante, con detalles modernos que brindan mayor comodidad. Espacio cómodo y acogedor.",
    url: "../html/habitacion_doble_superior.html",
    mostrar: true,
    capacidad: 2,
  },
  {
    id: 10,
    nombre: "Habitación Familiar/Grupal",
    precio: 250000,
    imagen: "../assets/habitaciones/habitacion7.png",
    descripcion:
      "Habitación con 4 camas individuales, ideal para familias o grupos que buscan comodidad y descanso compartido.",
    url: "../html/habitacion_familiar.html",
    mostrar: true,
    capacidad: 4,
  },
];

// localstorage es la persistencia

const CAPACIDADES_POR_ID = { 1:2, 2:2, 3:2, 4:2, 5:2, 6:4, 7:2, 8:2, 9:2, 10:4 };

let filtroPersonas = 0; // 0 = todos, 2 = hasta 2 personas, 4 = 3-4 personas

function inicializarHabitaciones() {
  if (!localStorage.getItem(CLAVE_HABITACIONES)) {
    localStorage.setItem(
      CLAVE_HABITACIONES,
      JSON.stringify(habitacionesIniciales),
    );
  } else {
    // Migración: agregar capacidad a habitaciones existentes que no la tengan
    const stored = obtenerHabitaciones();
    let actualizado = false;
    for (let i = 0; i < stored.length; i++) {
      if (stored[i].capacidad === undefined) {
        stored[i].capacidad = CAPACIDADES_POR_ID[stored[i].id] || 2;
        actualizado = true;
      }
    }
    if (actualizado) guardarHabitaciones(stored);
  }
}

function actualizarBotonesFiltro() {
  const botones = document.querySelectorAll(".btn-filtro-personas");
  for (let i = 0; i < botones.length; i++) {
    botones[i].classList.remove("active");
    if (parseInt(botones[i].dataset.personas) === filtroPersonas) {
      botones[i].classList.add("active");
    }
  }
}

function obtenerHabitaciones() {
  return JSON.parse(localStorage.getItem(CLAVE_HABITACIONES)) || [];
}

function guardarHabitaciones(habitaciones) {
  localStorage.setItem(CLAVE_HABITACIONES, JSON.stringify(habitaciones));
}

// utilidades

function generarId() {
  const habitaciones = obtenerHabitaciones();
  if (habitaciones.length === 0) return 1;
  return Math.max(...habitaciones.map((h) => h.id)) + 1;
}

function placeholderImagen() {
  return "https://placehold.co/300x200?text=Sin+imagen";
}

// modelado crud

function agregarHabitacion(nombre, precio, descripcion, imagen) {
  const habitaciones = obtenerHabitaciones();
  const nueva = {
    id: generarId(),
    nombre: nombre,
    precio: parseFloat(precio),
    descripcion: descripcion || "",
    imagen: imagen || "",
    url: "",
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

// ajustar habitaciones

function ajustarCatalogo() {
  const contenedor = document.getElementById("contenedorHabitaciones");

  if (!contenedor) {
    return;
  }

  const todasLasHabitaciones = obtenerHabitaciones();
  contenedor.innerHTML = "";
  let hayHabitacionesVisibles = false;

  for (let i = 0; i < todasLasHabitaciones.length; i++) {
    const habitacion = todasLasHabitaciones[i];

    if (habitacion.mostrar === false) continue;

    // Filtro por capacidad
    if (filtroPersonas === 2 && habitacion.capacidad > 2) continue;
    if (filtroPersonas === 4 && habitacion.capacidad < 3) continue;

    hayHabitacionesVisibles = true;

    const col = document.createElement("div");
    col.className = "col";

    const imagenSrc = habitacion.imagen || placeholderImagen();
    const capacidad = habitacion.capacidad || 2;

    col.innerHTML = `
      <div class="card card-habitacion h-100 shadow-sm">
        <img src="${imagenSrc}" class="img-habitacion" alt="${habitacion.nombre}" style="height: 180px; object-fit: cover;">
        <div class="card-texto text-center">
          <h6 class="mb-1">${habitacion.nombre}</h6>
          <p class="precio mb-1">$${habitacion.precio.toLocaleString("es-CO")} / noche</p>
          <p class="capacidad-badge mb-2"><i class="bi bi-people-fill me-1"></i>Hasta ${capacidad} persona${capacidad > 1 ? 's' : ''}</p>
          <p class="card-text texto-card-habitacion">${habitacion.descripcion || ""}</p>
          <button class="btn-reservar" data-id="${habitacion.id}">Reservar</button>
          <a href="${habitacion.url || '#'}" class="btn-reservar btn-ver-detalles">Ver detalles</a>
        </div>
      </div>
    `;
    contenedor.appendChild(col);
  }

  if (hayHabitacionesVisibles === false) {
    contenedor.innerHTML =
      '<div class="col-12 text-center"><p class="text-muted">No hay habitaciones disponibles.</p></div>';
  }

  const botones = document.querySelectorAll(".btn-reservar");

  for (let j = 0; j < botones.length; j++) {
    botones[j].addEventListener("click", function (e) {
      const idString = this.dataset.id;
      if (!idString) return; // el <a> de ver detalles no tiene data-id, lo ignoramos

      const idNum = parseInt(idString);

      let habSeleccionada = null;
      for (let k = 0; k < todasLasHabitaciones.length; k++) {
        if (todasLasHabitaciones[k].id === idNum) {
          habSeleccionada = todasLasHabitaciones[k];
          break;
        }
      }

      if (habSeleccionada) {
        sessionStorage.setItem(
          "habitacionSeleccionada",
          JSON.stringify(habSeleccionada),
        );

        const datosBusqueda = sessionStorage.getItem("busquedaHabitaciones");

        if (datosBusqueda) {
          window.location.href = "../html/detalleReserva.html";
        } else {
          if (
            confirm(
              "Primero debes seleccionar fechas en el inicio. ¿Ir allá ahora?",
            )
          ) {
            window.location.href = "../index.html";
          }
        }
      }
    });
  }
}

function actualizarTodosLosContadores() {
  const spanDisponibles = document.getElementById("contadorDisponible");
  const spanOcupadas = document.getElementById("contadorOcupadas");

  const habitaciones = obtenerHabitaciones();

  if (spanDisponibles) {
    const cantDisponibles = habitaciones.filter(
      (h) => h.mostrar === true,
    ).length;
    spanDisponibles.textContent = cantDisponibles;
  }

  if (spanOcupadas) {
    const cantOcupadas = habitaciones.filter((h) => h.mostrar === false).length;
    spanOcupadas.textContent = cantOcupadas;
  }
}

function pintarListaAdmin() {
  const contenedor = document.getElementById("listaHabitacionesAdmin");
  if (!contenedor) return;

  const habitaciones = obtenerHabitaciones();
  contenedor.innerHTML = "";

  for (let i = 0; i < habitaciones.length; i++) {
    const hab = habitaciones[i];

    let estadoTexto = "";
    let estadoColor = "";
    let textoBtnAccion = "";

    if (hab.mostrar === true) {
      estadoTexto = "Visible";
      estadoColor = "success";
      textoBtnAccion = "Ocultar";
    } else {
      estadoTexto = "Oculto";
      estadoColor = "secondary";
      textoBtnAccion = "Mostrar";
    }

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
        <button class="btn btn-sm btn-outline-primary toggle-visibilidad" data-id="${hab.id}" data-mostrar="${hab.mostrar}">
          ${textoBtnAccion}
        </button>
      </div>
    `;
    contenedor.appendChild(item);
  }
}

function activarEventosAdmin() {
  const contenedor = document.getElementById("listaHabitacionesAdmin");
  if (!contenedor) return;

  contenedor.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-eliminar")) {
      const idStr = e.target.dataset.id;
      const idNum = parseInt(idStr);

      if (confirm("¿Seguro quieres eliminar esta habitación?")) {
        eliminarHabitacion(idNum);
        pintarListaAdmin();
        ajustarCatalogo();
        actualizarTodosLosContadores();
      }
    }

    if (e.target.classList.contains("btn-editar")) {
      const idStr = e.target.dataset.id;
      const idNum = parseInt(idStr);
      cargarFormularioEdicion(idNum);
    }

    if (e.target.classList.contains("toggle-visibilidad")) {
      const idStr = e.target.dataset.id;
      const idNum = parseInt(idStr);
      const estadoActualStr = e.target.dataset.mostrar;

      let estadoActual = false;
      if (estadoActualStr === "true") {
        estadoActual = true;
      }

      actualizarVisibilidadHabitacion(idNum, !estadoActual);

      pintarListaAdmin();
      ajustarCatalogo();
      actualizarTodosLosContadores();
    }
  });
}

let imagenBase64 = null;

function ajustarListaAdmin() {
  const contenedor = document.getElementById("listaHabitacionesAdmin");
  if (!contenedor) return;

  const habitaciones = obtenerHabitaciones();
  contenedor.innerHTML = "";

  habitaciones.forEach((hab) => {
    const estadoTexto = hab.mostrar ? "Visible" : "Oculto";
    const estadoColor = hab.mostrar ? "success" : "secondary";
    const imagenSrc = hab.imagen || placeholderImagen();

    const item = document.createElement("div");
    item.className = "list-group-item d-flex align-items-center";
    item.innerHTML = `
      <div class="me-3">
        <img src="${imagenSrc}" alt="${hab.nombre}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 5px;" onerror="this.src='${placeholderImagen()}'">
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

function reservarDesdeDetalle(e, idHabitacion) {
  e.preventDefault();
  var habitaciones = obtenerHabitaciones();
  var hab = null;
  for (var i = 0; i < habitaciones.length; i++) {
    if (habitaciones[i].id === idHabitacion) {
      hab = habitaciones[i];
      break;
    }
  }
  if (!hab) {
    alert("No se encontró la información de esta habitación.");
    return;
  }
  sessionStorage.setItem("habitacionSeleccionada", JSON.stringify(hab));
  if (sessionStorage.getItem("busquedaHabitaciones")) {
    window.location.href = "./detalleReserva.html";
  } else {
    if (
      confirm("Primero debes seleccionar fechas en el inicio. ¿Ir allá ahora?")
    ) {
      window.location.href = "../index.html";
    }
  }
}

function limpiarBusqueda() {
  sessionStorage.removeItem("busquedaHabitaciones");
  window.location.href = "../index.html";
}

function mostrarResumenBusqueda() {
  const datosBusqueda = JSON.parse(
    sessionStorage.getItem("busquedaHabitaciones"),
  );
  const divResumen = document.getElementById("resumenBusqueda");

  if (datosBusqueda && divResumen) {
    const opcionesFecha = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };

    const fechaLlegada = new Date(
      datosBusqueda.llegada + "T00:00:00",
    ).toLocaleDateString("es-CO", opcionesFecha);
    const fechaSalida = new Date(
      datosBusqueda.salida + "T00:00:00",
    ).toLocaleDateString("es-CO", opcionesFecha);

    document.getElementById("resumenFechas").textContent =
      `${fechaLlegada} - ${fechaSalida}`;
    document.getElementById("resumenHuespedes").textContent =
      datosBusqueda.huespedes;

    divResumen.classList.remove("d-none");
    divResumen.classList.add("d-flex");

    const btnNueva = document.getElementById("btnNuevaBusqueda");
    if (btnNueva) {
      btnNueva.addEventListener("click", limpiarBusqueda);
    }

    // Pre-aplicar filtro de capacidad según huéspedes buscados.
    // Se suman todos los números del string ("2 adultos + 2 niños" → 4).
    // Si son 1-2 personas no se restringe: podrían venir con niños adicionales.
    // Solo se filtra a habitaciones grandes cuando el total ya indica 3 o más.
    const numeros = (datosBusqueda.huespedes || "").match(/\d+/g);
    const hues = numeros ? numeros.reduce((sum, n) => sum + parseInt(n), 0) : 0;
    if (!isNaN(hues) && hues > 0) {
      if (hues >= 3) {
        filtroPersonas = 4;
        actualizarBotonesFiltro();
        ajustarCatalogo();
      }

      // Ocultar el filtro visual porque ya viene una cantidad definida desde la búsqueda
      const filtroWrapper = document.getElementById("filtroPersonasWrapper");
      if (filtroWrapper) filtroWrapper.classList.add("d-none");
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  actualizarNavbar();
  inicializarHabitaciones();
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

  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  console.log("¿Botón encontrado?", btnCerrarSesion);

  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", function () {
      console.log("Intentando cerrar sesión...");
      localStorage.removeItem("usuarioLogueado");
      alert("Has cerrado sesión correctamente.");
      window.location.href = "../index.html";
    });
  }
});
