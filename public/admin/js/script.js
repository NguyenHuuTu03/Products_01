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

// Show alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
  const closeAlert = showAlert.querySelector("[close-alert]");
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End Show alert

// canvas
document.addEventListener("DOMContentLoaded", function () {

  function safeParse(value) {
    try {
      return JSON.parse(value || "[]");
    } catch (e) {
      console.error("JSON parse error:", e, value);
      return [];
    }
  }

  const revenueEl = document.getElementById("revenueChart");
  const productEl = document.getElementById("productChart");

  if (revenueEl) {
    const revenueData = safeParse(revenueEl.dataset.revenue);

    new Chart(revenueEl, {
      type: "line",
      data: {
        labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
        datasets: [{
          label: "Doanh thu ($)",
          data: revenueData
        }]
      }
    });
  }

  if (productEl) {
    const productLabels = safeParse(productEl.dataset.labels);
    const productData = safeParse(productEl.dataset.data);

    new Chart(productEl, {
      type: "bar",
      data: {
        labels: productLabels,
        datasets: [{
          label: "Số lượng bán",
          data: productData
        }]
      }
    });
  }

});
// end canvas