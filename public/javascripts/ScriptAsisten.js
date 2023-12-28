/** @format */

function getAsisten() {
    const itemsPerPage = 5; 
    let currentPage = 1;
  
    function displayAsisten(data) {
      let table = document.getElementById("asistenTable");
      let tbody = table.getElementsByTagName("tbody")[0];
      tbody.innerHTML = "";
  
      let startIndex = (currentPage - 1) * itemsPerPage;
      let endIndex = startIndex + itemsPerPage;
  
      data.slice(startIndex, endIndex).forEach((asisten, index) => {
        let row = tbody.insertRow();
  
        let cellNo = row.insertCell(0);
        let cell1 = row.insertCell(1);
        let cell2 = row.insertCell(2);
        let cell3 = row.insertCell(3);
        let cell4 = row.insertCell(4);
  
        cellNo.textContent = (currentPage - 1) * itemsPerPage + index + 1;
        cell1.innerHTML = asisten.nim_aslab;
        cell2.innerHTML = asisten.email;
        cell3.innerHTML = asisten.nama;
        cell4.className = `text-center d-flex justify-content-md-around`;
  
        let editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.classList = "btn btn-warning text-white ";
  
        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.className = "btn btn-danger";
  
        editButton.addEventListener("click", () => {
          document.getElementById("modal").style.display = "block";
          console.log(asisten.asisten_id);
          document.getElementById("nim_aslabUpdate").value = asisten.nim_aslab;
          document.getElementById("emailUpdate").value = asisten.email;
          document.getElementById("namaUpdate").value = asisten.nama;
  
          document
            .getElementById("updateAsisten")
            .addEventListener("submit", (event) => {
              event.preventDefault();
              updateAsisten(asisten.asisten_id);
            });
        });
  
        deleteButton.addEventListener("click", (event) => {
          event.preventDefault();
          deleteAsisten(asisten.asisten_id);
        });
  
        cell4.appendChild(editButton);
        cell4.appendChild(deleteButton);
      });
      document.getElementById("previousPage").addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          displayAsisten(data);
          updatePagination();
        }
      });
    
      document.getElementById("nextPage").addEventListener("click", () => {
        if (currentPage < Math.ceil(data.length / itemsPerPage)) {
          currentPage++;
          displayAsisten(data);
          updatePagination();
        }
      });
    }
  
    function updatePagination() {
      document.getElementById("currentPage").textContent = currentPage;
      document.getElementById("currentPage").style.color = 'white';
    }
  

  
    var myHeaders = new Headers();
    myHeaders.append("authorization", "Bearer " + token);
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
  
    fetch("http://localhost:3000/asisten", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        var asisten = data
        document.getElementById("search").addEventListener("input", function () {
            var searchTerm = this.value.toLowerCase();
            var filteredUser = asisten.filter(
                (asisten) =>
                    (asisten.nama && asisten.nama.toLowerCase().includes(searchTerm)) ||
                    (asisten.nim_aslab && asisten.nim_aslab.toLowerCase().includes(searchTerm)) ||
                    (asisten.email && asisten.email.toLowerCase().includes(searchTerm))
            );
        
            filteredUser.sort((a, b) => {
                const nameComparison = (a.nim_aslab || '').localeCompare(b.nim_aslab || '');
                if (nameComparison !== 0) {
                    return nameComparison;
                }
        
                return (a.nim || '').localeCompare(b.nim || '');
            });
            displayAsisten(filteredUser);
        });
        
  
        displayAsisten(data);
        updatePagination();
      })
      .catch((error) => console.log("error", error));
  }
  

function createAsisten() {
  document
    .getElementById("createAsisten")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      var myHeaders = new Headers();
      myHeaders.append("authorization", "Bearer " + token);
      myHeaders.append("Content-Type", "application/json");

      const nim_aslab = document.getElementById("nim_aslab").value;
      const nama = document.getElementById("nama").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      var raw = JSON.stringify({
        nim_aslab: nim_aslab,
        nama: nama,
        email: email,
        password: password,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("http://localhost:3000/asisten/create", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.success) {
            localStorage.setItem("flashMessage", result.success);

            const randomValue = new Date().getTime(); // Nilai waktu acak
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
}

function updateAsisten(asistenId) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("authorization", "Bearer " + token);

  let nama = document.getElementById("namaUpdate").value;
  var raw = JSON.stringify({
    nama: nama,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`http://localhost:3000/asisten/${asistenId}/update`, requestOptions)
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

function deleteAsisten(asistenId) {
  if (window.confirm("Apakah yakin ingin menghapus")) {
    var myHeaders = new Headers();
    myHeaders.append("authorization", "Bearer " + token);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:3000/asisten/${asistenId}/delete`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          localStorage.setItem("flashMessage", result.success);

          location.reload();
        } else if (result.error) {
          alert(result.error);
          alert("gagal");
        }
      })
      .catch((error) => {
        console.log("error", error);
        alert(error);
      });
  } else {
  }
}


