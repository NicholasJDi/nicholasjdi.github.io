import { sortDataBySchemeMode, sortDataBySearch } from "./search-sort.js";

const rawData = await fetchJsonData("https://nicholasjdi.github.io/stellara/data/music/data.json")
const searchScheme = await fetchJsonData("https://nicholasjdi.github.io/stellara/data/music/search.json")
const sortScheme = await fetchJsonData("https://nicholasjdi.github.io/stellara/data/music/sort.json")

async function fetchJsonData(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return await response.json(); 
	} catch (error) {
		console.error(`Error fetching or parsing JSON: ${error}`);
	}
}

document.addEventListener('DOMContentLoaded', ()=>{
	const searchbar = document.querySelector('.searchbar');
	if (!searchbar) return;
	const output = document.getElementById("output");

	const paramName = 'q'
	const searchParams = new URLSearchParams(window.location.search);
	const queryParam = searchParams.get(paramName);

	console.log(`${rawData}`)
	console.log(`${searchScheme}`)
	console.log(`${sortScheme}`)
	
	let searchQuery = queryParam
	let sortMode = "default"
	let reverse = false

	if (queryParam) {
		searchbar.value = queryParam
		search(searchQuery, sortMode, reverse);
	}

	searchbar.addEventListener("input", (event) => {
		console.log("a")
		search(event.target.value, sortMode, reverse);
	});

	searchbar.addEventListener("change", function(event) {
		const value = event.target.value.trim();
		const url = new URL(window.location.href);
		if (value) {
			url.searchParams.set(paramName, value);
		} else {
			url.searchParams.delete(paramName)
		}
		window.history.pushState({}, '', url);
	});

	const search = debounce(searchSort, 300);

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
		const sorted = sortDataBySchemeMode()
		const data = sortDataBySearch(sorted)
		if (reverse) data.reverse()
		musicListUpdate()
	}
});