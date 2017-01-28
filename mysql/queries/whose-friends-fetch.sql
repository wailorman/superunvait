SELECT
    userId
FROM
    `invite-candidates`
WHERE
    friendsStatus = 'NOT_FETCHED'

ORDER BY createdAt ASC

LIMIT 500