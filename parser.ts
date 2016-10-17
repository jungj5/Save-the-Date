/// <reference path="node_modules/@types/jquery/index.d.ts" />

// Interface describing the variables for the MutationObserver
interface ObserverConfig {
	attributes: boolean;
	childList: boolean;
	characterData: boolean;
}

// Function to parse all visible text
function parseDom(): void {
	let visibleText: string = $(document.body).children(":visible").text();
	visibleText = visibleText.replace(/\s+/g, " ");
	console.log(visibleText);
}

// Function that sets up observers and reparses the 
//  page every time there is a change
$(document).ready(function (): void {
	let observer: MutationObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation): void {
			parseDom();
		});    
	});
	 
	//Notify me of everything!
	let observerConfig: ObserverConfig = {
		attributes: true, 
		childList: true, 
		characterData: true 
	};
	 
	// Node, config
	// In this case we'll listen to all changes to body and child nodes
	let targetNode: HTMLElement = document.body;
	observer.observe(targetNode, observerConfig);
});