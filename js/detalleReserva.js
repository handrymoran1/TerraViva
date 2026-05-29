// [CAMBIO] Flujo completo de detalleReserva con control de login y guardado en usuario

document.addEventListener("DOMContentLoaded", function () {
  actualizarNavbar();

  const habitacion = JSON.parse(sessionStorage.getItem("habitacionSeleccionada"));
  const busqueda = JSON.parse(sessionStorage.getItem("busquedaHabitaciones"));
  const tarjeta = document.getElementById("tarjetaDetalleReserva");

  if (!habitacion) {
    if (tarjeta) {
      tarjeta.innerHTML = `
        <div class="alert alert-warning text-center m-5">
          No has seleccionado ninguna habitación.
          <a href="../index.html" class="ms-2">Volver al inicio</a>
        </div>`;
    }
    return;
  }

  // [CAMBIO] llenar datos básicos
  document.getElementById("detalleImagen").src = habitacion.imagen || "https://placehold.co/400x300?text=Sin+Imagen";
  document.getElementById("detalleImagen").alt = habitacion.nombre;
  document.getElementById("detalleNombre").textContent = habitacion.nombre;
  document.getElementById("detalleDescripcion").textContent = habitacion.descripcion;
  document.getElementById("detallePrecio").textContent = habitacion.precio.toLocaleString("es-CO");

  // [CAMBIO] calcular noches y total si hay búsqueda
  let diasEstancia = 0;
  let totalPagar = 0;
  let fechaLlegada = "";
  let fechaSalida = "";

  if (busqueda) {
    fechaLlegada = busqueda.llegada;
    fechaSalida = busqueda.salida;
    const fLlegada = new Date(busqueda.llegada + "T00:00:00");
    const fSalida = new Date(busqueda.salida + "T00:00:00");
    diasEstancia = Math.round((fSalida - fLlegada) / (1000 * 60 * 60 * 24));
    totalPagar = habitacion.precio * diasEstancia;

    document.getElementById("detalleFechas").textContent =
      new Date(fLlegada).toLocaleDateString("es-CO") + " hasta " + new Date(fSalida).toLocaleDateString("es-CO");
    document.getElementById("detalleHuespedes").textContent = busqueda.huespedes;
    document.getElementById("detalleCantidadNoches").textContent = diasEstancia;
    document.getElementById("detalleTotalPagar").textContent = totalPagar.toLocaleString("es-CO");
  } else {
    document.getElementById("detalleFechas").textContent = "No seleccionadas";
    document.getElementById("detalleHuespedes").textContent = "-";
  }

  // [CAMBIO] control de acceso
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
  const btnConfirmar = document.getElementById("btnConfirmarReserva");

  if (!usuarioLogueado) {
    // No logueado: ocultar botón confirmar y mostrar opción de login
    if (btnConfirmar) btnConfirmar.style.display = "none";

    const avisoLogin = document.createElement("div");
    avisoLogin.className = "alert alert-info text-center mt-4";
    avisoLogin.innerHTML = `
      <p class="mb-2">Para confirmar la reserva debes iniciar sesión.</p>
      <button class="btn btn-primary" id="btnIrLogin">Iniciar sesión para confirmar</button>`;
    tarjeta.querySelector(".card-body").appendChild(avisoLogin);

    document.getElementById("btnIrLogin").addEventListener("click", function () {
      // [CAMBIO] guardar página a la que volver tras login
      sessionStorage.setItem("redirectAfterLogin", "detalleReserva.html");
      window.location.href = "../html/iniciarSesion.html";
    });
  } else {
    // Logueado: habilitar confirmación
    if (btnConfirmar) {
      btnConfirmar.style.display = "block";
      btnConfirmar.addEventListener("click", function () {
        if (!busqueda) {
          alert("Debes seleccionar fechas antes de confirmar.");
          return;
        }

        // [CAMBIO] crear objeto reserva con todos los detalles
        const reserva = {
          id: Date.now(),
          habitacion: habitacion.nombre,
          imagen: habitacion.imagen,
          precioNoche: habitacion.precio,
          fechaLlegada: fechaLlegada,
          fechaSalida: fechaSalida,
          huespedes: busqueda.huespedes,
          noches: diasEstancia,
          total: totalPagar,
          fechaReserva: new Date().toISOString()
        };

        // [CAMBIO] actualizar usuario en localStorage
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const usuarioActual = { ...usuarioLogueado };
        if (!usuarioActual.reservas) usuarioActual.reservas = [];
        usuarioActual.reservas.push(reserva);

        const index = usuarios.findIndex(u => u.email === usuarioActual.email);
        if (index !== -1) {
          usuarios[index] = usuarioActual;
        } else {
          usuarios.push(usuarioActual);
        }
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioActual));

        // limpiar sessionStorage
        sessionStorage.removeItem("habitacionSeleccionada");
        sessionStorage.removeItem("busquedaHabitaciones");
        sessionStorage.removeItem("redirectAfterLogin");

        alert("¡Reserva confirmada con éxito!");
        window.location.href = "../html/perfil_usuario.html";
      });
    }
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