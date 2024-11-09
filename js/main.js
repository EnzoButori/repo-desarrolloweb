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

// arreglo del cierre de carrito accidental
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

  // Recorrer el carrito y añadir cada producto a la lista
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

  let cartTotal = document.querySelector('.cart-total');
  if (!cartTotal) {
    cartTotal = document.createElement('div');
    cartTotal.classList.add('cart-total');
    listaCarrito.appendChild(cartTotal);
  }

  cartTotal.innerHTML = `
    <h3>Total:</h3>
    <span class="total-pagar">$${total.toFixed(2)}</span>
  `;
}

window.onload = cargarCarritoDesdeLocalStorage;


