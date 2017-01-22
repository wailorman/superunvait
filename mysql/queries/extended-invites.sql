SELECT
		`ibb`.`invites`.`id` AS `id`,
    	`ibb`.`invites`.`userId` AS `userId`,
    	`ibb`.`invites`.`city` AS `city`,

    	convert_tz(
    		`ibb`.`invites`.`createdAt`,
    		'+00:00',
    		'+03:00'
    	) AS `createdAt`,

    	convert_tz(
    		`ibb`.`invites`.`updatedAt`,
    		'+00:00',
    		'+03:00'
    	) AS `updatedAt`,

    	`ibb`.`invites`.`senderId` AS `senderId`,
    	`senderNames`.`senderName` AS `senderName`,

    	`userNames`.`userName` AS `userName`,

    	convert_tz(
    		`joinedMembers`.`joinedAt`,
    		'+00:00',
    		'+03:00'
    	) AS `joinedAt`,

    	`userNames`.`age` AS `age`,
        `userNames`.`friends` AS `friends`,
        `userNames`.`photos` AS `photos`,
        `userNames`.`groups` AS `groups`,
        `userNames`.`notes` AS `notes`,
        `userNames`.`games` AS `games`,
        `userNames`.`registeredDate` AS `registeredDate`,
        `userNames`.`lastOnline` AS `lastOnline`,

        (
            UNIX_TIMESTAMP(
                convert_tz(
                    `ibb`.`invites`.`createdAt`,
                    '+00:00',
                    '+03:00'
                )
            )
            -
            UNIX_TIMESTAMP(`userNames`.`lastOnline`)
        ) / 3600 AS `hoursBetwSend&Online`
FROM

invites

LEFT JOIN
(
	SELECT DISTINCT
		invites.senderId,
		users.name AS senderName
	FROM invites
	LEFT JOIN users ON invites.senderId = users.uid
	WHERE invites.senderId IS NOT NULL
) senderNames
ON invites.senderId = senderNames.senderId

LEFT JOIN
(
	SELECT DISTINCT
		invites.userId,
		users.name AS userName,
		users.*
	FROM invites
	LEFT JOIN users ON invites.userId= users.uid
) userNames
ON invites.userId = userNames.userId

LEFT JOIN
(
	SELECT
		members.id AS id,
		members.createdAt AS joinedAt
	FROM members
) joinedMembers
ON invites.userId = joinedMembers.id


WHERE invites.senderId IS NOT NULL
  AND invites.status = 'SENT'

ORDER BY invites.id DESC;