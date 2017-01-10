(
SELECT * FROM avg_correlation
)

UNION ALL

(
SELECT

    "delta" AS joined,

    AVG(joined.avg_age)          - AVG(notJoined.avg_age)             AS dif_age,
    AVG(joined.avg_groups)       - AVG(notJoined.avg_groups)          AS dif_groups,
    AVG(joined.avg_games)        - AVG(notJoined.avg_games)           AS dif_games,
    AVG(joined.avg_friends)      - AVG(notJoined.avg_friends)         AS dif_friends,
    AVG(joined.avg_notes)        - AVG(notJoined.avg_notes)           AS dif_notes,
    AVG(joined.avg_photos)       - AVG(notJoined.avg_photos)          AS dif_photos,
    AVG(joined.avg_daysBetwReg)  - AVG(notJoined.avg_daysBetwReg)     AS dif_daysBetwReg

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