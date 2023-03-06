const nav = document.querySelector("nav");
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
  darkMode.style.display = "flex";
});

menu.addEventListener(`click`, function () {
  menu.classList.toggle("menu_show");
  closeMenu.replaceWith(bxMenu);
  darkMode.style.display = "flex";
});

window.addEventListener("scroll", function () {
  if (window.scrollY > 50) {
    // Add the "headerscrolled" class to the "nav" element
    nav.classList.add("headerscrolled");
  } else {
    // Remove the "headerscrolled" class from the "nav" element
    nav.classList.remove("headerscrolled");
  }
});
