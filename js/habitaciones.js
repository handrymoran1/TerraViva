const CLAVE_HABITACIONES = "habitacionesHuellas";

const habitacionesIniciales = [
  // Datos de para inicializar las habitaciones
  {
    id: 1,
    nombre: "Habitación 1",
    precio: 340000,
    imagen: "../assets/habitaciones/habitacion1.png",
    descripcion:
      "Elegante esia cotancn cama gfgfgfgfgdfgdfgddfgdfgdfgdfghghghg.",
    mostrar: true,
  },
  {
    id: 2,
    nombre: "Habitación 2",
    precio: 700000,
    imagen: "../assets/habitaciones/habitacion2.png",
    descripcion: "Suite de lujo con balcón.",
    mostrar: true,
  },
  {
    id: 3,
    nombre: "Habitación 3",
    precio: 250000,
    imagen: "../assets/habitaciones/habitacion3.png",
    descripcion: "Habitación temática botánica.",
    mostrar: true,
  },
  {
    id: 4,
    nombre: "Habitación 4",
    precio: 800000,
    imagen: "../assets/habitaciones/habitacion4.png",
    descripcion: "Suite familiar espaciosa.",
    mostrar: true,
  },
  {
    id: 5,
    nombre: "Habitación 5",
    precio: 200000,
    imagen: "../assets/habitaciones/habitacion5.png",
    descripcion: "Opción cómoda y funcional.",
    mostrar: true,
  },
  {
    id: 6,
    nombre: "Habitación 6",
    precio: 420000,
    imagen: "../assets/habitaciones/habitacion6.png",
    descripcion: "Vista a la ciudad, cama Queen.",
    mostrar: true,
  },
  {
    id: 7,
    nombre: "Habitación 7",
    precio: 550000,
    imagen: "../assets/habitaciones/habitacion7.png",
    descripcion: "Con jacuzzi y terraza.",
    mostrar: true,
  },
  {
    id: 8,
    nombre: "Habitación 8",
    precio: 310000,
    imagen: "../assets/habitaciones/habitacion8.png",
    descripcion: "Económica pero acogedora.",
    mostrar: true,
  },
  {
    id: 9,
    nombre: "Habitación 9",
    precio: 670000,
    imagen: "../assets/habitaciones/habitacion9.png",
    descripcion: "Doble con vistas panorámicas.",
    mostrar: true,
  },
  {
    id: 10,
    nombre: "Habitación 10",
    precio: 920000,
    imagen: "../assets/habitaciones/habitacion10.png",
    descripcion: "Presidencial con servicio 24h.",
    mostrar: true,
  },
];

// localstorage es la persistencia

function inicializarHabitaciones() {
  if (!localStorage.getItem(CLAVE_HABITACIONES)) {
    localStorage.setItem(
      CLAVE_HABITACIONES,
      JSON.stringify(habitacionesIniciales),
    );
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
  if (imagen !== undefined) habitaciones[index].imagen = imagen; // si no se pasa, mantiene la anterior
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
  //aquí recorremos una por una de las habitaciones
  for (let i = 0; i < todasLasHabitaciones.length; i++) {
    const habitacion = todasLasHabitaciones[i];

    // Si la habitacion no esta marcada para mostrarse nos la saltamos
    if (habitacion.mostrar === false) {
      continue;
    }
    hayHabitacionesVisibles = true;

    const col = document.createElement("div");
    col.className = "col"; // clase de bootstrap

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
    contenedor.appendChild(col); //aquí estoy agregando al DOM
  }

  if (hayHabitacionesVisibles === false) {
    contenedor.innerHTML =
      '<div class="col-12 text-center"><p class="text-muted">No hay habitaciones disponibles.</p></div>';
  }

  const botones = document.querySelectorAll(".btn-reservar");

  for (let j = 0; j < botones.length; j++) {
    botones[j].addEventListener("click", function (e) {
      const idString = this.dataset.id; //aquí obtenemos el ID del atributo data-id
      const idNum = parseInt(idString); //y con esto lo convertimos a int

      let habSeleccionada = null;
      for (let k = 0; k < todasLasHabitaciones.length; k++) {
        if (todasLasHabitaciones[k].id === idNum) {
          habSeleccionada = todasLasHabitaciones[k];
          break;
          //esto era para buscar la habitación por id
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
// Función simple para pintar la lista del admin
function pintarListaAdmin() {
  const contenedor = document.getElementById("listaHabitacionesAdmin");
  if (!contenedor) return;

  const habitaciones = obtenerHabitaciones();
  contenedor.innerHTML = "";

  // Usamos un ciclo for clásico como te gusta
  for (let i = 0; i < habitaciones.length; i++) {
    const hab = habitaciones[i];

    // Definimos textos y colores según el estado
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

// Función simple para activar los botones del admin
function activarEventosAdmin() {
  const contenedor = document.getElementById("listaHabitacionesAdmin");
  if (!contenedor) return;

  // Delegación de eventos: escuchamos clics en el contenedor padre
  contenedor.addEventListener("click", function (e) {
    // 1. Lógica para ELIMINAR
    if (e.target.classList.contains("btn-eliminar")) {
      const idStr = e.target.dataset.id;
      const idNum = parseInt(idStr);

      if (confirm("¿Seguro quieres eliminar esta habitación?")) {
        eliminarHabitacion(idNum); // Usamos tu función CRUD existente
        pintarListaAdmin(); // Volvemos a pintar
        ajustarCatalogo(); // Actualizamos el catálogo público
        actualizarTodosLosContadores(); // Actualizamos números
      }
    }

    // 2. Lógica para EDITAR
    if (e.target.classList.contains("btn-editar")) {
      const idStr = e.target.dataset.id;
      const idNum = parseInt(idStr);
      cargarFormularioEdicion(idNum); // Usamos tu función existente
    }

    // 3. Lógica para TOGGLE VISIBILIDAD (Mostrar/Ocultar)
    if (e.target.classList.contains("toggle-visibilidad")) {
      const idStr = e.target.dataset.id;
      const idNum = parseInt(idStr);
      const estadoActualStr = e.target.dataset.mostrar;

      // Convertimos el string "true"/"false" a booleano real
      let estadoActual = false;
      if (estadoActualStr === "true") {
        estadoActual = true;
      }

      // Invertimos el estado
      actualizarVisibilidadHabitacion(idNum, !estadoActual);

      // Refrescamos todo
      pintarListaAdmin();
      ajustarCatalogo();
      actualizarTodosLosContadores();
    }
  });
}
// ajustar imagen

let imagenBase64 = null; // almacena la imagen seleccionada en base64

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
  }
}

document.addEventListener("DOMContentLoaded", function () {
  actualizarNavbar();
  inicializarHabitaciones();
  ajustarCatalogo();
  actualizarTodosLosContadores();
  mostrarResumenBusqueda();

  if (document.getElementById("listaHabitacionesAdmin")) {
    pintarListaAdmin(); // colorea la lista
    activarEventosAdmin(); // ahora activamos los botones

    //este es el formulario
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
      console.log("Intentando cerrar sesión..."); // Para depuración
      localStorage.removeItem("usuarioLogueado");
      alert("Has cerrado sesión correctamente.");
      window.location.href = "../index.html";
    });
  }
});
