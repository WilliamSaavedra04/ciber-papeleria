let productos = JSON.parse(localStorage.getItem("productos")) || [];
let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
let carrito = []; // EN MEMORIA — no se guarda hasta confirmar el cobro

// Cuántas unidades de un producto ya están "apartadas" en el carrito actual
function cantidadEnCarrito(idProducto) {
  return carrito
    .filter(item => item.idProducto === idProducto)
    .reduce((suma, item) => suma + item.cantidad, 0);
}

// LLENAR el select, mostrando stock disponible (stock real - lo ya apartado en el carrito)
function poblarProductos() {
  productos = JSON.parse(localStorage.getItem("productos")) || [];
  let select = document.getElementById("productoVenta");
  select.innerHTML = '<option value="">Selecciona un producto</option>';

  productos.forEach(function (p) {
    let disponible = p.stock - cantidadEnCarrito(p.id);
    select.innerHTML += `<option value="${p.id}">${p.nombre} (Disponible: ${disponible})</option>`;
  });
}

// AGREGAR un producto al pedido actual (no guarda nada todavía)
function agregarAlCarrito() {
  let idProducto = document.getElementById("productoVenta").value;
  let cantidad = document.getElementById("cantidad").value;

  if (idProducto === "" || cantidad === "") {
    alert("Selecciona un producto y escribe la cantidad");
    return;
  }

  cantidad = parseInt(cantidad);
  idProducto = parseInt(idProducto);

  if (cantidad <= 0) {
    alert("La cantidad debe ser mayor a 0");
    return;
  }

  let producto = productos.find(p => p.id === idProducto);
  let disponible = producto.stock - cantidadEnCarrito(idProducto);

  if (cantidad > disponible) {
    alert(`Solo hay ${disponible} unidades disponibles de ${producto.nombre}`);
    return;
  }

  carrito.push({
    idProducto: producto.id,
    nombre: producto.nombre,
    precioUnitario: producto.precio,
    cantidad: cantidad,
    subtotal: producto.precio * cantidad
  });

  document.getElementById("cantidad").value = "";

  poblarProductos();
  renderizarCarrito();
}

// QUITAR una línea del pedido actual (antes de cobrar)
function quitarDelCarrito(index) {
  carrito.splice(index, 1);
  poblarProductos();
  renderizarCarrito();
}

// MOSTRAR el carrito en pantalla
function renderizarCarrito() {
  let tabla = document.getElementById("carritoBody");
  tabla.innerHTML = "";
  let total = 0;

  carrito.forEach(function (item, i) {
    tabla.innerHTML += `
      <tr>
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
        <td>Lps ${item.precioUnitario}</td>
        <td>Lps ${item.subtotal}</td>
        <td><button onclick="quitarDelCarrito(${i})">❌</button></td>
      </tr>
    `;
    total += item.subtotal;
  });

  document.getElementById("totalCarrito").innerText = total;
  document.getElementById("resultadoCambio").innerText = "";
}

function totalDelCarrito() {
  return carrito.reduce((suma, item) => suma + item.subtotal, 0);
}

// VISTA PREVIA del cambio — no guarda nada, solo calcula
function calcularCambio() {
  let pagaCon = document.getElementById("pagaCon").value;
  let resultado = document.getElementById("resultadoCambio");

  if (carrito.length === 0) {
    resultado.innerText = "Agrega al menos un producto al pedido";
    resultado.style.color = "red";
    return;
  }

  if (pagaCon === "") {
    resultado.innerText = "Escribe con cuánto paga el cliente";
    resultado.style.color = "red";
    return;
  }

  pagaCon = parseFloat(pagaCon);
  let total = totalDelCarrito();

  if (pagaCon < total) {
    let faltante = total - pagaCon;
    resultado.innerText = `Falta Lps ${faltante.toFixed(2)} — el cliente no pagó suficiente`;
    resultado.style.color = "red";
    return;
  }

  let cambio = pagaCon - total;
  resultado.innerText = `Cambio a devolver: Lps ${cambio.toFixed(2)}`;
  resultado.style.color = "green";
}

// CONFIRMAR EL COBRO — aquí sí se guarda todo y se descuenta el stock real
function confirmarCobro() {
  if (carrito.length === 0) {
    alert("No hay productos en el pedido");
    return;
  }

  let pagaCon = document.getElementById("pagaCon").value;

  if (pagaCon === "") {
    alert("Escribe con cuánto paga el cliente antes de confirmar");
    return;
  }

  pagaCon = parseFloat(pagaCon);
  let total = totalDelCarrito();

  if (pagaCon < total) {
    alert("El cliente no ha pagado el total del pedido");
    return;
  }

  let hoy = new Date().toLocaleDateString("es-HN");

  carrito.forEach(function (item) {
    ventas.push({
      idProducto: item.idProducto,
      producto: item.nombre,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      total: item.subtotal,
      fecha: hoy
    });

    let producto = productos.find(p => p.id === item.idProducto);
    producto.stock -= item.cantidad;
  });

  localStorage.setItem("ventas", JSON.stringify(ventas));
  localStorage.setItem("productos", JSON.stringify(productos));

  let cambio = pagaCon - total;

  carrito = [];
  document.getElementById("pagaCon").value = "";
  document.getElementById("resultadoCambio").innerText = `Cobro registrado. Cambio entregado: Lps ${cambio.toFixed(2)}`;
  document.getElementById("resultadoCambio").style.color = "green";

  poblarProductos();
  renderizarCarrito();
  renderizarHistorial();
}

// ELIMINAR una venta ya confirmada del historial (devuelve el stock)
function eliminarVentaHistorial(index) {
  let venta = ventas[index];
  let confirmar = confirm("¿Eliminar esta venta? El stock se devolverá al inventario.");
  if (!confirmar) return;

  let producto = productos.find(p => p.id === venta.idProducto);
  if (producto) {
    producto.stock += venta.cantidad;
    localStorage.setItem("productos", JSON.stringify(productos));
  }

  ventas.splice(index, 1);
  localStorage.setItem("ventas", JSON.stringify(ventas));

  poblarProductos();
  renderizarHistorial();
}

// MOSTRAR el historial de ventas ya confirmadas
function renderizarHistorial() {
  let tabla = document.getElementById("historialVentas");
  let total = 0;
  tabla.innerHTML = "";

  ventas.forEach(function (v, i) {
    tabla.innerHTML += `
      <tr>
        <td>${v.producto}</td>
        <td>${v.cantidad}</td>
        <td>Lps ${v.precioUnitario}</td>
        <td>Lps ${v.total}</td>
        <td><button onclick="eliminarVentaHistorial(${i})">❌</button></td>
      </tr>
    `;
    total += v.total;
  });

  document.getElementById("totalHistorial").innerText = total;
}

// CARGAR AL INICIO
poblarProductos();
renderizarCarrito();
renderizarHistorial();