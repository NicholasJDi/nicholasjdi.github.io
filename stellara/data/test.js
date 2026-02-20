function sortDataBySearch(data, searchScheme, inputText = "", includeWeight = false) {
	if (inputText === "") {
		return data;
	} else {
		data.reverse();
		const outData = [];
		const index = [];
		for (let i = 0; i < data.length; i++) {
			index.push(0);
		}
		const inputTokens = inputText.toLowerCase().split(" ").filter(t => t !== "");
		for (const key of Object.keys(searchScheme)) {
			let i = 0;
			const searchItem = searchScheme[key];
			for (const item of data) {
				if (key in item) {
					let value = item[key];
					if (Array.isArray(value)) {
						value = value.join(" ");
					}
					value = value.toLowerCase().split(" ").filter(t => t !== "");
					let success = false;
					const weight = parseFloat(searchItem.weight ?? 1);
					const tokenWeight = parseFloat(searchItem.token_weight ?? 0);
					const positionWeight = parseFloat(searchItem.position_weight ?? 0);
					let totalWeight = 0;

					switch (searchItem.type) {
						case "contains":
							for (const token of inputTokens) {
								for (const searchToken of value) {
									if (searchToken.includes(token)) {
										success = true;
										totalWeight += tokenWeight;
										totalWeight += positionWeight * (inputTokens.length - inputTokens.indexOf(token));
									}
								}
							}
							break;
						case "exact":
							for (const token of inputTokens) {
								if (value.includes(token)) {
									success = true;
									totalWeight += tokenWeight;
									totalWeight += positionWeight * (inputTokens.length - inputTokens.indexOf(token));
								}
							}
							break;
						case "range":
							// TODO: implement range
							break;
					}
					if (success) {
						totalWeight += weight;
					}
					index[i] += totalWeight;
				}
				i++;
			}
		}
		const sortArray = [];
		for (let i = 0; i < index.length; i++) {
			if (index[i] !== 0) {
				sortArray.push([index[i], i]);
			}
		}
		sortArray.sort((a, b) => a[0] - b[0]);
		sortArray.reverse();
		for (const item of sortArray) {
			const out = JSON.parse(JSON.stringify(data[item[1]]));
			if (includeWeight) {
				out.weight = item[0];
			}
			outData.push(out);
		}
		return outData;
	}
}

function sortDataBySchemeMode(data, sortScheme, sortMode = "default") {
	let mode = sortScheme[sortMode];
	while (typeof mode === "string") {
		if (mode in sortScheme) {
			mode = sortScheme[mode];
		} else {
			break;
		}
	}
	return sortData(data, mode);
}

function sortData(data, sortMode) {
	let groups = [data];
	for (const ruleKey of Object.keys(sortMode)) {
		const rule = sortMode[ruleKey];
		const newGroups = [];
		const groupMap = {};
		let i = 0;

		for (const group of groups) {
			switch (rule.type) {
				case "sort": {
					const g = JSON.parse(JSON.stringify(group));
					g.sort((a, b) => {
						if (rule.reverse) {
							return a[ruleKey] > b[ruleKey] ? 1 : -1;
						} else {
							return a[ruleKey] < b[ruleKey] ? 1 : -1;
						}
					});
					newGroups.push(g);
					break;
				}
				case "order": {
					const buckets = {};
					let order = rule.order.slice();
					if (rule.reverse) {
						order.reverse();
					}
					for (const bucket of order) {
						buckets[bucket] = [];
					}
					buckets[null] = [];
					for (const item of group) {
						const key = item[ruleKey];
						if (key in buckets) {
							buckets[key].push(item);
						} else {
							buckets[null].push(item);
						}
					}
					for (const bucket of Object.keys(buckets)) {
						if (buckets[bucket].length > 0) {
							newGroups.push(buckets[bucket]);
						}
					}
					break;
				}
				case "group": {
					const items = [];
					i = 0;
					for (const item of group) {
						const value = item[ruleKey];
						if (value !== null && value !== undefined) {
							if (items.length > 0) {
								const g = [];
								for (const itm of items) {
									g.push(itm);
								}
								newGroups.push(g);
								i++;
								items.length = 0;
							}
							if (value in groupMap) {
								newGroups[groupMap[value]].push(item);
							} else {
								groupMap[value] = i;
								i++;
								newGroups.push([item]);
							}
						} else {
							items.push(item);
						}
					}
					if (items.length > 0) {
						const g = [];
						for (const item of items) {
							g.push(item);
						}
						newGroups.push(g);
						i++;
					}
					break;
				}
			}
		}

		if (rule.type === "group" && rule.reverse) {
			for (const item of Object.keys(groupMap)) {
				newGroups[groupMap[item]].reverse();
			}
		}
		if (rule.reverse_after) {
			newGroups.reverse();
		}
		groups = newGroups;
	}
	return groups.flat();
}