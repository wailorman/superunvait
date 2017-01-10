(
SELECT
"joined" AS _,
AVG(age)        as avg_age,
AVG(groups)     as avg_groups,
AVG(games)      as avg_games,
AVG(friends)    as avg_friends,
AVG(notes)      as avg_notes,
AVG(photos)     as avg_photos
FROM
extended_invites
WHERE joinedAt IS NOT NULL
)
UNION ALL
(
SELECT
"not joined" _,
AVG(age)        as avg_age,
AVG(groups)     as avg_groups,
AVG(games)      as avg_games,
AVG(friends)    as avg_friends,
AVG(notes)      as avg_notes,
AVG(photos)     as avg_photos
FROM
extended_invites
WHERE joinedAt IS NULL
)



UNION ALL



(
SELECT

"diff" AS _,

joined.avg_age        - notJoined.avg_age       AS dif_age,
joined.avg_groups     - notJoined.avg_groups    AS dif_groups,
joined.avg_games      - notJoined.avg_games     AS dif_games,
joined.avg_friends    - notJoined.avg_friends   AS dif_friends,
joined.avg_notes      - notJoined.avg_notes     AS dif_notes,
joined.avg_photos     - notJoined.avg_photos    AS dif_photos

FROM


(
SELECT
joinedAt IS NOT NULL AS joined,
AVG(age)        as avg_age,
AVG(groups)     as avg_groups,
AVG(games)      as avg_games,
AVG(friends)    as avg_friends,
AVG(notes)      as avg_notes,
AVG(photos)     as avg_photos
FROM
extended_invites
WHERE joinedAt IS NOT NULL
) joined,


(
SELECT
joinedAt IS NOT NULL AS joined,
AVG(age)        as avg_age,
AVG(groups)     as avg_groups,
AVG(games)      as avg_games,
AVG(friends)    as avg_friends,
AVG(notes)      as avg_notes,
AVG(photos)     as avg_photos
FROM
extended_invites
WHERE joinedAt IS NULL
) notJoined

)