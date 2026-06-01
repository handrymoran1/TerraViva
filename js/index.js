const hoy = new Date().toISOString().split("T")[0];
const inputLlegada = document.getElementById("fechaLlegada");
const inputSalida = document.getElementById("fechaSalida");
const btnBuscarDisponibilidad = document.getElementById("btnBuscarDisponibilidad");
const selectHuespedes = document.getElementById("huespedes");

if (inputLlegada && inputSalida) {
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
}

if (btnBuscarDisponibilidad && inputLlegada && inputSalida && selectHuespedes) {
  btnBuscarDisponibilidad.addEventListener("click", function (e) {
    e.preventDefault();

    const llegada = inputLlegada.value;
    const salida = inputSalida.value;
    const huespedes = selectHuespedes.value;

    if (!llegada || !salida) {
      alert("Seleccione fechas de llegada y salida.");
      return;
    }

    if (new Date(salida) <= new Date(llegada)) {
      alert("La fecha de salida debe ser posterior a la de entrada.");
      return;
    }

    const datosBusqueda = {
      llegada,
      salida,
      huespedes
    };

    sessionStorage.setItem("busquedaHabitaciones", JSON.stringify(datosBusqueda));
    window.location.href = "./html/habitaciones.html";
  });
}