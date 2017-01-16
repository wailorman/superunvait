SELECT
    DATE(invites.createdAt) AS day,
    TRUNCATE( SUM(members.id IS NOT NULL) / COUNT(*) * 100, 2) AS conversion,
    COUNT(*) AS invites,
    SUM(members.id IS NOT NULL) AS joined,



    TRUNCATE( AVG(groups) , 2)             as avg_groups,
    TRUNCATE( AVG(notes) , 2)              as avg_notes,
    TRUNCATE( AVG(friends) , 2)            as avg_friends,
    TRUNCATE( AVG(photos) , 2)             as avg_photos,
    TRUNCATE( AVG(age) , 2)                as avg_age,
    TRUNCATE( AVG(games) , 2)              as avg_games,

    TRUNCATE(
        AVG(
            DATEDIFF(
                NOW(),
                registeredDate
            )
        )
    , 2)                                    as avg_daysBetwReg


FROM
    invites

LEFT JOIN members ON invites.userId = members.id
LEFT JOIN users ON invites.userId = users.uid

GROUP BY day

ORDER BY day DESC;