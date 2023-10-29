function getTugasPraktikan() {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + sessionStorage.getItem('token'));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/praktikan/detailTugas", requestOptions)
        .then(response => response.json())
        .then(result => {
            var table = document.getElementById("PengumpulanTugasTable");
            var tbody = table.querySelector("#tableBody");
            console.log(result)

            result.forEach(item => {
                var row = tbody.insertRow();

                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);

                cell1.innerHTML = item.Tuga.judul;
                cell2.innerHTML = item.Tuga.deadline.replace("T", " ").replace("Z", "").replace(":00.000", '');
                cell3.innerHTML = item.nilai;
                var file = item.Tuga.file;
                var Name = file.split('-')[1]
                cell4.innerHTML = Name;

                var downloadButton = document.createElement('button');
                downloadButton.textContent = 'Unduh';
                downloadButton.className = 'btn btn-primary';
                downloadButton.addEventListener('click', () => {
                    downloadFile(file);
                });
                cell4.appendChild(downloadButton);


                if (item.laporan === null) {
                    item.laporan = "belum mengumpulkan"
                    cell5.style.color = 'red'
                }
                var laporan = item.laporan;
                var Name = laporan.split('-')[1]
                cell5.innerHTML = Name;


                const submitButton = document.createElement('button')
                submitButton.textContent = "Submit"
                submitButton.className = 'btn btn-success'

                submitButton.addEventListener('click', () => {
                    document.getElementById("modal").style.display = "block";
                    console.log(item.tugas_id)
                    document.getElementById('updateTugas').addEventListener('submit', (event) => {
                        event.preventDefault();
                        var myHeaders = new Headers();
                        myHeaders.append('authorization', 'Bearer ' + sessionStorage.getItem('token'));

                        const fileInput = document.getElementById('customFile')
                        var formdata = new FormData();
                        formdata.append("laporan", fileInput.files[0]);

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: formdata,
                            redirect: 'follow'
                        };

                        fetch(`http://localhost:3000/submitTugas/${item.tugas_id}`, requestOptions)
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
                })


                cell6.appendChild(submitButton)

            });
        })
        .catch(error => console.log('error', error));
}
function updateFileName(input) {
    const fileNameText = document.getElementById("fileNameText");
    if (input.files.length > 0) {
        fileNameText.innerHTML = '<i class="far fa-file"></i> ' + input.files[0].name;
    } else {
        fileNameText.innerHTML = '<i class="far fa-file"></i> Belum ada file yang dipilih';
    }
}
function downloadFile(fileName) {
    // Buat tautan untuk mengunduh file
    var downloadLink = document.createElement('a');
    downloadLink.href = `/images/${fileName}`; // Gantilah URL sesuai dengan URL yang benar
    downloadLink.download = fileName;
    downloadLink.click();
}
getTugasPraktikan();
