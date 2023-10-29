function getPraktikanAbsen() {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/praktikan/detailAbsen", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            displayData(result)
        })
        .catch(error => console.log('error', error));
}

function displayData(data) {
    var tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = '';


    data.forEach((item, index) => {

        let status = item.status_kehadiran;
        var row = tableBody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);

        cell1.innerHTML = index + 1;
        cell2.innerHTML = item.Absen.nama;
        cell3.innerHTML = item.Absen.tanggal;
        cell4.innerHTML = item.Absen.jam_buka;
        cell5.innerHTML = item.Absen.jam_tutup;



        var actionButton = document.createElement('button');
        actionButton.textContent = 'Absen';
        actionButton.className = 'btn btn-success';

        if (status === null) {
            status = "belum absen"
            cell6.style.color = 'red'
        } else {
            actionButton.disabled = true
        }
        
        cell6.innerHTML = status
        actionButton.addEventListener('click', () => {

            console.log(item.absen_id);
            let absen_id = item.absen_id
            if (window.confirm("isi absen?")) {
                submitAbsen(absen_id)
            }

        });

        cell7.appendChild(actionButton);
    });
}

function submitAbsen(absen) {
    var myHeaders = new Headers();
    myHeaders.append('authorization', 'Bearer ' + token);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`http://localhost:3000/submitAbsen/${absen}`, requestOptions)
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

getPraktikanAbsen();
