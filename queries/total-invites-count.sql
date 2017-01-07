SELECT
	senderNames.senderName,
	COUNT(*) AS invitesCount
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
	SELECT
		members.id AS id,
		members.createdAt AS joinedAt
	FROM members
) joinedMembers
ON invites.userId = joinedMembers.id


WHERE invites.senderId IS NOT NULL

GROUP BY senderNames.senderName