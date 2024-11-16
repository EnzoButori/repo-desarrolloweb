document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('check');
  const content = document.querySelector('.content');

  // Mostrar y ocultar contenido del "More..."
  checkbox.addEventListener('change', () => {
    content.style.display = checkbox.checked ? 'block' : 'none';
  });
});

const carritoDropdown = document.getElementById('container-cart-products');
const contadorProductos = document.getElementById('contador-productos');
const totalPagar = document.querySelector('.total-pagar');
const listaCarrito = document.querySelector('.container-cart-products');
const iconoCarrito = document.querySelector('.icon-container');

let carrito = {};

// Función para cargar el carrito desde el almacenamiento local
function cargarCarritoDesdeLocalStorage() {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCarrito();
  }
}

// Guardar el carrito en el almacenamiento local
function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Mostrar y ocultar el carrito al hacer clic en el ícono
iconoCarrito.addEventListener('click', (event) => {
  event.stopPropagation();
  carritoDropdown.style.display = carritoDropdown.style.display === 'none' || carritoDropdown.style.display === '' ? 'block' : 'none';
});

// Evitar cierre accidental del carrito
carritoDropdown.addEventListener('click', (event) => {
  event.stopPropagation();
});

// Cerrar el carrito al hacer clic fuera de él
document.addEventListener('click', (event) => {
  if (!carritoDropdown.contains(event.target) && event.target !== iconoCarrito) {
    carritoDropdown.style.display = 'none';
  }
});

function agregarAlCarrito(nombreProducto, precio) {
  if (!carrito[nombreProducto]) {
    carrito[nombreProducto] = { cantidad: 1, precio };
  } else {
    carrito[nombreProducto].cantidad++;
  }
  actualizarCarrito();
  guardarCarritoEnLocalStorage();
}

function quitarDelCarrito(nombreProducto) {
  if (carrito[nombreProducto]) {
    carrito[nombreProducto].cantidad--;
    if (carrito[nombreProducto].cantidad <= 0) {
      delete carrito[nombreProducto];
    }
    actualizarCarrito();
    guardarCarritoEnLocalStorage();
  }
}

function eliminarProducto(nombreProducto) {
  if (carrito[nombreProducto]) {
    delete carrito[nombreProducto];
    actualizarCarrito();
    guardarCarritoEnLocalStorage();
  }
}

function actualizarCarrito() {
  listaCarrito.innerHTML = '';
  let total = 0;
  let totalItems = 0;

  if (Object.keys(carrito).length === 0) {
    listaCarrito.innerHTML = '<p class="empty-cart-message">El carrito está vacío</p>';
    totalPagar.innerText = `$0.00`;
    contadorProductos.innerText = 0;
    return;
  }

  for (const producto in carrito) {
    const item = carrito[producto];
    total += item.precio * item.cantidad;
    totalItems += item.cantidad;

    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-product');
    cartItem.innerHTML = `
      <div class="info-cart-product">
        <span class="cantidad-productos-carrito">${item.cantidad}</span>
        <p class="nombre-producto">${producto}</p>
        <span class="precio-producto-carrito">$${(item.precio * item.cantidad).toFixed(2)}</span>
      </div>
      <div class="quantity-buttons">
        <button class="quantity-button" onclick="event.stopPropagation(); quitarDelCarrito('${producto}')">-</button>
        <button class="quantity-button" onclick="event.stopPropagation(); agregarAlCarrito('${producto}', ${item.precio})">+</button>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-close" onclick="event.stopPropagation(); eliminarProducto('${producto}')">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    `;
    listaCarrito.appendChild(cartItem);
  }

  totalPagar.innerText = `$${total.toFixed(2)}`;
  contadorProductos.innerText = totalItems;

  const cartTotal = document.querySelector('.cart-total') || document.createElement('div');
  cartTotal.classList.add('cart-total');
  listaCarrito.appendChild(cartTotal);

  cartTotal.innerHTML = `
    <h3>Total:</h3>
    <span class="total-pagar">$${total.toFixed(2)}</span>
    <div class="finalizar-compra">
      <button id="openModal" class="finalizar boton" type="button">
        <div class="fondo-boton"></div>
        <h4>Finalizar Compra</h4>
      </button>
    </div>
  `;
}

document.body.addEventListener("click", (event) => {
  if (e.target.querySelector('.finalizar')) {
    console.log("Clase 'finalizar' detectada, ejecutando crearModal()");
    crearModal();
  }
});

function crearModal() {
  console.log("crearModal ejecutado");
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");

  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <span id="closeEmailModal" class="close">&times;</span>
      <h2>Confirmar Pedido</h2>
      <form id="emailForm">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required>
        
        <label for="email">Correo Electrónico:</label>
        <input type="email" id="email" name="email" required>
        
        <p><strong>Total del Pedido:</strong> <span id="totalPedido"></span></p>
        <p><strong>Productos:</strong></p>
        <ul id="listaProductos"></ul>
        
        <button type="button" class="terminar">Enviar Pedido</button>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  const totalPedido = document.getElementById("totalPedido");
  const listaProductos = document.getElementById("listaProductos");

  totalPedido.textContent = `$${Object.values(carrito).reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)}`;
  listaProductos.innerHTML = "";

  for (const [nombre, datos] of Object.entries(carrito)) {
    const li = document.createElement("li");
    li.textContent = `${datos.cantidad}x ${nombre} ($${datos.precio.toFixed(2)} c/u)`;
    listaProductos.appendChild(li);
  }

  document.getElementById("closeEmailModal").addEventListener("click", () => {
    document.body.removeChild(overlay);
    document.body.removeChild(modal);
  });

  document.querySelector(".terminar").addEventListener("click", async () => {
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!nombre || !email) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const params = {
      numeroOrden: numeroDeOrden++,
      nombreCliente: nombre,
      correoCliente: email,
      productos: Object.entries(carrito)
        .map(([nombre, datos]) => `${datos.cantidad}x ${nombre} ($${datos.precio.toFixed(2)} c/u)`)
        .join("\n"),
      total: `$${Object.values(carrito).reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2)}`
    };

    try {
      const response = await emailjs.send("service_ts8cc9h", "template_cnvq1or", params, "eZAFjxJPXInJm7B3t");

      alert("Pedido enviado correctamente.");
      console.log("Correo enviado:", response);

      carrito = {};
      actualizarCarrito();

      document.body.removeChild(overlay);
      document.body.removeChild(modal);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      alert("Hubo un error al enviar tu pedido. Por favor, intenta de nuevo.");
    }
  });
}


window.onload = cargarCarritoDesdeLocalStorage;