/** @format */

var myHeaders = new Headers();
let data = []; // Global variable to store original data
let currentPage = 1;
const itemsPerPage = 5;

function getPraktikanAbsen() {
  var myHeaders = new Headers();
  myHeaders.append("authorization", "Bearer " + token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  function sortAndDisplay(praktikanList) {
    const sortedPraktikan = praktikanList.sort((a, b) =>
      a.Absen.nama.localeCompare(b.Absen.nama)
    );

    displayData(sortedPraktikan);
  }

  function displayData(praktikanList) {
    var tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;

    praktikanList.slice(startIndex, endIndex).forEach((item, index) => {
      let status = item.status_kehadiran;
      var row = tableBody.insertRow();
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      var cell6 = row.insertCell(5);
      var cell7 = row.insertCell(6);

      let tanggalInput = item.Absen.tanggal;
      var tanggal = new Date(tanggalInput);

      var namaHari = getNamaHari(tanggal.getDay());
      var tanggalNumerik = tanggal.getDate();
      var namaBulan = getNamaBulan(tanggal.getMonth());
      var tahun = tanggal.getFullYear();

      var formatTanggal = `${namaHari}, ${tanggalNumerik} ${namaBulan} ${tahun}`;

      cell1.innerHTML = index + 1 + (currentPage-1)*itemsPerPage;
      cell2.innerHTML = item.Absen.nama;
      cell3.innerHTML = formatTanggal;

      cell4.innerHTML = item.Absen.jam_buka;
      cell5.innerHTML = item.Absen.jam_tutup;

      var actionButton = document.createElement("button");
      actionButton.textContent = "Absen";
      actionButton.className = "btn btn-secondary text-white ";
      actionButton.style.color = "white ";

      if (status === null) {
        status = "belum absen";
        cell6.style.color = "red";
      } else {
        actionButton.disabled = true;
      }

      cell6.innerHTML = status;
      actionButton.addEventListener("click", () => {
        console.log(item.absen_id);
        let absen_id = item.absen_id;
        if (window.confirm("isi absen?")) {
          submitAbsen(absen_id);
        }
      });

      cell7.appendChild(actionButton);
    });
    updatePagination() 
  }

  fetch("http://localhost:3000/praktikan/detailAbsen", requestOptions)
    .then((response) => response.json())
    .then((praktikanList) => {
      data = praktikanList;
      sortAndDisplay(praktikanList);

      document.getElementById("search").addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        const filteredPraktikan = data.filter((praktikan) =>
          praktikan.Absen.nama.toLowerCase().includes(searchTerm)
        );
        sortAndDisplay(filteredPraktikan);
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
    .catch((error) => console.log("error", error));
}

function updatePagination() {
  document.getElementById("currentPage").textContent = currentPage;
}

function submitAbsen(absen) {
  var myHeaders = new Headers();
  myHeaders.append("authorization", "Bearer " + token);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };

  fetch(`http://localhost:3000/submitAbsen/${absen}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.success) {
        localStorage.setItem("flashMessage", result.success);

        location.reload();
      } else if (result.error) {
        result.error;
        alert("gagal");
      }
    })
    .catch((error) => {
      console.log("error", error);
      alert(error);
    });
}

getPraktikanAbsen();

function getNamaHari(index) {
    var namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return namaHari[index];
}

function getNamaBulan(index) {
    var namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    return namaBulan[index];
}