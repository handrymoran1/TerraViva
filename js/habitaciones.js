localStorage.removeItem('habitacionesHuellas');
// const CLAVE_HABITACIONES = 'habitacionesHuellas';   (para cambiar la constante sin que el locar storage deje las viejas)

<<<<<<< HEAD
const habitacionesIniciales = [// Datos de para inicializar las habitaciones
  { id: 1, nombre: "la solitaria", precio: 340000, imagen: "assets/habitaciones/habitacion1.png", descripcion: "Elegante esia cotancador cama .", mostrar: true },
  { id: 2, nombre: "la de siempre", precio: 10000, imagen: "assets/habitaciones/habitacion2.png", descripcion: "Suite de lujo con balcón.", mostrar: true },
  { id: 3, nombre: "la clasica  ", precio: 250000, imagen: "assets/habitaciones/habitacion3.png", descripcion: "Habitación con colores clasicos enfocadad en el confort", mostrar: true },
  { id: 4, nombre: "cuarto terra", precio: 800000, imagen: "assets/habitaciones/habitacion4.png", descripcion: "habitacion con colores tierra muy calida para ser real.", mostrar: true },
  { id: 5, nombre: "cuarto africa", precio: 20000, imagen: "assets/habitaciones/habitacion5.png", descripcion: "habitacion africa con mini tematica de africa.", mostrar: true },
  { id: 6, nombre: "la vanguardia", precio: 42000, imagen: "assets/habitaciones/habitacion6.png", descripcion: "Vista a la ciudad, cama Queen.", mostrar: true },
  { id: 7, nombre: "vino tintico", precio: 550000, imagen: "assets/habitaciones/habitacion7.png", descripcion: "Con jacuzzi y terraza.", mostrar: true },
  { id: 8, nombre: "la frescuraa", precio: 310000, imagen: "assets/habitaciones/habitacion8.png", descripcion: "Económica pero acogedora.", mostrar: true },
  { id: 9, nombre: "2 pa 2 ", precio: 670000, imagen: "assets/habitaciones/habitacion9.png", descripcion: "Doble con vistas panorámicas.", mostrar: true },
  { id: 10, nombre: "Tropical ",precio: 9200, imagen: "assets/habitaciones/habitacion10.png", descripcion: "Presidencial con servicio 24h.", mostrar: true }
=======
const habitacionesIniciales = [
  // Datos de para inicializar las habitaciones
  {
    id: 1,
    nombre: "ALOJAMIENTO",
    precio: 340000,
    imagen: "../assets/habitaciones/habitacion1.png",
    descripcion:
      "Elegante esia cotancn cama gfgfgfgfgdfgdfgddfgdfgdfgdfghghghg.",
    mostrar: true,
  },
  {
    id: 2,
    nombre: "",
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
>>>>>>> a91effac3f5e230268f997475dde71a86b0c1f21
];

// localstorage es la persistencia

function inicializarHabitaciones() {
  if (!localStorage.getItem(CLAVE_HABITACIONES)) {
    localStorage.setItem(CLAVE_HABITACIONES, JSON.stringify(habitacionesIniciales));
  }
}

function obtenerHabitaciones() {
  return JSON.parse(localStorage.getItem(CLAVE_HABITACIONES)) || [];
}

// function obtenerHabitaciones() {
//   const datos = localStorage.getItem(CLAVE_HABITACIONES);
//   return datos ? JSON.parse(datos) : [];
// }

function guardarHabitaciones(habitaciones) {
  localStorage.setItem(CLAVE_HABITACIONES, JSON.stringify(habitaciones));
}

// utilidades

// function generarId() {
//   const habitaciones = obtenerHabitaciones();
//   if (habitaciones.length === 0) return 1;
//   return Math.max(...habitaciones.map(h => h.id)) + 1;
// }

<<<<<<< HEAD
// function placeholderImagen() {
//   return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" fill="%23cccccc"%3E%3Crect width="300" height="200"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23333333"%3ESin imagen%3C/text%3E%3C/svg%3E';
// }
=======
function placeholderImagen() {
  return "https://placehold.co/300x200?text=Sin+imagen";
}
>>>>>>> a91effac3f5e230268f997475dde71a86b0c1f21

// modelado crud 

function agregarHabitacion(nombre, precio, descripcion, imagen) {
  const habitaciones = obtenerHabitaciones();
  const nueva = {
    id: generarId(),
    nombre: nombre,
    precio: parseFloat(precio),
    descripcion: descripcion || '',
    imagen: imagen || '',
    mostrar: true
  };
  habitaciones.push(nueva);
  guardarHabitaciones(habitaciones);
  return nueva;
}

function editarHabitacion(id, nombre, precio, descripcion, imagen) {
  const habitaciones = obtenerHabitaciones();
  const index = habitaciones.findIndex(h => h.id === id);
  if (index === -1) return false;
  habitaciones[index].nombre = nombre;
  habitaciones[index].precio = parseFloat(precio);
  habitaciones[index].descripcion = descripcion || '';
  if (imagen !== undefined) habitaciones[index].imagen = imagen; // si no se pasa, mantiene la anterior
  guardarHabitaciones(habitaciones);
  return true;
}

function eliminarHabitacion(id) {
  if (!confirm('¿Eliminar esta habitación?')) return false;
  let habitaciones = obtenerHabitaciones();
  habitaciones = habitaciones.filter(h => h.id !== id);
  guardarHabitaciones(habitaciones);
  return true;
}

function actualizarVisibilidadHabitacion(id, mostrar) {
  const habitaciones = obtenerHabitaciones();
  const index = habitaciones.findIndex(h => h.id === id);
  if (index !== -1) {
    habitaciones[index].mostrar = mostrar;
    guardarHabitaciones(habitaciones);
  }
}

// ajustar habitaciones

function ajustarCatalogo() {
  const contenedor = document.getElementById('contenedorHabitaciones');
  if (!contenedor) return;

  const habitaciones = obtenerHabitaciones().filter(h => h.mostrar);
  contenedor.innerHTML = '';

  if (habitaciones.length === 0) {
    contenedor.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No hay habitaciones disponibles.</p></div>';
    return;
  }

  habitaciones.forEach(hab => {
    const col = document.createElement('div');
    col.className = 'col';
    const imagenSrc = hab.imagen || placeholderImagen();
    col.innerHTML = `
      <div class="card card-habitacion h-100 shadow-sm">
        <img src="${imagenSrc}" class="img-habitacion" alt="${hab.nombre}" style="height: 180px; object-fit: cover;" onerror="this.src='${placeholderImagen()}'">
        <div class="card-texto text-center">
          <h6 class="mb-1">${hab.nombre}</h6>
          <p class="precio mb-2">$${hab.precio.toLocaleString('es-CO')} / noche</p>
          <p class="card-text texto-card-habitacion">${hab.descripcion || ''}</p>
          <button class="btn-reservar" data-id="${hab.id}">Reservar</button>
        </div>
      </div>
    `;
    contenedor.appendChild(col);
  });

  document.querySelectorAll('.btn-reservar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.dataset.id);
      const habitacion = obtenerHabitaciones().find(h => h.id === id);
      if (habitacion) {
        alert(`Seleccionó ${habitacion.nombre}. Precio: $${habitacion.precio.toLocaleString('es-CO')} / noche.`);
      }
    });
  });
}

