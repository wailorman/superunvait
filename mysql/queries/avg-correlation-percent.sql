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
    splitted_invites_to_grps.groupsS ASC;