// Cập nhật số lượng sản phẩm trong giỏ hàng
const inputQuantity = document.querySelectorAll("input[name='quantity']");
if (inputQuantity.length > 0) {
  inputQuantity.forEach(input => {
    input.addEventListener("change", (e) => {
      const quantity = e.target.value;
      const productId = input.getAttribute("product-id");
      window.location.href = `/cart/update/${productId}/${quantity}`;
    });
  });
}
// Hết Cập nhật số lượng sản phẩm trong giỏ hàng