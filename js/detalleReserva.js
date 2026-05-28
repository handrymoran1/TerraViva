document.addEventListener("DOMContentLoaded", function () {
  //aquí traemos los datos
  actualizarNavbar();
  const habitacion = JSON.parse(
    sessionStorage.getItem("habitacionSeleccionada"),
  );
  const busqueda = JSON.parse(sessionStorage.getItem("busquedaHabitaciones"));

  // 2. Verificamos si hay habitación
  if (!habitacion) {
    const tarjeta = document.getElementById("tarjetaDetalleReserva");
    if (tarjeta) {
      tarjeta.innerHTML =
        '<div class="alert alert-warning text-center m-5">No has seleccionado ninguna habitación. <a href="../index.html">Volver al inicio</a></div>';
    }
    return;
  }

  // ahora llenamos los datos básicos
  document.getElementById("detalleImagen").src =
    habitacion.imagen || "https://placehold.co/400x300?text=Sin+Imagen";
  document.getElementById("detalleImagen").alt = habitacion.nombre;
  document.getElementById("detalleNombre").textContent = habitacion.nombre;
  document.getElementById("detalleDescripcion").textContent =
    habitacion.descripcion;
  document.getElementById("detallePrecio").textContent =
    habitacion.precio.toLocaleString("es-CO");

  if (busqueda) {
    const fechaLlegada = new Date(
      busqueda.llegada + "T00:00:00",
    ).toLocaleDateString("es-CO");
    const fechaSalida = new Date(
      busqueda.salida + "T00:00:00",
    ).toLocaleDateString("es-CO");

    document.getElementById("detalleFechas").textContent =
      `${fechaLlegada} hasta ${fechaSalida}`;
    document.getElementById("detalleHuespedes").textContent =
      busqueda.huespedes;

    const fLlegada = new Date(busqueda.llegada);
    const fSalida = new Date(busqueda.salida);

    // calculamos los dias
    const diferenciaMs = fSalida - fLlegada;
    const diasEstancia = diferenciaMs / (1000 * 60 * 60 * 24);

    const totalPagar = habitacion.precio * diasEstancia;

    // actualizamos el DOM
    document.getElementById("detalleCantidadNoches").textContent = diasEstancia;
    document.getElementById("detalleTotalPagar").textContent =
      totalPagar.toLocaleString("es-CO");
  }

  const btnConfirmar = document.getElementById("btnConfirmarReserva");
  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", function () {
      let historial =
        JSON.parse(localStorage.getItem("historialReservas")) || [];

      const reservaFinal = {
        habitacion: habitacion.nombre,
        total: document.getElementById("detalleTotalPagar").textContent,
        fecha: new Date().toISOString(),
      };

      historial.push(reservaFinal);
      localStorage.setItem("historialReservas", JSON.stringify(historial));

      // Limpiamos sesión
      sessionStorage.removeItem("habitacionSeleccionada");
      sessionStorage.removeItem("busquedaHabitaciones");


      window.location.href = "./perfil_usuario.html";
    });
  }
});
