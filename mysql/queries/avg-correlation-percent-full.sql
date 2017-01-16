-- groupsS
(
    SELECT
        splitted_invites_to_grps.groupsS,
        -- (COUNT(*) / _total.totalCnt - 1 + splitted_invites_to_grps.joined ) * 100 AS "%",
        _accepted.cnt / _total.cnt * 100 AS "%",
        _accepted.cnt AS "Приняли",
        _declined.cnt AS "Отказали",
        _total.cnt AS "Всего"
    FROM
        splitted_invites_to_grps


    LEFT JOIN (
            SELECT
                groupsS,
                COUNT(*) AS cnt
            FROM
                splitted_invites_to_grps
             WHERE joined = '1'
            GROUP BY groupsS
    ) AS _accepted ON _accepted.groupsS = splitted_invites_to_grps.groupsS


    LEFT JOIN (
            SELECT
                groupsS,
                COUNT(*) AS cnt
            FROM
                splitted_invites_to_grps
             WHERE joined = '0'
            GROUP BY groupsS
    ) AS _declined ON _declined.groupsS = splitted_invites_to_grps.groupsS


    LEFT JOIN (
            SELECT
                groupsS,
                COUNT(*) AS cnt
            FROM
                splitted_invites_to_grps
            GROUP BY groupsS
    ) AS _total ON _total.groupsS = splitted_invites_to_grps.groupsS


    GROUP BY splitted_invites_to_grps.groupsS

    ORDER BY
        `%` DESC,
        splitted_invites_to_grps.groupsS ASC
);



-- ageS
(
    SELECT
        splitted_invites_to_grps.ageS,
        -- (COUNT(*) / _total.totalCnt - 1 + splitted_invites_to_grps.joined ) * 100 AS "%",
        _accepted.cnt / _total.cnt * 100 AS "%",
        _accepted.cnt AS "Приняли",
        _declined.cnt AS "Отказали",
        _total.cnt AS "Всего"
    FROM
        splitted_invites_to_grps


    LEFT JOIN (
            SELECT
                ageS,
                COUNT(*) AS cnt
            FROM
                splitted_invites_to_grps
             WHERE joined = '1'
            GROUP BY ageS
    ) AS _accepted ON _accepted.ageS = splitted_invites_to_grps.ageS


    LEFT JOIN (
            SELECT
                ageS,
                COUNT(*) AS cnt
            FROM
                splitted_invites_to_grps
             WHERE joined = '0'
            GROUP BY ageS
    ) AS _declined ON _declined.ageS = splitted_invites_to_grps.ageS


    LEFT JOIN (
            SELECT
                ageS,
                COUNT(*) AS cnt
            FROM
                splitted_invites_to_grps
            GROUP BY ageS
    ) AS _total ON _total.ageS = splitted_invites_to_grps.ageS


    GROUP BY splitted_invites_to_grps.ageS

    ORDER BY
        `%` DESC,
        splitted_invites_to_grps.ageS ASC
);



-- notesS
(
    SELECT
        splitted_invites_to_grps.notesS,
        -- (COUNT(*) / _total.totalCnt - 1 + splitted_invites_to_grps.joined ) * 100 AS "%",
        _accepted.cnt / _total.cnt * 100 AS "%",
        _accepted.cnt AS "Приняли",
        _declined.cnt AS "Отказали",
        _total.cnt AS "Всего"
    FROM
        splitted_invites_to_grps


    LEFT JOIN (
            SELECT
                notesS,
                COUNT(*) AS cnt
            FROM
                splitted_invites_to_grps
             WHERE joined = '1'
            GROUP BY notesS
    ) AS _accepted ON _accepted.notesS = splitted_invites_to_grps.notesS


    LEFT JOIN (
            SELECT
                notesS,
                COUNT(*) AS cnt
            FROM
                splitted_invites_to_grps
             WHERE joined = '0'
            GROUP BY notesS
    ) AS _declined ON _declined.notesS = splitted_invites_to_grps.notesS


    LEFT JOIN (
            SELECT
                notesS,
                COUNT(*) AS cnt
            FROM
                splitted_invites_to_grps
            GROUP BY notesS
    ) AS _total ON _total.notesS = splitted_invites_to_grps.notesS


    GROUP BY splitted_invites_to_grps.notesS

    ORDER BY
        `%` DESC,
        splitted_invites_to_grps.notesS ASC
);


