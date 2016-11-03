/// <reference path="parser.ts" />
/// <reference path="marker.ts" />
/// <reference path="gcalApi.ts" />

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
    });
});