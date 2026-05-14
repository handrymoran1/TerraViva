let btnBuscarDisponibilidad = document.getElementById(
  "btnBuscarDisponibilidad",
);

btnBuscarDisponibilidad.addEventListener("click", function () {
  e.preventDefault();
  alert("funciona btn");

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

  window.location.href = "/html/habitaciones.html";
});
