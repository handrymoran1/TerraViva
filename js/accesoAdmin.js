(async function () {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("usuarioEmail");

  if (!token || !email) {
    window.location.replace("../index.html");
    return;
  }

  try {
    const res = await fetch("https://terraviva-backend.onrender.com/api/clientes/me", {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) throw new Error("No autorizado");

    const usuario = await res.json();

    // Solo ADMIN puede entrar al dashboard
    if (usuario.rol !== "ADMIN") {
      window.location.replace("../index.html");
    }

  } catch (err) {z
    window.location.replace("../index.html");
  }
})();