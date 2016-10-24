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

scrollBoxContainer.innerHTML = "";
var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin hendrerit metus eu metus finibus, ut bibendum ante gravida. Nulla facilisi. Pellentesque mi mi, elementum sit amet lorem in, luctus porttitor mauris. Nam convallis, dolor sed efficitur aliquet, lectus augue scelerisque magna, in egestas felis nibh et arcu."

for (var i = 0; i < 10; i++) {
    scrollBoxContainer.appendChild(item(
        'https://i.ytimg.com/vi/ll6XE5J9SUY/hqdefault.jpg?custom=true&w=168&h=94&stc=true&jpg444=true&jpgq=90&sp=68&sigh=Cx1nnRSpoljKN5ix-LM0A0kd5I4',
        "Title is long and ugly needs to shave more often",
        lorem));//'<div id="item">' + lorem + '</div>';
}

var request = new XMLHttpRequest();

request.onreadystatechange = readyCallback;

function readyCallback() {
    if( request.readyState < 4 || request.status !== 200){
        scrollBoxContainer.innerHTML = "Error fetching data";
        return;
    }

    if(request.responseText != ''){

        var xml = request.responseXML.getElementsByTagName("channel")[0].getElementsByTagName("item");
        var xml2 = request.responseXML.getElementsByTagName("channel")[0];

        // update headline
        var headline = xml2.getElementsByTagName("title")[0].innerHTML;
        if(headline != undefined){
            headlineContainer.innerHTML = stripCDATA(headline);
        }

        var items = xml2.childNodes;
        console.log(items);

        var ns = "http://search.yahoo.com/mrss/";
        console.log(ns);

        // clean up scroll box container
        scrollBoxContainer.innerHTML = "";
        for (var i = 0; i < /*xml.length*/ 1; i++){
            var title = xml[i].getElementsByTagName("title")[0].innerHTML
            title = stripCDATA(title);
            var description = xml[i].getElementsByTagName("description")[0].innerHTML
            var link = xml[i].getElementsByTagName("link")[0].innerHTML;
            var group = xml[i].getElementsByTagNameNS(ns, "group")[0];
            var image = group.firstChild.xml;
            console.log('imag: ' + image);
            scrollBoxContainer.appendChild(item( null, title, description));
        }

    }
}

function stripCDATA(data){
    return data.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1' );
}

request.open("GET", "https://crossorigin.me/http://rss.cnn.com/rss/edition_world.rss" , true);
request.send('');

//scrollBoxContainer.innerHTML = dummyContent;