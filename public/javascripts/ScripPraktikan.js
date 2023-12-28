
function getPraktikan() {
    const itemsPerPage = 5;
    let currentPage = 1;
    let data; // Store the original data globally

    function displayPraktikan(praktikans) {
        let table = document.getElementById("PraktikanTable");
        let tbody = table.getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';

        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;

        praktikans.slice(startIndex, endIndex).forEach((praktikan, index) => {
            let row = tbody.insertRow();
            let cellNo = row.insertCell(0);
            let cell1 = row.insertCell(1);
            let cell2 = row.insertCell(2);
            let cell3 = row.insertCell(3);
            let cell4 = row.insertCell(4);
            let cell5 = row.insertCell(5);

            cellNo.textContent = startIndex + index + 1;

            cell1.innerHTML = praktikan.nim;
            cell2.innerHTML = praktikan.email;
            cell3.innerHTML = praktikan.nama;
            cell4.innerHTML = praktikan.kelas;
            cell5.className = `text-center d-flex justify-content-md-around`;

            let editButton = document.createElement('button');
            editButton.innerText = "Edit";
            editButton.classList = "btn btn-warning text-white";

            editButton.addEventListener('click', () => {
                document.getElementById("modal").style.display = "block";
                console.log(praktikan.praktikan_id)
                document.getElementById('nimUpdate').value = praktikan.nim
                document.getElementById('emailUpdate').value = praktikan.email
                document.getElementById('namaUpdate').value = praktikan.nama
                document.getElementById('kelasUpdate').value = praktikan.kelas

                updatePraktikan(praktikan.praktikan_id)
            });

            let deleteButton = document.createElement('button');
            deleteButton.innerText = "Delete";
            deleteButton.className = "btn btn-danger";

            deleteButton.addEventListener('click', () => {
                deletePraktikan(praktikan.praktikan_id)
            });

            cell5.appendChild(editButton);
            cell5.appendChild(deleteButton);
        });

        updatePagination();
    }

    function updatePagination() {
        document.getElementById("currentPage").textContent = currentPage;
        document.getElementById("currentPage").style.color = 'white';
    }

    function searchPraktikan(searchTerm) {
        const filteredData = data.filter(praktikan =>
            praktikan.nama.toLowerCase().includes(searchTerm) ||
            praktikan.nim.toLowerCase().includes(searchTerm) ||
            praktikan.email.toLowerCase().includes(searchTerm) ||
            praktikan.kelas.toLowerCase().includes(searchTerm)
        );
        sortAndDisplay(filteredData);
    }

    function sortAndDisplay(praktikans) {
        praktikans.sort((a, b) => {
            const kelasComparison = a.kelas.localeCompare(b.kelas);
            if (kelasComparison !== 0) {
                return kelasComparison;
            }

            return a.praktikan_id - b.praktikan_id;
        });

        displayPraktikan(praktikans);
    }

    document.getElementById("previousPage").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            sortAndDisplay(data);
        }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        if (currentPage < Math.ceil(data.length / itemsPerPage)) {
            currentPage++;
            sortAndDisplay(data);
        }
    });

    document.getElementById("search").addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        searchPraktikan(searchTerm);
    });

    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/praktikan", requestOptions)
        .then(response => response.json())
        .then(praktikans => {
            data = praktikans; // Save the original data
            sortAndDisplay(praktikans);
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

function updatePraktikan(idPraktikan){
    document.getElementById("updatePraktikan").addEventListener('submit', (event) => {
        event.preventDefault();
        var myHeaders = new Headers();
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

        fetch(`http://localhost:3000/praktikan/${idPraktikan}/update`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if (result.success) {
                    localStorage.setItem("flashMessage", result.success);
                    location.reload();
                } else if (result.error) {
                    alert('gagal', result.error)
                    alert("gagal")
                }
            })
            .catch(error => {
                console.log('error', error)
                alert(error)
            });
    })   
}

function deletePraktikan(idPraktikan){

    if (window.confirm("Apakah yakin ingin menghapus")) {
        var myHeaders = new Headers();
        myHeaders.append('authorization', 'Bearer ' + token);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`http://localhost:3000/praktikan/${idPraktikan}/delete`, requestOptions)
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
}


