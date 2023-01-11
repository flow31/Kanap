// Récupère les données de l'objet "cart" dans le LocalStorage pour obtenir un objet JavaScript
let productInLocalStorage = JSON.parse(localStorage.getItem('cart'));
// Crée un tableau vide qui sera rempli avec les données des produits plus tard
let datas = [];

// Fonction asynchrone pour récupérer les données des produits à partir de l'API
async function getDatas() {
  // Utilise la méthode fetch pour récupérer les données de l'API
  const res = await fetch('http://localhost:3000/api/products/');
  // Transforme les données en un objet JSON
  const datas = await res.json();

  // Appelle plusieurs fonctions en utilisant les données des produits
  showCart(datas);
  removeProduct();
  updateQuantity(datas);
  getAllPrice(datas);
  totalArticles();
}

// Si le panier dans le LocalStorage contient au moins un produit, appelle la fonction getDatas()
if (productInLocalStorage.length > 0) {
  getDatas();
}

// Affiche les produits du panier dans la page HTML
function showCart(datas) {
  // Pour chaque produit dans le panier (productInLocalStorage)
  for (let data of productInLocalStorage) {
    // Trouve l'index du produit dans le tableau des données de tous les produits (datas)
    const index = datas.findIndex((product) => product._id === data.id);
    // Crée une chaîne de caractères qui représente le HTML de chaque produit
    const product = `<article class="cart__item" data-id="${data.id}" data-color="${data.color}">
        <div class="cart__item__img">
          ${data.image}
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${data.name}</h2>
            <p>${data.color}</p>
            <p>${datas[index].price} €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <p>Qté : </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${data.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`;

    // Insère le HTML du produit dans la page HTML
    document
      .getElementById('cart__items')
      .insertAdjacentHTML('beforeend', product);
  }
}

// Supprime un produit du panier lorsque le bouton "Supprimer" est cliqué
function removeProduct() {
  // Récupère tous les éléments HTML avec la classe "deleteItem"
  const deleteItem = document.getElementsByClassName('deleteItem');

  // Pour chaque élément "Supprimer"
  for (let a = 0; a < deleteItem.length; a++) {
    // Ajoute un gestionnaire d'événement "click" à l'élément "Supprimer"
    deleteItem[a].addEventListener('click', (event) => {
      // Empêche le comportement par défaut (rechargement de la page)
      event.preventDefault();

      // Enregistre l'ID et la couleur du produit à supprimer
      let deleteId = productInLocalStorage[a].id;
      let deleteColor = productInLocalStorage[a].color;

      // Filtre les produits à conserver dans le panier et supprime le produit cliqué
      productInLocalStorage = productInLocalStorage.filter(
        (element) => element.id !== deleteId || element.color !== deleteColor
      );

      // Met à jour le LocalStorage avec les produits restants
      localStorage.setItem('cart', JSON.stringify(productInLocalStorage));

      // Affiche un message de confirmation de la suppression du produit
      alert('Votre article a bien été retiré de votre panier !');

      // Actualise la page du panier
      window.location.href = 'cart.html';
    });
  }
}

// Calcule le nombre total d'articles dans le panier
function totalArticles() {
  let totalItems = 0;

  // Pour chaque produit dans le panier
  for (e in productInLocalStorage) {
    // Convertit la quantité du produit en entier et l'ajoute à la variable totalItems
    const newQuantity = parseInt(productInLocalStorage[e].quantity);
    totalItems += newQuantity;
  }

  // Récupère l'élément HTML avec l'ID "totalQuantity" et affiche le nombre total d'articles
  const totalQuantity = document.getElementById('totalQuantity');
  totalQuantity.innerHTML = totalItems;
}

