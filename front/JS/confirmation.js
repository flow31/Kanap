// Récupère l'URL de la page actuelle
let onPageUrl = window.location;
// Crée un objet URL à partir de l'URL de la page
let url = new URL(onPageUrl);
// Récupère la valeur de la propriété "orderId" dans l'URL
let id = url.searchParams.get('orderId');
// Affecte la valeur de la variable id à l'élément HTML ayant l'identifiant "orderId"
document.getElementById('orderId').innerText = id;
