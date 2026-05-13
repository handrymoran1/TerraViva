/*/*document.getElementById('inputFoto').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
 
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById('fotoPreview').src = e.target.result;
  };
  reader.readAsDataURL(file);
});
 
 
//* ─────────────────────────────────────────────────────
   2. ACTUALIZAR NOMBRE Y CORREO EN LA TARJETA EN VIVO
   ───────────────────────────────────────────────────── */
/*/ument.getElementById('inputNombre').addEventListener('input', function () {
  document.getElementById('nombreDisplay').textContent = this.value || 'Tu nombre';
});
 
document.getElementById('inputCorreo').addEventListener('input', function () {
  document.getElementById('correoDisplay').textContent = this.value || 'tu@correo.com';
});/*
 
 
/* ─────────────────────────────────────────────────────
   3. TOAST DE CONFIRMACIÓN AL GUARDAR
   ───────────────────────────────────────────────────── */
/*/nt.getElementById('btnGuardar').addEventListener('click', function () {
  const toast = document.getElementById('toastGuardado');
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 3000);
  });/*/



  // Esto va cuando ya se tenga la base de datos (LLENAR LOS NUMEROS)
fetch("/api/usuario/estadisticas")
  .then(res => res.json())
  .then(datos => {
    document.querySelectorAll(".stat-reservas").forEach(el => el.textContent = datos.totalReservas);
    document.querySelectorAll(".stat-activa").forEach(el => el.textContent = datos.reservaActiva);
    document.querySelectorAll(".stat-noches").forEach(el => el.textContent = datos.nochesHospedado);
    
  });


  // Ocultar el placeholder y mostrar la lista real
/*/document.getElementById("reservasVacias").style.display = "none";
document.getElementById("listaReservas").innerHTML += `<div class="reserva-item">...</div>`;/*/