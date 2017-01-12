SELECT
	*,
	(groups /100 * 3.65) +
	(friends /100 * 3.65) AS score
FROM
	inv_candidates
ORDER BY score DESC;