function removeAllChildren(element) {
	let first = element.firstElementChild;
	while (first) {
		first.remove();
		first = element.firstElementChild;
	}
}

function refreshHeader(table) {
	const row = document.createElement('tr');
	row.classList.add('highscore-table-header');
	const rankHeader = document.createElement('th');
	const nameHeader = document.createElement('th');
	const scoreHeader = document.createElement('th');
	rankHeader.appendChild(document.createTextNode('Rank'));
	nameHeader.appendChild(document.createTextNode('Name'));
	scoreHeader.appendChild(document.createTextNode('Score'));
	row.appendChild(rankHeader);
	row.appendChild(nameHeader);
	row.appendChild(scoreHeader);
	table.appendChild(row);
}

function refreshLeaderboardRows(table, data) {
	refreshHeader(table);
	data.forEach((item, index) => {
		const rank = index + 1;
		const name = item.name;
		const score = item.score;

		const row = document.createElement('tr');
		row.classList.add('highscore-table-row');
		const rankCell = document.createElement('td');
		const nameCell = document.createElement('td');
		const scoreCell = document.createElement('td');
		rankCell.appendChild(document.createTextNode(rank));
		nameCell.appendChild(document.createTextNode(name));
		scoreCell.appendChild(document.createTextNode(score));
		row.appendChild(rankCell);
		row.appendChild(nameCell);
		row.appendChild(scoreCell);
		table.appendChild(row);
	});
}

async function refreshLeaderboard(table) {
	fetch('/api/highscore')
		.then(response => response.json())
		.then(data => {
			removeAllChildren(table);
			refreshLeaderboardRows(table, data);
		})
		.catch(error => alert(`Download error: ${error.message}`));
}

addEventListener('load', () => {
	const root = document.getElementById('root');
	const leaderboardTable = document.createElement('table');
	leaderboardTable.setAttribute('id', 'highscore-table');
	root.appendChild(leaderboardTable);
	setInterval(() => { refreshLeaderboard(leaderboardTable); }, 500);
});
