// Aparecer al scrollear
const elementosAparecer = document.querySelectorAll('.aparecer');

const observer = new IntersectionObserver((entradas, observador) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      
      entrada.target.classList.add('aparecer-visible');
      
      observador.unobserve(entrada.target);
    }
  });
}, {
  threshold: 0.1
});

elementosAparecer.forEach(elemento => {
  observer.observe(elemento);
});

// Estado del carrito
const carrito = {};

// Ocultar el dropdown al cargar la página
document.addEventListener('DOMContentLoaded', function () {
  const dropdown = document.getElementById('carrito-dropdown');
  dropdown.style.display = 'none';  // Ocultar el dropdown al cargar la página
});

// Función para mostrar/ocultar el dropdown del carrito
function toggleCarritoDropdown() {
  const dropdown = document.getElementById('carrito-dropdown');
  if (dropdown.style.display === 'none' || dropdown.style.display === '') {
    dropdown.style.display = 'block';  // Mostrar si está oculto
  } else {
    dropdown.style.display = 'none';   // Ocultar si está visible
  }
}

// Cerrar el dropdown si se hace clic fuera de él
document.addEventListener('click', function (event) {
  const dropdown = document.getElementById('carrito-dropdown');
  const iconoCarrito = document.querySelector('.carrito-icono');
  
  // Verificar si el clic fue fuera del dropdown y del icono
  if (!dropdown.contains(event.target) && !iconoCarrito.contains(event.target)) {
    dropdown.style.display = 'none';
  }
});

// Función para agregar productos al carrito
function agregarAlCarrito(nombreProducto, precio) {
  if (!carrito[nombreProducto]) {
    carrito[nombreProducto] = { cantidad: 0, precio };
  }
  carrito[nombreProducto].cantidad++;
  actualizarCarrito();
}

// Función para actualizar el carrito y el total
function actualizarCarrito() {
  const lista = document.getElementById('carrito-lista');
  lista.innerHTML = ''; // Limpia la lista
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

// Función para quitar productos del carrito
function quitarDelCarrito(nombreProducto) {
  if (carrito[nombreProducto]) {
    carrito[nombreProducto].cantidad--;
    if (carrito[nombreProducto].cantidad <= 0) {
      delete carrito[nombreProducto];
    }
    actualizarCarrito();
  }
}
