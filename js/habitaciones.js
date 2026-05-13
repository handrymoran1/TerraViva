<<<<<<< HEAD
const CLAVE_HABITACIONES = "habitacionesHuellas"; // Clave para almacenar las habitaciones en localStorage

const btnEnviarHabitacion = document.getElementById("btnEnviarHabitacion");
const opcionesLista = document.getElementById("opcionesLista");
const listaContenedor = document.getElementById("lista");

document.addEventListener("DOMContentLoaded", mostrarLista);

=======
const CLAVE_HABITACIONES = "habitacionesHuellas";

>>>>>>> test
const habitacionesIniciales = [
  // Datos de para inicializar las habitaciones
  {
    id: 1,
    nombre: "ALOJAMIENTO",
    precio: 340000,
<<<<<<< HEAD
    imagen: "",
=======
    imagen: "../assets/habitaciones/habitacion1.png",
>>>>>>> test
    descripcion:
      "Elegante esia cotancn cama gfgfgfgfgdfgdfgddfgdfgdfgdfghghghg.",
    mostrar: true,
  },
  {
    id: 2,
<<<<<<< HEAD
    nombre: "Habitación 2",
    precio: 700000,
    imagen: "",
=======
    nombre: "",
    precio: 700000,
    imagen: "../assets/habitaciones/habitacion2.png",
>>>>>>> test
    descripcion: "Suite de lujo con balcón.",
    mostrar: true,
  },
  {
    id: 3,
    nombre: "Habitación 3",
    precio: 250000,
<<<<<<< HEAD
    imagen: ".",
=======
    imagen: "../assets/habitaciones/habitacion3.png",
>>>>>>> test
    descripcion: "Habitación temática botánica.",
    mostrar: true,
  },
  {
    id: 4,
    nombre: "Habitación 4",
    precio: 800000,
<<<<<<< HEAD
    imagen: ".",
=======
    imagen: "../assets/habitaciones/habitacion4.png",
>>>>>>> test
    descripcion: "Suite familiar espaciosa.",
    mostrar: true,
  },
  {
    id: 5,
    nombre: "Habitación 5",
    precio: 200000,
<<<<<<< HEAD
    imagen: ".",
=======
    imagen: "../assets/habitaciones/habitacion5.png",
>>>>>>> test
    descripcion: "Opción cómoda y funcional.",
    mostrar: true,
  },
  {
    id: 6,
    nombre: "Habitación 6",
    precio: 420000,
<<<<<<< HEAD
    imagen: ".",
=======
    imagen: "../assets/habitaciones/habitacion6.png",
>>>>>>> test
    descripcion: "Vista a la ciudad, cama Queen.",
    mostrar: true,
  },
  {
    id: 7,
    nombre: "Habitación 7",
    precio: 550000,
<<<<<<< HEAD
    imagen: ".",
=======
    imagen: "../assets/habitaciones/habitacion7.png",
>>>>>>> test
    descripcion: "Con jacuzzi y terraza.",
    mostrar: true,
  },
  {
    id: 8,
    nombre: "Habitación 8",
    precio: 310000,
<<<<<<< HEAD
    imagen: ".",
=======
    imagen: "../assets/habitaciones/habitacion8.png",
>>>>>>> test
    descripcion: "Económica pero acogedora.",
    mostrar: true,
  },
  {
    id: 9,
    nombre: "Habitación 9",
    precio: 670000,
<<<<<<< HEAD
    imagen: ".",
=======
    imagen: "../assets/habitaciones/habitacion9.png",
>>>>>>> test
    descripcion: "Doble con vistas panorámicas.",
    mostrar: true,
  },
  {
    id: 10,
    nombre: "Habitación 10",
    precio: 920000,
<<<<<<< HEAD
    imagen: ".",
=======
    imagen: "../assets/habitaciones/habitacion10.png",
>>>>>>> test
    descripcion: "Presidencial con servicio 24h.",
    mostrar: true,
  },
];

