(
SELECT * FROM avg_correlation
)

UNION ALL

(
SELECT

    "delta" AS joined,

    TRUNCATE( AVG(joined.avg_age)          - AVG(notJoined.avg_age) , 2)             AS dif_age,
    TRUNCATE( AVG(joined.avg_groups)       - AVG(notJoined.avg_groups) , 2)          AS dif_groups,
    TRUNCATE( AVG(joined.avg_games)        - AVG(notJoined.avg_games) , 2)           AS dif_games,
    TRUNCATE( AVG(joined.avg_friends)      - AVG(notJoined.avg_friends) , 2)         AS dif_friends,
    TRUNCATE( AVG(joined.avg_notes)        - AVG(notJoined.avg_notes) , 2)           AS dif_notes,
    TRUNCATE( AVG(joined.avg_photos)       - AVG(notJoined.avg_photos) , 2)          AS dif_photos,
    TRUNCATE( AVG(joined.avg_daysBetwReg)  - AVG(notJoined.avg_daysBetwReg) , 2)     AS dif_daysBetwReg

FROM


    (
        SELECT
        *
        FROM
        avg_correlation
        WHERE joined = '1'
    )
    joined,


    (
        SELECT
        *
        FROM
        avg_correlation
        WHERE joined = '0'
    )
    notJoined
)