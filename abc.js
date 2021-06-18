// GET by default.
// fetch('https://reqres.in/api/users/2')
//   .then((res) => {
//     if (res.ok) return res.json();
//     console.log('error');
//   })
//   .then((data) => console.log(data));

fetch('https://reqres.in/api/users', {
  method: 'POST',
  headers: {
    'Content-type': 'application/json',
  },
  body: JSON.stringify({
    name: 'User 1',
  }),
})
  .then((res) => {
    return res.json;
  })
  .then((data) => console.log(data))
  .catch((error) => console.log(error));
