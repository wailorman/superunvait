SELECT
	users.uid,
	users.name,
	users.city,
	users.age,
	users.friends,
	users.photos,
	users.groups,
	users.games,
	users.notes,
	users.lastOnline,
	users.updatedAt
FROM
    users

LEFT JOIN invites
ON users.uid = invites.userId

LEFT JOIN members
ON users.uid = members.id

WHERE invites.id IS NULL
  AND members.id IS NULL