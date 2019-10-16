const button = document.getElementById("send");
const searchbox = document.getElementById("link");
const hiddenDiv = document.getElementById("hidden");


button.addEventListener('click', () => {
    let info = sendURL(`http://localhost:4000/video?URL=${searchbox.value}`);
});


async function sendURL(url) {
    let info = await fetch(url).then((response)=>response.json())
    console.log(info);
    let selector = document.createElement("SELECT");
    selector.selectedIndex = 0;

    $.each(info.video_qualities, function (i, item) {
        var o = new Option(item, item);
        $(o).html(item);
        selector.append(o);
    });

    hiddenDiv.append(selector);

}
