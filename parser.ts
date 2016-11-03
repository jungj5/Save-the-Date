declare var chrono: any;

class ChronoParser {
    private parser;

    // Initialize the chrono parser with a refiner
    //  that ignores time events without a specified day
    constructor() {
        this.parser = new chrono.Chrono();
        let parserRefiner = new chrono.Refiner();
        parserRefiner.refine = function(text, results, opt) {
            let newResults = [];
            results.forEach(function(result) {
                if (typeof result.start.knownValues.day !== "undefined") {
                    newResults.push(result);
                }
            });
            return newResults;
        }
        this.parser.refiners.push(parserRefiner);
    }

    // Checks if a time event already happened
    // Returns true for past events, false otherwise
    private isPastEvent(parsedResult): boolean {
        let parsedDate: Date = new Date(parsedResult.start.date());
        let currentDate: Date = new Date();
        currentDate.setHours(23,59,59,999);
        if (parsedDate.getTime() <= currentDate.getTime()) {
            return true;
        } else {
            return false;
        }
    }

    // Find all of the text corresponding to time 
    //  events in the specified DOM element
    parseDom(element: HTMLElement): string[] {
        // Try to get more of the text from the page
        // .text() works for now but it can be better
        // (mark searches more of the page...)
        let parserResults = this.parser.parse($(element).text());

        // Get all of the matched text strings that did
        //  not already occur
        let textToMark: string[] = [];
        for (let i: number = 0; i < parserResults.length; i++) {
            let matchedText: string = parserResults[i].text;
            if (this.isPastEvent(parserResults[i])) {
                continue;
            }

            textToMark.push(matchedText);
        }
        return textToMark;
    }
}