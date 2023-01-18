// Récupération des paramètres de l'URL
const urlSearch = window.location.search;
const urlParams = new URLSearchParams(urlSearch);
const productId = urlParams.get('id');

// Récupération des données du produit depuis l'API
async function getDatas() {
  const res = await fetch('http://localhost:3000/api/products/' + productId);
  const data = await res.json();

  // Mise à jour du titre de la page
  document.querySelector('title').textContent = data.name;

  // Mise à jour de l'image du produit
  let itemParent = document.getElementsByClassName('item__img');
  let image = document.createElement('img');
  image.src = data.imageUrl;
  image.alt = data.altTxt;
  itemParent[0].appendChild(image);

  // Mise à jour du nom, du prix et de la description du produit
  document.querySelector('#title').textContent = data.name;
  document.querySelector('#price').textContent = data.price;
  document.querySelector('#description').textContent = data.description;

  // Mise à jour des options de couleur du produit
  for (let option of data.colors) {
    const color = `<option value="${option}">${option}</option>`;

    document.querySelector('#colors').insertAdjacentHTML('beforeend', color);
  }
}

// Récupération des données du produit depuis l'API
getDatas();

// Gestion de l'ajout au panier
document.querySelector('#addToCart').addEventListener('click', () => {
  // Récupération de la couleur et de la quantité sélectionnées par l'utilisateur
  const color = document.querySelector('#colors').value;
  const quantity = document.querySelector('#quantity').value;

  // Validation de la couleur et de la quantité
  // Si la couleur est vide
  if (color == '') {
    alert('Choisissez une couleur');
    return;
  }
  // Si la quantité n'est pas valide
  if (quantity < 1 || quantity > 100) {
    alert('Mettre une quantité valide');
    return;
  }

  // Lancement de la fonction addToCart
  addToCart();
});

// Fonction d'ajout au panier
function addToCart() {
  // Récupération du panier dans le local storage
  const cart =
    localStorage.getItem('cart') != null ||
    localStorage.getItem('cart') != undefined
      ? JSON.parse(localStorage.getItem('cart'))
      : [];

  // Récupération des données du produit
  const color = document.querySelector('#colors').value;
  const quantity = parseInt(document.querySelector('#quantity').value);
  const name = document.querySelector('#title').textContent;
  const image = document.querySelector('.item__img').innerHTML;
  const product = {
    id: productId,
    color,
    image,
    name,
    quantity,
  };

  // Si le panier est vide, ajout du produit
  if (cart.length <= 0) {
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produit ajouté au panier');
    return;
  }

  // Si le produit existe déjà dans le panier, mise à jour de la quantité
  const index = cart.findIndex(
    (product) => product.id === productId && product.color === color
  );
  if (index != -1) {
    const newQuantity = quantity + cart[index].quantity;

    // Validation de la quantité
    if (newQuantity > 100) {
      alert('Trop de produits');
      return;
    }

    // Mise à jour de la quantité
    cart[index].quantity += quantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('La quantité du produit a été mise à jour');
    return;
  }

  // Ajout du produit au panier
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Produit ajouté au panier');
}
