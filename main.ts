/// <reference path="parser.ts" />
/// <reference path="marker.ts" />

console.log("I AM PENCIL-IT-IN, FEEL MY WRATH");

// -------------
// Constant Global Variables
// -------------

const MIN_PARSABLE_TEXT_LENGTH: number = 3;
const OFFSET_X: number = 20;
const OFFSET_Y: number = 20;


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
    let removePopup: boolean = true;
    let popupTimeout: number;

    $(".greenText, .yellowText, .redText").hover(function(e) {
        // Cursor coordinates
        let x: number = e.clientX;
        let y: number = e.clientY;
        
        // DEBUGGING --------------------
        // console.log("X: " + x);
        // console.log("Y: " + y);
        // ------------------------------

        if (removePopup) {
            timeout = window.setTimeout(function() {
                // $('<div class="calendarPopup"></div>')
                //     .text("Test calendarPopup")
                let popupURL: string = chrome.runtime.getURL('hover_popup.html');
                let dateText: string = $(e.target).text();
                $("<iframe class='calendarPopup' src='" + popupURL + '?date=' + encodeURIComponent(dateText) +
                    "' height='354.375' width='280'></iframe>")
                    .appendTo("body")
                    .fadeIn("slow")
                    .css({top: y+OFFSET_Y+"px", left: x+OFFSET_X+"px"});
            }, 350);
        }

    }, function() {
        // Hover out code
        window.clearTimeout(timeout);
        popupTimeout = window.setTimeout(function() {
            $('.calendarPopup').remove();
        }, 500);            
    });

    $(".calendarPopup").hover(function() {
        // console.log("HERE");
        window.clearTimeout(popupTimeout);
    }, function() {
        if (removePopup) {
            popupTimeout = window.setTimeout(function() {
                $('.calendarPopup').remove();
            }, 500);
        }
    });

    $('.calendarPopup').on('click', '*', function() {
        console.log("CLICK");
        removePopup = false;
    });

    // $(".calendarPopup").click(function() {
    //     removePopup = false;
    // });

    $(document).click(function(event) {
        if (!$(event.target).closest('.calendarPopup').length) {
            $('.calendarPopup').remove();
            removePopup = true;
        }
    });
}


// -------------
// Main Function
// -------------

$(document).ready(function(): void {

    // DEBUGGING ------------------------
    // console.log(chrono.parseDate("'16"));
    // console.log("HERE");
    // let test = new Date();
    // test.setMonth(test.getMonth() + 7);
    // console.log("Date = " + test);
    // ----------------------------------


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
