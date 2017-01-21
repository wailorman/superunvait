SELECT
	*,
	IBB_SCORE(
	    inv_candidates.friends,
        inv_candidates.photos,
        inv_candidates.groups,
        inv_candidates.notes,
        inv_candidates.games
	) AS score
FROM
	inv_candidates
ORDER BY score DESC;