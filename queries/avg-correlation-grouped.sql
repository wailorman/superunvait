SELECT
    joinedAt IS NOT NULL    AS joined,
    COUNT(*)                AS count,


    -- AVG(groups)             as avg_groups,
    CASE
        WHEN    groups           < 100        THEN '0   .. 100'
        WHEN    groups BETWEEN   100 and 200  THEN '100 .. 200'
        WHEN    groups BETWEEN   200 and 300  THEN '200 .. 300'
        WHEN    groups BETWEEN   300 and 400  THEN '300 .. 400'
        WHEN    groups BETWEEN   400 and 500  THEN '400 .. 500'
        WHEN    groups BETWEEN   500 and 600  THEN '500 .. 600'
        WHEN    groups BETWEEN   600 and 700  THEN '600 .. 700'
        WHEN    groups           >  700       THEN '700 .. 999'
    END as      groupsS,


    -- AVG(age)                as avg_age,
    CASE
        WHEN    age           < 50        THEN '0  .. 50'
        WHEN    age BETWEEN   50 and 60   THEN '50 .. 60'
        WHEN    age BETWEEN   70 and 80   THEN '70 .. 80'
        WHEN    age           >  80       THEN '80 .. 99'
    END as      ageS,



    -- AVG(games)              as avg_games,
    CASE
        WHEN    games           < 100        THEN '0   .. 100'
        WHEN    games BETWEEN   100 and 200  THEN '100 .. 200'
        WHEN    games BETWEEN   200 and 300  THEN '200 .. 300'
        WHEN    games BETWEEN   300 and 400  THEN '300 .. 400'
        WHEN    games BETWEEN   400 and 500  THEN '400 .. 500'
        WHEN    games BETWEEN   500 and 600  THEN '500 .. 600'
        WHEN    games BETWEEN   600 and 700  THEN '600 .. 700'
        WHEN    games           >  700       THEN '700 .. 999'
    END as      gamesS,



    -- AVG(friends)            as avg_friends,
    CASE
        WHEN    friends           < 100        THEN '0   .. 100'
        WHEN    friends BETWEEN   100 and 200  THEN '100 .. 200'
        WHEN    friends BETWEEN   200 and 300  THEN '200 .. 300'
        WHEN    friends BETWEEN   300 and 400  THEN '300 .. 400'
        WHEN    friends BETWEEN   400 and 500  THEN '400 .. 500'
        WHEN    friends BETWEEN   500 and 600  THEN '500 .. 600'
        WHEN    friends BETWEEN   600 and 700  THEN '600 .. 700'
        WHEN    friends           >  700       THEN '700 .. 999'
    END as      friendsS,



    -- AVG(notes)              as avg_notes,
    CASE
        WHEN    notes           < 100        THEN '0   .. 100'
        WHEN    notes BETWEEN   100 and 200  THEN '100 .. 200'
        WHEN    notes BETWEEN   200 and 300  THEN '200 .. 300'
        WHEN    notes BETWEEN   300 and 400  THEN '300 .. 400'
        WHEN    notes BETWEEN   400 and 500  THEN '400 .. 500'
        WHEN    notes BETWEEN   500 and 600  THEN '500 .. 600'
        WHEN    notes BETWEEN   600 and 700  THEN '600 .. 700'
        WHEN    notes           >  700       THEN '700 .. 999'
    END as      notesS,



    -- AVG(photos)             as avg_photos,
    CASE
        WHEN    photos           < 100        THEN '0   .. 100'
        WHEN    photos BETWEEN   100 and 200  THEN '100 .. 200'
        WHEN    photos BETWEEN   200 and 300  THEN '200 .. 300'
        WHEN    photos BETWEEN   300 and 400  THEN '300 .. 400'
        WHEN    photos BETWEEN   400 and 500  THEN '400 .. 500'
        WHEN    photos BETWEEN   500 and 600  THEN '500 .. 600'
        WHEN    photos BETWEEN   600 and 700  THEN '600 .. 700'
        WHEN    photos           >  700       THEN '700 .. 999'
    END as      photosS,



    -- AVG(DATEDIFF(NOW(),registeredDate))
    --                        as avg_daysBetwReg,

    CASE
        WHEN    DATEDIFF( NOW(), registeredDate )           < 1000          THEN '0    .. 1000'
        WHEN    DATEDIFF( NOW(), registeredDate ) BETWEEN   1000 and 2000   THEN '1000 .. 2000'
        WHEN    DATEDIFF( NOW(), registeredDate ) BETWEEN   2000 and 3000   THEN '2000 .. 3000'
        WHEN    DATEDIFF( NOW(), registeredDate ) BETWEEN   3000 and 4000   THEN '3000 .. 4000'
        WHEN    DATEDIFF( NOW(), registeredDate ) BETWEEN   4000 and 5000   THEN '4000 .. 5000'
        WHEN    DATEDIFF( NOW(), registeredDate ) BETWEEN   5000 and 6000   THEN '5000 .. 6000'
        WHEN    DATEDIFF( NOW(), registeredDate ) BETWEEN   6000 and 7000   THEN '6000 .. 7000'
        WHEN    DATEDIFF( NOW(), registeredDate )           >  7000         THEN '7000 .. 9999'
    END as      daysBetwRegS




FROM
    extended_invites

GROUP BY joined, groupsS

ORDER BY
    joined DESC,
    groupsS ASC;