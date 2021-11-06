const filterControl = document.querySelector(".filter-control");
const filterDropDown = document.querySelector(".filter-dropdown");

filterControl.addEventListener("click", () => {
  filterDropDown.classList.toggle("slide-down");
});
