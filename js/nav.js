
function renderNav(paginaActiva) {
  const opciones = [
    { nombre: "Dashboard", archivo: "dashboard.html" },
    { nombre: "Ventas", archivo: "ventas.html" },
    { nombre: "Inventario", archivo: "inventario.html" },
    { nombre: "Servicios", archivo: "servicios.html" },
    { nombre: "Reportes", archivo: "reportes.html" }
  ];

  let html = `<h2>Inversiones Jireht</h2><ul>`;

  opciones.forEach(function (opcion) {
    const esActiva = opcion.archivo === paginaActiva;
    const clase = esActiva ? 'class="activo"' : "";
    html += `<li ${clase} onclick="window.location.href='${opcion.archivo}'">${opcion.nombre}</li>`;
  });

  html += `</ul>`;

  document.getElementById("sidebar").innerHTML = html;
}