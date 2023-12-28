var myHeaders = new Headers();

/** @format */

let data = []; 
let currentPage = 1;
const itemsPerPage = 5;

function getTugas() {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    function sortAndDisplay(tugasList) {
        const sortedTugas = tugasList.sort((a, b) => a.judul.localeCompare(b.judul));

        displayTugas(sortedTugas);
    }

    function displayTugas(tugasList) {
        let table = document.getElementById("TugasTable");
        let tbody = table.getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';

        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;

        tugasList.slice(startIndex, endIndex).forEach((tugas, index) => {
            var row = tbody.insertRow();
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);

            cell1.innerHTML = index + 1;
            cell2.innerHTML = tugas.judul;
            cell3.innerHTML = tugas.deadline;
            var file = tugas.file;
            var Name = file.split('-')[1]
            cell4.innerHTML = Name;
            cell5.innerHTML = tugas.deskripsi;
            cell6.className = `text-center d-flex justify-content-md-around`

            let editButton = document.createElement('button');
            editButton.innerText = "Edit";
            editButton.classList = "btn btn-warning text-white";

            let detailButton = document.createElement("a")
            detailButton.classList = "btn btn-info text-white"
            detailButton.innerText = "Detail"
            detailButton.href = `/pengumpulan/${tugas.tugas_id}?judul=${tugas.judul}`

            editButton.addEventListener('click', () => {
                document.getElementById("modal").style.display = "block";
                document.getElementById('judulUpdate').value = tugas.judul
                const deadlineDate = new Date(tugas.deadline);
                const formattedDeadline = deadlineDate.toISOString().slice(0, 16);
                document.getElementById('deadlineUpdate').value = formattedDeadline;
                document.getElementById('deskripsiUpdate').value = tugas.deskripsi
                console.log(tugas.tugas_id)

                document.getElementById('updateTugas').addEventListener('submit', (event) => {
                    event.preventDefault();
                    updateTugas(tugas.tugas_id)
    
                })
            })

            cell6.appendChild(editButton)
            cell6.appendChild(detailButton);
        });
        updatePagination()
    }

    fetch("http://localhost:3000/tugas", requestOptions)
        .then(response => response.json())
        .then(tugasList => {
            data = tugasList; 
            sortAndDisplay(tugasList);

   
            document.getElementById("search").addEventListener("input", function () {
                const searchTerm = this.value.toLowerCase();
                const filteredTugas = data.filter(
                    tugas => tugas.judul.toLowerCase().includes(searchTerm)
                );
                sortAndDisplay(filteredTugas);
                updatePagination();
            });

 
            document.getElementById("previousPage").addEventListener("click", () => {
                if (currentPage > 1) {
                    currentPage--;
                    sortAndDisplay(data);
                    updatePagination();
                }
            });

            document.getElementById("nextPage").addEventListener("click", () => {
                if (currentPage < Math.ceil(data.length / itemsPerPage)) {
                    currentPage++;
                    sortAndDisplay(data);
                    updatePagination();
                }
            });
        })
        .catch(error => console.log('error', error));
}


document.getElementById('createTugas').addEventListener('submit', (event) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);

    const judul = document.getElementById('judul').value
    const deskripsi = document.getElementById('deskripsi').value
    const deadline = document.getElementById('deadline').value
    const fileInput = document.getElementById('file')
    var formdata = new FormData();
    formdata.append("judul", judul);
    formdata.append("deskripsi", deskripsi);
    formdata.append("deadline", deadline);
    formdata.append("file", fileInput.files[0]);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };
    fetch("http://localhost:3000/tugas/create", requestOptions)
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
});

function updateTugas(idTugas){
    const judulUpdate = document.getElementById('judulUpdate').value
    const deadlineUpdate = document.getElementById('deadlineUpdate').value
    const deskripsiUpdate = document.getElementById('deskripsiUpdate').value
    myHeaders.append('authorization', 'Bearer ' + token);

    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "judul": judulUpdate,
        "deadline": deadlineUpdate,
        "deskripsi": deskripsiUpdate
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`http://localhost:3000/tugas/${idTugas}/update`, requestOptions)
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
}

  
function updatePagination() {
        document.getElementById("currentPage").innerText = currentPage; 
        document.getElementById("currentPage").style.color = 'white';
}


