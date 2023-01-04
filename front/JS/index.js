async function getDatas() {
  // Envoie une requête HTTP GET à l'API et attend la réponse
  const res = await fetch('http://localhost:3000/api/products');
  // Convertit la réponse en format JSON et la stock dans la variable `datas`
  const datas = await res.json();

  // Pour chaque élément du tableau `datas`
  for (let data of datas) {
    // Crée une chaîne de caractères qui représente un élément HTML contenant des informations sur un produit
    const product = `
    <a href="./product.html?id=${data._id}">
            <article>
              <img src="${data.imageUrl}" alt="${data.altTxt}">
              <h3 class="productName">${data.name}</h3>
              <p class="productDescription">${data.description}</p>
            </article>
          </a>
    `;

    // Sélectionne l'élément HTML qui a l'ID "items"
    const section = document.querySelector('#items');
    // Insère l'élément HTML généré à la fin de la section sélectionnée
    section.insertAdjacentHTML('beforeend', product);
  }
}

// Appelle la fonction
getDatas();
