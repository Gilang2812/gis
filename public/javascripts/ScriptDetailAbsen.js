var data; // Variabel untuk menyimpan data

function getDetailAbsen() {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    var currentPage = 1; // Halaman saat ini
    var rowsPerPage = 5; // Jumlah baris per halaman (sesuaikan sesuai kebutuhan)

    let absen_id = window.location.pathname.split('/')[2]
    var urlParams = new URLSearchParams(window.location.search);
    var tlg = urlParams.get("tgl");

    let tanggal = ubahBulanKeNama(tlg)


    var nama = urlParams.get("nama");
    let title = capitalizeEachWord(nama);
    document.getElementById('title').innerText = `Absen ${title}`
    document.getElementById('waktu').innerText = ` ${tanggal}`
    fetch(`http://localhost:3000/detailAbsen/${absen_id}`, requestOptions)
        .then(response => response.json()) // Assuming the response is in JSON format
        .then(responseData => {
            data = responseData; // Simpan data respons ke variabel data
            console.log(data);
            displayData();
        })
        .catch(error => console.log('error', error));

    function displayData() {
        var tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = '';

        // Calculate the starting and ending indices for the current page
        var startIndex = (currentPage - 1) * rowsPerPage;
        var endIndex = Math.min(startIndex + rowsPerPage, data.length);

        // Loop through the data and populate the table for the current page
        for (var i = startIndex; i < endIndex; i++) {
            var item = data[i];
            var row = tableBody.insertRow();
            row.insertCell(0).textContent = i + 1;
            row.insertCell(1).textContent = item.Praktikan.nim;
            row.insertCell(2).textContent = item.Praktikan.nama;
            var statusCell = row.insertCell(3);
            statusCell.className = 'text-center'
            if (item.status_kehadiran === null) {
                statusCell.textContent = "Belum Absen";
                statusCell.style.color = "red";
            } else {
                statusCell.textContent = item.status_kehadiran;
            }
        }


        document.getElementById("currentPage").textContent = currentPage;
    }

    document.getElementById("previousPage").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            displayData();
        }
    });

    document.getElementById("nextPage").addEventListener("click", () => {
        if (currentPage < Math.ceil(data.length / rowsPerPage)) {
            currentPage++;
            displayData();
        }
    });
}


getDetailAbsen(); // Panggil fungsi untuk mengambil data dan menampilkan data awal
