import { sortDataBySchemeMode, sortDataBySearch } from "./search-sort.js";

export default searchSort

const output = document.getElementById("output");

let resolveMusicLoaded;
const musicListReady = new Promise(resolve => {
	resolveMusicLoaded = resolve;
});

let loadFailed = false

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

const rawData = await fetchJsonData("https://nicholasjdi.github.io/stellara/data/music/data.json", null);
const searchScheme = await fetchJsonData("https://nicholasjdi.github.io/stellara/data/music/search.json", null);
const sortScheme = await fetchJsonData("https://nicholasjdi.github.io/stellara/data/music/sort.json", null);
if (rawData && searchScheme && sortScheme) {

	
	resolveMusicLoaded();
} else {
	loadFailed = true
	console.error(`Failed to fetch Json data, listData: ${!!rawData}; searchScheme: ${!!searchScheme}; sortScheme: ${!!sortScheme};`);
}

function searchSort(query, sort, reverse) {
	if (output) output.textContent = query;
	if (loadFailed) return;
	const sorted = sortDataBySchemeMode(rawData, sortScheme, sort);
	const data = sortDataBySearch(sorted, searchScheme, query);
	const ids = data.map(item => item.id).filter(Boolean);
	if (reverse) ids.reverse();
	musicListUpdate(ids);
}

async function musicListUpdate(ids) {
	await musicListReady;
}