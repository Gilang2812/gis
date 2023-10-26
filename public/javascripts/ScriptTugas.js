
let token = sessionStorage.getItem('token')

function getTugas() {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/tugas", requestOptions)
        .then(response => response.json())
        .then(data => {

            var table = document.getElementById("TugasTable");
            let tbody = table.getElementsByTagName('tbody')[0];

            while (table.rows.length > 1) {
                table.deleteRow(1);
            }

            data.forEach((tugas, index) => {
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
                cell4.innerHTML = tugas.file;
                cell5.innerHTML = tugas.deskripsi;
                cell6.className = `text-center d-flex justify-content-md-around`

                let editButton = document.createElement('button');
                editButton.innerText = "Edit";
                editButton.classList = "btn btn-warning ";

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

                        const judulUpdate = document.getElementById('judulUpdate').value
                        const deadlineUpdate = document.getElementById('deadlineUpdate').value
                        const deskripsiUpdate = document.getElementById('deskripsiUpdate').value

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

                        fetch(`http://localhost:3000/tugas/${tugas.tugas_id}/update`, requestOptions)
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
                cell6.appendChild(editButton)

            });
        })
        .catch(error => console.log('error', error));
}

function createTugas() {

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
    })
}