UPDATE `invite-candidates`
SET label = 'BAD'
WHERE userId IN (

	SELECT * FROM (

		SELECT
			userId
		FROM
			`invite-candidates`

		LEFT JOIN users ON
		`invite-candidates`.userId = users.uid

		WHERE users.groups < 100

	) as ic
);


UPDATE `invite-candidates`
SET label = 'NORMAL'
WHERE userId IN (

	SELECT * FROM (

		SELECT
			userId
		FROM
			`invite-candidates`

		LEFT JOIN users ON
		`invite-candidates`.userId = users.uid

		WHERE users.groups >= 100

	) as ic
);