function cerrarSesionManual() {
  localStorage.removeItem("usuarioLogueado");
  alert("Has cerrado sesión correctamente.");
  window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", function () {
  // aquí traemos los datos del usuario logueado
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

  // si no hay usuario lo sacamos de la página y con eso garantizamos un poco más de seguridad
  if (!usuario) {
    alert("Debes iniciar sesión para ver esta página.");
    window.location.href = "../html/iniciarSesion.html";
    return;
  }

  const inputNombre = document.getElementById("inputNombre");
  const inputCorreo = document.getElementById("inputCorreo");
  const inputTelefono = document.getElementById("inputTelefono");
  const nombreDisplay = document.getElementById("nombreDisplay");
  const correoDisplay = document.getElementById("correoDisplay");
  const fotoPreview = document.getElementById("fotoPreview");

  //con esto rellenamos los campos ome
  inputNombre.value = usuario.nombre || "";
  inputCorreo.value = usuario.email || "";
  inputTelefono.value = usuario.telefono || "";
  nombreDisplay.textContent = usuario.nombre || "Usuario";
  correoDisplay.textContent = usuario.email || "";

  const iniciales = (usuario.nombre || "U").charAt(0).toUpperCase();
  fotoPreview.src = `https://ui-avatars.com/api/?name=${iniciales}&background=1B4015&color=fff&size=200&font-size=0.4`;

  const btnGuardar = document.getElementById("btnGuardar");
  const toastGuardado = document.getElementById("toastGuardado");

  btnGuardar.addEventListener("click", function () {
    const nuevoNombre = inputNombre.value.trim();
    const nuevoTelefono = inputTelefono.value.trim();

    if (!nuevoNombre) {
      alert("El nombre no puede estar vacío.");
      return;
    }

    usuario.nombre = nuevoNombre;
    usuario.telefono = nuevoTelefono;

    localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
//aqui remplazamos en el local lo que ya teníamos por si volvemos a iniciar sesión
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].email === usuario.email) {
        usuarios[i].nombre = nuevoNombre;
        usuarios[i].telefono = nuevoTelefono;
        break;
      }
    }
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    nombreDisplay.textContent = nuevoNombre;

    // cambiamos foto si cambió el nombre, esto con la inicial
    const nuevasIniciales = nuevoNombre.charAt(0).toUpperCase();
    fotoPreview.src = `https://ui-avatars.com/api/?name=${nuevasIniciales}&background=1B4015&color=fff&size=200&font-size=0.4`;

    toastGuardado.classList.add("show"); 
    setTimeout(() => {
      toastGuardado.classList.remove("show");
    }, 3000);
  });
});

// Esto va cuando ya se tenga la base de datos (LLENAR LOS NUMEROS)
// fetch("/api/usuario/estadisticas")
//   .then(res => res.json())
//   .then(datos => {
//     document.querySelectorAll(".stat-reservas").forEach(el => el.textContent = datos.totalReservas);
//     document.querySelectorAll(".stat-activa").forEach(el => el.textContent = datos.reservaActiva);
//     document.querySelectorAll(".stat-noches").forEach(el => el.textContent = datos.nochesHospedado);

//   });

// Ocultar el placeholder y mostrar la lista real
/*/document.getElementById("reservasVacias").style.display = "none";
document.getElementById("listaReservas").innerHTML += `<div class="reserva-item">...</div>`;/*/
