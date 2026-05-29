let btnBuscarDisponibilidad = document.getElementById("btnBuscarDisponibilidad");

btnBuscarDisponibilidad.addEventListener("click", function (e) {
  e.preventDefault();
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
  // [CAMBIO] guardamos en sessionStorage para que persista durante la navegación
  sessionStorage.setItem("busquedaHabitaciones", JSON.stringify(datosBusqueda));

  // [CAMBIO] ruta relativa corregida
  window.location.href = "./html/habitaciones.html";
});

// [CAMBIO] funciones de navegación (iguales en todos los JS)
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

// [CAMBIO] Ejecutar actualizarNavbar al cargar la página
document.addEventListener("DOMContentLoaded", function() {
  actualizarNavbar();
});