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
		this.instance.mark(greenText, options);

		options["className"] = "yellowText";
		this.instance.mark(yellowText, options);
		
		options["className"] = "redText";
		this.instance.mark(redText, options);
	}
}