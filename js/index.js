const hoy = new Date().toISOString().Split("T")[0];
const inputLlegada = document.getElementById("fechaLlegada");
const inputSalida = document.getElementById("fechaSalida");

inputLlegada.min = hoy;
inputSalida.min = hoy;

inputLlegada.addEventListener("change", function () {
  if (this.value) {
    inputSalida.min = this.value;
    if (inputSalida.value && inputSalida.value <= this.value) {
      inputSalida.value = "";
    }
  }
});

let btnBuscarDisponibilidad = document.getElementById(
  "btnBuscarDisponibilidad",
);

btnBuscarDisponibilidad.addEventListener("click", function (e) {
  e.preventDefault();
  const llegada = document.getElementById("fechaLlegada").value;
  const salida = document.getElementById("fechaSalida").value;
  const huespedes = document.getElementById("huespedes").value;

  if (!llegada || !salida) {
    alert("Seleccione fechas de llegada y salida.");
    return;
  }

  if (new Date(salida) <= new Date(llegada)) {
    alert("La fecha de salida debe ser posterior a la de entrada.");
    return;
  }

  const datosBusqueda = {
    llegada: llegada,
    salida: salida,
    huespedes: huespedes,
  };
  // aquí cuando cerremos el navegador se borra ese almacenamiento en sessionStorage
  sessionStorage.setItem("busquedaHabitaciones", JSON.stringify(datosBusqueda));

  window.location.href = "./html/habitaciones.html";
});
