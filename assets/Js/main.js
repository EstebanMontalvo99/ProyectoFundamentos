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
function printProductsInCart(db) {
  const cartProductsHTML = document.querySelector(".cartProducts");
  let html = ``;

  for (const product in db.cart) {
    const { quantity, price, name, image, id, amount } = db.cart[product];

    html += `<div class="cartProduct">
        <div class="cartProductImg">
            <img src="${image}" alt="Imagen">
        </div>
        <div class="cartProductBody">
        <h4>${name} | $${price}</h4>
        <p>Stock: ${quantity}</p>
        
      <div class="cartProductBodyOp">
        <i class='bx bx-minus'></i>
        <span>${amount}</span>
        <i class='bx bx-plus' ></i>
        <i class='bx bx-trash' ></i>
        </div>
      </div>
    </div>`;
  }
  cartProductsHTML.innerHTML = html;
}
function handleTotal(db) {
  handlerPrintAmountProducts(db); //Esto es del ultimo video que ya viste va al ultimo
}
function addProductsToCart(db) {
  const productsHTML = document.querySelector(".products");
  productsHTML.addEventListener(`click`, function (e) {
    if (e.target.classList.contains("bx-plus")) {
      const id = Number(e.target.id);
      const productFind = db.products.find((product) => product.id === id);

      if (db.cart[productFind.id]) {
        if (productFind.quantity === db.cart[productFind.id].amount)
          return alert("No tenemos mas en bodega");
        db.cart[productFind.id].amount++;
      } else {
        db.cart[productFind.id] = { ...productFind, amount: 1 };
      }
    }
    window.localStorage.setItem("cart", JSON.stringify(db.cart));
    console.log(db.cart);
    printProductsInCart(db);
  });
}
function handleProductinCart(db) {
  const cartProductsHTML = document.querySelector(".cartProducts");
  cartProductsHTML.addEventListener("click", function (e) {
    if (e.target.classList.contains(`bx-plus`)) {
      const id = Number(e.target.parentElement.id);
      const productFind = db.products.find((product) => product.id === id);

      if (productFind.quantity === db.cart[productFind.id].amount)
        return alert("No tenemos mas en bodega");
      db.cart[id].amount++;
    }
    if (e.target.classList.contains(`bx-minus`)) {
      const id = Number(e.target.parentElement.id);
      if (db.cart[id].amount === 1) {
        const response = confirm(`Seguro quieres eliminar el producto?`);
        if (!response) return;
        delete db.cart[id];
      } else db.cart[id].amount--;
    }
    if (e.target.classList.contains(`bx-trash`)) {
      const id = Number(e.target.parentElement.id);
      const response = confirm(`Seguro quieres eliminar el producto?`);
      if (!response) return;
      delete db.cart[id];
    }
    window.localStorage.setItem(`cart`, JSON.stringify(db.cart));
    printProductsInCart(db);
  });
}
async function main() {
  const db = {
    products:
      JSON.parse(window.localStorage.getItem(`products`)) ||
      (await getProducts()),
    cart: JSON.parse(window.localStorage.getItem("cart")) || {},
  };
  printProducts(db);
  handlerPrintAmountProducts(db);
  addProductsToCart(db);
  printProductsInCart(db);
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

const iconCart = document.querySelector(".bx-shopping-bag");
const cart = document.querySelector(".cart");

iconCart.addEventListener("click", function () {
  cart.classList.toggle("showCart");
});
