// Variables globales
const carritoDropdown = document.getElementById('container-cart-products');
const contadorProductos = document.getElementById('contador-productos');
const totalPagar = document.querySelector('.total-pagar');
const listaCarrito = document.querySelector('.container-cart-products');
const iconoCarrito = document.querySelector('.icon-container');
const btnComprar = document.getElementById('btnComprar');

let carrito = {};

// Cargar carrito desde LocalStorage
function cargarCarritoDesdeLocalStorage() {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCarrito();
  }
}

// Guardar carrito en LocalStorage
function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Mostrar/ocultar el carrito
function toggleCarrito() {
  carritoDropdown.style.display = carritoDropdown.style.display === 'none' || !carritoDropdown.style.display ? 'block' : 'none';

  if (carritoDropdown.style.display === 'block') {
    const cerrarCarrito = (event) => {
      if (!carritoDropdown.contains(event.target) && event.target !== iconoCarrito) {
        carritoDropdown.style.display = 'none';
        document.removeEventListener('click', cerrarCarrito);
      }
    };
    setTimeout(() => document.addEventListener('click', cerrarCarrito), 0);
  }
}

// Evitar cierre accidental del carrito al interactuar con él
carritoDropdown.addEventListener('click', (event) => {
  event.stopPropagation();
});

// Agregar producto al carrito
function agregarAlCarrito(producto) {
  if (carrito[producto.nombre]) {
    carrito[producto.nombre].cantidad++;
  } else {
    carrito[producto.nombre] = {
      ...producto,
      cantidad: 1,
    };
  }
  actualizarCarrito();
  guardarCarritoEnLocalStorage();
}

// Quitar un producto del carrito
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

// Eliminar un producto completamente del carrito
function eliminarProducto(nombreProducto) {
  if (carrito[nombreProducto]) {
    delete carrito[nombreProducto];
    actualizarCarrito();
    guardarCarritoEnLocalStorage();
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
      </svg>
    `;
    listaCarrito.appendChild(cartItem);
  }

  totalPagar.innerText = `$${total.toFixed(2)}`;
  contadorProductos.innerText = totalItems;
}

// Mostrar popup de inicio de sesión
function mostrarPopupInicioSesion() {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  
  const popup = document.createElement('div');
  popup.classList.add('inicio-sesion');

  popup.innerHTML = `
    <h2>Iniciar Sesión</h2>
    <input class="inicio-controls" placeholder="Email" type="email" name="email" id="email">
    <input class="inicio-controls" placeholder="Contraseña" type="password" name="contraseña" id="contraseña">
    <span id="show-password" class="fa fa-eye-slash" aria-hidden="true"></span>
    <button class="inicio-boton" id="enviar" type="button">
        <h4>Enviar</h4>
    </button>
    <button class="invitado" id="continuar-invitado" type="button">
        <h6>Continuar como Invitado</h6>
    </button>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  const contraseñaInput = popup.querySelector('#contraseña');
  const mostrarContraseña = popup.querySelector('#show-password');

  mostrarContraseña.addEventListener('click', () => {
    const isPassword = contraseñaInput.type === 'password';
    contraseñaInput.type = isPassword ? 'text' : 'password';
    mostrarContraseña.classList.toggle('fa-eye-slash', !isPassword);
    mostrarContraseña.classList.toggle('fa-eye', isPassword);
  });

  popup.querySelector('#continuar-invitado').addEventListener('click', () => {
    overlay.remove();
    popup.remove();
  });

  popup.querySelector('#enviar').addEventListener('click', async () => {
    try {
      const email = popup.querySelector('#email').value.trim();
      const password = popup.querySelector('#contraseña').value.trim();
      
      const response = await fetch('http://localhost:3000/usuarios');
      const usuarios = await response.json();

      const usuarioEncontrado = usuarios.find(user => user.email === email && user.password === password);

      if (usuarioEncontrado) {
        overlay.remove();
        popup.remove();
        localStorage.setItem('tiempoUltimaInteraccion', Date.now());
      }
    } catch {
      // Manejar errores
    }
  });
}

// Inicializar aplicación
function inicializar() {
  iconoCarrito.addEventListener('click', toggleCarrito);
  cargarCarritoDesdeLocalStorage();

  const tiempoUltimaInteraccion = localStorage.getItem('tiempoUltimaInteraccion');
  const tiempoEspera = 60 * 60 * 1000;
  if (!tiempoUltimaInteraccion || (Date.now() - tiempoUltimaInteraccion > tiempoEspera)) {
    setTimeout(mostrarPopupInicioSesion, 5000);
  }
}

// Cargar todo al iniciar
document.addEventListener('DOMContentLoaded', inicializar);
