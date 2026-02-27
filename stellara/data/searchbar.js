import { sortDataBySchemeMode, sortDataBySearch } from "./search-sort.js";

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}

async function init() {
	const searchbar = document.querySelector('.searchbar');
	if (!searchbar) return;
	const output = document.getElementById("output");

	const rawData = await fetchJsonData("https://nicholasjdi.github.io/stellara/data/music/data.json", []);
	const searchScheme = await fetchJsonData("https://nicholasjdi.github.io/stellara/data/music/search.json");
	const sortScheme = await fetchJsonData("https://nicholasjdi.github.io/stellara/data/music/sort.json");

	const paramName = 'q';
	const searchParams = new URLSearchParams(window.location.search);
	const queryParam = searchParams.get(paramName);
	const search = debounce(searchSort, 300);

	let searchQuery = queryParam;
	let sortMode = "default";
	let reverse = false;

	if (queryParam) {
		searchbar.value = queryParam;
		search(searchQuery, sortMode, reverse);
	}

	searchbar.addEventListener("input", (event) => {
		console.log("a");
		search(event.target.value, sortMode, reverse);
	});

	searchbar.addEventListener("change", function(event) {
		const value = event.target.value.trim();
		const url = new URL(window.location.href);
		if (value) {
			url.searchParams.set(paramName, value);
		} else {
			url.searchParams.delete(paramName);
		}
		window.history.pushState({}, '', url);
	});

	async function fetchJsonData(url, backup = {}) {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Network response was not ok ${response.status} ${response.statusText}`);
			}
			return await response.json();
		} catch (error) {
			console.error(`Error fetching or parsing JSON: ${error}`);
			return backup;
		}
	}

	function debounce(func, delay) {
		let timeoutId;
		return function(...args) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				func.apply(this, args);
			}, delay);
		};
	}

	function searchSort(query, sort, reverse) {
		output.textContent = query;
		const sorted = sortDataBySchemeMode(rawData, sortScheme, sort);
		const data = sortDataBySearch(sorted, searchScheme,query);
		const ids = data.map(item => item.id).filter(Boolean);
		if (reverse) ids.reverse();
		musicListUpdate(ids);
	}

	function musicListUpdate(ids) {
		return;
	}
}