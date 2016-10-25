/**
 * Created by Vitalie Cartera on 10/24/2016.
 */

const ENDPOINT = "https://crossorigin.me/http://rss.cnn.com/rss/edition_world.rss";

var headlineContainer = document.getElementById("headline");
var scrollBoxContainer = document.getElementById("scroll-box");

scrollBoxContainer.onmouseover = function (e) {
    console.log("focus");
};

var items = [];

var request = new XMLHttpRequest();
request.onreadystatechange = readyCallback;
request.open("GET", ENDPOINT, true);
request.send('');

function readyCallback() {
    if (request.readyState < 4) {
        //request in progress
        return;
    }
    if (request.status !== 200) {
        // something went wrong
        console.log("AJAX call failed with " + request.status + " status./n" + request.getAllResponseHeaders());
        scrollBoxContainer.innerHTML = "Error fetching data.";
        return;
    }

    if (request.responseText != '') {

        var ns = request.responseXML.getElementsByTagName("rss")[0].attributes["xmlns:media"].value;

        var itemsXML = request.responseXML.getElementsByTagName("channel")[0].getElementsByTagName("item");
        var xml = request.responseXML.getElementsByTagName("channel")[0];

        // update top headline
        var headline = xml.getElementsByTagName("title")[0].innerHTML;
        if (headline != undefined) {
            headlineContainer.innerHTML = stripCDATA(headline);
        }

        // clean up scroll box container
        scrollBoxContainer.innerHTML = "";

        // generate content
        for (var i = 0; i < itemsXML.length; i++) {

            var itemData = {id: i};

            // parse XML node and extract relevant data
            var title = itemsXML[i].getElementsByTagName("title")[0].innerHTML;
            itemData.title = stripCDATA(title);
            var description = itemsXML[i].getElementsByTagName("description")[0].innerHTML;
            itemData.description = stripImageTags(description);
            itemData.link = itemsXML[i].getElementsByTagName("link")[0].innerHTML; // Not used. Integrate if time allows
            var group = itemsXML[i].getElementsByTagNameNS(ns, "group")[0];
            itemData.image = group.firstChild.attributes["url"].value;

            var element = item("item" + i, itemData.image, itemData.title, itemData.description);

            element = scrollBoxContainer.appendChild(element);
            itemData.htmlElement = document.getElementById("item" + i);

            console.log(itemData.htmlElement.id + " is visible = " + isScrolledIntoView(itemData.htmlElement)
                + " - t:" + itemData.htmlElement.getBoundingClientRect().top
                + ", b: " + itemData.htmlElement.getBoundingClientRect().bottom);

            // record the item's data
            items[i] = itemData;
        }

    }
}

/* Helper Methods */
function isScrolledIntoView(element) {
    return !(element.getBoundingClientRect().top >= window.innerHeight);
}

function stripCDATA(data) {
    return data.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
}

function stripImageTags(data) {
    return data.replace(/&lt;\/?[^>]+(&gt;|$)/g, '[link]');
}