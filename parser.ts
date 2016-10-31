const MIN_PARSABLE_TEXT_LENGTH: number = 3;

declare var Mark: any;

console.log("I AM PENCIL-IT-IN, FEEL MY WRATH");
// Interface describing the variables for the MutationObserver
interface ObserverConfig {
    attributes: boolean;
    childList: boolean;
    characterData: boolean;
    subtree: boolean;
}

interface MarkOptions {
    "separateWordSearch": boolean;
}

function chronoConstructor() {
    let chronoParser = new chrono.Chrono();

    let chronoParserRefiner = new chrono.Refiner();
    chronoParserRefiner.refine = function(text, results, opt) {
        let newResults = [];
        results.forEach(function(result) {
            // console.log("Day = " + result.start.knownValues.day);
            if (typeof result.start.knownValues.day !== "undefined") {
                // console.log("Adding a result");
                newResults.push(result);
            }
        });
        return newResults;
    }

    chronoParser.refiners.push(chronoParserRefiner);

    return chronoParser;
}

function markText(textToMark: string[], element: HTMLElement): void {
    let instance: Mark = new Mark(element);
    let options: MarkOptions = {
        "separateWordSearch": false
    }
    instance.mark(textToMark, options);
}

function isPastEvent(parsedResult: ParsedResult): boolean {
    let parsedDate: Date = new Date(parsedResult.start.date());
    let currentDate: Date = new Date();
    currentDate.setHours(23,59,59,999);
    // console.log("Current date: " + currentDate.getTime());
    // console.log("Parsed date: " + parsedDate.getTime());
    if (parsedDate.getTime() <= currentDate.getTime()) {
        return true;
    } else {
        return false;
    }
}

// Function to parse all visible text
function parseDom(chronoParser: Chrono, element: HTMLElement): void {

    // Try to get more of the text from the page
    // .text() works for now but it can be better
    // (mark searches more of the page...)

    let parserResults = chronoParser.parse($(element).text());

    let textToMark: string[] = [];

    for (let i: number = 0; i < parserResults.length; i++) {
        let matchedText: string = parserResults[i].text;
        if (isPastEvent(parserResults[i])) {
            // console.log("knownValues: " + parserResults[i].start.knownValues.month);
            continue;
        }

        textToMark.push(matchedText);
    }

    markText(textToMark, element);

}


// Function that sets up observers and reparses the
//  page every time there is a change
$(document).ready(function(): void {

    let chronoParser = chronoConstructor();

    parseDom(chronoParser, document.body);

    let observer: MutationObserver = new MutationObserver(function(mutations) {
        // Called every time a DOM mutation occurs
        mutations.forEach(function(mutation): void {
            var newNodes = mutation.addedNodes;
            if (newNodes) {
                $(newNodes).each(function(index, node: HTMLElement) {
                    parseDom(chronoParser, node);
                })
            }
        });
    });

    //Notify me of everything!
    let observerConfig: ObserverConfig = {
        attributes: false,
        childList: true,
        characterData: true,
        subtree: true
    };

    // Node, config
    // In this case we'll listen to all changes to body and child nodes
    let targetNode: HTMLElement = document.body;
    observer.observe(targetNode, observerConfig);
});
