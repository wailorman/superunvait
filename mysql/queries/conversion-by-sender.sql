SELECT
	senderName,
	AVG(conversion) AS conversion,
	SUM(invites),
	SUM(joined)
FROM `conversion_by_date_&_sender`
GROUP BY senderName
ORDER BY conversion DESC;