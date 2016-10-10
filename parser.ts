function parseDom() {
	var visibleText = $(document.body).children(":visible").text();
	visibleText = visibleText.replace(/\s+/g, " ");
	console.log(visibleText);
}

parseDom();