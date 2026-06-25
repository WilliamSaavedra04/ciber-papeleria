// Cargar servicios guardados o iniciar arreglo vacío
let servicios = JSON.parse(localStorage.getItem("servicios")) || [];

// REGISTRAR un nuevo servicio
function registrarServicio() {
  let tipoServicio = document.getElementById("tipoServicio").value;
  let precio = document.getElementById("precioServicio").value;

  if (precio === "") {
    alert("Ingresa el precio del servicio");
    return;
  }

  let hoy = new Date();
  let fecha = hoy.toLocaleDateString("es-HN"); // formato dd/mm/aaaa

  let nuevoServicio = {
    servicio: tipoServicio,
    precio: parseFloat(precio),
    fecha: fecha
  };

  servicios.push(nuevoServicio);
  localStorage.setItem("servicios", JSON.stringify(servicios));

  document.getElementById("precioServicio").value = "";

  renderizarServicios();
}

// MOSTRAR servicios en la tabla
function renderizarServicios() {
  let tabla = document.getElementById("tablaServicios");
  tabla.innerHTML = "";

  let total = 0;

  servicios.forEach(function (s) {
    tabla.innerHTML += `
      <tr>
        <td>${s.servicio}</td>
        <td>Lps ${s.precio}</td>
        <td>${s.fecha}</td>
      </tr>
    `;
    total += s.precio;
  });

  document.getElementById("totalServicios").innerText = total;
}

// CARGAR AL INICIO
renderizarServicios();