(async function () {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("usuarioEmail");

  if (!token || !email) {
    window.location.replace("../html/iniciarSesion.html");
    return;
  }

  try {
    const res = await fetch("https://terraviva-backend.onrender.com/api/clientes/me", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error("No autorizado");
    }

    const usuario = await res.json();

    if (!usuario) {
      window.location.replace("../html/iniciarSesion.html");
      return;
    }

    localStorage.setItem("usuarioRol", usuario.rol || "");

    if (usuario.rol !== "ADMIN") {
      window.location.replace("../html/perfil_usuario.html");
    }
  } catch (err) {
    console.error("Error validando acceso admin:", err);
    localStorage.removeItem("usuarioRol");
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioEmail");
    window.location.replace("../html/iniciarSesion.html");
  }
})();