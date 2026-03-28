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

const data = new Map();

const rawData = await fetchJsonData("https://nicholasjdi.github.io/stellara/data/music/data.json", null);
const searchScheme = await fetchJsonData("https://nicholasjdi.github.io/stellara/data/music/search.json", null);
const sortScheme = await fetchJsonData("https://nicholasjdi.github.io/stellara/data/music/sort.json", null);
const songList = document.querySelector('.song-list');
if (rawData && searchScheme && sortScheme && songList) {
	try {
		const typeMap = {
			single: 'Single',
			remix: 'Remix',
			album: 'Album',
			ep: 'EP'
		};
		// populate songList
		for (const song of rawData) {
			// prepare stuff
			const id = song.id;
			if (!id) {
				console.error(`${JSON.stringify(song)} does not include an id`);
				continue;
			}
			const file = song.file_art ?? song.file ?? song.file_library ?? '';
			if (!file) {
				console.warn(`${JSON.stringify(song)} does not include a file`);
			}
			const art = song.art ?? song.art_high_res ?? '';
			const art_high_res = song.art_high_res ?? song.art ?? '';
			if (!art || !art_high_res) {
				console.warn(`${JSON.stringify(song)} does not include art`);
			}
			const title = song.title ?? 'Missing Title :<';
			const artists = song.artists?.join(', ') ?? 'Missing Artist(s) :<';
			const date = getDateString(song.date) ?? 'Unknown'
			const album = song.album ?? song.title ?? ''
			const type = typeMap[song.type?.toLowerCase()] ?? 'Unknown';

			// save data
			data.set(id, song)

			// build the item
			const songListItem = document.createElement("div");
			songListItem.className = 'song-list-item';
			songListItem.id = id;

			// set the items content
			songListItem.innerHTML = `
				<a class="cover-art link" target="_blank" href="${art_high_res}">
					<img class="cover-art image" src="${art}" alt="Cover Art">
				</a>
				<div class="content-box">
					<div class="details-box">
						<p class="title-text">${title}</p>
						<p class="artist-text">${artists}</p>
					</div>
					<div class="right-box">
						<div class="info-box">
							<div class="date-box">
								<p class="date-text">${date}</p>
							</div>
							<div class="type-box">
								<p class="type-text ${type.toLowerCase()}" title="${album}">${type}</p>
							</div>
						</div>
						<div class="dropdown-box">
							<a class="download-button" target="_blank" download="" href="${file}">Download</a>
							<button class="dropdown-button">V</button>
						</div>
					</div>
				</div>
			`

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

function getDateString(date) {
	if (!date) return;
	const nums = date.split('-');
	if (nums.length != 3) return;
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const index = Number(nums[1]) - 1;
	return `${months[index]} ${nums[2]}, ${nums[0]}`;
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