UPDATE users
  SET score = IBB_SCORE(
    friends,
    photos,
    groups,
    notes,
    games
  )