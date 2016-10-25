Assignment details:

Implement a vertical list with scroll-bar:
 
The list contains box elements, each elements consist of an image and text.             
 
è The width of the elements is fixed the height may vary based on the text content inside.
è The first visible element is always on top of the view.
è The navigation can be done with focus and keyboard arrows.
è On moving the focus the next up/down element is hightlighted with border.
è When reaching the bottom of view and the next element is not visible scroll the list up and another way around.
è Update the scroll bar in order to indicate that there are still navigation elements down/up.
è On selection of an element (click or keyboard enter) open the text content of the element in a dialog/overlay with a close button on it.
è Selecting close button the dialog should close   
è Implement lazy loading of elements using ajax (there are several mock services available for this.)
è Use vanilla Javascript

_____________________________________________
Implementation details:

This exercise uses CNN world edition RSS feed to get images and articles for mocking up scroll-box component.
Endpoint goes through proxy to avoid cross origin server rejection, while using localhost. [Not optimal]
ORIGIN_PROXY: 'https://crossorigin.me/';
ENDPOINT: 'http://rss.cnn.com/rss/edition_world.rss';

Knowing issues:
1. Lazy-loading is implemented for images only.
2. Mouse rollover getting confused by item's foreground elements
3. Modal window doesn't close on Enter key. Modal layout not optimal.
4. Code was not optimized for other browsers. Use Chrome Version 54..
5. Code was tested from localhost only. Crossdomain issues could be present.

Vitalie Cartera SDE
Oct 26, 2016