// Met à jour la quantité d'un produit dans le panier lorsque l'utilisateur modifie la valeur du champ de quantité
function updateQuantity(datas) {
  // Récupère tous les éléments HTML avec la classe "itemQuantity"

  let itemQuantity = document.querySelectorAll('.itemQuantity');
  // Pour chaque élément "itemQuantity"

  for (let n = 0; n < itemQuantity.length; n++) {
    // Ajoute un gestionnaire d'événement "change" à l'élément "itemQuantity"

    itemQuantity[n].addEventListener('change', (event) => {
      // Empêche le comportement par défaut (rechargement de la page)

      event.preventDefault();

      // Récupère la nouvelle quantité entrée par l'utilisateur
      let itemWithNewQuantity = itemQuantity[n].value;
      // Crée un nouvel objet avec les nouvelles données du produit (ID, quantité, etc.)

      const newLocalStorage = {
        id: productInLocalStorage[n].id,
        image: productInLocalStorage[n].image,
        alt: productInLocalStorage[n].alt,
        name: productInLocalStorage[n].name,
        color: productInLocalStorage[n].color,
        quantity: parseInt(itemWithNewQuantity),
      };
      // Si la quantité est supérieure à 100, affiche un message d'erreur

      if (itemWithNewQuantity > 100) {
        alert('Trop de produits');
        return;
      }
      // Si la quantité est inférieure ou égale à 0, affiche un message d'erreur

      if (itemWithNewQuantity <= 0) {
        alert('Quantité non valide');
        return;
      }
      // Nouvelles valeurs du localstorage
      productInLocalStorage[n] = newLocalStorage;
      localStorage.setItem('cart', JSON.stringify(productInLocalStorage));
      totalArticles();
      getAllPrice(datas);
    });
  }
}

function getAllPrice(datas) {
  // Utiliser reduce pour réduire productInLocalStorage en une seule valeur

  const result = productInLocalStorage.reduce(
    (acc, currentValue) => {
      const index = datas.findIndex(
        (product) => product._id === currentValue.id
      );
      // Accumuler la quantité et le prix du produit courant
      acc.nbProduct += parseInt(currentValue.quantity);
      acc.totalPrice += parseInt(currentValue.quantity * datas[index].price);
      return acc;
    },
    { nbProduct: 0, totalPrice: 0 }
  ); // Valeur initiale de l'accumulateur

  // Affiche le nombre total de produits et le prix total

  document.querySelector('#totalPrice').innerHTML = result.totalPrice;
}
// Récupère les éléments HTML avec les IDs "firstName", "lastName", "address", "city" et "email"
const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const address = document.querySelector('#address');
const city = document.querySelector('#city');
const email = document.querySelector('#email');

// Ajoute un gestionnaire d'événement "click" à l'élément HTML avec l'ID "order"
const sendOrder = document.getElementById('order');
sendOrder.addEventListener('click', () => {
  // Lance les fonctions de vérification du formulaire
  firstNameValid();
  lastNameValid();
  addressValid();
  cityValid();
  emailValid();
});

// Vérifie que le champ "Prénom" du formulaire est valide
function firstNameValid() {
  // Récupère l'élément HTML avec l'ID "firstNameErrorMsg"
  let firstNameMessage = document.querySelector('#firstNameErrorMsg');
  const firstNameValue = firstName.value.trim();

  // Si la valeur du champ "Prénom" est vide
  if (firstNameValue === '') {
    // Affiche un message d'erreur
    firstNameMessage.innerHTML = 'Ne peut pas être vide';
  }
  // Si la valeur du champ "Prénom" ne correspond pas au motif de caractères alphabétiques et d'espaces
  else if (!firstNameValue.match(/^[a-zA-Z-\s]+$/)) {
    // Affiche un message d'erreur
    firstNameMessage.innerHTML = 'Ne doit pas contenir de chiffres';
  }
  // Si aucune erreur n'est détectée
  else {
    // Efface le message d'erreur
    firstNameMessage.innerHTML = '';
  }
}

