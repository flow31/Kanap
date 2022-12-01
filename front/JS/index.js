async function getDatas() {
  const res = await fetch('http://localhost:3000/api/products');
  const datas = await res.json();

  for (let data of datas) {
    const product = `
    <a href="./product.html?id=${data._id}">
            <article>
              <img src="${data.imageUrl}" alt="${data.altTxt}">
              <h3 class="productName">${data.name}</h3>
              <p class="productDescription">${data.description}</p>
            </article>
          </a>
    `;

    const section = document.querySelector('#items');
    section.insertAdjacentHTML('beforeend', product);
  }
}

getDatas();
