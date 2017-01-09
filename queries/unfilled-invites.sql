SELECT
invites.id,
invites.userId,
users.uid
FROM
invites
LEFT JOIN users ON invites.userId = users.uid
WHERE users.uid IS NULL
LIMIT 100;