// Permission
const tablePermission = document.querySelector("[table-permissions]");
if (tablePermission) {
  const buttonSubmit = document.querySelector("[button-submit]");
  buttonSubmit.addEventListener("click", () => {
    let permission = [];
    const rows = document.querySelectorAll("[data-name]");
    rows.forEach(row => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");
      if (name == "id") {
        inputs.forEach(input => {
          const id = input.value;
          permission.push({
            id: id,
            permission: []
          });
        });
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;
          if (checked) {
            permission[index].permission.push(name);
          }
        });
      }
    });
    if (permission.length > 0) {
      const formChangePermission = document.querySelector("[form-change-permission]");
      const input = formChangePermission.querySelector("input");
      input.value = JSON.stringify(permission);
      formChangePermission.submit();
    }
  });
}
// End Permission

// Permission data default
const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
  const records = JSON.parse(dataRecords.getAttribute("data-records"));
  const tablePermission = document.querySelector("[table-permissions]");
  records.forEach((record, index) => {
    const permission = record.permission;
    permission.forEach(permission => {
      const row = tablePermission.querySelector(`[data-name=${permission}]`);
      const input = row.querySelectorAll("input")[index];
      input.checked = true;

    });

  });
}
// End Permission data default