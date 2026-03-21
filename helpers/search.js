module.exports = (query) => {
  let objectSearch = {
    keyword: ""
  };
  if (query.keyword) {
    objectSearch.keyword = query.keyword;
    const regex = new RegExp(objectSearch.keyword, "i"); // tìm gần đúng và không phân biệt chữ hoa chữ thường
    objectSearch.regex = regex;
  }
  return objectSearch;
}