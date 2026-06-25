// Cargar productos guardados o iniciar arreglo vacío
let productos = JSON.parse(localStorage.getItem("productos")) || [];

// Guarda el id del producto que se está editando (null = modo "crear nuevo")
let idEditando = null;

// GUARDAR (crea o actualiza, según idEditando)
function guardarProducto() {
  let nombre = document.getElementById("nombre").value.trim();
  let precio = document.getElementById("precio").value;
  let stock = document.getElementById("stock").value;
  let categoria = document.getElementById("categoria").value.trim();

  if (nombre === "" || precio === "" || stock === "" || categoria === "") {
    alert("Completa todos los campos");
    return;
  }

  if (idEditando === null) {
    // MODO CREAR
    let producto = {
      id: Date.now(),
      nombre: nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      categoria: categoria
    };
    productos.push(producto);
  } else {
    // MODO ACTUALIZAR
    let producto = productos.find(p => p.id === idEditando);
    producto.nombre = nombre;
    producto.precio = parseFloat(precio);
    producto.stock = parseInt(stock);
    producto.categoria = categoria;
    idEditando = null; // salimos del modo edición
    document.getElementById("btnGuardar").innerText = "Agregar producto";
  }

  localStorage.setItem("productos", JSON.stringify(productos));
  limpiarFormulario();
  renderizarProductos();
}

// CARGAR datos de un producto en el formulario para editarlo
function editarProducto(id) {
  let producto = productos.find(p => p.id === id);

  document.getElementById("nombre").value = producto.nombre;
  document.getElementById("precio").value = producto.precio;
  document.getElementById("stock").value = producto.stock;
  document.getElementById("categoria").value = producto.categoria;

  idEditando = id;
  document.getElementById("btnGuardar").innerText = "Guardar cambios";
}

// ELIMINAR producto
function eliminarProducto(id) {
  let confirmar = confirm("¿Seguro que deseas eliminar este producto?");
  if (!confirmar) return;

  productos = productos.filter(p => p.id !== id);
  localStorage.setItem("productos", JSON.stringify(productos));
  renderizarProductos();
}

// LIMPIAR formulario
function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("categoria").value = "";
}

// MOSTRAR productos en la tabla
function renderizarProductos() {
  let tabla = document.getElementById("tablaProductos");
  tabla.innerHTML = "";

  productos.forEach(function (p) {
    tabla.innerHTML += `
      <tr>
        <td>${p.nombre}</td>
        <td>Lps ${p.precio}</td>
        <td>${p.stock}</td>
        <td>${p.categoria}</td>
        <td>
          <button onclick="editarProducto(${p.id})">✏️</button>
          <button onclick="eliminarProducto(${p.id})">❌</button>
        </td>
      </tr>
    `;
  });
}

// CARGAR AL INICIO
renderizarProductos();