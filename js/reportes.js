function cargarReporte() {
  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
  let servicios = JSON.parse(localStorage.getItem("servicios")) || [];

  let hoy = new Date().toLocaleDateString("es-HN");

  let ventasHoy = ventas.filter(v => v.fecha === hoy);
  let serviciosHoy = servicios.filter(s => s.fecha === hoy);

  // ===== Tabla de ventas =====
  let tablaVentas = document.getElementById("tablaReporteVentas");
  let totalVentas = 0;
  tablaVentas.innerHTML = "";

  ventasHoy.forEach(function (v) {
    tablaVentas.innerHTML += `
      <tr>
        <td>${v.producto}</td>
        <td>${v.cantidad}</td>
        <td>Lps ${v.precioUnitario}</td>
        <td>Lps ${v.total}</td>
      </tr>
    `;
    totalVentas += v.total;
  });

  // ===== Tabla de servicios =====
  let tablaServicios = document.getElementById("tablaReporteServicios");
  let totalServicios = 0;
  tablaServicios.innerHTML = "";

  serviciosHoy.forEach(function (s) {
    tablaServicios.innerHTML += `
      <tr>
        <td>${s.servicio}</td>
        <td>Lps ${s.precio}</td>
      </tr>
    `;
    totalServicios += s.precio;
  });

  // ===== Resumen general =====
  document.getElementById("fechaReporte").innerText = hoy;
  document.getElementById("totalProductosReporte").innerText = productos.length;
  document.getElementById("totalVentasReporte").innerText = totalVentas;
  document.getElementById("totalServiciosReporte").innerText = totalServicios;
  document.getElementById("totalGeneralReporte").innerText = totalVentas + totalServicios;
}

function imprimirReporte() {
  window.print();
}

cargarReporte();