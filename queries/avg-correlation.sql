SELECT
    joinedAt IS NOT NULL    AS joined,
    AVG(age)                as avg_age,
    AVG(groups)             as avg_groups,
    AVG(games)              as avg_games,
    AVG(friends)            as avg_friends,
    AVG(notes)              as avg_notes,
    AVG(photos)             as avg_photos,
    AVG(
        DATEDIFF(
            NOW(),
            registeredDate
        )
    )                       as avg_daysBetwReg

FROM
    extended_invites

GROUP BY joined