#1.8.1
* fix(inviter): Overlay friend offer

#1.8.0
* fix(members observer): Works on ../group/53396058603765/members too
* fix(post hunter): Errors on promo posts
* fix(inviter): Control panel mounting after /online button click

* feat(api/invites & inviter): senderId field
* feat(inviter): 5px gray border before send invitation
* feat(inviter): Change some button texts

#1.7.0
* API: limit & offset

#1.6.8
* Docker: API now running on 80 port 

#1.6.7
* Move to MySQL hosting. MySQL container won't start any more
* MySQL connect credentials in one 

#1.6.5
* fix(post hunter): post-hunter.html doesn't exist
* fix(post hunter): Too low scores

#1.6.4
* Fix Post hunter post score where likes amount > 1000

#1.6.3
* Improved logging
* Builded js files in repository version. npm run build needless
* Fix Auction clicker script mounting: unmount when /auctions leave

#1.6.0
* Page script loader: all page scripts loaded by one file -- `public/src/page-script.js` using `public/lib/page-script-loader` lib
* Page script loader interface for Inviter
* Inviter doesn't invite already invited persons