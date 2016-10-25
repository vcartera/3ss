/**
 * Created by Vitalie Cartera on 10/25/2016.
 *
 * Handles creation of scroll box elements
 * uses HTML template and injects the data accordingly
 * Depends on specific XML schema (CNN world edition RSS feed)
 *
 */
var itemTemplate = document.querySelector('.item-template');

function createItem(index, itemsXML, mediaNS) {

    var itemData = {id: index, isLoaded: false};

    // parse XML node and extract relevant data
    var title = itemsXML[index].getElementsByTagName("title")[0].innerHTML;
    itemData.title = stripCDATA(title);
    var description = itemsXML[index].getElementsByTagName("description")[0].innerHTML;
    itemData.description = stripImageTags(description);
    itemData.link = itemsXML[index].getElementsByTagName("link")[0].innerHTML;
    var group = itemsXML[index].getElementsByTagNameNS(mediaNS, "group")[0];
    itemData.image = group.firstChild.attributes["url"].value;

    // deal with template
    var itemDiv = document.importNode(itemTemplate.content, true);

    itemDiv.firstElementChild.setAttribute('id', index);
    itemDiv.querySelector(".item-title").innerHTML = itemData.title;
    itemDiv.querySelector(".item-content").innerHTML = itemData.description;

    // temporarily attach HTML element to output object
    // will going to be replaced with a "real-deal" when it gets attached to the DOM
    itemData.htmlElement = itemDiv;

    // lazy-loading for the image
    itemData.loadContent = function(){
        if(!itemData.isLoaded){
            itemData.htmlElement.querySelector(".item-image").setAttribute('src', itemData.image);
            itemData.isLoaded = true;
        }
    };

    // focus handlers
    itemData.setFocus = function(){
        itemData.htmlElement.style = "border: 2px solid red;";
    };

    itemData.resetFocus = function(){
        itemData.htmlElement.style = "";
    };

    return itemData;
}