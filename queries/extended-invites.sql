SELECT
	invites.*,
	senderNames.senderName,
	userNames.userName,
	joinedMembers.joinedAt
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
		users.name AS userName
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

LIMIT 100;