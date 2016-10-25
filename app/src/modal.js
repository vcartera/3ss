/**
 * Created by Vitalie on 10/25/2016.
 */

var modal = document.getElementById('modal');
var span = document.getElementsByClassName("close")[0];

span.onclick = function() {
    modal.style.display = "none";
};

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

function openDetails(item) {

     var title = document.getElementById("modal-title");
     var image = document.getElementById("modal-image");
     var details = document.getElementById("modal-details");
     var link = document.getElementById("modal-link");

    title.innerHTML = item.title;
    image.setAttribute("src", item.image);
    details.innerHTML = item.description;
    link.innerHTML = '<a href="' + item.link + '" target="_blank" >'+item.link + '</a>';

    modal.style.display = "block";
}