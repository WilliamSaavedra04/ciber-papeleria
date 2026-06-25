function cargarDashboard() {
  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
  let servicios = JSON.parse(localStorage.getItem("servicios")) || [];

  let hoy = new Date().toLocaleDateString("es-HN");

  // Filtrar solo lo registrado hoy
  let ventasHoy = ventas.filter(v => v.fecha === hoy);
  let serviciosHoy = servicios.filter(s => s.fecha === hoy);

  // Sumar totales usando reduce
  let totalVentasHoy = ventasHoy.reduce((suma, v) => suma + v.precio, 0);
  let totalServiciosHoy = serviciosHoy.reduce((suma, s) => suma + s.precio, 0);
  let totalGeneral = totalVentasHoy + totalServiciosHoy;

  // Mostrar en pantalla
  document.getElementById("totalProductos").innerText = productos.length;
  document.getElementById("totalVentasHoy").innerText = "Lps " + totalVentasHoy;
  document.getElementById("totalServiciosHoy").innerText = "Lps " + totalServiciosHoy;
  document.getElementById("totalGeneral").innerText = "Lps " + totalGeneral;
}

function logout() {
  localStorage.removeItem("session");
  window.location.href = "login.html";
}

cargarDashboard();