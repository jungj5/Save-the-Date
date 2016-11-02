/// <reference path="parser.ts" />
/// <reference path="marker.ts" />

const MIN_PARSABLE_TEXT_LENGTH: number = 3;

console.log("I AM PENCIL-IT-IN, FEEL MY WRATH");

// Interface describing the variables for the MutationObserver
interface ObserverConfig {
    attributes: boolean;
    childList: boolean;
    characterData: boolean;
    subtree: boolean;
}

// Function that sets up observers and reparses the
//  page every time there is a change
$(document).ready(function(): void {

    // Initialize the parser and the marker
    let chronoParser = new ChronoParser();
    let marker = new Marker(document.body);

    // Parse the page and highlight appropriate text
    let textToMark: string[] = chronoParser.parseDom(document.body);
    marker.markText(textToMark);

    let observer: MutationObserver = new MutationObserver(function(mutations) {
        // Called every time a DOM mutation occurs
        mutations.forEach(function(mutation): void {
            var newNodes = mutation.addedNodes;
            if (newNodes) {
                $(newNodes).each(function(index, node: HTMLElement) {
                    // Reparse the changed element and remark
                    textToMark = chronoParser.parseDom(node);
                    marker.setContext(node);
                    marker.markText(textToMark);
                })
            }
        });
    });

    // Specify what to observe and attach the
    //  observer to the document body
    let observerConfig: ObserverConfig = {
        attributes: false,
        childList: true,
        characterData: true,
        subtree: true
    };
    let targetNode: HTMLElement = document.body;
    observer.observe(targetNode, observerConfig);


    var markedElements = document.getElementsByClassName("markedText");
    // var modal = document.getElementById("myModal");
    var i;
    for (i = 0; i < markedElements.length; i++) {
        markedElements[i].onclick = function () {
            console.log("Clicked");
            // modal.style.display = "block";
        };
    }
});