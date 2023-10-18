const API = "http://localhost:8000/products";

//add product
let productTitle = document.querySelector("#title");
let productPrice = document.querySelector("#price");
let productDesc = document.querySelector("#desc");
let productImage = document.querySelector("#image");
let addBtn = document.querySelector("#add-btn");
let addForm = document.querySelector("#add-form");

async function addProduct(e) {
  e.preventDefault();
  if (
    !productTitle.value.trim() ||
    !productPrice.value.trim() ||
    !productDesc.value.trim() ||
    !productImage.value.trim()
  ) {
    alert("Some inputs are empty");
    return;
  }

  let productObj = {
    title: productTitle.value,
    price: productPrice.value,
    desc: productDesc.value,
    image: productImage.value,
  };

  await fetch(API, {
    method: "POST",
    body: JSON.stringify(productObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  productTitle.value = "";
  productPrice.value = "";
  productDesc.value = "";
  productImage.value = "";

  render();
}

addForm.addEventListener("submit", addProduct);

//! read

const products = document.querySelector("#products");

async function render() {
  let response = await fetch(API);
  let data = await response.json();
  products.innerHTML = "";
  data.forEach((card) => {
    products.innerHTML += `
    <div class="card border-dark" style="width: 18rem;">
  <img height=180 class='fit-contain' src="${card.image}"  class="card-img-top" alt="${card.title}">
  <div class="card-body">
    <h5 class="card-title">${card.title}</h5>
    <h5>Price: ${card.price} $</h5>
    <p class="card-text">${card.desc}</p>
    <button id=${card.id} class='btn btn-danger btn-delete'>Detele</button>
    <button data-bs-toggle="modal"
      data-bs-target="#exampleModal" id=${card.id} class='btn btn-primary btn-update'>Update</button>
  </div>
</div>
    `;
  });
}

render();

//delete
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete")) {
    console.log(e.target);
    const productId = e.target.id;

    await fetch(`${API}/${productId}`, {
      method: "DELETE",
    });

    render();
  }
});

// update
let editForm = document.querySelector("#edit-form");
let editTitle = document.querySelector("#edit-title");
let editPrice = document.querySelector("#edit-price");
let editDesc = document.querySelector("#edit-desc");
let editImage = document.querySelector("#edit-image");

let closeBtn = document.querySelector(".btn-close");

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-update")) {
    let productId = e.target.id;
    let response = await fetch(`${API}/${productId}`);
    let productObj = await response.json();

    editTitle.value = productObj.title;
    editPrice.value = productObj.price;
    editDesc.value = productObj.desc;
    editImage.value = productObj.image;

    editForm.id = "edit-form " + productObj.id;
  }
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let updatedObj = {
    title: editTitle.value,
    price: editPrice.value,
    desc: editDesc.value,
    image: editImage.value,
  };

  let id = e.target.id.split(" ")[1];

  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updatedObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  closeBtn.click();
  render();
});
