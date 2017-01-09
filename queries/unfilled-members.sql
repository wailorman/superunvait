SELECT
`members`.id,
users.uid
FROM
`members`
LEFT JOIN users ON `members`.id = users.uid
WHERE users.uid IS NULL
LIMIT 100;