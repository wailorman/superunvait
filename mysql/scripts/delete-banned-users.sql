DELETE FROM users
WHERE uid IN (

	SELECT * FROM (

		SELECT
			uid
		FROM
			users

		WHERE uid IS NOT NULL
		  AND groups IS NULL

	) as banned

)