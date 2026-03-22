// button status

const buttonStatus = document.querySelectorAll("[button-status]"); // tìm các button
if (buttonStatus.length > 0) { // nếu tìm thấy
  let url = new URL(window.location.href); // lấy url 
  buttonStatus.forEach(button => { // duyệt qua từng button trong mảng
    button.addEventListener("click", () => { // bắt sự kiện cho từng button
      const status = button.getAttribute("button-status"); // lấy giá trị của attribute trong từng button
      if (status) { // nếu có giá trị
        url.searchParams.set("status", status); // thêm hoặc sửa lại params (key, value)
      } else {
        url.searchParams.delete("status"); // xoá params
      }
      window.location.href = url.href; // chuyển hướng đường dẫn
    })
  })
}

// form search
const formSearch = document.querySelector("#form-search");

if (formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();

    const keyword = e.target.elements.keyword.value;

    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href;
  });
}

// Pagination
const buttonPagination = document.querySelectorAll("[button-page]");
buttonPagination.forEach(button => {
  button.addEventListener("click", () => {
    let url = new URL(window.location.href);
    const pageNumber = button.getAttribute("button-page");
    if (pageNumber) {
      url.searchParams.set("page", pageNumber);
    } else {
      url.searchParams.delete("page");
    }
    window.location.href = url.href;
  });
});
// End Pagination

// Upload Image
const uploadImage = document.querySelector("[upload-image]");

if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const preview = document.querySelector(".preview-image");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  const closeImage = document.querySelector(".close-image");

  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      preview.classList.remove("d-none");
      uploadImagePreview.src = URL.createObjectURL(file); // tạo đường dẫn tạm
    }
  });

  closeImage.addEventListener("click", () => {
    uploadImageInput.value = "";
    uploadImagePreview.src = "";
    preview.classList.add("d-none");
  });
}
// End Upload Image

// Sort
const sort = document.querySelector("[sort]");
if (sort) {
  let url = new URL(window.location.href);
  const sortSelect = sort.querySelector("[sort-select]");
  const sortReset = document.querySelector("[sort-reset]");
  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    const [sortKey, sortValue] = value.split("-");
    if (sortKey && sortValue) {
      url.searchParams.set("sortKey", sortKey);
      url.searchParams.set("sortValue", sortValue);
    } else {
      url.searchParams.delete("sortKey");
      url.searchParams.delete("sortValue");
    }
    window.location.href = url.href;
  });
  sortReset.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    window.location.href = url.href;
  });

  // thêm selected cho option
  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");
  if (sortKey && sortValue) {
    const stringSort = `${sortKey}-${sortValue}`;
    const optionSelected = sortSelect.querySelector(`option[value=${stringSort}]`);
    if (optionSelected) {
      optionSelected.setAttribute("selected", true);
    }
  }
}
// End Sort