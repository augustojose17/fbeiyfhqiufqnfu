document.addEventListener('DOMContentLoaded', () => {
    const carritoLink = document.getElementById('carrito-link');
    const carritoContenedor = document.getElementById('carrito-contenedor');
    const botonCerrar = document.getElementById('boton-cerrar');
    const cartItemsElement = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    let totalPrice = 0;
    let cart = [];

    // Mostrar/ocultar carrito al hacer clic en el enlace de carrito
    carritoLink.addEventListener('click', (e) => {
        e.preventDefault();
        carritoContenedor.classList.toggle('mostrar');
        updateCart();
    });

    // Cerrar carrito al hacer clic en el botón de cerrar
    botonCerrar.addEventListener('click', () => {
        carritoContenedor.classList.remove('mostrar');
    });

    // Agregar evento clic a todos los botones "Añadir al carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.getAttribute('data-product-id');
            const productName = event.target.getAttribute('data-product-name');
            const productPrice = parseFloat(event.target.previousElementSibling.textContent.replace('Precio: L', '').replace(',', ''));
            const productImage = document.querySelector(`#product${productId} img`).src;

            addToCart(productId, productName, productPrice, productImage);
        });
    });

    // Función para añadir producto al carrito
    function addToCart(productId, productName, productPrice, productImage) {
        // Comprobar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            // Si el producto ya está en el carrito, aumentar su cantidad
            existingItem.quantity++;
        } else {
            // Si es un nuevo producto, agregarlo al carrito
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1,
                image: productImage
            });
        }

        // Guardar el carrito en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Actualizar la visualización del carrito
        updateCart();
    }

    // Función para actualizar el carrito en la interfaz
    function updateCart() {
        cartItemsElement.innerHTML = '';
        totalPrice = 0;

        // Obtener el carrito desde localStorage
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = storedCart;

        // Recorrer cada elemento en el carrito
        cart.forEach(item => {
            // Crear contenedor de elemento de carrito
            const cartItemContainer = document.createElement('div');
            cartItemContainer.classList.add('cart-item-container');

            // Crear elemento de artículo de carrito
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            // Crear imagen de producto
            const productImage = document.createElement('img');
            productImage.src = item.image;
            productImage.classList.add('product-image');
            productImage.alt = item.name;

            // Crear detalles del artículo
            const itemDetails = document.createElement('div');

            // Crear nombre del artículo
            const itemName = document.createElement('h4');
            itemName.textContent = `${item.name} x${item.quantity}`;

            // Crear precio del artículo
            const itemPrice = document.createElement('p');
            const formattedPrice = formatPrice(item.price * item.quantity);
            itemPrice.textContent = formattedPrice;

            // Crear botón de aumento de cantidad
            const increaseButton = document.createElement('button');
            increaseButton.textContent = '+';
            increaseButton.classList.add('increase-button');
            increaseButton.addEventListener('click', () => {
                item.quantity++;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            });

            // Crear botón de disminución de cantidad
            const decreaseButton = document.createElement('button');
            decreaseButton.textContent = '-';
            decreaseButton.classList.add('decrease-button');
            decreaseButton.addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    const index = cart.indexOf(item);
                    cart.splice(index, 1);
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            });

            // Agregar elementos al contenedor de detalles del artículo
            itemDetails.appendChild(itemName);
            itemDetails.appendChild(itemPrice);
            itemDetails.appendChild(increaseButton);
            itemDetails.appendChild(decreaseButton);

            // Agregar imagen y detalles del artículo al contenedor de artículo de carrito
            cartItem.appendChild(productImage);
            cartItem.appendChild(itemDetails);
            cartItemContainer.appendChild(cartItem);

            // Agregar contenedor de artículo de carrito al elemento de lista de artículos de carrito
            cartItemsElement.appendChild(cartItemContainer);

            // Calcular el precio total
            totalPrice += item.price * item.quantity;
        });

        // Formatear y mostrar el precio total en la interfaz
        const formattedTotalPrice = formatPrice(totalPrice);
        totalPriceElement.textContent = `Total: ${formattedTotalPrice}`;
    }

    // Función para formatear el precio con comas y moneda
    function formatPrice(price) {
        return price.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' });
    }

    // Al cargar la página, asegúrate de mostrar los productos del carrito si hay alguno guardado
    updateCart();
});
