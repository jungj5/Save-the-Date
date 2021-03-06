// --------------------------------------------------------
// PARSER class that handles all page parsing including
//  filtering out old events and events lacking appropriate
//  information, checking the number of event conflicts,
//  and returning all of the proposed events with their
//  coloring
// --------------------------------------------------------

// This class in combination with popup.ts follows
// the Interpreter design pattern. (Specifically with dates)


// -------------
// Variable Declarations
// -------------

declare let chrono: any;


// -------------
// Constant Global Variables
// -------------

const MONTH_THRESHOLD: number = 2;
const DEFAULT_EVENT_LENGTH: number = 1;


// -------------
// Class Declaration
// -------------

class ChronoParser {

    // -------------
    // Member Variables
    // -------------

    private parser;
    private events;


    // -------------
    // Constructor
    // -------------

    constructor(events) {
        this.parser = new chrono.Chrono();
        this.events = events;

        // Custom refiner to filter out events that do not
        //  contain enough information to be useful
        let parserRefiner = new chrono.Refiner();
        parserRefiner.refine = function(text, results, opt) {
            let newResults = [];
            results.forEach(function(result) {
                // Ignore any events that do not have a month and
                //  day specified
                if (typeof result.start.knownValues.day !== "undefined"
                    && typeof result.start.knownValues.month !== "undefined") {
                    // Events with a year can be added
                    if (typeof result.start.knownValues.year !== "undefined") {
                        newResults.push(result);
                    } else {
                        // Add the event to the list if there is no year but
                        //  the month is within the threshold measured off
                        //  the current date
                        let currentMonth: number = new Date().getMonth();
                        let knownMonth: number = result.start.knownValues.month;
                        let difference: number = Math.abs(knownMonth - currentMonth);
                        if (difference <= MONTH_THRESHOLD || difference >= 12 - MONTH_THRESHOLD) {
                            newResults.push(result);
                        }
                    }
                }
            });
            return newResults;
        }
        this.parser.refiners.push(parserRefiner);
    }


    // -------------
    // Private Functions
    // -------------

    // Checks if a time event already happened
    // Returns true for past events, false otherwise
    private isPastEvent(parsedResult): boolean {
        let parsedDate: Date = new Date(parsedResult.start.date());
        let currentDate: Date = new Date();
        currentDate.setHours(23, 59, 59, 999);
        if (parsedDate.getTime() <= currentDate.getTime()) {
            return true;
        } else {
            return false;
        }
    }

    // Get the number of conflicts that the
    //  proposed event has with existing events
    private getNumConflicts(proposedEventStart: Date, proposedEventEnd: Date): number {
        let count: number = 0;
        for (let i: number = 0; i < this.events.length; i++) {
            let currentEventStart: Date = new Date(this.events[i].start.dateTime);
            let currentEventEnd: Date = new Date(this.events[i].end.dateTime);
            // Compare the proposed event's start and end time
            //  with each event already on the calendar
            if ((proposedEventStart.getTime() >= currentEventStart.getTime() && proposedEventStart.getTime() <= currentEventEnd.getTime())
                || (proposedEventEnd.getTime() >= currentEventStart.getTime() && proposedEventEnd.getTime() <= currentEventEnd.getTime())
                || (proposedEventStart.getTime() <= currentEventStart.getTime() && proposedEventEnd.getTime() >= currentEventEnd.getTime())) {
                count++;
            }
            if (count >= 2) {
                break;
            }
        }
        return count;
    }


    // -------------
    // Public Functions
    // -------------

    // Find all of the text corresponding to time
    //  events in the specified DOM element
    public parseDom(element: HTMLElement) {

        // Try to get more of the text from the page
        // .text() works for now but it can be better
        // (mark searches more of the page...)
        let parserResults = this.parser.parse($(element).text());

        // Structure to store the text to mark and its
        //  associated colors
        let textToMark = {
            "green": [],
            "yellow": [],
            "red": [],
        };

        for (let i: number = 0; i < parserResults.length; i++) {
            let parserResult = parserResults[i];
            let matchedText: string = parserResult.text;

            // Ignore past events
            if (this.isPastEvent(parserResult)) {
                continue;
            }

            // Events without a specified time don't have conflicts
            if (parserResult.start.impliedValues.hour) {
                textToMark["green"].push(matchedText);
                continue;
            }

            // Get the event start and end times
            // let parserResult: ParsedResult = parserResults[i];
            let proposedEventStart: Date = new Date(parserResult.start.date());
            let proposedEventEnd: Date;
            if (parserResult.end) {
                proposedEventEnd = new Date(parserResult.end.date());
            } else {
                // Create an end time if there is not currently one
                proposedEventEnd = new Date(parserResult.start.date());
                proposedEventEnd.setHours(proposedEventStart.getHours() + DEFAULT_EVENT_LENGTH);
            }

            // Assign an appropriate color based on the
            //  number of event conflicts
            let numConflicts: number = this.getNumConflicts(proposedEventStart, proposedEventEnd);
            if (numConflicts == 0) {
                textToMark["green"].push(matchedText);
            } else if (numConflicts == 1) {
                textToMark["yellow"].push(matchedText);
            } else {
                textToMark["red"].push(matchedText);
            }
        }
        return textToMark;
    }
}
