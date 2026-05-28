(function () {
  var u = JSON.parse(localStorage.getItem("usuarioLogueado"));
  if (!u || u.email !== "admin@gmail.com") {
    window.location.replace("../index.html");
  }
})();
