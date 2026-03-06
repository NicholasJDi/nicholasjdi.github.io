import { sortDataBySchemeMode, sortDataBySearch } from "./search-sort.js";

export default searchSort

const output = document.getElementById("output");
if (!output) return;	

let resolveMusicLoaded;
const musicListReady = new Promise(resolve => {
	resolveMusicLoaded = resolve;
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

const rawData = await fetchJsonData("https://nicholasjdi.github.io/stellara/data/music/data.jon", null);
const searchScheme = await fetchJsonData("https://nicholasjdi.github.io/stellara/data/music/search.jso", null);
const sortScheme = await fetchJsonData("https://nicholasjdi.github.io/stellara/data/music/sort.j", null);
if (!rawData || !searchScheme || !sortScheme) console.error(`Failed to fetch Json data, data: ${rawData}; searchScheme: ${searchScheme}; sortScheme: ${sortScheme};`); return;

function searchSort(query, sort, reverse) {
	output.textContent = query;
	const sorted = sortDataBySchemeMode(rawData, sortScheme, sort);
	const data = sortDataBySearch(sorted, searchScheme,query);
	const ids = data.map(item => item.id).filter(Boolean);
	if (reverse) ids.reverse();
	musicListUpdate(ids);
}

async function musicListUpdate(ids) {
	await musicListReady;
}

resolveMusicLoaded();