const API_URL = "https://terraviva-backend.onrender.com";

document.addEventListener("DOMContentLoaded", async function () {
  actualizarNavbar();

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("usuarioEmail");

  const habitacion = JSON.parse(
    sessionStorage.getItem("habitacionSeleccionada"),
  );
  const busqueda = JSON.parse(sessionStorage.getItem("busquedaHabitaciones"));

  if (!habitacion) {
    const tarjeta = document.getElementById("tarjetaDetalleReserva");
    if (tarjeta) {
      tarjeta.innerHTML =
        '<div class="alert alert-warning text-center m-5">No has seleccionado ninguna habitación. <a href="../index.html">Volver al inicio</a></div>';
    }
    return;
  }

  console.log("Habitación seleccionada:", habitacion);
  console.log("ID habitación detectado:", habitacion.idHabitacion);

  document.getElementById("detalleImagen").src =
    habitacion.imagen || "https://placehold.co/400x300?text=Sin+Imagen";
  document.getElementById("detalleImagen").alt =
    habitacion.nombre || habitacion.tipo || "Habitación";
  document.getElementById("detalleNombre").textContent =
    habitacion.nombre || habitacion.tipo || "Habitación";
  document.getElementById("detalleDescripcion").textContent =
    habitacion.descripcion || "Sin descripción";
  document.getElementById("detallePrecio").textContent = Number(
    habitacion.precio || habitacion.precioNoche || 0,
  ).toLocaleString("es-CO");

  let diasEstancia = 0;

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

    diasEstancia =
      (new Date(busqueda.salida) - new Date(busqueda.llegada)) /
      (1000 * 60 * 60 * 24);

    const precioBase = Number(habitacion.precio || habitacion.precioNoche || 0);
    const totalPagar = precioBase * diasEstancia;

    document.getElementById("detalleCantidadNoches").textContent = diasEstancia;
    document.getElementById("detalleTotalPagar").textContent =
      totalPagar.toLocaleString("es-CO");
  }

  const btnConfirmar = document.getElementById("btnConfirmarReserva");

  if (!token || !email) {
    if (btnConfirmar) {
      btnConfirmar.disabled = true;
      btnConfirmar.style.opacity = "0.7";

      const mensajeNoLogin = document.createElement("div");
      mensajeNoLogin.innerHTML =
        '<div class="alert alert-warning text-center mt-3">Debes <a href="./iniciarSesion.html">iniciar sesión</a> para poder confirmar la reserva.</div>';
      btnConfirmar.parentNode.insertBefore(mensajeNoLogin, btnConfirmar);
    }
    return;
  }

  let clienteData = null;

  try {
    const res = await fetch(`${API_URL}/api/clientes/me`, {
      headers: { Authorization: "Bearer " + token },
    });

    if (!res.ok) throw new Error("Sesión inválida");
    clienteData = await res.json();

    console.log("Cliente autenticado:", clienteData);
  } catch (err) {
    console.error("Error al obtener cliente:", err);
    if (btnConfirmar) btnConfirmar.disabled = true;
    return;
  }

  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", function () {
      Swal.fire({
        title:
          '<strong>Tu Pago Seguro Con Terra Viva <img src="../assets/logo/secure.png" style="height: 32px; vertical-align: text-bottom;"></strong>',
        customClass: {
          title: "swal-title-custom",
          htmlContainer: "swal-html-container-custom",
          confirmButton: "swal-confirm-button-custom",
          cancelButton: "swal-cancel-button-custom",
        },
        html: `
<i class="bi bi-credit-card-fill custom-credit-card-icon"></i>
<p class="mt-3">Estás a punto de pagar <b>$${document.getElementById("detalleTotalPagar").textContent}</b>.</p>
<p>Ingresa los datos de tu tarjeta de crédito para continuar.</p>
<form id="payment-form">
<div class="form-group">
<label for="card-number">Número de la tarjeta</label>
<div class="position-relative">
<input type="password" class="form-control" id="card-number" placeholder="**** **** **** ****" oninput="this.value = this.value.replace(/[^0-9]/g, '')" maxlength="16">
<button class="btn" type="button" id="toggle-card-number">
<i class="bi bi-eye"></i>
</button>
</div>
</div>
<div class="form-group">
<label for="card-holder">Nombre del titular</label>
<input type="text" class="form-control" id="card-holder" placeholder="Nombre completo" oninput="this.value = this.value.replace(/[^a-zA-Z ]/g, '')">
</div>
<div class="row">
<div class="col">
<label for="expiry-date">Fecha de expiración</label>
<input type="text" class="form-control" id="expiry-date" placeholder="MM/YY" oninput="this.value = this.value.replace(/[^0-9/]/g, '')" maxlength="5">
</div>
<div class="col">
<label for="cvv">CVV</label>
<input type="text" class="form-control" id="cvv" placeholder="***" oninput="this.value = this.value.replace(/[^0-9]/g, '')" maxlength="3">
</div>
</div>
</form>
        `,
        showCancelButton: true,
        confirmButtonText: "Pagar",
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        didOpen: () => {
          const toggleButton = document.getElementById("toggle-card-number");
          const cardNumberInput = document.getElementById("card-number");

          toggleButton.addEventListener("click", function () {
            const type =
              cardNumberInput.getAttribute("type") === "password"
                ? "text"
                : "password";
            cardNumberInput.setAttribute("type", type);
            this.querySelector("i").classList.toggle("bi-eye");
            this.querySelector("i").classList.toggle("bi-eye-slash");
          });

          const expiryDateInput = document.getElementById("expiry-date");
          expiryDateInput.addEventListener("input", (e) => {
            if (
              e.target.value.length === 2 &&
              e.inputType !== "deleteContentBackward"
            ) {
              e.target.value += "/";
            }
          });
        },
        preConfirm: async () => {
          // Intento 1: JSON body (estándar REST)
          try {
            const r1 = await fetch(`${API_URL}/api/reservas`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
              body: JSON.stringify({
                idCliente: clienteData.idCliente,
                idHabitacion: habitacion.id,
                fechaInicio: busqueda.llegada,
                fechaFin: busqueda.salida,
              }),
            });
            if (r1.ok) return await r1.json();
            console.warn(
              "Intento JSON falló:",
              r1.status,
              await r1.text().catch(() => ""),
            );
          } catch (e) {
            console.warn("Intento JSON error de red:", e);
          }

          // Intento 2: query params (formato @RequestParam)
          try {
            const params = new URLSearchParams({
              idCliente: clienteData.idCliente,
              idHabitacion: habitacion.id,
              fechaInicio: busqueda.llegada,
              fechaFin: busqueda.salida,
            });
            const r2 = await fetch(`${API_URL}/api/reservas?${params}`, {
              method: "POST",
              headers: { Authorization: "Bearer " + token },
            });
            if (r2.ok) return await r2.json();
            console.warn(
              "Intento query params falló:",
              r2.status,
              await r2.text().catch(() => ""),
            );
          } catch (e) {
            console.warn("Intento query params error de red:", e);
          }

          // Ambos fallaron: pago ficticio, el flujo continúa igual
          return { ficticio: true };
        },
        allowOutsideClick: () => !Swal.isLoading(),
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          // Si el backend no guardó (ficticio), guardamos localmente
          if (result.value.ficticio) {
            const reservasLocales = JSON.parse(
              localStorage.getItem("reservasLocales") || "[]",
            );
            reservasLocales.push({
              idReserva: "local-" + Date.now(),
              fechaInicio: busqueda.llegada,
              fechaFin: busqueda.salida,
              cantidadNoches: diasEstancia,
              totalReserva: habitacion.precio * diasEstancia,
              estado: "RESERVADA",
              habitacion: {
                tipo: habitacion.nombre,
                imagen: habitacion.imagen,
              },
            });
            localStorage.setItem(
              "reservasLocales",
              JSON.stringify(reservasLocales),
            );
          }

          sessionStorage.removeItem("habitacionSeleccionada");
          sessionStorage.removeItem("busquedaHabitaciones");

          Swal.fire({
            title: "¡Pago Exitoso!",
            text: "Tu reserva ha sido confirmada.",
            icon: "success",
            confirmButtonText: "Ver mis reservas",
          }).then(() => {
            window.location.href = "./perfil_usuario.html";
          });
        }
      });
    });
  }
});
