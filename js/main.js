const carritoDropdown = document.getElementById('container-cart-products');
const contadorProductos = document.getElementById('contador-productos');
const totalPagar = document.querySelector('.total-pagar');
const listaCarrito = document.querySelector('.container-cart-products');
const iconoCarrito = document.querySelector('.icon-container');
const checkbox = document.getElementById('check');
const content = document.querySelector('.content');
const botonesComprar = document.querySelectorAll('#btnComprar');
const botonFinalizar = document.querySelector('button.Enviar');
const cerrar = document.getElementsByClassName('salir');
const btnMenu = document.querySelector(".btnMenu");
const navUl = document.querySelector(".navul");
const completarTodo = document.querySelector('.completar-todo');
const dbUrl = '../json/db.json';

let carrito = {};
let productos = [];

// Menú hamburguesa
if (btnMenu && navUl) {
  btnMenu.addEventListener("click", () => {
    navUl.classList.toggle("show");

    // Verifica si el carrito está abierto y lo cierra
    if (carritoDropdown.style.display === 'block') {
      carritoDropdown.style.display = 'none';
    }
  });
} else {
  console.error("btnMenu o navUl no se encontraron en el DOM.");
}

// Mostrar/ocultar contenido del checkbox
if (checkbox && content) {
  checkbox.addEventListener('change', () => {
    content.style.display = checkbox.checked ? 'block' : 'none';
  });
}

// Funcionalidad del carrito
if (carritoDropdown && contadorProductos && totalPagar && listaCarrito && iconoCarrito) {

  async function cargarProductos() {
    try {
      const response = await fetch(dbUrl);
      if (!response.ok) {
        throw new Error('No se pudo cargar el archivo JSON');
      }
      const data = await response.json();
      productos = data.productos;
      asignarEventosBotones();
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  iconoCarrito.addEventListener('click', () => {
    carritoDropdown.style.display =
      carritoDropdown.style.display === 'none' || !carritoDropdown.style.display ? 'block' : 'none';
  });

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
    } else {
      console.error(`Producto con data-id ${dataId} no encontrado`);
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

      const cartTotal = document.querySelector('.cart-total');
      if (cartTotal) cartTotal.remove();
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
          <button class="quantity-button" onclick="event.stopPropagation(); aumentarCantidad('${producto}')">+</button>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-close" onclick="event.stopPropagation(); eliminarProducto('${producto}')">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>`;
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
        <a href="./finalizarcompra.html">
          <button id="openModal" class="boton botonModal" type="button">
            <div class="fondo-boton"></div>
            <h4>Finalizar Compra</h4>
          </button>
        </a>
      </div>`;

    carritoDropdown.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    mostrarCarritoEnProductosFin();
  }

  function mostrarCarritoEnProductosFin() {
    const productosFin = document.querySelector('.productos-fin');
    if (!productosFin) {
      console.error('El contenedor .productos-fin no existe en el DOM');
      return;
    }
    productosFin.innerHTML = '';

    if (!carrito || Object.keys(carrito).length === 0) {
      productosFin.innerHTML = '<p class="fin-text">El carrito está vacío, agregá productos al carrito</p>';
      return; 
    }

    for (const producto in carrito) {
      const item = carrito[producto];

      const productoHTML = document.createElement('div');
      productoHTML.classList.add('producto-fin-item');
      productoHTML.innerHTML = `
        <div class="info-producto-fin">
          <span class="cantidad-producto-fin">${item.cantidad}x</span>
          <p class="nombre-producto-fin">${producto}</p>
          <span class="precio-producto-carrito-fin">$${(item.precio * item.cantidad).toFixed(2)}</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-cancelar" onclick="eliminarProducto('${producto}')">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>
      `;
      productosFin.appendChild(productoHTML);
    }
  }

  function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      carrito = JSON.parse(carritoGuardado);
      actualizarCarrito();
    }
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

  function aumentarCantidad(nombreProducto) {
    if (carrito[nombreProducto]) {
      carrito[nombreProducto].cantidad++;
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

  function asignarEventosBotones() {
    const botonesComprar = document.querySelectorAll('#btnComprar');
    botonesComprar.forEach((boton) => {
      boton.addEventListener('click', agregarAlCarrito);
    });
  }

  

  cargarCarritoDesdeLocalStorage();
  cargarProductos();
}

if (botonFinalizar) {
  botonFinalizar.addEventListener('click', () => {
    const email = document.getElementById('email-compra');
    const pais = document.getElementById('Pais');
    const cp = document.getElementById('cp');
    const direccion = document.getElementById('direccion');
    const sucursalCheckbox = document.getElementById('sucursal');
    const tarjeta = document.getElementById('num-tarjeta');
    const titular = document.getElementById('titular');
    const cvv = document.getElementById('cvv');
    const exp = document.getElementById('exp');
    const errores = [];

    // Limpiar el mensaje de "completar todo" al iniciar la validación
    completarTodo.style.display = 'none';

    // Validaciones
    if (!email.value || !validarEmail(email.value)) {
      errores.push('Debes ingresar un correo válido.');
    }

    if (!pais.value) {
      errores.push('Debes seleccionar un país.');
    }

    if (!cp.value || !/^\d+$/.test(cp.value)) {
      errores.push('Debes ingresar un código postal válido.');
    }

    if (sucursalCheckbox.checked) {
      const sucursal = document.getElementById('sucursales');
      if (!sucursal.value) {
        errores.push('Debes seleccionar una sucursal para el retiro.');
      }
    } else {
      if (!direccion.value) {
        errores.push('Debes ingresar una dirección para el envío.');
      }
    }

    if (!tarjeta.value || !/^\d{16}$/.test(tarjeta.value)) {
      errores.push('Debes ingresar un número de tarjeta válido (16 dígitos).');
    }

    if (!titular.value) {
      errores.push('Debes ingresar el titular de la tarjeta.');
    }

    if (!cvv.value || !/^\d{3,4}$/.test(cvv.value)) {
      errores.push('Debes ingresar un CVV válido (3 o 4 dígitos).');
    }

    if (!exp.value) {
      errores.push('Debes ingresar la fecha de vencimiento de la tarjeta.');
    }

    // Si hay errores, mostrar el mensaje de completar todos los campos
    if (errores.length > 0) {
      completarTodo.style.display = 'flex';
    } else {
      // Si no hay errores, mostrar el popup
      const popup = document.createElement('div');
      popup.classList.add('popup-overlay');
      popup.innerHTML = `
        <div class="popupFin">
          <span class="verificado">¡Gracias por tu compra!</span>
          <button type="button" class="salir">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      `;
      document.body.appendChild(popup);

      const btnSalir = popup.querySelector('.salir');
      if (btnSalir) {
        btnSalir.addEventListener('click', () => {
          popup.remove();
        });
      }
    }
  });
};
  
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
