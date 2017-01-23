DROP FUNCTION IF EXISTS IBB_JOINING_SPEED;
CREATE FUNCTION IBB_JOINING_SPEED(
    inviteDate DATETIME,
    regDate DATETIME,
    groups INTEGER
) RETURNS FLOAT

BEGIN

  DECLARE joiningSpeed FLOAT DEFAULT 0;

    SELECT

			groups /

			CASE
			    WHEN DATEDIFF(inviteDate,regDate) < 700  THEN DATEDIFF(inviteDate,regDate)
			    WHEN DATEDIFF(inviteDate,regDate) >= 700  THEN 700
			END

		AS joiningSpeed
    INTO joiningSpeed;

  RETURN joiningSpeed;

END;

SELECT IBB_JOINING_SPEED(
    NOW(),
    '2017-01-20',
    103
)