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
    cart: JSON.parse(window.localStorage.getItem(`cart`)) || {},
  };
  printProducts(db);
  handlerPrintAmountProducts(db);

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

  iconCart.addEventListener("click", function () {
    cart.classList.toggle("showCart");
  });
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
  });
  window.localStorage.setItem("cart", JSON.stringify(db.cart));
  console.log(db.cart);
}
main();
