let productInLocalStorage = JSON.parse(localStorage.getItem('cart'));
let datas = [];

// console.log(productInLocalStorage);

async function getDatas() {
  const res = await fetch('http://localhost:3000/api/products/');
  const datas = await res.json();

  showCart(datas);

  removeProduct();

  updateQuantity();
  // priceAmount();
}

if (productInLocalStorage.length > 0) {
  getDatas();
}

function showCart(datas) {
  for (let data of productInLocalStorage) {
    const index = datas.findIndex((product) => product._id === data.id);
    // console.log(index);
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

    document
      .querySelector('#cart__items')
      .insertAdjacentHTML('beforeend', product);

    totalArticles();
  }
}
function removeProduct() {
  const deleteItem = document.querySelector('.deleteItem');

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

    totalArticles();
  }
}

function totalArticles() {
  let totalItems = 0;

  for (e in productInLocalStorage) {
    // Analyse et converti la valeur 'quantity' dans le localstorage en une chaîne, et renvoie un entier
    const newQuantity = parseInt(productInLocalStorage[e].quantity);

    // Attribue la valeur retournée par parseInt à la variable totalItems
    totalItems += newQuantity;
  }

  // Attribue à totalQuantity la valeur de totalItems et l'afficher dans le DOM
  const totalQuantity = document.querySelector('#totalQuantity');
  totalQuantity.textContent = totalItems;
}

function updateQuantity() {
  let itemQuantity = document.querySelector('.itemQuantity');

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
}

// Gestion formulaire
// Récupération des elements

const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const address = document.querySelector('#address');
const city = document.querySelector('#city');
const email = document.querySelector('#email');

// Event
document.querySelector('#order').addEventListener('click', () => {
  // Verification
  firstNameValid();
  lastNameValid();
  addressValid();
  cityValid();
  emailValid();
});

// Fonctions formulaire

function firstNameValid() {
  const firstNameValue = firstName.value.trim();
  let firstNameMessage = document.querySelector('#firstNameErrorMsg');
  if (firstNameValue === '') {
    firstNameMessage.innerHTML = 'Ne peut pas être vide';
  } else if (!firstNameValue.match(/^[a-zA-Z-\s]+$/)) {
    firstNameMessage.innerHTML = 'Ne doit pas contenir de chiffres';
  } else {
    firstNameMessage.innerHTML = '';
  }
}
function lastNameValid() {
  const lastNameValue = lastName.value.trim();
  let lastNameMessage = document.querySelector('#lastNameErrorMsg');
  if (lastNameValue === '') {
    lastNameMessage.innerHTML = 'Ne peut pas être vide';
  } else if (!lastNameValue.match(/^[a-zA-Z-\s]+$/)) {
    lastNameMessage.innerHTML = 'Ne doit pas contenir de chiffres';
  } else {
    lastNameMessage.innerHTML = '';
  }
}
function addressValid() {
  const addressNameValue = address.value.trim();
  let addressNameMessage = document.querySelector('#addressErrorMsg');
  if (addressNameValue === '') {
    addressNameMessage.innerHTML = 'Ne peut pas être vide';
  } else {
    addressMessage.innerHTML = '';
  }
}
function cityValid() {
  const cityNameValue = city.value.trim();
  let cityNameMessage = document.querySelector('#cityErrorMsg');
  if (cityNameValue === '') {
    cityNameMessage.innerHTML = 'Ne peut pas être vide';
  } else {
    cityNameMessage.innerHTML = '';
  }
}
function emailValid() {
  const emailValue = email.value.trim();
  let emailMessage = document.querySelector('#emailErrorMsg');
  if (emailValue === '') {
    emailMessage.innerHTML = 'Ne peut pas être vide';
  } else if (
    !emailValue.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    emailMessage.innerHTML = 'Email non conforme';
  } else {
    emailMessage.innerHTML = '';
  }
}
