
var data
function getDetailTugas(page) {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + sessionStorage.getItem('token'));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    var currentPage = 1; // Halaman saat ini
    var rowsPerPage = 5; // Jumlah baris per halaman (sesuaikan sesuai kebutuhan)
    const tugas_id = window.location.pathname.split("/")[2]
    var urlParams = new URLSearchParams(window.location.search);

    var judul = urlParams.get("judul");
    let title = capitalizeEachWord(judul);
    document.getElementById('title').innerText = `Tugas ${title}`

    fetch(`http://localhost:3000/detailTugas/${tugas_id}`, requestOptions)
        .then(response => response.json())
        .then(responseData => {

            data = responseData; // Simpan data respons ke variabel data
            console.log(data);
            displayData();

        })

        .catch(error => {
            alert('error ya ', error)
            console.log('error', error)
        });

    function displayData() {
        var tableBody = document.getElementById("tableBody");
        tableBody.innerHTML = '';

        // Calculate the starting and ending indices for the current page
        var startIndex = (currentPage - 1) * rowsPerPage;
        var endIndex = Math.min(startIndex + rowsPerPage, data.length);


        for (var i = startIndex; i < endIndex; i++) {
            var item = data[i];
            var row = tableBody.insertRow();
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);

            if (item.nilai === null || item.nilai === 0) {
                item.nilai = "belum di nilai"
                cell3.style.color = "red"
            }
         

            cell1.innerHTML = i + 1
            cell2.innerHTML = item.Tuga.deadline;
            cell3.innerHTML = item.nilai;
            cell4.innerHTML = item.Praktikan.nama;

            var laporan = item.laporan;
            if(laporan){
                var Name = laporan.split('-')[1]
                cell5.innerHTML = Name;
            }else    if (item.laporan === null) {
                item.laporan = "belum di kumpul"
                cell5.style.color = "red"
                cell5.innerHTML =item.laporan
            }
            cell6.className = "text-center";
            let editButton = document.createElement("button");
            editButton.className = "btn btn-info";
            editButton.textContent = "Detail";

            cell6.appendChild(createEditButton(item)); // Menggunakan fungsi yang mengembalikan tombol Edit

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

function createEditButton(item) {
    let editButton = document.createElement("button");
    editButton.className = "btn btn-info";
    editButton.textContent = "Detail";

    editButton.addEventListener('click', () => {
        document.getElementById("modal").style.display = "block";
        console.log(item.praktikan_id)
        document.getElementById("nama_pengumpul").textContent = `Nama :${item.Praktikan.nama}`
        document.getElementById("nim").innerText = `NIM :${item.Praktikan.nim}`
        if (item.Asisten != null) {
            document.getElementById("penilai").innerText = `penilai :${item.Asisten.nama}`
        }
        document.getElementById("nilai").value = item.nilai
        document.getElementById("laporan").src = `/images/${item.laporan}`
        if (item.laporan === 'belum di kumpul') {
            document.getElementById("laporan").src = ''
        }

        document.getElementById('updateNilai').addEventListener('submit', (event) => {
            event.preventDefault();

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append('authorization', 'Bearer ' + sessionStorage.getItem('token'));

            const nilai = document.getElementById("nilai").value
            var raw = JSON.stringify({
                "nilai": nilai
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(`http://localhost:3000/detailTugas/${item.praktikan_id}/${item.tugas_id}/update`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    if (result.success) {
                        localStorage.setItem("flashMessage", result.success);

                        location.reload()
                    } else if (result.error) {
                        alert("gagal", result.error)
                    }
                })
                .catch(error => {
                    console.log('error', error)
                    alert(error)
                });
        })
    });

    return editButton; 
}
getDetailTugas(currentPage);
