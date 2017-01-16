SELECT
    joinedAt IS NOT NULL    AS joined,
    TRUNCATE( AVG(age) , 2)                as avg_age,
    TRUNCATE( AVG(groups) , 2)             as avg_groups,
    TRUNCATE( AVG(games) , 2)              as avg_games,
    TRUNCATE( AVG(friends) , 2)            as avg_friends,
    TRUNCATE( AVG(notes) , 2)              as avg_notes,
    TRUNCATE( AVG(photos) , 2)             as avg_photos,

    TRUNCATE(
        AVG(
            DATEDIFF(
                NOW(),
                registeredDate
            )
        )
    , 2)
    as avg_daysBetwReg

FROM
    extended_invites

WHERE createdAt >= '2017-01-11 00:00:00'

GROUP BY joined