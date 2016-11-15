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

function addHover(): void {
    $(".greenText, .yellowText, .redText").unbind("mouseenter mouseleave");
    $(".greenText, .yellowText, .redText").hover(function(e) {
        console.log("First");
        // console.log("Entered hover function");
        let markTop: number = $(this).position().top;
        let markLeft: number = $(this).position().left;
        console.log("y: " + markTop);
        console.log("x: " + markLeft);
        console.log("e.pageY: " + e.pageY);
        console.log("e.pageX: " + e.pageX);
        // console.log(position);
        $('<p class="tooltip"></p>')
            .text("Test tooltip")
            .appendTo("body")
            .fadeIn("slow")
            .css({top: e.pageY+20, left: e.pageX+20});
    }, function() {
        // Hover out code
        $('.tooltip').remove();
    });
}

// Function that sets up observers and reparses the
//  page every time there is a change
$(document).ready(function(): void {

    // console.log("HERE");

    // Wait until the events are received from the 
    //  GCal class
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {

        // Initialize the parser and the marker
        let chronoParser: ChronoParser = new ChronoParser(request);
        let marker: Marker = new Marker(document.body);

        // Parse the page and highlight appropriate text
        let textToMark: {[index: string]: string[]} = chronoParser.parseDom(document.body);
        marker.markText(textToMark);
        addHover();

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
                        //Add the hover functionality
                        addHover();
                    });
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
    });
});