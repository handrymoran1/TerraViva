document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");

  if (!token) return;

  try {
    const res = await fetch("https://terraviva-backend.onrender.com/api/habitaciones", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!res.ok) {
      throw new Error("No se pudieron cargar habitaciones");
    }

    const habitaciones = await res.json();

    const totalHabitaciones = habitaciones.length;
    const visibles = habitaciones.filter(h => h.visible === true).length;
    const ocultas = habitaciones.filter(h => h.visible === false).length;

    const totalEl = document.getElementById("contadorTotalHabitaciones");
    const visiblesEl = document.getElementById("contadorDisponible");
    const ocultasEl = document.getElementById("contadorOcupadas");

    if (totalEl) totalEl.textContent = totalHabitaciones;
    if (visiblesEl) visiblesEl.textContent = visibles;
    if (ocultasEl) ocultasEl.textContent = ocultas;
  } catch (error) {
    console.error("Error cargando métricas admin:", error);
  }
});