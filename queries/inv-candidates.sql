SELECT
	`invite-candidates`.userId,
	users.name,
	users.city,
	users.age,
	-- DATEDIFF(UTC_TIMESTAMP(),users.updatedAt) AS _daysLastUpd,
	-- DATEDIFF(NOW(), lastOnline) AS daysBetwOnline,
	-- DATEDIFF(NOW(), registeredDate) AS daysBetwRegister,
	users.friends,
	users.photos,
	users.groups,
	users.games,
	users.notes
FROM
`invite-candidates`

LEFT JOIN users
ON `invite-candidates`.userId = users.uid

LEFT JOIN invites
ON `invite-candidates`.userId = invites.userId

WHERE invites.id IS NULL