const express = require('express');
const router = express.Router();
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

const ddb = new DynamoDBClient();

async function scanTable(tableName, limit = 50) {
	const entries = [];

	let lastEvaluatedKey = null;
	do {
		const command = new ScanCommand({
			TableName: tableName,
			ReturnConsumedCapacity: "NONE",
			ExclusiveStartKey: lastEvaluatedKey,
		});
		const results = await ddb.send(command);
		const items = results.Items;
		items.forEach(item => {
			entries.push({
				name: item.Name.S,
				date: new Date(item.Date.S),
				score: parseInt(item.Score.N, 10),
			});
		});
		lastEvaluatedKey = results.LastEvaluatedKey;
	} while (lastEvaluatedKey)

	entries.sort((a, b) => {
		if (a.score < b.score) return 1;
		if (a.score > b.score) return -1;
		return a.date.getTime() - b.date.getTime();
	});

	return entries.slice(0, limit);
}

router.get('/highscore', async (req, res) => {
	try {
		const entries = await scanTable('highscore');
		res.json(entries);
	}
	catch (err) {
		console.error(err);
		res.sendStatus(500);
	};
});

module.exports = router;
