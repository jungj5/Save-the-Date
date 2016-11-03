declare var chrono: any;

class ChronoParser {
    private parser;
    private events;

    // Initialize the chrono parser with a refiner
    //  that ignores time events without a specified day
    constructor(events) {
        this.parser = new chrono.Chrono();
        this.events = events;
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

    // Get the number of conflicts that the 
    //  proposed event has with existing events
    private getNumConflicts(proposedEventTime: Date): number {
        let count = 0;
        for (let i = 0; i < this.events.length; i++) {
            let currentEventStart: Date = new Date(this.events[i].start.dateTime);
            let currentEventEnd: Date = new Date(this.events[i].end.dateTime);
            if (proposedEventTime.getTime() >= currentEventStart.getTime() && proposedEventTime.getTime() <= currentEventEnd.getTime()) {
                count++;
            }
            if (count >= 2) {
                break;
            }
        }
        return count;
    }

    // Find all of the text corresponding to time 
    //  events in the specified DOM element
    parseDom(element: HTMLElement): {[index: string]: string[]} {

        // Try to get more of the text from the page
        // .text() works for now but it can be better
        // (mark searches more of the page...)
        let parserResults = this.parser.parse($(element).text());

        // Structure to store the text to mark and its
        //  associated colors
        let textToMark: {[index: string]: string[]} = {
            "green": [],
            "yellow": [],
            "red": [],
        };

        for (let i: number = 0; i < parserResults.length; i++) {
            let matchedText: string = parserResults[i].text;
            // Ignore past events
            if (this.isPastEvent(parserResults[i])) {
                continue;
            }
            // Assign an appropriate color based on the 
            //  number of event conflicts
            let numConflicts = this.getNumConflicts(new Date(parserResults[i].start.date()));
            if (numConflicts == 0) {
                textToMark["green"].push(matchedText);
            } else if (numConflicts == 1) {
                textToMark["yellow"].push(matchedText);
            } else {
                textToMark["red"].push(matchedText);
            }
        }
        // console.log(textToMark);
        return textToMark;
    }
}