// ajustar imagen


let imagenBase64 = null; // almacena la imagen seleccionada en base64

function ajustarListaAdmin() {
  const contenedor = document.getElementById('listaHabitacionesAdmin');
  if (!contenedor) return;

  const habitaciones = obtenerHabitaciones();
  contenedor.innerHTML = '';

  habitaciones.forEach(hab => {
    const estadoTexto = hab.mostrar ? 'Visible' : 'Oculto';
    const estadoColor = hab.mostrar ? 'success' : 'secondary';
    const imagenSrc = hab.imagen || placeholderImagen();

    const item = document.createElement('div');
    item.className = 'list-group-item d-flex align-items-center';
    item.innerHTML = `
      <div class="me-3">
        <img src="${imagenSrc}" alt="${hab.nombre}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 5px;" onerror="this.src='${placeholderImagen()}'">
      </div>
      <div class="flex-grow-1">
        <strong>${hab.nombre}</strong> - $${hab.precio.toLocaleString('es-CO')} / noche<br>
        <small class="text-muted">${hab.descripcion || ''}</small><br>
        <span class="badge bg-${estadoColor}">${estadoTexto}</span>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-outline-warning btn-editar" data-id="${hab.id}">Editar</button>
        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${hab.id}">Eliminar</button>
        <button class="btn btn-sm btn-outline-primary toggle-visibilidad" data-id="${hab.id}" data-mostrar="${hab.mostrar}">
          ${hab.mostrar ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
    `;
    contenedor.appendChild(item);
  });

  // Eventos de edición
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', () => cargarFormularioEdicion(parseInt(btn.dataset.id)));
  });

  // Eventos de eliminación
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', () => {
      if (eliminarHabitacion(parseInt(btn.dataset.id))) {
        ajustarListaAdmin();
        ajustarCatalogo();
      }
    });
  });

  // Eventos de visibilidad
  document.querySelectorAll('.toggle-visibilidad').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const mostrarActual = btn.dataset.mostrar === 'true';
      actualizarVisibilidadHabitacion(id, !mostrarActual);
      ajustarListaAdmin();
      ajustarCatalogo();
    });
  });
}

