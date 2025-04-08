function handleClick(e) {
    const isClickInsideFilter = e.target.closest(
        ".filter-btn, .filter-dropdown"
    );

    if (isClickInsideFilter) {
        return;
    }

    requestAnimationFrame(() => {
        filterDropDown.classList.remove("slide-down");
        filterControlBtn.classList.remove("rotate");
    });
}

document.addEventListener("click", handleClick);
