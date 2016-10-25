/**
 * Created by Vitalie Cartera on 10/25/2016.
 */
var itemTemplate = document.querySelector('.item-template');

function item(id, image, title, content) {
    var itemDiv = document.importNode(itemTemplate.content, true);

    itemDiv.firstElementChild.setAttribute('id', id);
    itemDiv.querySelector(".item-image").setAttribute('src', image);
    itemDiv.querySelector(".item-title").innerHTML = title;
    itemDiv.querySelector(".item-content").innerHTML = content;

    return itemDiv;
}