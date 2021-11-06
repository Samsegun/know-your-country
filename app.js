const filterControl = document.querySelector(".filter-control");
const filterControlSpan = document.querySelector(".filter-control span");
const filterDropDown = document.querySelector(".filter-dropdown");

filterControl.addEventListener("click", () => {
  filterDropDown.classList.toggle("slide-down");
  filterControlSpan.classList.toggle("rotate");
});
