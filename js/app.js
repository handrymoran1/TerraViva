const btnEnviarHabitacion = document.getElementById("btnEnviarHabitacion");
const opcionesLista = document.getElementById("opcionesLista");
const listaContenedor = document.getElementById("lista");

document.addEventListener("DOMContentLoaded", mostrarLista);
actualizarNavbar();

function agregarALista(nombreHabitacion) {
  const nuevaLista = document.createElement("li");
  nuevaLista.className = "bg-light p-2 border rounded d-inline-block mb-2";

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
    Swal.fire({
      icon: "warning",
      title: "Selección requerida",
      text: "Seleccione una habitación.",
      confirmButtonColor: "#5FA62D"
    });
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
