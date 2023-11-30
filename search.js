const inputElement = document.querySelector("#search-input");
const search_icon = document.querySelector("#search-close-icon");
const sort_wrapper = document.querySelector(".sort-wrapper");

// ตรวจสอบการพิมพ์ข้อมูลในช่องค้นหา
inputElement.addEventListener("input", () => {
  handleInputChange(inputElement);
});

// จัดการเหตุการณ์เมื่อคลิกปุ่มปิดค้นหา
search_icon.addEventListener("click", handleSearchCloseOnClick);

// จัดการเหตุการณ์เมื่อคลิกไอคอนเรียงลำดับ
sort_wrapper.addEventListener("click", handleSortIconOnClick);

// จัดการการพิมพ์ข้อมูลในช่องค้นหา
function handleInputChange(inputElement) {
  const inputValue = inputElement.value;

  if (inputValue !== "") {
    document
      .querySelector("#search-close-icon")
      .classList.add("search-close-icon-visible");
  } else {
    document
      .querySelector("#search-close-icon")
      .classList.remove("search-close-icon-visible");
  }
}

// จัดการเหตุการณ์เมื่อคลิกปุ่มปิดค้นหา
function handleSearchCloseOnClick() {
  document.querySelector("#search-input").value = "";
  document
    .querySelector("#search-close-icon")
    .classList.remove("search-close-icon-visible");
}

// จัดการเหตุการณ์เมื่อคลิกไอคอนเรียงลำดับ
function handleSortIconOnClick() {
  document
    .querySelector(".filter-wrapper")
    .classList.toggle("filter-wrapper-open");
  document.querySelector("body").classList.toggle("filter-wrapper-overlay");
}