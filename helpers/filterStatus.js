module.exports = (query) => {
  let filtersStatus = [{
      name: "Tất cả",
      status: "",
      class: ""
    },
    {
      name: "Hoạt động",
      status: "active",
      class: ""
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: ""
    }
  ];

  if (query.status) {
    const index = filtersStatus.findIndex(item => item.status == query.status);
    filtersStatus[index].class = "active";
  } else {
    const index = filtersStatus.findIndex(item => item.status == "");
    filtersStatus[index].class = "active";
  }
  return filtersStatus;
}