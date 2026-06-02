(function () {
  var u = JSON.parse(localStorage.getItem("usuarioLogueado"));
  if (!u || u.email !== "admin02@gmail.com") {
    window.location.href("../html/dashboard.html");
  }
})();
