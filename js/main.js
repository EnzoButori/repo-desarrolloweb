const carritoDropdown = document.getElementById('container-cart-products');
const contadorProductos = document.getElementById('contador-productos');
const totalPagar = document.querySelector('.total-pagar');
const listaCarrito = document.querySelector('.container-cart-products');
const iconoCarrito = document.querySelector('.icon-container');
const checkbox = document.getElementById('check');
const content = document.querySelector('.content');
const botonesComprar = document.querySelectorAll('#btnComprar');
const botonFinalizar = document.getElementsByClassName('Enviar');
const emailInput = document.getElementById('email-compra');
const cpInput = document.getElementById('cp');
const paisSelect = document.getElementById('Pais');
const cerrar = document.getElementsByClassName('salir');
const btnMenu = document.querySelector(".btnMenu");
const navUl = document.querySelector(".navul");
const dbUrl = '../json/db.json';

let carrito = {};
let productos = [];


if (btnMenu && navUl) {
  btnMenu.addEventListener("click", () => {
    navUl.classList.toggle("show"); 
  });
} else {
  console.error("btnMenu o navUl no se encontraron en el DOM.");
}

if (checkbox && content) {
  checkbox.addEventListener('change', () => {
    content.style.display = checkbox.checked ? 'block' : 'none';
  });
}

if (carritoDropdown && contadorProductos && totalPagar && listaCarrito && iconoCarrito) {
  const temporizadorHTML = document.createElement('p');
  temporizadorHTML.classList.add('carrito-temporizador');
  listaCarrito.parentElement.appendChild(temporizadorHTML);

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

  if (botonFinalizar.length > 0) {
      Array.from(botonFinalizar).forEach((boton) => {
        boton.addEventListener('click', () => {
          const popup = document.createElement('div');
          popup.classList.add('popup-overlay');
          popup.innerHTML = `
            <div class="popupFin">
              <span class="verificado">
                <?xml version="1.0" ?><svg id="Layer_1" style="enable-background:new 0 0 120 120;" version="1.1" viewBox="0 0 120 120" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><style type="text/css">
                    .st0{fill:#00D566;}
                    .st1{opacity:0.15;}
                    .st2{fill:#FFFFFF;}
                  </style><g><path class="st0" d="M99.5,52.8l-1.9,4.7c-0.6,1.6-0.6,3.3,0,4.9l1.9,4.7c1.1,2.8,0.2,6-2.3,7.8L93,77.8c-1.4,1-2.3,2.5-2.7,4.1   l-0.9,5c-0.6,3-3.1,5.2-6.1,5.3l-5.1,0.2c-1.7,0.1-3.3,0.8-4.5,2l-3.5,3.7c-2.1,2.2-5.4,2.7-8,1.2l-4.4-2.6   c-1.5-0.9-3.2-1.1-4.9-0.7l-5,1.2c-2.9,0.7-6-0.7-7.4-3.4l-2.3-4.6c-0.8-1.5-2.1-2.7-3.7-3.2l-4.8-1.6c-2.9-1-4.7-3.8-4.4-6.8   l0.5-5.1c0.2-1.7-0.3-3.4-1.4-4.7l-3.2-4c-1.9-2.4-1.9-5.7,0-8.1l3.2-4c1.1-1.3,1.6-3,1.4-4.7l-0.5-5.1c-0.3-3,1.5-5.8,4.4-6.8   l4.8-1.6c1.6-0.5,2.9-1.7,3.7-3.2l2.3-4.6c1.4-2.7,4.4-4.1,7.4-3.4l5,1.2c1.6,0.4,3.4,0.2,4.9-0.7l4.4-2.6c2.6-1.5,5.9-1.1,8,1.2   l3.5,3.7c1.2,1.2,2.8,2,4.5,2l5.1,0.2c3,0.1,5.6,2.3,6.1,5.3l0.9,5c0.3,1.7,1.3,3.2,2.7,4.1l4.2,2.9C99.7,46.8,100.7,50,99.5,52.8z   "/><g class="st1"><path d="M43.4,93.5l-2.3-4.6c-0.8-1.5-2.1-2.7-3.7-3.2l-4.8-1.6c-2.9-1-4.7-3.8-4.4-6.8l0.5-5.1c0.2-1.7-0.3-3.4-1.4-4.7l-3.2-4    c-1.9-2.4-1.9-5.7,0-8.1l3.2-4c1.1-1.3,1.6-3,1.4-4.7l-0.5-5.1c-0.3-3,1.5-5.8,4.4-6.8l4.8-1.6c1.6-0.5,2.9-1.7,3.7-3.2l2.3-4.6    c0.8-1.6,2.2-2.7,3.7-3.2c-2.7-0.4-5.4,1-6.6,3.5l-2.3,4.6c-0.8,1.5-2.1,2.7-3.7,3.2l-4.8,1.6c-2.9,1-4.7,3.8-4.4,6.8l0.5,5.1    c0.2,1.7-0.3,3.4-1.4,4.7l-3.2,4c-1.9,2.4-1.9,5.7,0,8.1l3.2,4c1.1,1.3,1.6,3,1.4,4.7l-0.5,5.1c-0.3,3,1.5,5.8,4.4,6.8l4.8,1.6    c1.6,0.5,2.9,1.7,3.7,3.2l2.3,4.6c1.4,2.7,4.4,4.1,7.4,3.4l0.6-0.1C46.3,96.7,44.4,95.5,43.4,93.5z"/><path d="M60.6,22.5l4.4-2.6c0.4-0.2,0.8-0.4,1.2-0.5c-1.4-0.2-2.9,0.1-4.1,0.8l-4.4,2.6c-0.4,0.2-0.8,0.4-1.2,0.5    C57.9,23.5,59.3,23.3,60.6,22.5z"/><path d="M81,92c-0.5,0-1,0.1-1.4,0.2l3.6-0.2c0.5,0,0.9-0.1,1.4-0.2L81,92z"/><path d="M65,98.9l-4.4-2.6c-1.5-0.9-3.2-1.1-4.9-0.7l-0.6,0.1c0.9,0.1,1.7,0.4,2.5,0.8l4.4,2.6c1.7,1,3.6,1.1,5.4,0.5    C66.6,99.6,65.8,99.4,65,98.9z"/></g><polyline class="st0" points="44,53.6 56.5,67.9 82.1,47.3  "/><path class="st2" d="M53.5,75.3c-1.4,0-2.8-0.6-3.8-1.7L37.2,59.3c-1.8-2.1-1.6-5.2,0.4-7.1c2.1-1.8,5.2-1.6,7.1,0.4l9.4,10.7   l21.9-17.6c2.1-1.7,5.3-1.4,7,0.8c1.7,2.2,1.4,5.3-0.8,7L56.6,74.2C55.7,74.9,54.6,75.3,53.5,75.3z"/></g></svg>
              </span>
              <h4 class="comprado">Gracias por tu compra!</h4>
              <button type="button" class="salir">
                <h6>Cerrar</h6>
              </button>
            </div>
          `;
          document.body.appendChild(popup);
        });
      });
  }
  
  
  


  window.onload = async () => {
    await cargarProductos();
    cargarCarritoDesdeLocalStorage();
  };
}