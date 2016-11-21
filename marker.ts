// --------------------------------------------------------
// MARKER class that handles highlighting all of the
//  appropriate time events on the webpage
// --------------------------------------------------------

// -------------
// Variable Declarations
// -------------

declare var Mark: any;


// -------------
// Interfaces
// -------------

interface MarkOptions {
    "className": string;
    "separateWordSearch": boolean;
}


// -------------
// Class Declaration
// -------------

class Marker {

	// -------------
	// Member Variables
	// -------------

	private instance;


	// -------------
	// Constructor
	// -------------

	constructor(context: HTMLElement) {
		this.instance = new Mark(context);
	}


	// -------------
	// Public Functions
	// -------------

	// The context is the HTMLElement that
	//  is searched for text to highlight
	setContext(newContext: HTMLElement): void {
		this.instance = new Mark(newContext);
	}

	// Mark each event with its appropriate
	//  text color
	markText(textToMark): void {
		let greenText: string[] = textToMark["green"];
		let yellowText: string[] = textToMark["yellow"];
		let redText: string[] = textToMark["red"];

		let options = {
	        "className": "greenText",
	        "separateWordSearch": false
	    }
	    if (greenText.length > 0) {
			this.instance.mark(greenText, options);
	    } 

	    if (yellowText.length > 0) {
	    	options["className"] = "yellowText";
			this.instance.mark(yellowText, options);
	    }
		
		if (redText.length > 0) {
			options["className"] = "redText";
			this.instance.mark(redText, options);	
		}
	}
}