SELECT
    DATE(invites.createdAt) AS day,
    TRUNCATE( SUM(members.id IS NOT NULL) / COUNT(*) * 100, 2) AS conversion,
    COUNT(*) AS invites,
    SUM(members.id IS NOT NULL) AS joined
FROM
    invites

LEFT JOIN members ON invites.userId = members.id

GROUP BY day

ORDER BY day DESC;