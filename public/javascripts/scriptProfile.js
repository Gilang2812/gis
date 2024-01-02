var myHeaders = new Headers()
let role = sessionStorage.getItem("role")

myHeaders.append("authorization", `bearer ${sessionStorage.getItem('token')}`)

document.getElementById('editPassword').addEventListener('click', ()=>{
    document.getElementById('modal').style.display='block'
})


var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("http://localhost:3000/profileUser", requestOptions)
  .then(response => response.json())
  .then(result =>{
     console.log(result)
    document.getElementById("nama").textContent = result.nama
    document.getElementById("email").textContent =result.email
    if(role==='asisten'){
        document.getElementById("kelas").textContent = ''
    }
    document.getElementById("kelas").textContent = result.kelas

    })
  .catch(error => console.log('error', error));
