const addToCart = async (event) => {

  const cartId = event.target.attributes['data-cart-id'].value;
  const prodId = event.target.attributes['data-product-id'].value;

  await fetch(`/api/carts/${cartId}/product/${prodId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

let botonList = [...document.querySelectorAll('.addToCart')];
botonList.map(boton => boton.addEventListener('click', addToCart));