<<<<<<< HEAD
function inicializarHabitaciones() {
  // Solo se inicializan si no hay datos previos en localStorage
  const guardadas = localStorage.getItem(CLAVE_HABITACIONES); // Si no hay habitaciones guardadas, se inicializan con los datos predefinidos
  if (!guardadas) {
    // Solo se inicializan si no hay datos previos en localStorage
    localStorage.setItem(
      CLAVE_HABITACIONES,
      JSON.stringify(habitacionesIniciales),
    ); // Esto asegura que al cargar por primera vez, el sistema tenga datos para mostrar y administrar
=======
// localstorage es la persistencia

function inicializarHabitaciones() {
  if (!localStorage.getItem(CLAVE_HABITACIONES)) {
    localStorage.setItem(
      CLAVE_HABITACIONES,
      JSON.stringify(habitacionesIniciales),
    );
>>>>>>> test
  }
}

function obtenerHabitaciones() {
<<<<<<< HEAD
  // Devuelve un array de habitaciones desde localStorage, o un array vacío si no hay datos
  const data = localStorage.getItem(CLAVE_HABITACIONES); // Si no hay datos, devuelve un array vacío para evitar errores al intentar renderizar o administrar habitaciones
  return data ? JSON.parse(data) : []; // Esto garantiza que las funciones que dependen de esta información siempre tengan un array válido para trabajar, incluso si el localStorage está vacío o ha sido limpiado.
}

function guardarHabitaciones(habitaciones) {
  // Guarda el array de habitaciones actualizado en localStorage
  localStorage.setItem(CLAVE_HABITACIONES, JSON.stringify(habitaciones)); // Esto se llama cada vez que se cambia la visibilidad de una habitación para asegurar que los cambios se mantengan al recargar la página o navegar entre el catálogo y el dashboard de administración.
}

function actualizarVisibilidadHabitacion(id, mostrar) {
  // Actualiza el estado de mostrar/ocultar de una habitación específica por su ID
  let habitaciones = obtenerHabitaciones(); // Se obtiene el array actual de habitaciones para modificarlo
  const index = habitaciones.findIndex((hab) => hab.id === id); // Se busca la habitación por su ID para actualizar su propiedad "mostrar"
  if (index !== -1) {
    // Si se encuentra la habitación, se actualiza su estado de visibilidad
    habitaciones[index].mostrar = mostrar; // Se actualiza el array con el nuevo estado de visibilidad
    guardarHabitaciones(habitaciones); // Se guarda el array actualizado en localStorage para que los cambios se reflejen en el catálogo y el dashboard de administración.
  }
}

function renderizarCatalogo() {
  // Renderiza el catálogo de habitaciones mostrando solo las que tienen "mostrar: true"
  const contenedor = document.getElementById("contenedorHabitaciones"); // Si no se encuentra el contenedor, no se intenta renderizar para evitar errores en páginas que no tienen esta sección (como el dashboard de administración)
  if (!contenedor) return; // Se obtiene el array de habitaciones y se filtra para mostrar solo las que están marcadas como visibles

  const habitaciones = obtenerHabitaciones(); // Se filtra el array para obtener solo las habitaciones que deben mostrarse en el catálogo, lo que permite ocultar habitaciones sin eliminarlas del sistema.
  const habitacionesVisibles = habitaciones.filter(
    (hab) => hab.mostrar === true,
  ); // Se limpia el contenedor antes de renderizar para evitar duplicados al recargar o cambiar la visibilidad de las habitaciones
  contenedor.innerHTML = ""; // Si no hay habitaciones visibles, se muestra un mensaje indicando que no hay opciones disponibles en lugar de dejar el contenedor vacío, lo que mejora la experiencia del usuario al informar claramente la situación.
  if (habitacionesVisibles.length === 0) {
    // Si no hay habitaciones visibles, se muestra un mensaje indicando que no hay opciones disponibles en lugar de dejar el contenedor vacío, lo que mejora la experiencia del usuario al informar claramente la situación.
    contenedor.innerHTML =
      '<div class="col-12 text-center"><p class="text-muted">No hay habitaciones disponibles en este momento.</p></div>';
    return;
  }
  habitacionesVisibles.forEach((hab) => {
    // Se itera sobre las habitaciones visibles para crear y agregar las tarjetas al contenedor del catálogo, mostrando solo la información relevante para los usuarios finales.
    const col = document.createElement("div"); // Se crea un elemento div para cada habitación que se va a mostrar en el catálogo, lo que permite organizar las tarjetas de manera responsiva utilizando clases de Bootstrap.
    col.className = "col"; // Se asigna la clase "col" para que cada tarjeta ocupe un espacio adecuado en la cuadrícula del catálogo, adaptándose a diferentes tamaños de pantalla.
=======
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
  if (!contenedor) return;

  const habitaciones = obtenerHabitaciones().filter((h) => h.mostrar);
  contenedor.innerHTML = "";

  if (habitaciones.length === 0) {
    contenedor.innerHTML =
      '<div class="col-12 text-center"><p class="text-muted">No hay habitaciones disponibles.</p></div>';
    return;
  }

  habitaciones.forEach((hab) => {
    const col = document.createElement("div");
    col.className = "col";
    const imagenSrc = hab.imagen || placeholderImagen();
>>>>>>> test
    col.innerHTML = `
      <div class="card card-habitacion h-100 shadow-sm">
        <img src="${imagenSrc}" class="img-habitacion" alt="${hab.nombre}" style="height: 180px; object-fit: cover;" onerror="this.src='${placeholderImagen()}'">
        <div class="card-texto text-center">
          <h6 class="mb-1">${hab.nombre}</h6>
          <p class="precio mb-2">$${hab.precio.toLocaleString("es-CO")} / noche</p>
          <p class="card-text texto-card-habitacion">${hab.descripcion || ""}</p>
          <button class="btn-reservar" data-id="${hab.id}">Reservar</button>
        </div>
      </div>
    `;
<<<<<<< HEAD
    contenedor.appendChild(col); // Se agrega la tarjeta de la habitación al contenedor del catálogo para que se muestre en la página.
  });

  document.querySelectorAll(".btn-reservar").forEach((btn) => {
    // Se agrega un evento de clic a cada botón de reservar para mostrar una alerta con la información de la habitación seleccionada, lo que simula el proceso de reserva y proporciona feedback al usuario.
    btn.addEventListener("click", (e) => {
      // Se obtiene el ID de la habitación desde el atributo data-id del botón para identificar cuál habitación fue seleccionada.
      const id = parseInt(btn.dataset.id); // Se busca la habitación correspondiente en el array de habitaciones para obtener su información y mostrarla en la alerta.
      const habitacion = obtenerHabitaciones().find((h) => h.id === id); // Si se encuentra la habitación, se muestra una alerta con su nombre y precio por noche, lo que simula el proceso de reserva y proporciona feedback al usuario sobre su selección.
      if (habitacion) {
        // Si se encuentra la habitación, se muestra una alerta con su nombre y precio por noche, lo que simula el proceso de reserva y proporciona feedback al usuario sobre su selección.
        alert(
          `Selecciono ${habitacion.nombre}. Precio: $${habitacion.precio.toLocaleString("es-CO")} / noche.`,
        ); // En un sistema real, aquí se redirigiría a una página de reserva o se abriría un formulario para completar la reserva, pero por ahora solo se muestra una alerta con la información de la habitación seleccionada.
=======
    contenedor.appendChild(col);
  });

  document.querySelectorAll(".btn-reservar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(btn.dataset.id);
      const habitacion = obtenerHabitaciones().find((h) => h.id === id);
      if (habitacion) {
        alert(
          `Seleccionó ${habitacion.nombre}. Precio: $${habitacion.precio.toLocaleString("es-CO")} / noche.`,
        );
>>>>>>> test
      }
    });
  });
}

<<<<<<< HEAD
function renderizarListaDesplegable() {
  // Renderiza el select con las habitaciones visibles para que los usuarios puedan seleccionar una habitación específica y ver su información detallada.
  const select = document.getElementById("listaDesplegableHabitaciones"); // Si no se encuentra el select, no se intenta renderizar para evitar errores en páginas que no tienen esta sección (como el dashboard de administración)
  if (!select) return; // Se obtiene el array de habitaciones y se filtra para mostrar solo las que están marcadas como visibles, lo que permite ocultar habitaciones sin eliminarlas del sistema y mantener la flexibilidad en la gestión de las opciones disponibles para los usuarios.

  const habitaciones = obtenerHabitaciones(); // Se filtra el array para obtener solo las habitaciones que deben mostrarse en el select, lo que permite ocultar habitaciones sin eliminarlas del sistema y mantener la flexibilidad en la gestión de las opciones disponibles para los usuarios.
  const habitacionesVisibles = habitaciones.filter(
    (hab) => hab.mostrar === true,
  ); // Se limpia el select antes de renderizar para evitar duplicados al recargar o cambiar la visibilidad de las habitaciones, lo que garantiza que el select siempre muestre la información actualizada y correcta.
  select.innerHTML =
    '<option value="" disabled selected>-- Seleccione una habitación --</option>'; // Si no hay habitaciones visibles, se muestra una opción deshabilitada indicando que no hay opciones disponibles en lugar de dejar el select vacío, lo que mejora la experiencia del usuario al informar claramente la situación.
  habitacionesVisibles.forEach((hab) => {
    // Se itera sobre las habitaciones visibles para crear y agregar las opciones al select, mostrando solo la información relevante para los usuarios finales.
    const opcion = document.createElement("option"); //
    opcion.value = hab.id; // Se asigna el ID de la habitación como valor de la opción para identificar cuál habitación fue seleccionada posteriormente.
    opcion.textContent = `${hab.nombre} - $${hab.precio.toLocaleString("es-CO")} / noche`; // Se muestra el nombre y precio de la habitación en el texto de la opción para que los usuarios puedan identificar fácilmente las opciones disponibles al seleccionar una habitación específica.
    select.appendChild(opcion); // Se agrega la opción al select para que se muestre en la página y los usuarios puedan seleccionar una habitación específica para ver su información detallada.
  });
}

function configurarSeleccionDesplegable() {
  // Configura el botón para mostrar la habitación seleccionada en el select, lo que permite a los usuarios obtener información detallada sobre la habitación que han seleccionado de manera interactiva.
  const select = document.getElementById("listaDesplegableHabitaciones"); // Si no se encuentra el select o el botón, no se intenta configurar para evitar errores en páginas que no tienen estas secciones (como el dashboard de administración)
  const boton = document.getElementById("botonSeleccionarHabitacion"); // Se obtiene el contenedor donde se mostrará la información de la habitación seleccionada para actualizar su contenido dinámicamente cuando el usuario haga clic en el botón, lo que mejora la experiencia del usuario al proporcionar feedback inmediato sobre su selección.
  const contenedor = document.getElementById("resultadoSeleccion"); // Si no se encuentra el contenedor, se usará una alerta para mostrar la información de la habitación seleccionada, lo que garantiza que el usuario reciba feedback sobre su selección incluso si la página no tiene un área designada para mostrar esta información.
  if (!select || !boton) return; // Se agrega un evento de clic al botón para mostrar la información de la habitación seleccionada en el select, lo que permite a los usuarios obtener detalles sobre la habitación que han seleccionado de manera interactiva y mejorar su experiencia al navegar por las opciones disponibles.

  boton.addEventListener("click", () => {
    // Se obtiene el ID de la habitación seleccionada desde el valor del select para identificar cuál habitación fue seleccionada y mostrar su información detallada.
    const id = parseInt(select.value); // Se valida que se haya seleccionado una opción válida antes de intentar mostrar la información de la habitación, lo que mejora la experiencia del usuario al evitar errores o confusiones al hacer clic en el botón sin haber seleccionado una habitación.
    if (isNaN(id)) {
      // Si no se ha seleccionado una opción válida, se muestra una alerta indicando que se debe seleccionar una habitación antes de intentar mostrar su información, lo que mejora la experiencia del usuario al proporcionar feedback claro sobre lo que se espera que hagan para obtener la información deseada.
      alert("Por favor, seleccione una habitación válida."); // Se muestra una alerta indicando que se debe seleccionar una habitación antes de intentar mostrar su información, lo que mejora la experiencia del usuario al proporcionar feedback claro sobre lo que se espera que hagan para obtener la información deseada.
      return; // Si no se ha seleccionado una opción válida, se muestra una alerta indicando que se debe seleccionar una habitación antes de intentar mostrar su información, lo que mejora la experiencia del usuario al proporcionar feedback claro sobre lo que se espera que hagan para obtener la información deseada.
    }
    const habitaciones = obtenerHabitaciones(); // Se obtiene el array de habitaciones para buscar la habitación correspondiente al ID seleccionado y mostrar su información detallada.
    const habitacion = habitaciones.find((h) => h.id === id); // Si se encuentra la habitación, se muestra un mensaje con su nombre, precio por noche y descripción, lo que proporciona a los usuarios información detallada sobre la habitación que han seleccionado de manera interactiva.
    if (habitacion) {
      // Si se encuentra la habitación, se muestra un mensaje con su nombre, precio por noche y descripción, lo que proporciona a los usuarios información detallada sobre la habitación que han seleccionado de manera interactiva.
      const mensaje = `Ha seleccionado: ${habitacion.nombre} - $${habitacion.precio.toLocaleString("es-CO")} / noche. ${habitacion.descripcion}`; // Se muestra un mensaje con el nombre, precio por noche y descripción de la habitación seleccionada para proporcionar a los usuarios información detallada sobre su selección de manera interactiva.
      if (contenedor) {
        // Si se encuentra el contenedor, se muestra la información de la habitación seleccionada dentro de él para proporcionar feedback inmediato al usuario sobre su selección de manera más visual y atractiva, lo que mejora la experiencia del usuario al interactuar con la página.
        contenedor.innerHTML = `<div class="alert alert-success mt-3">${mensaje}</div>`; // Se muestra la información de la habitación seleccionada dentro del contenedor utilizando una alerta de Bootstrap para resaltar la información y mejorar la experiencia del usuario al interactuar con la página.
      } else {
        // Si no se encuentra el contenedor, se muestra la información de la habitación seleccionada en una alerta para garantizar que el usuario reciba feedback sobre su selección incluso si la página no tiene un área designada para mostrar esta información, lo que mejora la experiencia del usuario al proporcionar feedback inmediato sobre su selección.
        alert(mensaje); // Se muestra la información de la habitación seleccionada en una alerta para garantizar que el usuario reciba feedback sobre su selección incluso si la página no tiene un área designada para mostrar esta información, lo que mejora la experiencia del usuario al proporcionar feedback inmediato sobre su selección.
      }
    }
  });
}

function renderizarListaAdmin() {
  // Renderiza la lista de habitaciones con opciones para mostrar/ocultar en el dashboard de administración, lo que permite a los administradores gestionar fácilmente la visibilidad de las habitaciones en el catálogo sin eliminar datos, lo que mejora la flexibilidad y control sobre las opciones disponibles para los usuarios finales.
  const contenedor = document.getElementById("listaHabitacionesAdmin"); // Si no se encuentra el contenedor, no se intenta renderizar para evitar errores en páginas que no tienen esta sección (como el catálogo o la página principal)
  if (!contenedor) return; // Se obtiene el array de habitaciones para renderizar la lista completa con su estado de visibilidad, lo que permite a los administradores ver todas las habitaciones y gestionar su visibilidad de manera eficiente desde el dashboard de administración.

  const habitaciones = obtenerHabitaciones(); // Se limpia el contenedor antes de renderizar para evitar duplicados al recargar o cambiar la visibilidad de las habitaciones, lo que garantiza que la lista siempre muestre la información actualizada y correcta.
  contenedor.innerHTML = ""; // Se itera sobre todas las habitaciones para crear y agregar los elementos de la lista con su información y estado de visibilidad, lo que permite a los administradores gestionar fácilmente la visibilidad de las habitaciones en el catálogo sin eliminar datos, lo que mejora la flexibilidad y control sobre las opciones disponibles para los usuarios finales.
  habitaciones.forEach((hab) => {
    // Se crea un elemento div para cada habitación que se va a mostrar en la lista de administración, lo que permite organizar la información de manera clara y accesible para los administradores al gestionar la visibilidad de las habitaciones.
    const item = document.createElement("div"); // Se asigna la clase "list-group-item" para que cada elemento de la lista tenga el estilo adecuado y se utilicen las utilidades de Bootstrap para organizar el contenido dentro de cada elemento, lo que mejora la apariencia y usabilidad del dashboard de administración al gestionar la visibilidad de las habitaciones.
    item.className =
      "list-group-item d-flex justify-content-between align-items-center"; // Se asigna la clase "list-group-item" para que cada elemento de la lista tenga el estilo adecuado y se utilicen las utilidades de Bootstrap para organizar el contenido dentro de cada elemento, lo que mejora la apariencia y usabilidad del dashboard de administración al gestionar la visibilidad de las habitaciones.
    const estadoTexto = hab.mostrar ? "Visible" : "Oculto"; // Se determina el texto del estado de visibilidad de la habitación para mostrarlo en la lista de administración, lo que proporciona a los administradores información clara sobre qué habitaciones están visibles u ocultas en el catálogo, lo que mejora la experiencia del usuario al gestionar las opciones disponibles para los usuarios finales.
    const estadoColor = hab.mostrar ? "success" : "secondary"; // Se determina el color del badge que indica el estado de visibilidad de la habitación para mostrarlo en la lista de administración, lo que proporciona a los administradores una indicación visual clara sobre qué habitaciones están visibles u ocultas en el catálogo, lo que mejora la experiencia del usuario al gestionar las opciones disponibles para los usuarios finales.
    item.innerHTML = `
      <div>
=======
function actualizarTodosLosContadores() {
  const spanDisponibles = document.getElementById("contadorDisponible");
  const spanOcupadas = document.getElementById("contadorOcupadas");

  //obtener los datos reales del LocalStorage
  const habitaciones = obtenerHabitaciones();

  // actulizamos disponibles (mostrar: true)
  if (spanDisponibles) {
    const cantDisponibles = habitaciones.filter(
      (h) => h.mostrar === true,
    ).length;
    spanDisponibles.textContent = cantDisponibles;
  }

  //actualizar ocupadas con (mostrar: false)
  if (spanOcupadas) {
    const cantOcupadas = habitaciones.filter((h) => h.mostrar === false).length;
    spanOcupadas.textContent = cantOcupadas;
  }
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
>>>>>>> test
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
<<<<<<< HEAD
    contenedor.appendChild(item); // Se agrega el elemento de la habitación a la lista de administración para que se muestre en el dashboard y los administradores puedan gestionar su visibilidad de manera eficiente desde esta sección.
  });

  document.querySelectorAll(".toggle-visibilidad").forEach((btn) => {
    // Se agrega un evento de clic a cada botón de mostrar/ocultar para actualizar la visibilidad de la habitación correspondiente y refrescar la lista de administración, el catálogo y el select en tiempo real, lo que mejora la experiencia del usuario al gestionar las opciones disponibles para los usuarios finales sin necesidad de recargar la página.
    btn.addEventListener("click", (e) => {
      // Se obtiene el ID de la habitación desde el atributo data-id del botón para identificar cuál habitación se va a actualizar su visibilidad.
      const id = parseInt(btn.dataset.id); // Se determina el estado actual de visibilidad de la habitación desde el atributo data-mostrar del botón para calcular el nuevo estado que se va a asignar, lo que permite alternar entre mostrar y ocultar la habitación de manera eficiente al hacer clic en el botón.
      const mostrarActual = btn.dataset.mostrar === "true"; // Se calcula el nuevo estado de visibilidad que se va a asignar a la habitación al hacer clic en el botón, lo que permite alternar entre mostrar y ocultar la habitación de manera eficiente al hacer clic en el botón.
      const nuevoEstado = !mostrarActual; // Se actualiza la visibilidad de la habitación correspondiente utilizando la función actualizarVisibilidadHabitacion, lo que garantiza que los cambios se reflejen en el catálogo y el select de manera inmediata, mejorando la experiencia del usuario al gestionar las opciones disponibles para los usuarios finales sin necesidad de recargar la página.
      actualizarVisibilidadHabitacion(id, nuevoEstado); // Se actualiza la visibilidad de la habitación correspondiente utilizando la función actualizarVisibilidadHabitacion, lo que garantiza que los cambios se reflejen en el catálogo y el select de manera inmediata, mejorando la experiencia del usuario al gestionar las opciones disponibles para los usuarios finales sin necesidad de recargar la página.
      renderizarListaAdmin(); // refrescar lista del admin para mostrar el nuevo estado de la habitación
      renderizarCatalogo(); // refrescar catálogo en tiempo real para mostrar/ocultar la habitación según el nuevo estado, lo que mejora la experiencia del usuario al gestionar las opciones disponibles para los usuarios finales sin necesidad de recargar la página.
      renderizarListaDesplegable(); // refrescar select en tiempo real para mostrar/ocultar la habitación según el nuevo estado, lo que mejora la experiencia del usuario al gestionar las opciones disponibles para los usuarios finales sin necesidad de recargar la página.
=======
    contenedor.appendChild(item);
  });

  // Eventos de edición
  document.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", () =>
      cargarFormularioEdicion(parseInt(btn.dataset.id)),
    );
  });

  // Eventos de eliminación
  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (eliminarHabitacion(parseInt(btn.dataset.id))) {
        ajustarListaAdmin();
        ajustarCatalogo();
        actualizarTodosLosContadores();
      }
    });
  });

  // Eventos de visibilidad
  document.querySelectorAll(".toggle-visibilidad").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const mostrarActual = btn.dataset.mostrar === "true";
      actualizarVisibilidadHabitacion(id, !mostrarActual);
      ajustarListaAdmin();
      ajustarCatalogo();
      actualizarTodosLosContadores();
>>>>>>> test
    });
  });
}

<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", () => {
  // Se ejecuta al cargar la página
  inicializarHabitaciones(); // Solo se inicializan si no hay datos previos en localStorage
  renderizarCatalogo(); // Renderiza el catálogo con las habitaciones visibles
  renderizarListaDesplegable(); // Renderiza el select con las habitaciones visibles
  configurarSeleccionDesplegable(); // Configura el botón para mostrar la habitación seleccionada
  if (document.getElementById("listaHabitacionesAdmin")) {
    // Si estamos en el dashboard de admin
    renderizarListaAdmin(); // Renderiza la lista de habitaciones con opciones para mostrar/ocultar
  }
});

function agregarALista(nombreHabitacion) {
  const nuevaLista = document.createElement("li");
  nuevaLista.className = "bg-light p-2 border rounded d-block mb-2";

  nuevaLista.innerHTML = `
              ${nombreHabitacion}
              <a href="../html/habitaciones.html">Info</a>
              <button type="button" class="btn btn-sm btn-outline-success ms-2">Disponible</button>
              <button type="button" class="btn btn-sm btn-outline-danger ms-1">No disponible</button>
              <button type="button"class="btnGuardar btn btn-sm btn-primary ms-1">Publicar Habitación</button>`;
  console.log("Seleccionó: " + nombreHabitacion);

  listaContenedor.appendChild(nuevaLista);

  const btnNuevo = nuevaLista.querySelector(".btnGuardar");
  if (btnNuevo) {
    btnNuevo.addEventListener("click", function () {
      console.log("vamos bien");

      const nuevaHabitacion = {
        nombre: nombreHabitacion,
        estado: "Pendiente",
      };

      const guardadas = JSON.parse(localStorage.getItem("guardar")) || [];
      guardadas.push(nuevaHabitacion);

      localStorage.setItem("guardar", JSON.stringify(guardadas));
      console.log("¡Guardado exitoso! Contenido actual:");
      console.table(guardadas);

      console.log("Habitación agregada con éxito", nuevaHabitacion);
      this.textContent = "Publicada ✔";
      this.disabled = true;
      this.className = "btn btn-sm btn-success ms-1";
    });
  }
}

btnEnviarHabitacion.addEventListener("click", function () {
  console.log("El botón funciona.");

  const habitacionSeleccionada =
    opcionesLista.options[opcionesLista.selectedIndex].text;

  if (opcionesLista.value.trim() === "") {
    alert("Seleccione una habitación.");
    return;
  } else {
    console.log(lista);
  }
  agregarALista(habitacionSeleccionada);
});

function mostrarLista() {
  const guardadas = JSON.parse(localStorage.getItem("guardar")) || [];

  listaContenedor.innerHTML = "";

  guardadas.forEach((hab) => {
    const nuevoElemento = document.createElement("li");
    nuevoElemento.className = "bg-light p-2 border rounded mb-2";

    nuevoElemento.innerHTML = `${hab.nombre} 
    <span class="badge bg-primary">Publicada</span>`;

    listaContenedor.appendChild(nuevoElemento);
  });
  if (guardadas.length > 0) {
    console.log("Datos cargados del Local Storage al iniciar:");
    console.table(guardadas);
  }
}
=======
// formulario

function cargarFormularioEdicion(id) {
  const habitaciones = obtenerHabitaciones();
  const hab = habitaciones.find((h) => h.id === id);
  if (!hab) return;

  document.getElementById("habitacionId").value = hab.id;
  document.getElementById("nombre").value = hab.nombre;
  document.getElementById("precio").value = hab.precio;
  document.getElementById("descripcion").value = hab.descripcion || "";
  document.getElementById("imagenInput").value = ""; // limpiar input file
  imagenBase64 = hab.imagen; // mantener la imagen anterior por si no se cambia
  document.getElementById("tituloFormulario").textContent = "Editar habitación";
}

function resetFormulario() {
  document.getElementById("formularioHabitacion").reset();
  document.getElementById("habitacionId").value = "";
  document.getElementById("tituloFormulario").textContent =
    "Agregar nueva habitación";
  imagenBase64 = null;
}

function manejarEnvioFormulario(e) {
  e.preventDefault(); //esto es para evitar el acto natural del formulario.
  const id = document.getElementById("habitacionId").value;
  const nombre = document.getElementById("nombre").value.trim();
  const precio = document.getElementById("precio").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();

  if (!nombre || !precio) {
    alert("Completa al menos el nombre y el precio.");
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
  actualizarTodosLosContadores();
}

// Convertir imagen a base64 al seleccionar archivo
document.addEventListener("DOMContentLoaded", () => {
  inicializarHabitaciones();
  ajustarCatalogo();
  actualizarTodosLosContadores();

  if (document.getElementById("listaHabitacionesAdmin")) {
    ajustarListaAdmin();

    // Configurar formulario
    const form = document.getElementById("formularioHabitacion");
    form.addEventListener("submit", manejarEnvioFormulario);

    document
      .getElementById("btnCancelar")
      .addEventListener("click", resetFormulario);

    const inputImagen = document.getElementById("imagenInput");
    inputImagen.addEventListener("change", (e) => {
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
>>>>>>> test
