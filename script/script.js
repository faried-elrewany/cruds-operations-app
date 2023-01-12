"use strict";

// global variables
const total = document.querySelector(".total");
const taxElement = document.getElementById("taxs");
const adsElement = document.getElementById("ads");
const priceElement = document.getElementById("price");
const discountElement = document.getElementById("discount");
const countElement = document.getElementById("count");
const inputs = document.querySelectorAll("input");
const createBtn = document.querySelector(".create-button");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const tableBody = document.querySelector("tbody");
const dellAllBtn = document.querySelector(".cruds__delete--all");
const nDell = document.querySelector(".cruds__delete--all span");
const searchBtn = document.querySelector(".search");
const countLabel = document.querySelector(".count-label");
// _________________________________________
let virtual;
let mode = "create";
let searchMode = "title";

discountElement.placeholder = "discount <= price";

// _______--------------------------------------------------------------
// _______--------------------------------------------------------------
// _______--------------------------------------------------------------
// _______--------------------------------------------------------------
// _______--------------------------------------------------------------
// _______--------------------------------------------------------------
// _______--------------------------------------------------------------
// _______--------------------------------------------------------------
// ________________________________________________________________
// window.localStorage.clear();
let newarr = [];
function calcTotalSum() {
  const arr = [...inputs];

  newarr = arr.filter((cur) => {
    if (cur.id == "taxs" || cur.id == "price" || cur.id == "ads") {
      return cur;
    }
  });
  newarr.forEach((cur) => {
    cur.onkeyup = totalSum;
  });
  discountElement.onkeyup = totalSum;
  countElement.onkeyup = totalSum;
}
function totalSum() {
  let s = 1;
  let sum = newarr.reduce((acc, cur) => {
    return acc + +cur?.value;
  }, 0);
  s = countElement?.value;
  sum -= +discountElement?.value;
  // if (+countElement.value >= 1) sum *= +s;

  total.innerHTML = sum;
}
calcTotalSum();
totalSum();
// ______________________________________________________________
//calcTotalSum();
//clear input data
function clearInputData() {
  titleInput.value = "";
  categoryInput.value = "";
  priceElement.value = "";
  taxElement.value = "";
  adsElement.value = "";
  countElement.value = "";
  discountElement.value = "";
  total.innerHTML = " 0";
  priceElement.placeholder = "Price";
  categoryInput.placeholder = "Category";
  titleInput.placeholder = "Title";
  countLabel.classList.remove("active-label");
}
// create product
let product = [];
if (window.localStorage.proMemory) {
  product = JSON.parse(window.localStorage.proMemory);
} else {
  product = [];
}
readData();
createBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let newProduct = {
    title: titleInput?.value.toLowerCase(),
    category: categoryInput?.value.toLowerCase(),
    price: priceElement?.value,
    tax: taxElement?.value || "__",
    ads: adsElement?.value || "__",
    count: countElement?.value,
    discount: discountElement?.value || "__",
    total: total.innerHTML,
  };

  if (validation()) {
    if (mode === "create") {
      if (newProduct.count > 1) {
        for (let i = 0; i < newProduct.count; ++i) product.push(newProduct);
      } else {
        product.push(newProduct);
      }
    } else {
      product[virtual] = newProduct;
      mode = "create";
      createBtn.innerHTML = "Create";

      countElement.style.visibility = "visible";
      countElement.style.opacity = "1";
    }
    clearInputData();
  }
  // console.log(product);
  window.localStorage.proMemory = JSON.stringify(product);
  readData();
});

//delete item
function deleteItem(i) {
  product.splice(i, 1);
  // console.log(i);
  window.localStorage.proMemory = JSON.stringify(product);
  readData();
}
// read products

function readData() {
  let htmlData = "";

  product.forEach((cur, i) => {
    htmlData += `
    <tr>
    <td data-label="ID">${i + 1}</td>
    <td data-label="TITLE">${cur.title}</td>
    <td data-label="PRICE">${cur.price}$</td>
              <td data-label="TAXES">${cur?.tax}</td>
              <td data-label="ADS">${cur?.ads}</td>
              <td data-label="DISCOUNT">${cur?.discount}</td>
              <td data-label="TOTAL">${cur.total}</td>
              <td data-label="CATEGORY">${cur.category}</td>
              <td>
              <div  id="${i}"  onclick ="updateItem(${i})" class=" table__btn--update" >UPDATE</div>
              </td>
              <td>
              <div  id="${i}" onclick ="deleteItem(${i})" class=" table__btn--delete" >Delete</div>
              </td>
              </tr>
              `;
  });
  tableBody.innerHTML = htmlData;
  if (product.length) {
    dellAllBtn.classList.add("active--del-all");
  } else {
    dellAllBtn.classList.remove("active--del-all");
  }
  nDell.textContent = `${product.length}`;
}

//  number of products
// function Dellete all elements
function dellAll() {
  window.localStorage.removeItem("proMemory");
  product.splice(0);
  readData();
}
dellAllBtn.addEventListener("click", dellAll);
// _____________________________________________________________;

function updateItem(i) {
  mode = "update";
  titleInput.value = product[i].title;
  categoryInput.value = product[i].category;
  priceElement.value = product[i].price;
  taxElement.value = product[i].tax;
  adsElement.value = product[i].ads;
  discountElement.value = product[i].discount;
  total.value = product[i].total;
  createBtn.innerHTML = "Update";
  countElement.style.visibility = "hidden";
  countElement.style.opacity = "0";

  virtual = i;
  // calcTotalSum();
  // mode = "create";
  totalSum();
  scroll({
    top: 0,
    behavior: "smooth",
  });
}
// ____________________________________________________________
//search functions
//_______________________________________________________________
function getSearchMode(clsName) {
  if (clsName === "title") {
    searchMode = "title";
  } else {
    searchMode = "category";
  }
  searchBtn.placeholder = `Search by ${searchMode}`;
  searchBtn.focus();
  searchBtn.value = "";
  readData();
}
function searchForProduct(value) {
  value = value.toLowerCase();
  let table = "";
  let i = 0;
  product.filter((cur) => {
    if (cur[`${searchMode}`].includes(value)) {
      table += `<tr>
        <td data-label="ID">${i + 1}</td>
        <td data-label="TITLE">${cur.title}</td>
        <td data-label="PRICE">${cur.price}$</td>
        <td data-label="TAXES">${cur.tax}</td>
        <td data-label="ADS">${cur.ads}</td>
        <td data-label="DISCOUNT">${cur.discount}</td>
        <td data-label="TOTAL">${cur.total}</td>
        <td data-label="CATEGORY">${cur.category}</td>
        <td >
        <div  id="${i}"  onclick ="updateItem(${i})" class=" table__btn--update" >UPDATE</div>
        </td>
        <td >
        <div  id="${i}" onclick ="deleteItem(${i})" class=" table__btn--delete" >Delete</div>
                </td>
                </tr>
                `;
      ++i;
    }
  });
  tableBody.innerHTML = table;
}

// _________________________________________________________
function validation() {
  if (!priceElement.value) priceElement.placeholder = " Fill Price";
  if (!categoryInput.value) categoryInput.placeholder = "Please Fill category";
  if (!titleInput.value) titleInput.placeholder = "Please Fill title";

  if (titleInput.value && priceElement.value && categoryInput.value) {
    if (Number(countElement.value) > 100) {
      countLabel.classList.add("active-label");
      return false;
    }
    return true;
  } else {
    return false;
  }
}
