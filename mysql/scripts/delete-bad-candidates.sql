DELETE FROM
users
WHERE uid IN (

	SELECT * FROM (

		SELECT
			uid
		FROM
			users

		LEFT JOIN `invite-candidates` ON `invite-candidates`.userId = users.uid
		LEFT JOIN members ON members.id = users.uid
		LEFT JOIN invites ON invites.userId = users.uid

		WHERE `invite-candidates`.label = 'BAD'
			AND members.id IS NULL
			AND invites.id IS NULL

	) as bad

)