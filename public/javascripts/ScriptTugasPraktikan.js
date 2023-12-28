/** @format */

var currentPage = 1;
var itemsPerPage = 5;
var totalPages = 0;
var data = [];

function getTugasPraktikan() {
  var myHeaders = new Headers();
  myHeaders.append(
    "authorization",
    "Bearer " + sessionStorage.getItem("token")
  );

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  function sortAndDisplay(tugasList) {
    const sortedTugas = tugasList.sort((a, b) =>
      a.Tuga.judul.localeCompare(b.Tuga.judul)
    );

    updateTabletugasList(sortedTugas);
  }

  function updateTabletugasList(tugasList) {
    var table = document.getElementById("PengumpulanTugasTable");
    var tbody = table.querySelector("#tableBody");

    tbody.innerHTML = "";

    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;

    tugasList.slice(startIndex, endIndex).forEach((item, index) => {

      var row = tbody.insertRow();
      var cellNo = row.insertCell(0);
      var cell1 = row.insertCell(1);
      var cell2 = row.insertCell(2);
      var cell3 = row.insertCell(3);
      var cell4 = row.insertCell(4);
      var cell5 = row.insertCell(5);
      var cell6 = row.insertCell(6);

      cellNo.textContent = index + 1;
      cell1.innerHTML = item.Tuga.judul;
      cell2.innerHTML = item.Tuga.deadline
        .replace("T", " ")
        .replace("Z", "")
        .replace(":00.000", "");
      cell3.innerHTML = item.nilai;
      var file = item.Tuga.file;
      var Name = file.split("-")[1];
      cell4.style = "display:flex; flex-direction: column;";
      cell4.innerHTML = Name;

      var downloadButton = document.createElement("button");
      downloadButton.innerHTML = `<i class="bi bi-file-arrow-down-fill"></i>`;
      downloadButton.className = "btn btn-primary my-2 w-25";
      downloadButton.addEventListener("click", () => {
        downloadFile(file);
      });
      cell4.appendChild(downloadButton);

        if (item.laporan === null || undefined) {
            item.laporan = "belum mengumpulkan";
            cell5.style.color = "red";
        }
  ;
        cell5.innerHTML = item.laporan;

      const submitButton = document.createElement("button");
      submitButton.textContent = "Submit";
      submitButton.className = "btn btn-success";

      submitButton.addEventListener("click", () => {
        document.getElementById("modal").style.display = "block";
        console.log(item.tugas_id);
        document
          .getElementById("updateTugas")
          .addEventListener("submit", (event) => {
            event.preventDefault();
            var myHeaders = new Headers();
            myHeaders.append(
              "authorization",
              "Bearer " + sessionStorage.getItem("token")
            );

            const fileInput = document.getElementById("customFile");
            var formdata = new FormData();
            formdata.append("laporan", fileInput.files[0]);

            var requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: formdata,
              redirect: "follow",
            };

            fetch(
              `http://localhost:3000/submitTugas/${item.tugas_id}`,
              requestOptions
            )
              .then((response) => response.json())
              .then((result) => {
                console.log(result);
                if (result.success) {
                  localStorage.setItem("flashMessage", result.success);
                  const randomValue = new Date().getTime();
                  location.href = `?random=${randomValue}`;
                } else if (result.error) {
                  result.error;
                  alert("gagal");
                }
              })
              .catch((error) => {
                console.log("error", error);
                alert(error);
              });
          });
      });

      cell6.appendChild(submitButton);
    });
    updatePagination();
  }

  fetch("http://localhost:3000/praktikan/detailTugas", requestOptions)
    .then((response) => response.json())
    .then((tugasList) => {
        console.log(tugasList)
      data = tugasList;
      sortAndDisplay(tugasList);

      document.getElementById("search").addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        const filteredTugas = data.filter((tugas) =>
          tugas.Tuga.judul.toLowerCase().includes(searchTerm)
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
    .catch((error) => console.log("error", error));
}

function downloadFile(fileName) {
  var downloadLink = document.createElement("a");
  downloadLink.href = `/images/${fileName}`;
  downloadLink.download = fileName;
  downloadLink.click();
}

getTugasPraktikan();

function updatePagination() {
  document.getElementById("currentPage").innerText = currentPage;
  document.getElementById("currentPage").style.color = "white";
}
