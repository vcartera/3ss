var content = document.getElementById("scroll-box");

var dummy = "";

for (var i = 0; i < 20; i++) {
    dummy += "<div id=\"item\">some text blah blah. text blah blah..text blah blah..text blah blah... </div>"
}
content.innerHTML = dummy;
console.log("test lorem ipsum");