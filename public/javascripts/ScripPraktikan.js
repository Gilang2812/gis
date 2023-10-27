

function getPraktikan() {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/praktikan", requestOptions)
        .then(response => response.json()) //
        .then(data => {
            console.log(data)
            let table = document.getElementById("PraktikanTable");
            let tbody = table.getElementsByTagName('tbody')[0];

            data.forEach(praktikan => {
                let row = tbody.insertRow();
                let cell1 = row.insertCell(0);
                let cell2 = row.insertCell(1);
                let cell3 = row.insertCell(2);
                let cell4 = row.insertCell(3);
                let cell5 = row.insertCell(4);

                cell1.innerHTML = praktikan.nim;
                cell2.innerHTML = praktikan.email;
                cell3.innerHTML = praktikan.nama;
                cell4.innerHTML = praktikan.kelas;
                cell5.className = `text-center d-flex justify-content-md-around`


                let editButton = document.createElement('button');
                editButton.innerText = "Edit";
                editButton.classList = "btn btn-warning ";

                editButton.addEventListener('click', () => {
                    document.getElementById("modal").style.display = "block";
                    console.log(praktikan.praktikan_id)
                    document.getElementById('nimUpdate').value = praktikan.nim
                    document.getElementById('emailUpdate').value = praktikan.email
                    document.getElementById('namaUpdate').value = praktikan.nama
                    document.getElementById('kelasUpdate').value = praktikan.kelas


                    document.getElementById("updatePraktikan").addEventListener('submit', (event) => {
                        event.preventDefault();
                        myHeaders.append('authorization', 'Bearer ' + token);
                        myHeaders.append("Content-Type", "application/json");
                        let nama = document.getElementById('namaUpdate').value
                        let kelas = document.getElementById('kelasUpdate').value
                        var raw = JSON.stringify({
                            "nama": nama,
                            "kelas": kelas
                        });

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: raw,
                            redirect: 'follow'
                        };

                        fetch(`http://localhost:3000/praktikan/${praktikan.praktikan_id}/update`, requestOptions)
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
                myHeaders.append('authorization', 'Bearer ' + token);
                deleteButton.addEventListener('click', () => {
                    if (window.confirm("Apakah yakin ingin menghapus")) {
                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            redirect: 'follow'
                        };

                        fetch(`http://localhost:3000/praktikan/${praktikan.praktikan_id}/delete`, requestOptions)
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

                cell5.appendChild(editButton);
                cell5.appendChild(deleteButton);
            });
        })
        .catch(error => console.log('error', error));
}

function createPraktikan() {

    document.getElementById("createPraktikan").addEventListener('submit', (event) => {
        event.preventDefault()

        var myHeaders = new Headers();
        myHeaders.append('authorization', 'Bearer ' + token);
        myHeaders.append("Content-Type", "application/json");

        const nim = document.getElementById('nim').value
        const nama = document.getElementById('nama').value
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        const kelas = document.getElementById('kelas').value
        var raw = JSON.stringify({
            "nim": nim,
            "nama": nama,
            "email": email,
            "password": password,
            "kelas": kelas
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3000/praktikan/create", requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if (result.success) {
                    localStorage.setItem("flashMessage", result.success);

                    const randomValue = new Date().getTime(); // Nilai waktu acak
                    location.href = `?random=${randomValue}`;
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
