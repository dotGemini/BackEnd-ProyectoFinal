const ticket = async (event) => {
    const cartId = event.target.attributes['data-cart-id'].value;

    const response = await fetch(`/api/carts/${cartId}/purchase`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

let botonFinish = document.querySelector('.ticket');
botonFinish.addEventListener('click', ticket);