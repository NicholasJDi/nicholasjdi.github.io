import { sortDataBySchemeMode, sortDataBySearch } from "./search-sort.js";

export default searchSort;

const output = document.getElementById("output");
const noResultsText = document.querySelector('.no-results-text');

let loadFailed = false;

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

const songListItems = new Map();
const visibleSongListItems = new Set();

const rawData = await fetchJsonData("https://nicholasjdi.github.io/stellara/data/music/data.json", null);
const searchScheme = await fetchJsonData("https://nicholasjdi.github.io/stellara/data/music/search.json", null);
const sortScheme = await fetchJsonData("https://nicholasjdi.github.io/stellara/data/music/sort.json", null);
const songList = document.querySelector('.song-list');
if (rawData && searchScheme && sortScheme && songList) {
	try {
		for (const song of rawData) {
			// prepare stuff
			const id = song.id;
			if (!id) {
				console.error(`${JSON.stringify(song)} does not include an id`);
				continue;
			}

			// build the item
			const songListItem = document.createElement("div");
			songListItem.id = id;
			songListItem.classList.add('song-list-item');

			// set the items content
			const text = document.createElement('a');
			text.textContent = id;
			songListItem.appendChild(text);

			// add the item
			songListItems.set(id, songListItem);
			songList.appendChild(songListItem);
		}
	} catch (e) {
		console.error(`${e}`)
	}
} else {
	loadFailed = true;
	console.error(`Failed to fetch Json data, listData: ${!!rawData}; searchScheme: ${!!searchScheme}; sortScheme: ${!!sortScheme}; songList: ${!!songList};`);
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

function musicListUpdate(ids) {
	songList.classList.add('hidden');

	// remove previous
	for (const songListItem of visibleSongListItems) {
		songListItem.classList.remove("visible");
	}
	visibleSongListItems.clear();

	if (ids.length === 0) {
		// no results
		if (noResultsText) {
			noResultsText.classList.add("visible");
			visibleSongListItems.add(noResultsText);
		}
	} else {
		// add new
		const fragment = document.createDocumentFragment();

		for (const id of ids) {
			const songListItem = songListItems.get(id);
			if (!songListItem) continue;

			songListItem.classList.add("visible");
			fragment.appendChild(songListItem);
			visibleSongListItems.add(songListItem);
		}

		songList.appendChild(fragment);
	}
	songList.classList.remove('hidden');
}