var template = document.querySelector('.item-template');


var item = function (image, title, content) {
    var itemDiv = document.importNode(template.content, true);
    itemDiv.querySelector(".item-image").setAttribute('src', image);
    itemDiv.querySelector(".item-title").innerHTML = title;
    itemDiv.querySelector(".item-content").innerHTML = content;
    return itemDiv;

};

var scrollBoxContainer = document.getElementById("scroll-box");

scrollBoxContainer.innerHTML = "";
var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin hendrerit metus eu metus finibus, ut bibendum ante gravida. Nulla facilisi. Pellentesque mi mi, elementum sit amet lorem in, luctus porttitor mauris. Nam convallis, dolor sed efficitur aliquet, lectus augue scelerisque magna, in egestas felis nibh et arcu."

for (var i = 0; i < 1; i++) {
    scrollBoxContainer.appendChild(item(
        'https://i.ytimg.com/vi/ll6XE5J9SUY/hqdefault.jpg?custom=true&w=168&h=94&stc=true&jpg444=true&jpgq=90&sp=68&sigh=Cx1nnRSpoljKN5ix-LM0A0kd5I4',
        "Title",
        lorem));//'<div id="item">' + lorem + '</div>';
}

//scrollBoxContainer.innerHTML = dummyContent;