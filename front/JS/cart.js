// const numberOfKanaps = localStorage.length;
// console.log(numberOfKanaps);
// const cart = [];

// for (let i = 0; i < numberOfKanaps; i++) {
//   const element = localStorage.getItem(localStorage.key(i));
//   const elementObject = JSON.parse(element);
//   cart.push(elementObject);
//   //Intégration du  html dans la section "cart__items"
//   document.querySelector('#cart__items').innerHTML = cart[i].name;
// }

// Etape 1 : récupérer le panier avec ta ternaire comme sur product
// Etape 2 : initialisé tes datas en renvoyant un tableau vide
// Etape 3 : Créer une fonction pour get les datas qui te permet de fetch les info produits de l'api
// Etape 4 : lancer a l'intérieur de ta fonction getdata les autres fonctions nécessaire au fonctionnement (showCart, removeProduct, updateQuantity)
// Etape 5 : Hors de la function getdata, teste la longueur du panier. Si panier plein = lancer la fonction getdata
// Etape 6 : Crée la fonction showcart qui permet de récupérer les info des produits dans le localstorage et l'api afin de les afficher dans le panier
// const price
async function getDatas() {
  const res = await fetch('http://localhost:3000/api/products/');
  const data = await res.json();
}
// Récupération des produits dans le local storage
let products = [];

// Récupère les données en objet
let productInLocalStorage = JSON.parse(localStorage.getItem('cart'));

// Affichage des produits sur la page

// Si le panier est vide
if (productInLocalStorage === null || productInLocalStorage == 0) {
  // Affichage du panier vide
  document.getElementById('cart__items').innerHTML = `
      <div class="cart__empty">
        <p> Votre panier est vide ! </p>
      </div>
    `;
} else {
  // Si le panier n'est pas vide : Affichage des produits dans le localStorage
  let productsCart = [];

  // Boucle for et push dans le tableau
  for (i = 0; i < productInLocalStorage.length; i++) {
    // Récupère uniquement l'id de chaque produit dans le panier
    products.push(productInLocalStorage[i].id);
    productsCart =
      // Ajout du produit au tableau productsCart sans écraser le précédent
      productsCart +
      `  
        <article class="cart__item" data-id="${productInLocalStorage[i].id}" data-color="${productInLocalStorage.color}">         
            <div class="cart__item__img">
            ${productInLocalStorage[i].image}
                
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__titlePrice">
                    <h2>${productInLocalStorage[i].name}</h2>
                    <p>${productInLocalStorage[i].color}</p>
                    <p>${productInLocalStorage[i].price} €</p>
                </div>          
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInLocalStorage[i].quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article>
      `;
  }

  if (i === productInLocalStorage.length) {
    // Injection du code HTML et affichage sur la page panier
    const cartItems = document.getElementById('cart__items');
    cartItems.innerHTML += productsCart;
  }

  // Supprimer un article du panier

  removeProduct = () => {
    const deleteItem = document.getElementsByClassName('deleteItem');

    for (let a = 0; a < deleteItem.length; a++) {
      deleteItem[a].addEventListener('click', (event) => {
        event.preventDefault();

        // Enregistrement de l'id et de la couleur séléctionnée par le bouton supprimer
        let deleteId = productInLocalStorage[a].id;
        let deleteColor = productInLocalStorage[a].color;

        // Sélection des éléments à garder avec la méthode .filter et suppression de l'élément cliqué
        productInLocalStorage = productInLocalStorage.filter(
          (element) => element.id !== deleteId || element.color !== deleteColor
        );

        // Mise à jour du local storage avec les produits restants
        localStorage.setItem('cart', JSON.stringify(productInLocalStorage));

        // Confirmation de la suppression du produit
        alert('Votre article a bien été retiré de votre panier !');

        // Actualiser le contenu du panier
        window.location.href = 'cart.html';
      });
    }
  };

  removeProduct();

  totalArticles = () => {
    let totalItems = 0;

    for (e in productInLocalStorage) {
      // Analyse et converti la valeur 'quantity' dans le localstorage en une chaîne, et renvoie un entier
      const newQuantity = parseInt(productInLocalStorage[e].quantity);

      // Attribue la valeur retournée par parseInt à la variable totalItems
      totalItems += newQuantity;
    }

    // Attribue à totalQuantity la valeur de totalItems et l'afficher dans le DOM
    const totalQuantity = document.getElementById('totalQuantity');
    totalQuantity.textContent = totalItems;
  };
}

totalArticles();

//-------------------------------------------------

// Modifier la quantité dans le panier

updateQuantity = () => {
  let itemQuantity = document.getElementsByClassName('itemQuantity');

  for (let n = 0; n < itemQuantity.length; n++) {
    itemQuantity[n].addEventListener('change', (event) => {
      event.preventDefault();

      // Initialisation d'un nouveau tableau avec la nouvelle quantité
      let itemWithNewQuantity = itemQuantity[n].value;

      const newLocalStorage = {
        id: productInLocalStorage[n].id,
        image: productInLocalStorage[n].image,
        alt: productInLocalStorage[n].alt,
        name: productInLocalStorage[n].name,
        color: productInLocalStorage[n].color,
        price: productInLocalStorage[n].price,
        quantity: itemWithNewQuantity,
      };
      if (itemWithNewQuantity > 100) {
        alert('Trop de produits');
        return;
      }
      if (itemWithNewQuantity <= 0) {
        alert('Quantité non valide');
        return;
      }
      // Nouvelles valeurs du localstorage
      productInLocalStorage[n] = newLocalStorage;
      localStorage.setItem('cart', JSON.stringify(productInLocalStorage));

      // Actualisation de la quantité d'articles dans le panier
      totalArticles();
    });
  }
};

updateQuantity();
