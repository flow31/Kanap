//Création const pour rechercher l'id dans l'url
const urlSearch = window.location.search;
const urlParams = new URLSearchParams(urlSearch);
const productId = urlParams.get('id');
// Fonction async await + recherche de l'id
async function getDatas() {
  const res = await fetch('http://localhost:3000/api/products/' + productId);
  const data = await res.json();
  // Selection sur le code html
  document.querySelector('title').innerHTML = data.name;
  document.querySelector(
    '.item__img'
  ).innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
  document.querySelector('#title').innerHTML = data.name;
  document.querySelector('#price').innerHTML = data.price;
  document.querySelector('#description').innerHTML = data.description;

  // Boucle for of pour les options
  //Création boucle pour choix des couleurs
  for (let option of data.colors) {
    const color = `<option value="${option}">${option}</option>`;

    document.querySelector('#colors').insertAdjacentHTML('beforeend', color);
  }
}
//Lancement de la fonction
getDatas();
// Ecoute au clic + selection html
// Création fonction pour le localstorage
document.querySelector('#addToCart').addEventListener('click', () => {
  const color = document.querySelector('#colors').value;
  const quantity = document.querySelector('#quantity').value;
  // Si pas de couleurs sélectionner alors message d'alerte
  if (color == '') {
    alert('Choisissez une couleur');
    return;
  }
  // Si quantité en dessous de 0 ou au dessus de 100 alors message d'alerte
  if (quantity < 1 || quantity > 100) {
    alert('Mettre une quantité valide');
    return;
  }

  addToCart();
});
//Fonction ajout panier
function addToCart() {
  // Si le localstorage est rempli alors création d'un tableau cart
  const cart =
    localStorage.getItem('cart') != null ||
    localStorage.getItem('cart') != undefined
      ? JSON.parse(localStorage.getItem('cart'))
      : [];

  // récupération des éléments suivant : color, quantity, name, image
  // Création de produit en réutilisant color, quantity, name, image et l'id du produit
  //Selection des elements html
  const color = document.querySelector('#colors').value;
  //Proriété parseInt pour que les quantités soit des nombres entiers
  const quantity = parseInt(document.querySelector('#quantity').value);
  const name = document.querySelector('#title').innerHTML;
  const image = document.querySelector('.item__img').innerHTML;
  //Création d'un objet pour  récupérer toutes les infos
  const product = {
    id: productId,
    color,
    image,
    name,
    quantity,
  };
  // Condition si le tableau cart est vide alors ajout
  if (cart.length <= 0) {
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produit ajouté au panier');
    return;
  }
  // Comparaison entre le tableau et l'id récuperer sur l'api et la couleur
  const index = cart.findIndex(
    (product) => product.id === productId && product.color === color
  );
  //Mise a jour quantité
  if (index != -1) {
    // MEttre à jour le produit
    const newQuantity = quantity + cart[index].quantity;

    if (newQuantity > 100) {
      alert('Trop de produits');
      return;
    }

    cart[index].quantity += quantity;
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('La quantité du produit a été mise à jour');
    return;
  }

  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Produit ajouté au panier');
}
