const button = document.getElementById("send");
const searchbox = document.getElementById("link");


button.addEventListener('click', () => {
    console.log(`URL: ${searchbox.value}`);
    sendURL(searchbox.value);
});


function sendURL(URL) {
    window.location.href = `http://localhost:4000/download?URL=${URL}`;
}
