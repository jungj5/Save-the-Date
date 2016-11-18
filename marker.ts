declare var Mark: any;

interface MarkOptions {
    "className": string;
    "separateWordSearch": boolean;
}

class Marker {
	private instance;

	constructor(context: HTMLElement) {
		this.instance = new Mark(context);
	}

	setContext(newContext: HTMLElement): void {
		this.instance = new Mark(newContext);
	}

	markText(textToMark: {[index: string]: string[]}): void {
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