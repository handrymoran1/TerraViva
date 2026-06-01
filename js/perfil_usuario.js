const API_URL = "https://terraviva-backend.onrender.com";
document.addEventListener("DOMContentLoaded", async function () {
  actualizarNavbar();

  // Verificamos sesión activa con token y email del localStorage
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("usuarioEmail");

  // Si no hay sesión, redirigir al login
  if (!token || !email) {
    window.location.href = "../html/iniciarSesion.html";
    return;
  }

  // ── REFERENCIAS AL DOM ──────────────────────────────────────────────────
  const inputNombre = document.getElementById("inputNombre");
  const inputCorreo = document.getElementById("inputCorreo");
  const inputTelefono = document.getElementById("inputTelefono");
  const nombreDisplay = document.getElementById("nombreDisplay");
  const correoDisplay = document.getElementById("correoDisplay");
  const fotoPreview = document.getElementById("fotoPreview");

  // Mostramos el email mientras cargamos los datos del backend
  inputCorreo.value = email;
  correoDisplay.textContent = email;

  // Avatar temporal con la inicial del email
  const inicial = email.charAt(0).toUpperCase();
  fotoPreview.src = `https://ui-avatars.com/api/?name=${inicial}&background=1B4015&color=fff&size=200&font-size=0.4`;

  // ── CARGAR DATOS DEL USUARIO DESDE EL BACKEND ──────────────────────────
  let usuario = null;
  try {
    const res = await fetch(`${API_URL}/api/clientes/me`, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) {
      // Token inválido o expirado → mandamos al login
      localStorage.removeItem("token");
      localStorage.removeItem("usuarioEmail");
      window.location.href = "../html/iniciarSesion.html";
      return;
    }

    usuario = await res.json();

    // Rellenamos los campos con los datos reales de Supabase
    inputNombre.value = usuario.nombre || "";
    inputCorreo.value = usuario.email || "";
    inputTelefono.value = usuario.telefono || "";
    nombreDisplay.textContent = usuario.nombre || "Usuario";
    correoDisplay.textContent = usuario.email || "";

    // Avatar con la inicial del nombre real
    const iniciales = (usuario.nombre || "U").charAt(0).toUpperCase();
    fotoPreview.src = `https://ui-avatars.com/api/?name=${iniciales}&background=1B4015&color=fff&size=200&font-size=0.4`;

  } catch (err) {
    console.error("Error al cargar perfil:", err);
    return;
  }

  // ── GUARDAR CAMBIOS ───────────────────────────────────────────────────
  const btnGuardar = document.getElementById("btnGuardar");
  const toastGuardado = document.getElementById("toastGuardado");

  btnGuardar.addEventListener("click", async function () {
    const nuevoNombre = inputNombre.value.trim();
    const nuevoTelefono = inputTelefono.value.trim();

    if (!nuevoNombre) {
      alert("El nombre no puede estar vacío.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/clientes/${usuario.idCliente}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          nombre: nuevoNombre,
          telefono: nuevoTelefono,
          email: usuario.email,
          apellido: usuario.apellido,
          documento: usuario.documento,
          rol: usuario.rol,
          password: usuario.password || ""
        })
      });

      if (!res.ok) throw new Error("No se pudo actualizar");

      nombreDisplay.textContent = nuevoNombre;
      const nuevaInicial = nuevoNombre.charAt(0).toUpperCase();
      fotoPreview.src = `https://ui-avatars.com/api/?name=${nuevaInicial}&background=1B4015&color=fff&size=200&font-size=0.4`;

      toastGuardado.classList.add("show");
      setTimeout(() => toastGuardado.classList.remove("show"), 3000);

    } catch (err) {
      console.error("Error al guardar:", err);
      alert("No se pudieron guardar los cambios.");
    }
  });

  // ── RESERVAS DEL USUARIO DESDE EL BACKEND ────────────────────────────
  const listaReservasDiv = document.getElementById("listaReservas");
  const reservasVaciasDiv = document.getElementById("reservasVacias");

  let reservas = [];
  try {
    // Llamamos al backend con el idCliente para traer sus reservas
    const res = await fetch(`${API_URL}/api/reservas/cliente/${usuario.idCliente}`, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (res.ok) {
      reservas = await res.json();
    }
  } catch (err) {
    console.error("Error al cargar reservas:", err);
  }

  // Actualizamos contadores de estadísticas
  document.querySelectorAll(".stat-reservas").forEach(el => el.textContent = reservas.length);

  // Contamos noches totales
  let totalNoches = 0;
  reservas.forEach(r => totalNoches += r.cantidadNoches || 0);
  document.querySelectorAll(".stat-noches").forEach(el => el.textContent = totalNoches);

  // Reserva activa: alguna con fechaFin en el futuro y estado RESERVADA
  const hoy = new Date();
  const activas = reservas.filter(r => r.fechaFin && new Date(r.fechaFin) >= hoy && r.estado === "RESERVADA");
  document.querySelectorAll(".stat-activa").forEach(el => el.textContent = activas.length);

  // Mostramos tabla o placeholder según si hay reservas
  if (reservas.length === 0) {
    if (reservasVaciasDiv) reservasVaciasDiv.style.display = "flex";
  } else {
    if (reservasVaciasDiv) reservasVaciasDiv.style.display = "none";

    const tablaHTML = `
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-success">
            <tr>
              <th>Habitación</th>
              <th>Fechas</th>
              <th>Noches</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            ${reservas.map(r => {
              const fechaInicio = r.fechaInicio
                ? new Date(r.fechaInicio + "T00:00:00").toLocaleDateString("es-CO")
                : "-";
              const fechaFin = r.fechaFin
                ? new Date(r.fechaFin + "T00:00:00").toLocaleDateString("es-CO")
                : "-";

              const estadoColor = r.estado === "RESERVADA" ? "success" :
                                  r.estado === "CANCELADA" ? "danger" : "secondary";

              return `
                <tr>
                  <td>
                    <div class="d-flex align-items-center">
                      <img src="${r.habitacion?.imagen || 'https://placehold.co/80x60?text=Sin+Imagen'}"
                           class="me-2 rounded" width="60" height="40" style="object-fit:cover;">
                      <span class="fw-semibold">${r.habitacion?.tipo || "-"}</span>
                    </div>
                  </td>
                  <td>${fechaInicio} → ${fechaFin}</td>
                  <td>${r.cantidadNoches || 0}</td>
                  <td>$${r.totalReserva?.toLocaleString("es-CO") || 0}</td>
                  <td><span class="badge bg-${estadoColor}">${r.estado}</span></td>
                  <td>
                    ${r.estado === "RESERVADA" ? `
                      <button class="btn btn-sm btn-outline-danger btn-cancelar" data-id="${r.idReserva}">
                        Cancelar
                      </button>` : "-"}
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
    listaReservasDiv.insertAdjacentHTML("beforeend", tablaHTML);

    // Eventos para cancelar reserva
    document.querySelectorAll(".btn-cancelar").forEach(btn => {
      btn.addEventListener("click", async function () {
        const idReserva = this.dataset.id;
        if (!confirm("¿Seguro que quieres cancelar esta reserva?")) return;

        try {
          const res = await fetch(`${API_URL}/api/reservas/cancelar/${idReserva}`, {
            method: "PUT",
            headers: { "Authorization": "Bearer " + token }
          });

          if (!res.ok) throw new Error("No se pudo cancelar");

          alert("Reserva cancelada correctamente.");
          window.location.reload();

        } catch (err) {
          console.error("Error al cancelar:", err);
          alert("No se pudo cancelar la reserva.");
        }
      });
    });
  }
});