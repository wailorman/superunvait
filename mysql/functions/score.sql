DROP FUNCTION IF EXISTS IBB_SCORE;
CREATE FUNCTION IBB_SCORE(
    friends FLOAT,
    photos FLOAT,
    groups FLOAT,
    notes FLOAT,
    games FLOAT
) RETURNS FLOAT

BEGIN

  DECLARE score FLOAT DEFAULT 0;

    SELECT
        (groups /100 * 10) +
        (friends /100 * 1) AS score
    INTO score;

  RETURN score;

END;

SELECT IBB_SCORE(
    107,
    138,
    103,
    32,
    18
)