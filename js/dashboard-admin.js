const API_HABITACIONES = "https://terraviva-backend.onrender.com/api/habitaciones";
const API_CLIENTES = "https://terraviva-backend.onrender.com/api/clientes";
const API_RESERVAS = "https://terraviva-backend.onrender.com/api/reservas";

function setText(id, valor) {
  const el = document.getElementById(id);
  if (el) el.textContent = valor;
}

function normalizarEstadoReserva(estado) {
  if (!estado) return "";
  return String(estado).trim().toUpperCase();
}

function calcularReservasActivas(reservas) {
  return reservas.filter(r => {
    const estado = normalizarEstadoReserva(r.estado);
    return estado === "RESERVADA" || estado === "ACTIVA" || estado === "CONFIRMADA";
  }).length;
}

function calcularReservasCanceladas(reservas) {
  return reservas.filter(r => {
    const estado = normalizarEstadoReserva(r.estado);
    return estado === "CANCELADA" || estado === "CANCELADO";
  }).length;
}

function calcularReservasProximas(reservas) {
  const hoy = new Date();
  const limite = new Date();
  limite.setDate(hoy.getDate() + 7);

  return reservas.filter(r => {
    if (!r.fechaInicio) return false;
    const inicio = new Date(r.fechaInicio + "T00:00:00");
    return inicio >= hoy && inicio <= limite;
  }).length;
}

function construirResumen(habitaciones, clientes, reservas) {
  const totalHabitaciones = habitaciones.length;
  const visibles = habitaciones.filter(h => h.visible === true).length;
  const ocultas = habitaciones.filter(h => h.visible === false).length;
  const totalClientes = clientes.length;
  const totalReservas = reservas.length;
  const activas = calcularReservasActivas(reservas);
  const canceladas = calcularReservasCanceladas(reservas);

  const textoEstado = document.getElementById("textoResumenEstado");
  const textoObservacion = document.getElementById("textoResumenObservacion");

  if (textoEstado) {
    textoEstado.textContent =
      `Actualmente TerraViva tiene ${totalHabitaciones} habitaciones, ${visibles} visibles para el catálogo, ` +
      `${totalClientes} clientes registrados y ${totalReservas} reservas acumuladas.`;
  }

  if (textoObservacion) {
    if (canceladas > activas) {
      textoObservacion.textContent =
        "Hay más reservas canceladas que activas. Conviene revisar el flujo de reserva y la disponibilidad mostrada al cliente.";
    } else if (ocultas > visibles) {
      textoObservacion.textContent =
        "Hay más habitaciones ocultas que visibles. Esto puede afectar la oferta mostrada en el catálogo.";
    } else {
      textoObservacion.textContent =
        "El panel muestra una operación estable. Conviene seguir monitoreando reservas próximas y visibilidad de habitaciones.";
    }
  }
}

async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error al consultar ${url}`);
  }
  return response.json();
}

async function cargarMetricasDashboard() {
  const esDashboard = document.getElementById("contadorClientes");
  if (!esDashboard) return;

  try {
    const [habitaciones, clientes, reservas] = await Promise.all([
      fetchJSON(API_HABITACIONES),
      fetchJSON(API_CLIENTES),
      fetchJSON(API_RESERVAS)
    ]);

    const totalHabitaciones = habitaciones.length;
    const visibles = habitaciones.filter(h => h.visible === true).length;
    const ocultas = habitaciones.filter(h => h.visible === false).length;
    const totalClientes = clientes.length;
    const totalReservas = reservas.length;
    const reservasActivas = calcularReservasActivas(reservas);
    const reservasCanceladas = calcularReservasCanceladas(reservas);
    const reservasProximas = calcularReservasProximas(reservas);

    setText("contadorTotalHabitaciones", totalHabitaciones);
    setText("contadorDisponible", visibles);
    setText("contadorOcupadas", ocultas);
    setText("contadorClientes", totalClientes);
    setText("contadorReservas", totalReservas);
    setText("contadorReservasActivas", reservasActivas);
    setText("contadorReservasCanceladas", reservasCanceladas);
    setText("contadorReservasProximas", reservasProximas);

    construirResumen(habitaciones, clientes, reservas);
  } catch (error) {
    console.error("Error cargando métricas del dashboard:", error);

    setText("contadorTotalHabitaciones", "—");
    setText("contadorDisponible", "—");
    setText("contadorOcupadas", "—");
    setText("contadorClientes", "—");
    setText("contadorReservas", "—");
    setText("contadorReservasActivas", "—");
    setText("contadorReservasCanceladas", "—");
    setText("contadorReservasProximas", "—");

    const textoEstado = document.getElementById("textoResumenEstado");
    const textoObservacion = document.getElementById("textoResumenObservacion");

    if (textoEstado) {
      textoEstado.textContent = "No fue posible cargar las métricas del panel en este momento.";
    }

    if (textoObservacion) {
      textoObservacion.textContent =
        "Revisa el backend, CORS, el token o la estructura de respuesta de clientes y reservas.";
    }
  }
}

document.addEventListener("DOMContentLoaded", cargarMetricasDashboard);