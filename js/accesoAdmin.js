(async function () {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("usuarioEmail");

  if (!token || !email) {
    window.location.replace("../index.html");
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

    if (!usuario || usuario.rol !== "ADMIN") {
      window.location.replace("../index.html");
      return;
    }

    localStorage.setItem("usuarioRol", usuario.rol);
  } catch (err) {
    console.error("Error validando acceso admin:", err);
    localStorage.removeItem("usuarioRol");
    window.location.replace("../index.html");
  }
})();