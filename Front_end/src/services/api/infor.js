const token = localStorage.getItem("token");

fetch("https://localhost:7154/api/user/info", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then(res => res.json())
  .then(data => {
    console.log(data);
  });
