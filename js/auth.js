// Credenciales del sistema (en un MVP sin backend, viven aquí)
const USUARIO_VALIDO = "admin";
const PASS_VALIDO = "1234";

function login() {
  let user = document.getElementById("user").value.trim();
  let pass = document.getElementById("pass").value.trim();
  let error = document.getElementById("error");

  // Limpiar mensaje de error anterior antes de validar de nuevo
  error.innerText = "";

  // Validación de campos vacíos
  if (user === "" || pass === "") {
    error.innerText = "Debes completar usuario y contraseña";
    return;
  }

  // Validación de credenciales
  if (user === USUARIO_VALIDO && pass === PASS_VALIDO) {
    localStorage.setItem("session", "active");
    window.location.href = "dashboard.html";
  } else {
    error.innerText = "Usuario o contraseña incorrectos";
  }
}