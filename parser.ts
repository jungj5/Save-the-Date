/// <reference path="node_modules/@types/jquery/index.d.ts" />

function parseDom() {
	let visibleText: string = $(document.body).children(":visible").text();
	visibleText = visibleText.replace(/\s+/g, " ");
	console.log(visibleText);
}

parseDom();
