SELECT
	invites.city AS city,
	COUNT(invites.id) AS invited,
	COUNT(members.id) AS joined,
	COUNT(members.id) / COUNT(invites.id) * 100 AS conversion
FROM
	invites
LEFT JOIN members ON invites.userId = members.id
WHERE invites.createdAt BETWEEN '2015-02-10' AND '2017-02-17'
GROUP BY
	invites.city
ORDER BY
conversion DESC
