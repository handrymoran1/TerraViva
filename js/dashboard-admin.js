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

function contarClientesHuespedes(clientes) {
  return clientes.filter(c => {
    const rol = (c.rol || "").toUpperCase().trim();
    return rol !== "ADMIN";
  }).length;
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
    const totalClientes = contarClientesHuespedes(clientes);
    const totalReservas = reservas.length;
    const reservasActivas = calcularReservasActivas(reservas);
    const reservasCanceladas = calcularReservasCanceladas(reservas);

    setText("contadorTotalHabitaciones", totalHabitaciones);
    setText("contadorDisponible", visibles);
    setText("contadorOcupadas", ocultas);
    setText("contadorClientes", totalClientes);
    setText("contadorReservas", totalReservas);
    setText("contadorReservasActivas", reservasActivas);
    setText("contadorReservasCanceladas", reservasCanceladas);
  } catch (error) {
    console.error("Error cargando métricas del dashboard:", error);

    setText("contadorTotalHabitaciones", "0");
    setText("contadorDisponible", "0");
    setText("contadorOcupadas", "0");
    setText("contadorClientes", "0");
    setText("contadorReservas", "0");
    setText("contadorReservasActivas", "0");
    setText("contadorReservasCanceladas", "0");
  }
}

document.addEventListener("DOMContentLoaded", cargarMetricasDashboard);