SELECT DISTINCT
	*
FROM
	(
		(
			SELECT
				`members`.id,
				users.uid
			FROM
				`members`
			LEFT JOIN users ON `members`.id = users.uid
			WHERE
				users.uid IS NULL
		)
		UNION ALL
		(
			SELECT
				`invite-candidates`.userId,
				users.uid
			FROM
				`invite-candidates`
			LEFT JOIN users ON `invite-candidates`.userId = users.uid
			WHERE
				users.uid IS NULL
		)
		UNION ALL
		(
			SELECT
				invites.userId,
				users.uid
			FROM
				invites
			LEFT JOIN users ON invites.userId = users.uid
			WHERE
				users.uid IS NULL
		)
	) AS unino
LIMIT 100;