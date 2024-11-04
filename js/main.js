document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('check');
  const content = document.querySelector('.content');

 
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      
      content.style.display = 'block';
    } else {
      
      content.style.display = 'none';
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.querySelector('.navbar-toggler');
});


const carritoDropdown = document.getElementById('container-cart-products');
const contadorProductos = document.getElementById('contador-productos');
const totalPagar = document.getElementsByClassName('total-pagar')[0];
const listaCarrito = document.getElementsByClassName('cart-product')[0];
const iconoCarrito = document.getElementById('icon-container');

let carrito = {};

function cargarCarritoDesdeLocalStorage(){
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCarrito();
  }
}

function guardarCarritoEnLocalStorage(){
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

iconoCarrito.addEventListener('click', ()=> {
  carritoDropdown.style.display = carritoDropdown.style.display === 'none' || carritoDropdown.style.display === '' ? 'block' : 'none';
});

function agregarAlCarrito (nombreProducto, precio) {
  if (!carrito[nombreProducto]){
    carrito[nombreProducto] = { cantidad: 1, precio };
  } else {
    carrito[nombreProducto].cantidad++;
  }
  actualizarCarrito();
  guardarCarritoEnLocalStorage();
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
                <button class="quantity-button" onclick="quitarDelCarrito('${producto}')">-</button>
                <button class="quantity-button" onclick="agregarAlCarrito('${producto}', ${item.precio})">+</button>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-close" onclick="eliminarProducto('${producto}')">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        `;
        listaCarrito.appendChild(cartItem);
    }

    totalPagar.innerText = `$${total.toFixed(2)}`;
    contadorProductos.innerText = totalItems;
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


function eliminarProducto(nombreProducto) {
    if (carrito[nombreProducto]) {
        delete carrito[nombreProducto];
        actualizarCarrito();
        guardarCarritoEnLocalStorage();
    }
}


window.onload = cargarCarritoDesdeLocalStorage;

