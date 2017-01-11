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
				users.groups IS NULL
            LIMIT 100
		)
		UNION ALL
		(
			SELECT
				`invite-candidates`.userId AS id,
				users.uid
			FROM
				`invite-candidates`
			LEFT JOIN users ON `invite-candidates`.userId = users.uid
			WHERE
				users.groups IS NULL
            LIMIT 100
		)
		UNION ALL
		(
			SELECT
				invites.userId AS id,
				users.uid
			FROM
				invites
			LEFT JOIN users ON invites.userId = users.uid
			WHERE
				users.groups IS NULL
			LIMIT 100
		)
	) AS unino;