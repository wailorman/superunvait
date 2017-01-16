SELECT
	completed.senderName,
	completed.invitesCount AS completedInvites,
	invitesTotal.invitesCount AS invitesTotal,
	(completed.invitesCount / invitesTotal.invitesCount) * 100 AS conversion
FROM
(

				SELECT
					COUNT(*) AS invitesCount,
					senderNames.senderName,
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
					SELECT
						members.id AS id,
						members.createdAt AS joinedAt
					FROM members
				) joinedMembers
				ON invites.userId = joinedMembers.id


				WHERE invites.senderId IS NOT NULL
					AND joinedMembers.joinedAt IS NOT NULL

				GROUP BY senderNames.senderName

) completed

LEFT JOIN
(
				SELECT
					COUNT(*) AS invitesCount,
					senderNames.senderName
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
) invitesTotal
ON completed.senderName = invitesTotal.senderName