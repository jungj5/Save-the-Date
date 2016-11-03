declare var Mark: any;

interface MarkOptions {
    "className": string;
    "separateWordSearch": boolean;
}

class Marker {
	private instance;
	private options: MarkOptions;

	constructor(context: HTMLElement) {
		this.instance = new Mark(context);
		this.options = {
	        "className": "markedText",
	        "separateWordSearch": false
	    }
	}

	setContext(newContext: HTMLElement): void {
		this.instance = new Mark(newContext);
	}

	markText(textToMark: string[]): void {
		this.instance.mark(textToMark, this.options);
	}
}