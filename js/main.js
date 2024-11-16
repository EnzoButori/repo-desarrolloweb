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
  <div class="finalizar-compra">
    <button id="openModal" class="finalizar boton botonModal" type="button">
      <div class="fondo-boton"></div>
      <h4>Finalizar Compra</h4>
    </button>
  </div>
`;
}

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openModal");
  const closeBtn = document.getElementById("closeModal");
  const modal = document.getElementById("modal");

  
  if (openBtn) {
    openBtn.addEventListener("click", () => {
      modal.classList.add("open"); 
    });
  }

  
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("open"); 
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const tiempoEspera = 60 * 60 * 1000; 
  const tiempoUltimaInteraccion = localStorage.getItem('tiempoUltimaInteraccion');
  const ahora = new Date().getTime();

  if (!tiempoUltimaInteraccion || (ahora - tiempoUltimaInteraccion) > tiempoEspera) {
      setTimeout(function() {
          let overlay = document.createElement('div');
          overlay.classList.add('overlay');
          
          let popup = document.createElement('div');
          popup.classList.add('inicio-sesion');

          popup.innerHTML = `
              <h2>Iniciar Sesión</h2>
              <input class="inicio-controls" placeholder="Email" type="email" name="email" id="email">
              <input class="inicio-controls" placeholder="Contraseña" type="password" name="contraseña" id="contraseña">
              <span id="show-password" class="fa fa-eye-slash" aria-hidden="true"></span>
              <button class="inicio-boton" id="enviar" class="iniciar" type="button">
                  <h4>Enviar</h4>
              </button>
              <button class="invitado" id="invitado-boton" type="button">
                  <h6>Continuar como invitado</h6>
              </button>
          `;

          document.body.appendChild(overlay);
          document.body.appendChild(popup);

          const contraseñaInput = document.getElementById('contraseña');
          const mostrarContraseña = document.getElementById('show-password');
          const enviarBoton = document.getElementById('enviar');
          const invitadoBoton = document.getElementById('invitado-boton');

          if (contraseñaInput && mostrarContraseña) {
              mostrarContraseña.addEventListener('click', () => {
                  if (contraseñaInput.type === 'password') {
                      contraseñaInput.type = 'text';
                      mostrarContraseña.classList.remove('fa-eye-slash');
                      mostrarContraseña.classList.add('fa-eye');
                  } else {
                      contraseñaInput.type = 'password';
                      mostrarContraseña.classList.remove('fa-eye');
                      mostrarContraseña.classList.add('fa-eye-slash');
                  }
              });
          } else {
              console.error('No se encontraron los elementos de contraseña o mostrar contraseña');
          }

          enviarBoton.addEventListener('click', async (event) => {
              event.preventDefault(); 
              
              const email = document.getElementById('email').value.trim().toLowerCase();
              const contraseña = document.getElementById('contraseña').value.trim();

              try {
                  const response = await fetch('http://localhost:3000/usuarios');
                  const usuarios = await response.json();

                  const usuarioEncontrado = usuarios.find(user => user.email === email && user.password === contraseña);

                  if (usuarioEncontrado) {
                      localStorage.setItem('popupShown', 'true'); 
                      localStorage.setItem('tiempoUltimaInteraccion', ahora); 
                      document.body.removeChild(popup); 
                      document.body.removeChild(overlay); 
                  } else {
                      alert('Email o contraseña incorrectos');
                  }
              } catch (error) {
                  console.error('Error al verificar el usuario', error);
                  alert('Hubo un error al verificar tu información. Por favor, intenta de nuevo.');
              }
          });

          invitadoBoton.addEventListener('click', () => {
              localStorage.setItem('popupShown', 'true');
              document.body.removeChild(popup); 
              document.body.removeChild(overlay);
          });

      }, 5000);
  }
});

let numeroDeOrden = 0;

function crearModal() {
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

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("finalizar")) {
    crearModal();
  }
});


window.onload = cargarCarritoDesdeLocalStorage;