// formulario

function cargarFormularioEdicion(id) {
  const habitaciones = obtenerHabitaciones();
  const hab = habitaciones.find(h => h.id === id);
  if (!hab) return;

  document.getElementById('habitacionId').value = hab.id;
  document.getElementById('nombre').value = hab.nombre;
  document.getElementById('precio').value = hab.precio;
  document.getElementById('descripcion').value = hab.descripcion || '';
  document.getElementById('imagenInput').value = ''; // limpiar input file
  imagenBase64 = hab.imagen; // mantener la imagen anterior por si no se cambia
  document.getElementById('tituloFormulario').textContent = 'Editar habitación';
}

function resetFormulario() {
  document.getElementById('formularioHabitacion').reset();
  document.getElementById('habitacionId').value = '';
  document.getElementById('tituloFormulario').textContent = 'Agregar nueva habitación';
  imagenBase64 = null;
}

function manejarEnvioFormulario(e) {
  e.preventDefault();
  const id = document.getElementById('habitacionId').value;
  const nombre = document.getElementById('nombre').value.trim();
  const precio = document.getElementById('precio').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();

  if (!nombre || !precio) {
    alert('Completa al menos el nombre y el precio.');
    return;
  }

  if (id) {
    // Editar
    editarHabitacion(parseInt(id), nombre, precio, descripcion, imagenBase64);
  } else {
    // Agregar
    agregarHabitacion(nombre, precio, descripcion, imagenBase64);
  }

  resetFormulario();
  ajustarListaAdmin();
  ajustarCatalogo();
}

// Convertir imagen a base64 al seleccionar archivo
document.addEventListener('DOMContentLoaded', () => {
  inicializarHabitaciones();
  ajustarCatalogo();
  if (document.getElementById('listaHabitacionesAdmin')) {
    ajustarListaAdmin();

    // Configurar formulario
    const form = document.getElementById('formularioHabitacion');
    form.addEventListener('submit', manejarEnvioFormulario);

    document.getElementById('btnCancelar').addEventListener('click', resetFormulario);

    const inputImagen = document.getElementById('imagenInput');
    inputImagen.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        imagenBase64 = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }
});