// Vérifie que le champ "Nom" du formulaire est valide
function lastNameValid() {
  // Récupère l'élément HTML avec l'ID "lastNameErrorMsg"
  let lastNameMessage = document.querySelector('#lastNameErrorMsg');
  const lastNameValue = lastName.value.trim();

  // Si la valeur du champ "Nom" est vide
  if (lastNameValue === '') {
    // Affiche un message d'erreur
    lastNameMessage.innerHTML = 'Ne peut pas être vide';
  }
  // Si la valeur du champ "Nom" ne correspond pas au motif de caractères alphabétiques et d'espaces
  else if (!lastNameValue.match(/^[a-zA-Z-\s]+$/)) {
    // Affiche un message d'erreur
    lastNameMessage.innerHTML = 'Ne doit pas contenir de chiffres';
  }
  // Si aucune erreur n'est détectée
  else {
    // Efface le message d'erreur
    lastNameMessage.innerHTML = '';
  }
}

// Vérifie que le champ "Adresse" du formulaire est valide
function addressValid() {
  // Récupère l'élément HTML avec l'ID "addressErrorMsg"
  let addressNameMessage = document.querySelector('#addressErrorMsg');
  const addressNameValue = address.value.trim();

  // Si la valeur du champ "Adresse" est vide
  if (addressNameValue === '') {
    // Affiche un message d'erreur
    addressNameMessage.innerHTML = 'Ne peut pas être vide';
  }
  // Si aucune erreur n'est détectée
  else {
    // Efface le message d'erreur
    addressNameMessage.innerHTML = '';
  }
}

function cityValid() {
  // Récupère l'élément HTML qui affiche le message d'erreur pour le champ de saisie de la ville
  let cityNameMessage = document.querySelector('#cityErrorMsg');
  const cityNameValue = city.value.trim();

  // Si la valeur du champ de saisie de la ville est vide
  if (cityNameValue === '') {
    // Affiche un message d'erreur indiquant que le champ de saisie de la ville ne peut pas être vide
    cityNameMessage.innerHTML = 'Ne peut pas être vide';
  } else {
    // Si la valeur du champ de saisie de la ville n'est pas vide, efface le message d'erreur
    cityNameMessage.innerHTML = '';
  }
}

function emailValid() {
  // Récupère l'élément HTML qui affiche le message d'erreur pour le champ de saisie de l'email
  let emailMessage = document.querySelector('#emailErrorMsg');
  const emailValue = email.value.trim();

  // Si la valeur du champ de saisie de l'email est vide
  if (emailValue === '') {
    // Affiche un message d'erreur indiquant que le champ de saisie de l'email ne peut pas être vide
    emailMessage.innerHTML = 'Ne peut pas être vide';
    // Sinon, si la valeur du champ de saisie de l'email ne correspond pas au format d'un email valide
  } else if (
    !emailValue.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    // Affiche un message d'erreur indiquant que l'email est non conforme
    emailMessage.innerHTML = 'Email non conforme';
  } else {
    // Si la valeur du champ de saisie de l'email est valide, efface le message d'erreur
    emailMessage.innerHTML = '';
  }
}

// Gestion de la soumission de la commande
sendOrder.addEventListener('click', function (e) {
  e.preventDefault();

  // Récupération des produits dans le panier
  let products = JSON.parse(localStorage.getItem('cart'));

  // Si le panier est vide, affichage d'une alerte
  if (products === null || products.length < 1) {
    alert(
      'Votre panier est vide, veuillez ajouter des articles pour les commander.'
    );
    return;
  }

  // Préparation de l'objet de commande
  const productsId = [];
  products.forEach((product) => {
    productsId.push(product.id);
  });
  const order = {
    contact: {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    },
    products: productsId,
  };
  // Envoi de la commande au serveur
  orderProduct(order);
});

// Fonction d'envoi de la commande et des informations de contact
function orderProduct(order) {
  // Appel de l'API avec la méthode POST
  fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    // Indication à l'API que les données envoyées sont au format JSON
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    // Envoi de l'objet JSON
    body: JSON.stringify(order),
  })
    .then(function (res) {
      // Vérification que la réponse est OK
      if (res.ok) {
        return res.json();
      }
    })
    // Récupération de l'identifiant de commande dans la réponse
    .then(function (value) {
      window.location = `./confirmation.html?orderId=${value.orderId}`;
      localStorage.clear();
    })
    // Gestion d'une erreur lors de l'appel de l'API
    .catch(function (err) {
      alert("Votre commande n'a pas pu être envoyée");
    });
}
