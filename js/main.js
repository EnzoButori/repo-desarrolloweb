const carritoDropdown = document.getElementById('container-cart-products');
const contadorProductos = document.getElementById('contador-productos');
const totalPagar = document.querySelector('.total-pagar');
const listaCarrito = document.querySelector('.container-cart-products');
const iconoCarrito = document.querySelector('.icon-container');

let carrito = {};
let productos = [];

// Comprobar si los elementos del carrito existen en el DOM
if (carritoDropdown && contadorProductos && totalPagar && listaCarrito && iconoCarrito) {
  const temporizadorHTML = document.createElement('p'); // Elemento para mostrar el temporizador
  temporizadorHTML.classList.add('carrito-temporizador');
  listaCarrito.parentElement.appendChild(temporizadorHTML);

  let temporizador = null;

  // Ruta al archivo JSON
  const dbUrl = '../json/db.json';

  // Cargar productos desde el JSON
  async function cargarProductos() {
    try {
      const response = await fetch(dbUrl);
      if (!response.ok) {
        throw new Error('No se pudo cargar el archivo JSON');
      }
      const data = await response.json();
      productos = data.productos; // Asegúrate de acceder correctamente a la clave `productos`
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  // Mostrar/ocultar el carrito
  iconoCarrito.addEventListener('click', () => {
    carritoDropdown.style.display =
      carritoDropdown.style.display === 'none' || !carritoDropdown.style.display ? 'block' : 'none';
  });

  // Agregar producto al carrito
  function agregarAlCarrito(event) {
    const button = event.target;
    const dataId = button.getAttribute('data-id');
    const productoSeleccionado = productos.find((producto) => producto.id.toString() === dataId);

    if (productoSeleccionado) {
      if (carrito[productoSeleccionado.modelo]) {
        carrito[productoSeleccionado.modelo].cantidad++;
      } else {
        carrito[productoSeleccionado.modelo] = {
          ...productoSeleccionado,
          cantidad: 1,
        };
      }
      actualizarCarrito();
      guardarCarritoEnLocalStorage();
      if (!temporizador) iniciarTemporizador();
    } else {
      console.error(`Producto con data-id ${dataId} no encontrado`);
    }
  }

  // Actualizar la visualización del carrito
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
        </svg>`
      ;
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
    <div class="finalizar-compra">
      <button id="openModal" class="boton botonModal" type="button">
        <div class="fondo-boton"></div>
        <h4>Finalizar Compra</h4>
      </button>
    </div>`
  ;
  }

    carritoDropdown.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  // Guardar carrito en LocalStorage
  function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  // Asignar eventos a botones "Añadir al carrito"
  function asignarEventosBotones() {
    const botonesComprar = document.querySelectorAll('#btnComprar');
    botonesComprar.forEach((boton) => {
      boton.addEventListener('click', agregarAlCarrito);
    });
  }

  // Cargar productos y carrito al iniciar la página
  window.onload = async () => {
    await cargarProductos();
    cargarCarritoDesdeLocalStorage();
    asignarEventosBotones();
  };

  // Cargar carrito desde LocalStorage
  function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      carrito = JSON.parse(carritoGuardado);
      actualizarCarrito();
    }
  }



