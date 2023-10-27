
getAbsen();
createAbsen();
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

            console.log(data)
            var tableBody = document.getElementById("tBody");

            // Loop through the data and populate the table
            data.forEach((item, index) => {
                var row = tableBody.insertRow();
                row.insertCell(0).textContent = index + 1; // No
                row.insertCell(1).textContent = item.tanggal;
                row.insertCell(2).textContent = item.jam_buka;
                row.insertCell(3).textContent = item.jam_tutup;
                const cell4 = row.insertCell(4);
                cell4.classList = `text-center d-flex justify-content-md-around`

                const edtiButton = document.createElement("button")
                edtiButton.innerText = "Edit"
                edtiButton.classList = "btn btn-warning"
                const detailButton = document.createElement("a")
                detailButton.innerText = "Detail"
                detailButton.classList = "btn btn-info"

                detailButton.href = `/absen/${item.absen_id}`

                edtiButton.addEventListener('click', () => {
                    console.log(item.absen_id)
                    document.getElementById("modal").style.display = "block";

                    document.getElementById('tanggalUpdate').value = new Date(item.tanggal).toISOString().slice(0, 16);
                    function convertToTimeFormat(timeString) {
                        const timeParts = timeString.split(':');
                        return timeParts[0] + ':' + timeParts[1];
                    }

                    document.getElementById('jamBukaUpdate').value = convertToTimeFormat(item.jam_buka);
                    document.getElementById('jamTutupUpdate').value = convertToTimeFormat(item.jam_tutup);

                    document.getElementById('updateAbsen').addEventListener('submit', (event) => {
                        event.preventDefault();

                        const tanggal = document.getElementById('tanggalUpdate').value
                        const jamBuka = document.getElementById('jamBukaUpdate').value
                        const jamTutup = document.getElementById('jamTutupUpdate').value
                        myHeaders.append('authorization', 'Bearer ' + token);
                        myHeaders.append("Content-Type", "application/json");

                        var raw = JSON.stringify({
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

                        fetch(`http://localhost:3000/absen/${item.absen_id}/update`, requestOptions)
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

                cell4.append(edtiButton)
                cell4.append(detailButton)



            });
        })
        .catch(error => console.log('error', error));
}


function createAbsen() {
    document.getElementById('createAbsen').addEventListener('submit', (event) => {
        event.preventDefault();

        var myHeaders = new Headers();
        myHeaders.append('authorization', 'Bearer ' + token);
        myHeaders.append("Content-Type", "application/json");

        const tanggal = document.getElementById('tanggal').value
        const jamBuka = document.getElementById('jamBuka').value
        const jamTutup = document.getElementById('jamTutup').value

        var raw = JSON.stringify({

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


