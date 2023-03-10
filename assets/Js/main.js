async function getProducts() {
  try {
    const data = await fetch(
      "https://ecommercebackend.fundamentos-29.repl.co/"
    );
    const response = await data.json();
    window.localStorage.setItem("products", JSON.stringify(response));
    return response;
  } catch (error) {
    console.log(error);
  }
}
function printProducts(db) {
  const productsHTML = document.querySelector(".products");
  let html = ``;
  for (const product of db.products) {
    html += `
    <div class="product">
      <div class="productImg">
        <img src="${product.image}" alt="Imagen">
      </div>

      <div class="productInfo">
        <h4>${product.name} <span><b>Stock</b>: ${product.quantity}</span> </h4>
        <h5>
           $${product.price} 
          <i class='bx bx-plus' id="${product.id}"></i>
        </h5>
        </div>
      </div>`;
  }

  productsHTML.innerHTML = html;
}
function handlerPrintAmountProducts(db) {
  const amountProductsHTML = document.querySelector(".amountProducts");
  let amount = 0;
  for (const product in db.cart) {
    amount += db.cart[product].amount;
  }
  amountProductsHTML.textContent = amount;
}
function handleTotal(db) {
  handlerPrintAmountProducts(db); //Esto es del ultimo video que ya viste va al ultimo
}
async function main() {
  const db = {
    products:
      JSON.parse(window.localStorage.getItem(`products`)) ||
      (await getProducts()),
    cart: {},
  };
  printProducts(db);
  handlerPrintAmountProducts(db);
}
main();
const header = document.querySelector("header");
const menu = document.querySelector(".menu");
const bxMenu = document.querySelector(".bxMenu");
const darkMode = document.querySelector(".darkMode");
const closeMenu = document.querySelector(".closeMenu");

bxMenu.addEventListener(`click`, function () {
  menu.classList.toggle("menu_show");
  bxMenu.replaceWith(closeMenu);
  darkMode.style.display = "none";
  closeMenu.style.display = "flex";
});
closeMenu.addEventListener(`click`, function () {
  menu.classList.toggle("menu_show");
  closeMenu.replaceWith(bxMenu);
  darkMode.style.display = "block";
});

menu.addEventListener(`click`, function () {
  menu.classList.toggle("menu_show");
  closeMenu.replaceWith(bxMenu);
  darkMode.style.display = "flex";
});

window.addEventListener("scroll", function () {
  if (window.scrollY > 50) {
    header.classList.add("headerscrolled");
  } else {
    header.classList.remove("headerscrolled");
  }
});
