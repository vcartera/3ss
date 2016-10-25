/**
 * Created by Vitalie Cartera on 10/24/2016.
 *
 * This exercise uses CNN world edition RSS feed to get images and articles for mocking up scroll-box component.
 * Lazy-loading is implemented for images only.
 *
 * Endpoint goes through proxy to avoid cross origin server rejection, while using localhost. [Not optimal]
 *
 */

const ORIGIN_PROXY = 'https://crossorigin.me/';
const ENDPOINT = ORIGIN_PROXY + 'http://rss.cnn.com/rss/edition_world.rss';

var headlineContainer = document.getElementById("headline");
var scrollBoxContainer = document.getElementById("scroll-box");
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
            headlineContainer.innerText = stripCDATA(headline);
        }

        // clean up scroll box container
        scrollBoxContainer.innerHTML = "";

        // generate content
        for (var i = 0; i < itemsXML.length; i++) {

            var element = createItem(i, itemsXML, ns);

            scrollBoxContainer.appendChild(element.htmlElement);
            element.htmlElement = document.getElementById("item" + i);

            if (isScrolledIntoView(element.htmlElement))
                element.loadContent();

            // record the item's data
            items[i] = element;
        }
        items[0].setFocus();
    }
}

/**
 * Interactivity Handlers
 *
 */
scrollBoxContainer.onscroll = handleScroll;
scrollBoxContainer.onresize = handleScroll;
scrollBoxContainer.onfocus = handleFocus;

var allLoaded = false;
function handleScroll() {
    if (!items.length || allLoaded) return;

    var loadedTotal = 0;

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        loadedTotal += (item.isLoaded) ? 1 : 0;

        if (!item.isLoaded && isScrolledIntoView(item.htmlElement)) {
            item.loadContent();
        }
    }

    // optimization for when everything is got loaded
    if (items.length > 0 && loadedTotal == items.length)
            allLoaded = true;
}

function handleFocus() {
    console.log("handle focus");
}

/**
 * Helper Methods
 *
 */
function isScrolledIntoView(element) {
    return !(element.getBoundingClientRect().top >= window.innerHeight);
}

function stripCDATA(data) {
    return data.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
}

function stripImageTags(data) {
    return data.replace(/&lt;\/?[^>]+(&gt;|$)/g, '[link]');
}