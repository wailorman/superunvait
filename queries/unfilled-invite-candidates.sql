SELECT
`invite-candidates`.userId,
users.uid
FROM
`invite-candidates`
LEFT JOIN users ON `invite-candidates`.userId = users.uid
WHERE users.uid IS NULL
LIMIT 100;