-- photosS
(
    SELECT
        splitted_invites_to_grps.photosS,
        -- (COUNT(*) / _total.totalCnt - 1 + splitted_invites_to_grps.joined ) * 100 AS "%",
        _accepted.cnt / _total.cnt * 100 AS "%",
        _accepted.cnt AS "Приняли",
        _declined.cnt AS "Отказали",
        _total.cnt AS "Всего"
    FROM
        splitted_invites_to_grps


    LEFT JOIN (
            SELECT
                photosS,
                COUNT(*) AS cnt
            FROM
                splitted_invites_to_grps
             WHERE joined = '1'
            GROUP BY photosS
    ) AS _accepted ON _accepted.photosS = splitted_invites_to_grps.photosS


    LEFT JOIN (
            SELECT
                photosS,
                COUNT(*) AS cnt
            FROM
                splitted_invites_to_grps
             WHERE joined = '0'
            GROUP BY photosS
    ) AS _declined ON _declined.photosS = splitted_invites_to_grps.photosS


    LEFT JOIN (
            SELECT
                photosS,
                COUNT(*) AS cnt
            FROM
                splitted_invites_to_grps
            GROUP BY photosS
    ) AS _total ON _total.photosS = splitted_invites_to_grps.photosS


    GROUP BY splitted_invites_to_grps.photosS

    ORDER BY
        `%` DESC,
        splitted_invites_to_grps.photosS ASC
);


-- reg
(
    SELECT
        splitted_invites_to_grps.daysBetwRegS,
        -- (COUNT(*) / _total.totalCnt - 1 + splitted_invites_to_grps.joined ) * 100 AS "%",
        _accepted.cnt / _total.cnt * 100 AS "%",
        _accepted.cnt AS "Приняли",
        _declined.cnt AS "Отказали",
        _total.cnt AS "Всего"
    FROM
        splitted_invites_to_grps


    LEFT JOIN (
            SELECT
                daysBetwRegS,
                COUNT(*) AS cnt
            FROM
                splitted_invites_to_grps
             WHERE joined = '1'
            GROUP BY daysBetwRegS
    ) AS _accepted ON _accepted.daysBetwRegS = splitted_invites_to_grps.daysBetwRegS


    LEFT JOIN (
            SELECT
                daysBetwRegS,
                COUNT(*) AS cnt
            FROM
                splitted_invites_to_grps
             WHERE joined = '0'
            GROUP BY daysBetwRegS
    ) AS _declined ON _declined.daysBetwRegS = splitted_invites_to_grps.daysBetwRegS


    LEFT JOIN (
            SELECT
                daysBetwRegS,
                COUNT(*) AS cnt
            FROM
                splitted_invites_to_grps
            GROUP BY daysBetwRegS
    ) AS _total ON _total.daysBetwRegS = splitted_invites_to_grps.daysBetwRegS


    GROUP BY splitted_invites_to_grps.daysBetwRegS

    ORDER BY
        `%` DESC,
        splitted_invites_to_grps.daysBetwRegS ASC
);


-- friendsS
(
    SELECT
        splitted_invites_to_grps.friendsS,
        -- (COUNT(*) / _total.totalCnt - 1 + splitted_invites_to_grps.joined ) * 100 AS "%",
        _accepted.cnt / _total.cnt * 100 AS "%",
        _accepted.cnt AS "Приняли",
        _declined.cnt AS "Отказали",
        _total.cnt AS "Всего"
    FROM
        splitted_invites_to_grps


    LEFT JOIN (
            SELECT
                friendsS,
                COUNT(*) AS cnt
            FROM
                splitted_invites_to_grps
             WHERE joined = '1'
            GROUP BY friendsS
    ) AS _accepted ON _accepted.friendsS = splitted_invites_to_grps.friendsS


    LEFT JOIN (
            SELECT
                friendsS,
                COUNT(*) AS cnt
            FROM
                splitted_invites_to_grps
             WHERE joined = '0'
            GROUP BY friendsS
    ) AS _declined ON _declined.friendsS = splitted_invites_to_grps.friendsS


    LEFT JOIN (
            SELECT
                friendsS,
                COUNT(*) AS cnt
            FROM
                splitted_invites_to_grps
            GROUP BY friendsS
    ) AS _total ON _total.friendsS = splitted_invites_to_grps.friendsS


    GROUP BY splitted_invites_to_grps.friendsS

    ORDER BY
        `%` DESC,
        splitted_invites_to_grps.friendsS ASC
);