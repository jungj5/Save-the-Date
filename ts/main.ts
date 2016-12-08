// -------------
// Constant Global Variables
// -------------

const MIN_PARSABLE_TEXT_LENGTH: number = 3;
const OFFSET_X: number = 20;
const OFFSET_Y: number = 20;
const OFFSET_X_OPPOSITE: number = -325;
const OFFSET_Y_OPPOSITE: number = -400;


// -------------
// Interfaces
// -------------

// MutationObserver
interface ObserverConfig {
    attributes: boolean;
    childList: boolean;
    characterData: boolean;
    subtree: boolean;
}


// -------------
// Helper Functions
// -------------

// Adds hover functionality to highlighted text
function addHover(): void {
    // Remove any previous hover functionality
    $(".greenText, .yellowText, .redText").unbind("mouseenter mouseleave");

    let timeout: number;
    let popupTimeout: number;

    $(".greenText, .yellowText, .redText").hover(function(e) {
        // Cursor coordinates
        let x: number = e.clientX;
        let y: number = e.clientY;
        let maxX: number = $(window).width();
        let maxY: number = $(window).height();
        if ((maxY - y) < 390) {
            y = y + OFFSET_Y_OPPOSITE;
        } else {
            y = y + OFFSET_Y;
        }
        if ((maxX - x) < 315) {
            x = x + OFFSET_X_OPPOSITE;
        } else {
            x = x + OFFSET_X;
        }

        // Set a timer so that the popup box only appears
        //  if the user hovers over the highlighted text
        //  for 350 milliseconds
        timeout = window.setTimeout(function() {
            // Create the iframe for the popup box
            let popupURL: string = chrome.runtime.getURL('html/hover_popup.html');
            let dateText: string = $(e.target).text();
            let parsedText = chrono.parse(dateText);

            if (parsedText[0].end == undefined) {

                $("<iframe id='calPopup' class='calendarPopup' src='" + popupURL + '?date=' + encodeURIComponent(parsedText[0].start.date()) +
                    "' height='354.375' width='280'></iframe>")
                    .appendTo("body")
                    .fadeIn("slow")
                    .css({ top: y + "px", left: x + "px" });
            }
            else {
                $("<iframe id='calPopup' class='calendarPopup' src='" + popupURL + '?date=' + encodeURIComponent(parsedText[0].start.date()) + '?date=' + encodeURIComponent(parsedText[0].end.date()) + "' height='354.375' width='280'></iframe>")
                    .appendTo("body")
                    .fadeIn("slow")
                    .css({ top: y + "px", left: x + "px" });
            }

        }, 350);

        // Hover out code
    }, function() {
        // Remove the timer
        window.clearTimeout(timeout);
        // Remove the popup box 500 milliseconds after
        //  the cursor leaves the highlighted text
        popupTimeout = window.setTimeout(function() {
            $('.calendarPopup').remove();
        }, 500);
    });

    // Keep the popup box on the screen as long as the
    //  cursor is in the popup box
    $(".calendarPopup").hover(function() {
        window.clearTimeout(popupTimeout);
    }, function() {
        popupTimeout = window.setTimeout(function() {
            $('.calendarPopup').remove();
        }, 500);
    });
}


// -------------
// Main Function
// -------------

// Function that sets up observers and reparses the
//  page every time there is a change
$(document).ready(function(): void {

    // Wait until the calendar events are received from the
    //  GCal class
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {

            // Initialize the parser and the marker
            let chronoParser: ChronoParser = new ChronoParser(request);
            let marker: Marker = new Marker(document.body);

            // Parse the page and highlight appropriate text
            // Add hover functinality
            let textToMark = chronoParser.parseDom(document.body);
            marker.markText(textToMark);
            addHover();

            let observer: MutationObserver = new MutationObserver(function(mutations: MutationRecord[]): void {
                // Called every time a DOM mutation occurs
                mutations.forEach(function(mutation: MutationRecord): void {
                    let newNodes: NodeList = mutation.addedNodes;
                    if (newNodes) {
                        $(newNodes).each(function(index: number, node: HTMLElement) {
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
            observer.observe(document.body, observerConfig);
        });
});
