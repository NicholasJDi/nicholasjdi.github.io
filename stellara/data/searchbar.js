document.addEventListener('DOMContentLoaded', ()=>{
	const searchbar = document.querySelector('.searchbar');
	if (!searchbar) {console.console.error('No searchbar found'); return}
	const output = document.getElementById("output");

	searchbar.addEventListener("input", (event) => {
		search(event.target.value);
	});

	searchbar.addEventListener("change", function(event) {
		const value = event.target.value.trim();
		const url = new URL(window.location.href);
		if (value) {
			url.searchParams.set('search', value);
		} else {
			url.searchParams.delete('search')
		}
		window.history.replaceState({}, '', url);
	});

	const search = debounce(rebuildList, 300);

	function debounce(func, delay) {
		let timeoutId;
		return function(...args) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				func.apply(this, args);
			}, delay);
		};
	}

	function rebuildList(query) {
		console.log('rebuild')
		output.textContent = query
	}
});