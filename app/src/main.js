const ENDPOINT = "https://crossorigin.me/http://rss.cnn.com/rss/edition_world.rss";

var template = document.querySelector('.item-template');


var item = function (image, title, content) {
    var itemDiv = document.importNode(template.content, true);
    itemDiv.querySelector(".item-image").setAttribute('src', image);
    itemDiv.querySelector(".item-title").innerHTML = title;
    itemDiv.querySelector(".item-content").innerHTML = content;
    return itemDiv;

};

var scrollBoxContainer = document.getElementById("scroll-box");
var headlineContainer = document.getElementById("headline");

var request = new XMLHttpRequest();

request.onreadystatechange = readyCallback;

function readyCallback() {
    if( request.readyState < 4 ){
        return;
    }
    if(request.status !== 200){
        scrollBoxContainer.innerHTML = "Error fetching data";
        return;
    }

    if(request.responseText != ''){

        var ns = request.responseXML.getElementsByTagName("rss")[0].attributes["xmlns:media"].value;

        var items = request.responseXML.getElementsByTagName("channel")[0].getElementsByTagName("item");
        var xml = request.responseXML.getElementsByTagName("channel")[0];

        // update headline
        var headline = xml.getElementsByTagName("title")[0].innerHTML;
        if(headline != undefined){
            headlineContainer.innerHTML = stripCDATA(headline);
        }

        // clean up scroll box container
        scrollBoxContainer.innerHTML = "";

        // generate content
        for (var i = 0; i < items.length; i++){
            var title = items[i].getElementsByTagName("title")[0].innerHTML;
            title = stripCDATA(title);
            var description = items[i].getElementsByTagName("description")[0].innerHTML;
            description = stripImageTags(description);
            var link = items[i].getElementsByTagName("link")[0].innerHTML;
            var group = items[i].getElementsByTagNameNS(ns, "group")[0];
            var image = group.firstChild.attributes["url"].value;
            scrollBoxContainer.appendChild(item( image, title, description));
        }

    }
}

function stripCDATA(data){
    return data.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1' );
}

function stripImageTags(data){
    return data.replace(/&lt;\/?[^>]+(&gt;|$)/g, '[link]');
}

request.open("GET", ENDPOINT , true);
request.send('');