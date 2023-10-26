
let token = sessionStorage.getItem('token')

function getAsisten() {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/asisten", requestOptions)
        .then(response => response.json()) //
        .then(data => {
            console.log(data)
            let table = document.getElementById("asistenTable");
            let tbody = table.getElementsByTagName('tbody')[0];

            data.forEach(asisten => {
                let row = tbody.insertRow();
                let cell1 = row.insertCell(0);
                let cell2 = row.insertCell(1);
                let cell3 = row.insertCell(2);
                let cell4 = row.insertCell(3);

                cell1.innerHTML = asisten.nim_aslab;
                cell2.innerHTML = asisten.email;
                cell3.innerHTML = asisten.nama;
                cell4.className = `text-center d-flex justify-content-md-around`


                let editButton = document.createElement('button');
                editButton.innerText = "Edit";
                editButton.classList = "btn btn-warning ";

                editButton.addEventListener('click', () => {
                    document.getElementById("modal").style.display = "block";
                    console.log(asisten.asisten_id)
                    document.getElementById('nim_aslabUpdate').value = asisten.nim_aslab
                    document.getElementById('emailUpdate').value = asisten.email
                    document.getElementById('namaUpdate').value = asisten.nama


                    document.getElementById("updateAsisten").addEventListener('submit', (event) => {
                        event.preventDefault();

                        myHeaders.append("Content-Type", "application/json");
                        let nama = document.getElementById('namaUpdate').value
                        var raw = JSON.stringify({
                            "nama": nama
                        });

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: raw,
                            redirect: 'follow'
                        };

                        fetch(`http://localhost:3000/asisten/${asisten.asisten_id}/update`, requestOptions)
                            .then(response => response.json())
                            .then(result => {
                                console.log(result);
                                if (result.success) {
                                    localStorage.setItem("flashMessage", result.success);

                                    location.reload();
                                } else if (result.error) {
                                    result.error
                                    alert("gagal")
                                }
                            })
                            .catch(error => {
                                console.log('error', error)
                                alert(error)
                            });
                    })
                })


                let deleteButton = document.createElement('button');
                deleteButton.innerText = "Delete";
                deleteButton.className = "btn btn-danger";

                deleteButton.addEventListener('click', () => {
                    if (window.confirm("Apakah yakin ingin menghapus")) {
                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            redirect: 'follow'
                        };

                        fetch(`http://localhost:3000/asisten/${asisten.asisten_id}/delete`, requestOptions)
                            .then(response => response.json())
                            .then(result => {
                                console.log(result);
                                if (result.success) {
                                    localStorage.setItem("flashMessage", result.success);

                                    location.reload();
                                } else if (result.error) {
                                    result.error
                                    alert("gagal")
                                }
                            })
                            .catch(error => {
                                console.log('error', error)
                                alert(error)
                            });
                    } else {

                    }
                })

                cell4.appendChild(editButton);
                cell4.appendChild(deleteButton);
            });
        })
        .catch(error => console.log('error', error));
}

function createAsisten() {

    document.getElementById("createAsisten").addEventListener('submit', (event) => {
        event.preventDefault()

        var myHeaders = new Headers();
        myHeaders.append('authorization', 'Bearer ' + token);
        myHeaders.append("Content-Type", "application/json");

        const nim_aslab = document.getElementById('nim_aslab').value
        const nama = document.getElementById('nama').value
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        var raw = JSON.stringify({
            "nim_aslab": nim_aslab,
            "nama": nama,
            "email": email,
            "password": password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3000/asisten/create", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
    
                if (result.success) {
                    localStorage.setItem("flashMessage", result.success);
                   
                    location.reload();
                    window.scrollTo(0, 0);
                } else if (result.error) {
                    result.error
                    alert("gagal")
                }
            })
            .catch(error => {
                console.log('error', error)
                alert(error)
            });
    })
}
