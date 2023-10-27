
let currentPage = 1;  // Halaman saat ini
const itemsPerPage = 10;  // Jumlah item per halaman

function getDetailTugas(page) {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    const tugas_id = window.location.pathname.split("/")[2]
    fetch(`http://localhost:3000/detailTugas/${tugas_id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);

            // Batasi hasil ke jumlah yang diinginkan per halaman
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const slicedData = result.slice(startIndex, endIndex);

            var tbody = document.getElementById("tableBody");
            tbody.innerHTML = "";

            slicedData.forEach(data => {
                var row = tbody.insertRow();
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);

                if (data.nilai === null || data.nilai === 0) {
                    data.nilai = "belum di nilai"
                    cell3.style.color = "red"
                }
                if (data.laporan === null) {
                    data.laporan = "belum di kumpul"
                    cell5.style.color = "red"

                }

                cell1.innerHTML = data.Tuga.judul;
                cell2.innerHTML = data.Tuga.deadline;
                cell3.innerHTML = data.nilai;
                cell4.innerHTML = data.Praktikan.nama;
                cell5.innerHTML = data.laporan;
                cell6.className = "text-center";
                let editButton = document.createElement("button");
                editButton.className = "btn btn-info";
                editButton.textContent = "Detail";

                editButton.addEventListener('click', () => {
                    document.getElementById("modal").style.display = "block";

                    document.getElementById("nama_pengumpul").textContent = `Nama :${data.Praktikan.nama}`
                    document.getElementById("nim").innerText = `NIM :${data.Praktikan.nim}`
                    if (data.Asisten != null) {
                        document.getElementById("penilai").innerText = `penilai :${data.Asisten.nama}`
                    }
                    document.getElementById("nilai").value = data.nilai
                    document.getElementById("laporan").src = `/images/${data.laporan}`
                    if (data.laporan === 'belum di kumpul') {
                        document.getElementById("laporan").src = ''
                    }

                    document.getElementById('updateNilai').addEventListener('submit', (event) => {
                        event.preventDefault();

                        myHeaders.append('authorization', 'Bearer ' + token);
                        myHeaders.append("Content-Type", "application/json");

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

                        fetch(`http://localhost:3000/detailTugas/${data.praktikan_id}/${data.tugas_id}/update`, requestOptions)
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
                });

                cell6.appendChild(editButton);
            });
        })
        .catch(error => console.log('error', error));
    document.getElementById("currentPage").textContent = `${page}`;
}

function nextPage() {
    currentPage++;
    getDetailTugas(currentPage);
}


function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        getDetailTugas(currentPage);
    }
}

// Tambahkan event listener untuk tombol "Halaman Berikutnya" dan "Halaman Sebelumnya"
document.getElementById("nextPage").addEventListener("click", nextPage);
document.getElementById("previousPage").addEventListener("click", previousPage);

getDetailTugas(currentPage);
