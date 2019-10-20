const button = document.getElementById("send");
const searchbox = document.getElementById("link");
const hiddenDiv = document.getElementById("hidden");
const ul = $('#hidden-list-div');




button.addEventListener('click', () => {
    fetch(`http://localhost:4000/video?url=${searchbox.value}`).then((response)=>response.json())
        .then((data)=>{
                console.log(data);
                hiddenDiv.innerHTML = data.title + "   :  " +  data.duration;
                data.options.map((option)=>{
                    ul.append(`<a class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" href="/download?ID=${data.video_id}&itag=${option.itag}&clen=${option.clen}">
                    Quality: ${option.quality}     |   <span class="badge badge-primary badge-pill">Size:${readableBytes(option.clen)}</span></a>`);
                })
        });
});

function readableBytes(bytes) {
    var i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
}
