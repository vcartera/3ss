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
var current = 0;
var inFocus = false;

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
        console.log("AJAX call failed with " + request.status + " status.\n" + request.getAllResponseHeaders());
        scrollBoxContainer.innerHTML = "Error fetching data.";
        return;
    }

    if (request.responseText != '') {

        // get media namespace
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
            element.htmlElement = document.getElementById('' + i);

            if (isScrolledIntoView(element.htmlElement))
                element.loadContent();

            // record the item's data
            items[i] = element;
        }

        // enable focus
        scrollBoxContainer.setAttribute("tabindex", "0");
        scrollBoxContainer.focus();

        // we can now setup event listeners
        scrollBoxContainer.onscroll = handleScroll;
        scrollBoxContainer.onresize = handleScroll;
        scrollBoxContainer.onfocus = handleFocus;
        scrollBoxContainer.onblur = handleBlur;
        scrollBoxContainer.onmouseover = handleMouseOverElement;
        scrollBoxContainer.onclick = openItem;

        document.onkeydown = function (e) {
            // stop default scrolling
            e.preventDefault();
        };
        document.onkeyup = handleKeyUp;
    }
}

/**
 * Interactivity Handlers
 *
 */

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

    // optimization for when everything was loaded
    if (items.length > 0 && loadedTotal == items.length)
        allLoaded = true;
}

function handleFocus() {
    if (inFocus || !items.length) return;

    inFocus = true;
    items[current].setFocus();
}

function handleBlur() {
    if (!inFocus || !items.length) return;

    inFocus = false;
    items[current].resetFocus();
}

function handleKeyUp(k) {
    if (inFocus) {
        var old = current;
        if (k.keyCode == 38) {
            // UP ARROW key
            current--;
            if (current < 0) {
                current = 0;
            }

        } else if (k.keyCode == 40) {
            // DOWN ARROW key
            current++;
            if (current > items.length - 1) {
                current = items.length - 1;
            }
        } else if(k.keyCode == 13){
            //ENTER key
            openItem();
        }
        if (old != current) {
            items[old].resetFocus();
            items[current].setFocus();
            scrollToCurrent();
        }
    }
}

function openItem() {
    openDetails(items[current]);
}

function handleMouseOverElement(e) {
    handleFocus();
    var element = document.elementFromPoint(e.clientX, e.clientY);
    if (element.className == "item") {
        var newIndex = element.getAttribute("id");

        if (newIndex != current) {
            items[current].resetFocus();
            items[newIndex].setFocus();
            current = newIndex;
            scrollToCurrent();
        }
        console.log();
    }
}

/**
 * Helper Methods
 *
 */
function isScrolledIntoView(element) {
    return !(element.getBoundingClientRect().top >= scrollBoxContainer.getBoundingClientRect().bottom);
}

function elementIsCropped(element) {
    var top = element.getBoundingClientRect().top;
    var bottom = element.getBoundingClientRect().bottom;
    var clientHeight = scrollBoxContainer.getBoundingClientRect().bottom;
    var clientTop = scrollBoxContainer.getBoundingClientRect().top;

    var isVisible = (top >= clientTop) && (bottom <= clientHeight);
    return !isVisible;
}

function scrollToCurrent() {
    if (items.length) {
        var element = items[current].htmlElement;
        if (elementIsCropped(element)) {
            var top = element.getBoundingClientRect().top;
            var bottom = element.getBoundingClientRect().bottom;
            var clientHeight = scrollBoxContainer.getBoundingClientRect().bottom;
            var clientTop = scrollBoxContainer.getBoundingClientRect().top;
            // console.log("top: " + top + ", bottom: " + bottom + " clientHeight: " + clientHeight + " clienTop:" + clientTop);
            if (bottom > clientHeight)
                scrollBoxContainer.scrollTop += bottom - clientHeight;
            if (top < clientTop)
                scrollBoxContainer.scrollTop -= clientTop - top;
        }
    }
}

function stripCDATA(data) {
    return data.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');
}

function stripImageTags(data) {
    return data.replace(/&lt;\/?[^>]+(&gt;|$)/g, '[link]');
}