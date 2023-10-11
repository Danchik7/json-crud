let body = document.querySelector("body");
body.addEventListener("mousemove", eyeball);

function eyeball() {
  const eye = document.querySelectorAll(".eyes");
  eye.forEach((item) => {
    let x = item.getBoundingClientRect().left + item.clientWidth / 2;
    let y = item.getBoundingClientRect().top + item.clientHeight / 2;
    let radian = Math.atan2(event.pageX - x, event.pageY - y);
    let rotate = radian * (180 / Math.PI) * -1 + 270;
    item.style.transform = `rotate(${rotate}deg)`;
  });
}

////////////////////////////////////////////////////////////

// localStorage
// localStorage.setItem("name", "Nurik");
// localStorage.setItem("age", 22);
// // console.log(localStorage.getItem("name"));
// // localStorage.removeItem("name");
// localStorage.clear();
// console.log(localStorage.key("name"));

// let products = [
//   {
//     title: "Fridge",
//     price: 2000,
//   },
//   {
//     title: "MicroWave",
//     price: 1500,
//   },
// ];

// localStorage.setItem("products", JSON.stringify(products));

// let newProducts = JSON.parse(localStorage.getItem("products"));
// console.log(newProducts);

function initStorage() {
  console.log("init");
  if (!localStorage.getItem("products")) {
    console.log(localStorage.getItem("products"));
    localStorage.setItem("products", "[]");
  }
}

initStorage();

function getProductsFromStorage() {
  return JSON.parse(localStorage.getItem("products"));
}

function setProductsToStorage(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

const saveBtn = document.querySelector("#save-changes");
const addBtn = document.querySelector("#add-btn");
const closeBtn = document.querySelector("#close");
addBtn.addEventListener("click", createProduct);

//create
const imgInp = document.querySelector("#url-inp");
const titleInp = document.querySelector("#title-inp");
const priceInp = document.querySelector("#price-inp");
function createProduct() {
  const productObj = {
    url: imgInp.value,
    title: titleInp.value,
    price: priceInp.value,
  };

  let products = getProductsFromStorage();
  products.push(productObj);
  setProductsToStorage(products);

  imgInp.value = "";
  titleInp.value = "";
  priceInp.value = "";

  closeBtn.click();
  render();
}

function render(data = getProductsFromStorage()) {
  let container = document.querySelector(".products");
  container.innerHTML = "";
  data.forEach((item, index) => {
    container.innerHTML += `
    <div class="card" style="width: 18rem" id="${index}">
        <img class='card-img' src="${item.url}" height=500 class="card-img-top" alt="..." />
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
          <p class="card-text">
          <b>Price</b>: ${item.price} $
          </p>
          <button id='del-btn' class="btn btn-danger">Delete</button>
          <button id='upd-btn' class='btn btn-success' data-bs-toggle="modal"
          data-bs-target="#exampleModal">Update</button>
          </div>
          </div>
          `;
  });
  addDeleteEvent();
  addUpdateEvent();
}

render();

function addDeleteEvent() {
  let deleteBtns = document.querySelectorAll("#del-btn");
  console.log(deleteBtns);
  deleteBtns.forEach((btn) => btn.addEventListener("click", deleteProduct));
}

//delete
function deleteProduct(e) {
  let productId = e.target.parentNode.parentNode.id;
  console.log(productId);
  let products = getProductsFromStorage();
  products.splice(productId, 1);
  setProductsToStorage(products);

  render();
}

//update

function getOneProductById(id) {
  return getProductsFromStorage()[+id];
}

function addUpdateEvent() {
  let updateBtns = document.querySelectorAll("#upd-btn");
  updateBtns.forEach((btn) => btn.addEventListener("click", updateProduct));
}

function updateProduct(e) {
  // if(e.target)
  let productId = e.target.parentNode.parentNode.id;
  let productObj = getOneProductById(productId);
  console.log(productObj);
  imgInp.value = productObj.url;
  priceInp.value = productObj.price;
  titleInp.value = productObj.title;

  saveBtn.setAttribute("id", productId);
}

saveBtn.addEventListener("click", saveChanges);

function saveChanges() {
  if (!saveBtn.id) return;
  let products = getProductsFromStorage();
  let productObj = products[+saveBtn.id];
  productObj.url = imgInp.value;
  productObj.title = titleInp.value;
  productObj.price = priceInp.value;
  setProductsToStorage(products);
  saveBtn.removeAttribute("id");
  closeBtn.click();
  render();
}

// search
const searchInp = document.querySelector("#search-inp");
searchInp.addEventListener("input", (e) => {
  let products = getProductsFromStorage();
  products = products.filter((item) => {
    return (
      item.title.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
    );
  });
  render(products);
});
