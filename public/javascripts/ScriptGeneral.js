let token = sessionStorage.getItem('token')

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