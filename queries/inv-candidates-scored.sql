SELECT
	*,
	(groups /100 * 10) +
	(friends /100 * 1) AS score
FROM
	inv_candidates
ORDER BY score DESC;