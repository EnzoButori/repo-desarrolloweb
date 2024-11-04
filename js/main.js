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


// iniciamos con carrito vacio
const carrito = {};

// apenas cargue la pagina el dropdown esta oculto
document.addEventListener('DOMContentLoaded', function () {
  const dropdown = document.getElementById('carrito-dropdown');
  dropdown.style.display = 'none';
});

// un toggle para mostrar/ocultar el carrito
function toggleCarritoDropdown() {
  const dropdown = document.getElementById('carrito-dropdown');
  if (dropdown.style.display === 'none' || dropdown.style.display === '') {
    dropdown.style.display = 'block'; 
  } else {
    dropdown.style.display = 'none';
  }
}

// funcion para que si el usuario clickea fuera del carrito, este se cierra
document.addEventListener('click', function (event) {
  const dropdown = document.getElementById('carrito-dropdown');
  const iconoCarrito = document.querySelector('.carrito-icono');
  
  if (!dropdown.contains(event.target) && !iconoCarrito.contains(event.target)) {
    dropdown.style.display = 'none';
  }
});

// función para agregar productos al carrito
function agregarAlCarrito(nombreProducto, precio) {
  if (!carrito[nombreProducto]) {
    carrito[nombreProducto] = { cantidad: 0, precio };
  }
  carrito[nombreProducto].cantidad++;
  actualizarCarrito();
}

// función para actualizar el carrito y el total
function actualizarCarrito() {
  const lista = document.getElementById('carrito-lista');
  lista.innerHTML = '';
  let total = 0;

  for (const producto in carrito) {
    const item = carrito[producto];
    total += item.precio * item.cantidad;

    const li = document.createElement('li');
    li.innerHTML = `
      ${producto} (x${item.cantidad}) 
      <button onclick="quitarDelCarrito('${producto}')">-</button>
      <button onclick="agregarAlCarrito('${producto}', ${item.precio})">+</button>
    `;
    lista.appendChild(li);
  }

  document.getElementById('precio-total').innerText = total.toFixed(2);
  document.getElementById('contador-carrito').innerText = Object.values(carrito).reduce((sum, item) => sum + item.cantidad, 0);
}

// función para sacar productos
function quitarDelCarrito(nombreProducto) {
  if (carrito[nombreProducto]) {
    carrito[nombreProducto].cantidad--;
    if (carrito[nombreProducto].cantidad <= 0) {
      delete carrito[nombreProducto];
    }
    actualizarCarrito();
  }
}
