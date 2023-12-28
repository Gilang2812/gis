let token = sessionStorage.getItem('token')

document.getElementById('logout').addEventListener('click',()=>{
    if(window.confirm("apakah anda ingin logout")){
        sessionStorage.removeItem('token')
        window.location.reload( )
    }
})

if (!token) {
    window.location.href = "/login"
}
document.getElementById("scrollButton").addEventListener("click", function () {

    window.scrollBy(1, 10 * window.innerHeight);
});
document.getElementById("closeModalBtn").addEventListener("click", closeModal);
document.getElementById("closeModal").addEventListener("click", closeModal);

// Function to open the modal
function openModal() {
    document.getElementById("modal").style.display = "block";
}

// Function to close the modal  
function closeModal() {
    document.getElementById("modal").style.display = "none";
}
const flashMessage = localStorage.getItem("flashMessage");
if (flashMessage) {
    const message = document.getElementById("flash-message");
    const p = document.createElement("p");
    p.textContent = flashMessage;
    p.className = "flash-message success"
    message.appendChild(p);
    localStorage.removeItem("flashMessage");
}
function capitalizeEachWord(inputString) {
    var words = inputString.split(' ');
    for (var i = 0; i < words.length; i++) {
        var firstLetter = words[i].charAt(0).toUpperCase();
        words[i] = firstLetter + words[i].slice(1);
    }
    var resultString = words.join(' ');
    return resultString;
}

function ubahBulanKeNama(tgl) {
    var namaBulan = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    var namaHari = [
        "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
    ];

    var tanggal = new Date(tgl);
    var nomorBulan = tanggal.getMonth();
    var namaBulanTeks = namaBulan[nomorBulan];
    var namaHariTeks = namaHari[tanggal.getDay()];
    var hari = tanggal.getDate();
    var tahun = tanggal.getFullYear();

    var hasil = namaHariTeks + ", " + hari + " " + namaBulanTeks + " " + tahun;

    return hasil;
}

var thElements = document.querySelectorAll('th');

// Menambahkan kelas "text-center" pada setiap elemen <th>
thElements.forEach(function (th) {
    th.classList.add('text-center');
});