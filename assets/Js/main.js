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
    const buttonAdd = product.quantity
      ? `<i class='bx bx-plus' id="${product.id}"></i>`
      : "<span class=soldOut>SOLD OUT</span>";

    html += `
    <div class="product">
      <div class="productImg">
        <img src="${product.image}" alt="Imagen">
      </div>

      <div class="productInfo">
        <h4>${product.name} <span><b>Stock</b>: ${product.quantity}</span> </h4>
        <h5>
           $${product.price} 
          ${buttonAdd}
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
        
      <div class="cartProductBodyOp" id="${id}">
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
  const btnBuy = document.querySelector(".btnBuy");
  btnBuy.addEventListener("click", function () {
    if (!Object.values(db.cart).length)
      return alert("Tienes que tener algo en el carrito");
    const response = confirm("Seguro que quieres comprar?");
    if (!response) return;
    const currentProducts = [];

    for (const product of db.products) {
      const productCart = db.cart[product.id];
      if (product.id === productCart?.id) {
        currentProducts.push({
          ...product,
          quantity: product.quantity - productCart.amount,
        });
      } else {
        currentProducts.push(product);
      }
    }
    db.products = currentProducts;
    db.cart = {};
    window.localStorage.setItem(`products`, JSON.stringify(db.products));
    window.localStorage.setItem(`cart`, JSON.stringify(db.cart));
    printTotal(db);
    printProductsInCart(db);
    printProducts(db);
    handlerPrintAmountProducts(db);
  });
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
    printProductsInCart(db);
    printTotal(db);
    handlerPrintAmountProducts(db);
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
    printTotal(db);
    handlerPrintAmountProducts(db);
  });
}
function printTotal(db) {
  const infoTotalHTML = document.querySelector(".infoTotal");
  const infoAmountHTML = document.querySelector(".infoAmount");

  let totalProducts = 0,
    amountProducts = 0;

  for (const product in db.cart) {
    const { amount, price } = db.cart[product];
    amountProducts += amount;
    totalProducts += price * amount;
  }
  infoAmountHTML.textContent = "$" + totalProducts + ".00";
  infoTotalHTML.textContent = amountProducts + " units";
}
function handleCartandMenuShow() {
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
}
function loading() {
  const loading = document.querySelector(".loading");
  setTimeout(() => {
    loading.style.opacity = 0;
    loading.style.display = "none";
  }, 1000);
}
function darkMode() {
  const darkMode = document.querySelector(".darkMode");
  const moonIcon = document.querySelector(".moon");
  const sunIcon = document.querySelector(".sun");
  moonIcon.addEventListener("click", function () {
    sunIcon.style.display = "block";
    document.documentElement.style.setProperty(
      "--redish",
      "hsl(182, 53%, 74%)"
    );
    document.documentElement.style.setProperty("--titleH2", "white");
    document.documentElement.style.setProperty("--text", "hsl(182, 53%, 74%)");
    document.documentElement.style.setProperty("--btn-color", "white");
    document.documentElement.style.setProperty("--texth3", "white");
    document.documentElement.style.setProperty(
      "--bgColor",
      "hsl(249, 19%, 14%)"
    );
    document.documentElement.style.setProperty(
      "--footerColor",
      "hsla(246, 16%, 5%)"
    );
    document.documentElement.style.setProperty("--white", "hsl(246, 16%, 12%)");
    moonIcon.replaceWith(sunIcon);
    document.documentElement.style.setProperty("--gray", "hsla(246, 16%, 5%)");
    moonIcon.replaceWith(sunIcon);
  });
  sunIcon.addEventListener("click", function () {
    document.documentElement.style.setProperty(
      "--redish",
      "hsl(354, 78%, 60%)"
    );
    document.documentElement.style.setProperty("--titleH2", "hsl(0, 0%, 15%)");
    document.documentElement.style.setProperty("--text", "hsl(0, 0%, 55%)");
    document.documentElement.style.setProperty(
      "--btn-color",
      "hsl(0, 0%, 17%)"
    );
    document.documentElement.style.setProperty(
      "--texth3",
      "hsla(0, 7%, 16%, 0.849"
    );
    document.documentElement.style.setProperty(
      "--bgColor",
      "hsl(206, 4%, 97%)"
    );
    document.documentElement.style.setProperty(
      "--footerColor",
      "hsl(0, 0%, 90%)"
    );
    document.documentElement.style.setProperty("--white", "white");
    moonIcon.replaceWith(sunIcon);
    document.documentElement.style.setProperty("--gray", "lightgray");

    sunIcon.replaceWith(moonIcon);
  });
}
function showShirts(db) {
  const productsHTML = document.querySelector(".products");
  const shirt = document.querySelector(".shirt");
  shirt.addEventListener("click", function () {
    let html = ``;
    for (const product of db.products) {
      if (product.category === "shirt") {
        const buttonAdd = product.quantity
          ? `<i class='bx bx-plus' id="${product.id}"></i>`
          : "<span class=soldOut>SOLD OUT</span>";

        html += `
          <div class="product scale-animation">
            <div class="productImg">
              <img src="${product.image}" alt="Imagen">
            </div>
            <div class="productInfo">
              <h4>${product.name} <span><b>Stock</b>: ${product.quantity}</span> </h4>
              <h5>
                $${product.price}
                ${buttonAdd}
              </h5>
            </div>
          </div>
        `;
      }
    }
    productsHTML.innerHTML = html;
  });
}

function showHoddies(db) {
  const productsHTML = document.querySelector(".products");
  const hoddie = document.querySelector(".hoddie");
  hoddie.addEventListener("click", function () {
    let html = ``;
    for (const product of db.products) {
      if (product.category === "hoddie") {
        const buttonAdd = product.quantity
          ? `<i class='bx bx-plus' id="${product.id}"></i>`
          : "<span class=soldOut>SOLD OUT</span>";

        html += `
    <div class="product" style="opacity: 0">
      <div class="productImg">
        <img src="${product.image}" alt="Imagen">
      </div>

      <div class="productInfo">
        <h4>${product.name} <span><b>Stock</b>: ${product.quantity}</span> </h4>
        <h5>
           $${product.price} 
          ${buttonAdd}
        </h5>
        </div>
      </div>`;
      }

      productsHTML.innerHTML = html;
    }

    const products = document.querySelectorAll(".product");
    let delay = 0;

    products.forEach((product, index) => {
      setTimeout(() => {
        product.style.opacity = 1;
      }, delay);
      delay += 100;
    });
  });
}

function showAll(db) {
  const productsHTML = document.querySelector(".products");
  const showAll = document.querySelector(".showAll");
  showAll.addEventListener("click", function () {
    let html = ``;
    for (const product of db.products) {
      const buttonAdd = product.quantity
        ? `<i class='bx bx-plus' id="${product.id}"></i>`
        : "<span class=soldOut>SOLD OUT</span>";

      html += `
        <div class="product slide-in"> <!-- add the slide-in class -->
          <div class="productImg">
            <img src="${product.image}" alt="Imagen">
          </div>

          <div class="productInfo">
            <h4>${product.name} <span><b>Stock</b>: ${product.quantity}</span> </h4>
            <h5>
              $${product.price} 
              ${buttonAdd}
            </h5>
          </div>
        </div>`;
    }
    productsHTML.innerHTML = html;

    // Remove the slide-in class after a delay
    const products = document.querySelectorAll(".product");
    setTimeout(() => {
      products.forEach((product) => {
        product.classList.remove("slide-in");
      });
    }, 300);
  });
}

function showSwaters(db) {
  const productsHTML = document.querySelector(".products");
  const sweater = document.querySelector(".sweater");
  sweater.addEventListener("click", function () {
    let html = ``;
    for (const product of db.products) {
      if (product.category === "sweater") {
        const buttonAdd = product.quantity
          ? `<i class='bx bx-plus' id="${product.id}"></i>`
          : "<span class=soldOut>SOLD OUT</span>";

        html += `
          <div class="product fade-in">
            <div class="productImg">
              <img src="${product.image}" alt="Imagen">
            </div>

            <div class="productInfo">
              <h4>${product.name} <span><b>Stock</b>: ${product.quantity}</span> </h4>
              <h5>
                $${product.price} 
                ${buttonAdd}
              </h5>
            </div>
          </div>`;
      }

      productsHTML.innerHTML = html;
    }
    const products = document.querySelectorAll(".product");
    setTimeout(() => {
      products.forEach((product) => {
        product.classList.remove("fade-in");
      });
    }, 300);
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
  handleProductinCart(db);
  printTotal(db);
  handleTotal(db);
  handleCartandMenuShow();
  loading();
  darkMode();
  showAll(db);
  showShirts(db);
  showHoddies(db);
  showSwaters(db);
}

main();
