
getAbsen();
createAbsen();

let currentPage = 1;
const itemsPerPage = 5; // Adjust the number of items per page as needed

function getAbsen() {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/absen", requestOptions)
        .then(response => response.json()) // Assuming the response is in JSON format
        .then(data => {
            // Sort the data by name
            data.sort((a, b) => a.nama.localeCompare(b.nama));

            const updateTable = (data) => {
                const tableBody = document.getElementById("tBody");
                tableBody.innerHTML = "";

                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;

                data.slice(startIndex, endIndex).forEach((item, index) => {
                    const row = tableBody.insertRow();
                    row.insertCell(0).textContent = startIndex + index + 1; // No
                    row.insertCell(1).textContent = item.nama;
                    let tanggalTanpaZT = item.tanggal.substring(0, 10);
                    row.insertCell(2).textContent = tanggalTanpaZT;
                    row.insertCell(3).textContent = item.jam_buka;
                    row.insertCell(4).textContent = item.jam_tutup;
                    const cell5 = row.insertCell(5);
                    cell5.classList = `text-center d-flex justify-content-md-around`;

                    const editButton = document.createElement("button");
                    editButton.innerText = "Edit";
                    editButton.classList = "btn btn-warning text-white";
                    const detailButton = document.createElement("a");
                    detailButton.innerText = "Detail";
                    detailButton.classList = "btn btn-info text-white";
                    let tanggal = new Date(item.tanggal).toISOString().slice(0, 16);

                    detailButton.href = `/absen/${item.absen_id}?nama=${item.nama}&tgl=${tanggal}`;

                    editButton.addEventListener('click', () => {
                        document.getElementById("modal").style.display = "block";
                        document.getElementById("namaUpdate").value = item.nama;
                        document.getElementById('tanggalUpdate').value = tanggal;

                        function convertToTimeFormat(timeString) {
                            const timeParts = timeString.split(':');
                            return timeParts[0] + ':' + timeParts[1];
                        }

                        document.getElementById('jamBukaUpdate').value = convertToTimeFormat(item.jam_buka);
                        document.getElementById('jamTutupUpdate').value = convertToTimeFormat(item.jam_tutup);

                        document.getElementById('updateAbsen').addEventListener('submit', (event) => {
                            event.preventDefault();
                            updateAbsen(item.absen_id);
                        });
                    });

                    cell5.append(editButton);
                    cell5.append(detailButton);
                });
                updatePagination()
            };

            // Search functionality
            document.getElementById('search').addEventListener('input', (event) => {
                const searchTerm = event.target.value.toLowerCase();
                const filteredData = data.filter(item => item.nama.toLowerCase().includes(searchTerm));
                currentPage = 1; // Reset current page to 1 when searching
                updateTable(filteredData);
            });

            // Pagination functionality
            document.getElementById('previousPage').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTable(data);
                }
            });

            document.getElementById('nextPage').addEventListener('click', () => {
                const totalPages = Math.ceil(data.length / itemsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTable(data);
                }
            });

            // Initial table rendering
            updateTable(data);
        })
        .catch(error => console.log('error', error));
}


function createAbsen() {
    document.getElementById('createAbsen').addEventListener('submit', (event) => {
        event.preventDefault();

        var myHeaders = new Headers();
        myHeaders.append('authorization', 'Bearer ' + token);
        myHeaders.append("Content-Type", "application/json");

        const nama = document.getElementById('nama').value
        const tanggal = document.getElementById('tanggal').value
        const jamBuka = document.getElementById('jamBuka').value
        const jamTutup = document.getElementById('jamTutup').value

        var raw = JSON.stringify({

            "nama": nama,
            "tanggal": tanggal,
            "jam_buka": jamBuka,
            "jam_tutup": jamTutup
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:3000/absen/create", requestOptions)
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

function updateAbsen(idAbsen){
    const nama = document.getElementById('namaUpdate').value
    const tanggal = document.getElementById('tanggalUpdate').value
    const jamBuka = document.getElementById('jamBukaUpdate').value
    const jamTutup = document.getElementById('jamTutupUpdate').value

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append('authorization', 'Bearer ' + token);

    var raw = JSON.stringify({
        "nama": nama,
        "tanggal": tanggal,
        "jam_buka": jamBuka,
        "jam_tutup": jamTutup
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(`http://localhost:3000/absen/${idAbsen}/update`, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            if (result.success) {
                localStorage.setItem("flashMessage", result.success);

                const randomValue = new Date().getTime(); // Nilai waktu acak
                location.href = `?random=${randomValue}`;
            } else if (result.error) {
                alert('gagal', result.error)

            }
        })
        .catch(error => {
            console.log('error', error)
            alert(error)
        });
}


function updatePagination() {
    document.getElementById("currentPage").textContent = currentPage;
    document.getElementById("currentPage").style.color = 'white';
  }
