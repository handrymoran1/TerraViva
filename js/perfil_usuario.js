const API_URL = "https://terraviva-backend.onrender.com";

document.addEventListener("DOMContentLoaded", async function () {
  actualizarNavbar();

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("usuarioEmail");

  if (!token || !email) {
    window.location.href = "../html/iniciarSesion.html";
    return;
  }

  const inputNombre = document.getElementById("inputNombre");
  const inputCorreo = document.getElementById("inputCorreo");
  const inputTelefono = document.getElementById("inputTelefono");
  const inputCiudad = document.getElementById("inputCiudad");
  const nombreDisplay = document.getElementById("nombreDisplay");
  const correoDisplay = document.getElementById("correoDisplay");
  const fotoPreview = document.getElementById("fotoPreview");
  const inputFoto = document.getElementById("inputFoto");

  inputCorreo.value = email;
  correoDisplay.textContent = email;

  const inicial = email.charAt(0).toUpperCase();
  fotoPreview.src = `https://ui-avatars.com/api/?name=${inicial}&background=1B4015&color=fff&size=200&font-size=0.4`;

  // ── CARGAR DATOS DEL USUARIO ──────────────────────────────────────────
  let usuario = null;
  let fotoKey = "";

  try {
    const res = await fetch(`${API_URL}/api/clientes/me`, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuarioEmail");
      window.location.href = "../html/iniciarSesion.html";
      return;
    }

    usuario = await res.json();
    fotoKey = "foto_" + usuario.idCliente;

    inputNombre.value = usuario.nombre || "";
    inputTelefono.value = usuario.telefono || "";
    nombreDisplay.textContent = usuario.nombre || "Usuario";
    correoDisplay.textContent = usuario.email || "";

    // Correo deshabilitado para ADMIN
    if (usuario.rol === "ADMIN") {
      inputCorreo.value = usuario.email || "";
      inputCorreo.disabled = true;
      inputCorreo.style.opacity = "0.6";
    } else {
      inputCorreo.value = usuario.email || "";
    }

    // Ciudad desde localStorage
    const ciudadGuardada = localStorage.getItem("ciudad_" + usuario.idCliente);
    if (inputCiudad && ciudadGuardada) inputCiudad.value = ciudadGuardada;

    // Foto desde localStorage o avatar generado
    const fotoGuardada = localStorage.getItem(fotoKey);
    if (fotoGuardada) {
      fotoPreview.src = fotoGuardada;
    } else {
      const iniciales = (usuario.nombre || "U").charAt(0).toUpperCase();
      fotoPreview.src = `https://ui-avatars.com/api/?name=${iniciales}&background=1B4015&color=fff&size=200&font-size=0.4`;
    }

  } catch (err) {
    console.error("Error al cargar perfil:", err);
    return;
  }

  // ── FOTO DE PERFIL ────────────────────────────────────────────────────
  if (inputFoto) {
    inputFoto.addEventListener("change", function () {
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        fotoPreview.src = e.target.result;
        localStorage.setItem(fotoKey, e.target.result);
        Swal.fire({
          icon: "success",
          title: "¡Foto actualizada!",
          text: "Tu foto de perfil ha sido cambiada.",
          confirmButtonColor: "#1B4015",
          timer: 2000,
          showConfirmButton: false
        });
      };
      reader.readAsDataURL(file);
    });
  }

  // ── GUARDAR CAMBIOS ───────────────────────────────────────────────────
  const btnGuardar = document.getElementById("btnGuardar");
  const toastGuardado = document.getElementById("toastGuardado");

  btnGuardar.addEventListener("click", async function () {
    const nuevoNombre = inputNombre.value.trim();
    const nuevoTelefono = inputTelefono.value.trim();
    const nuevaCiudad = inputCiudad ? inputCiudad.value.trim() : "";

    if (!nuevoNombre) {
      await Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "El nombre no puede estar vacío.",
        confirmButtonColor: "#1B4015"
      });
      return;
    }

    // Confirmación antes de guardar
    const confirm = await Swal.fire({
      icon: "question",
      title: "¿Guardar cambios?",
      text: "¿Deseas actualizar tu información personal?",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#1B4015"
    });

    if (!confirm.isConfirmed) return;

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
          apellido: usuario.apellido || "",
          documento: usuario.documento || "",
          rol: usuario.rol
        })
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.mensaje || "No se pudo actualizar");
      }

      // Ciudad en localStorage
      if (nuevaCiudad) localStorage.setItem("ciudad_" + usuario.idCliente, nuevaCiudad);

      nombreDisplay.textContent = nuevoNombre;

      // Actualizar avatar solo si no hay foto personalizada
      if (!localStorage.getItem(fotoKey)) {
        const nuevaInicial = nuevoNombre.charAt(0).toUpperCase();
        fotoPreview.src = `https://ui-avatars.com/api/?name=${nuevaInicial}&background=1B4015&color=fff&size=200&font-size=0.4`;
      }

      await Swal.fire({
        icon: "success",
        title: "¡Cambios guardados!",
        text: "Tu información ha sido actualizada correctamente.",
        confirmButtonColor: "#1B4015",
        timer: 2000,
        showConfirmButton: false
      });

    } catch (err) {
      console.error("Error al guardar:", err);
      await Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: err.message || "No se pudieron guardar los cambios.",
        confirmButtonColor: "#1B4015"
      });
    }
  });

  // ── RESERVAS DEL USUARIO ──────────────────────────────────────────────
  const listaReservasDiv = document.getElementById("listaReservas");
  const reservasVaciasDiv = document.getElementById("reservasVacias");

  let reservas = [];
  try {
    const res = await fetch(`${API_URL}/api/reservas/cliente/${usuario.idCliente}`, {
      headers: { "Authorization": "Bearer " + token }
    });
    if (res.ok) reservas = await res.json();
  } catch (err) {
    console.error("Error al cargar reservas:", err);
  }

  document.querySelectorAll(".stat-reservas").forEach(el => el.textContent = reservas.length);

  let totalNoches = 0;
  reservas.forEach(r => totalNoches += r.cantidadNoches || 0);
  document.querySelectorAll(".stat-noches").forEach(el => el.textContent = totalNoches);

  const hoy = new Date();
  const activas = reservas.filter(r => r.fechaFin && new Date(r.fechaFin) >= hoy && r.estado === "RESERVADA");
  document.querySelectorAll(".stat-activa").forEach(el => el.textContent = activas.length);

  if (reservas.length === 0) {
    if (reservasVaciasDiv) reservasVaciasDiv.style.display = "flex";
  } else {
    if (reservasVaciasDiv) reservasVaciasDiv.style.display = "none";

    const tablaHTML = `
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-success">
            <tr>
              <th>Habitación</th><th>Fechas</th><th>Noches</th>
              <th>Total</th><th>Estado</th><th>Acción</th>
            </tr>
          </thead>
          <tbody>
            ${reservas.map(r => {
              const fechaInicio = r.fechaInicio ? new Date(r.fechaInicio + "T00:00:00").toLocaleDateString("es-CO") : "-";
              const fechaFin = r.fechaFin ? new Date(r.fechaFin + "T00:00:00").toLocaleDateString("es-CO") : "-";
              const estadoColor = r.estado === "RESERVADA" ? "success" : r.estado === "CANCELADA" ? "danger" : "secondary";
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
                  <td>${r.estado === "RESERVADA" ? `
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

    document.querySelectorAll(".btn-cancelar").forEach(btn => {
      btn.addEventListener("click", async function () {
        const idReserva = this.dataset.id;
        const result = await Swal.fire({
          icon: "warning",
          title: "¿Cancelar reserva?",
          text: "Esta acción no se puede deshacer.",
          showCancelButton: true,
          confirmButtonText: "Sí, cancelar",
          cancelButtonText: "No",
          confirmButtonColor: "#dc3545"
        });

        if (!result.isConfirmed) return;

        try {
          const res = await fetch(`${API_URL}/api/reservas/cancelar/${idReserva}`, {
            method: "PUT",
            headers: { "Authorization": "Bearer " + token }
          });
          if (!res.ok) throw new Error("No se pudo cancelar");
          await Swal.fire({
            icon: "success",
            title: "Reserva cancelada",
            confirmButtonColor: "#1B4015"
          });
          window.location.reload();
        } catch (err) {
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo cancelar la reserva.",
            confirmButtonColor: "#1B4015"
          });
        }
      });
    });
  }
});