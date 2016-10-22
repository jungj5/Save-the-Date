/// <reference path="node_modules/@types/jquery/index.d.ts" />
const MIN_PARSABLE_TEXT_LENGTH: number = 3;

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

// Function to parse all visible text
function parseDom(element: HTMLElement): void {
    // var context = visibleNodes[i];
    let parserResults = chrono.parse($(element).text());
    for (let i: number = 0; i < parserResults.length; i++) {
        let matchedText: string = parserResults[i].text;
        console.log(matchedText);
        let instance: Mark = new Mark(element);
        let options: MarkOptions = {
            "separateWordSearch": false
        }
        instance.mark(matchedText, options);
    }
}

// Function that sets up observers and reparses the
//  page every time there is a change
$(document).ready(function(): void {
    parseDom(document.body);
    let observer: MutationObserver = new MutationObserver(function(mutations) {
        // Called every time a DOM mutation occurs
        mutations.forEach(function(mutation): void {
            var newNodes = mutation.addedNodes;
            if (newNodes) {
                $(newNodes).each(function(index, node: HTMLElement) {
                    parseDom(node);
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
