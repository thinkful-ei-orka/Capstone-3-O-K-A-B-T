Curse App API
===

`${Live Link}`
---

The Curse App API uses 4 tables:
Blessings, Curses, Quotes, and Users

The Blessings Table has 2 attributes:
- **blessing_id**: This is an identifier used to match blessings to users and curses.
- **blessing**: This is the emoji that responds to a curse.

The Curses Table has 7 attributes:

- **curse_id**: This is an identifier used to match curses to users and blessings
- **curse**: This is the text string that the user writes and submits.
- **user_id**: This is an identifier to match a curse to the user who made it.
- **blessed**: This is a boolean that flags a curse for having been blessed.
- **blessing**: This is the response from the blesser.
- **pulled_by**: This matches a Blesser to the curse they blessed.
- **pulled_time**: This is the timestamp for when the curse was viewed by the blesser.

The Quotes table has 3 attributes:
- **quote_id**: Assigns an identifier integer to a quote
- **quote_text**: The actual quote.
- **quote_source**: The source of the quote.

The Users table has 7 attributes:
- **user_id**: Assigns an identifier integer to a user.
- **name**: An easily changable alias that does not affect login credentials.
- **username**: The first half of login credentials.
- **password**: The second half of login credentials.
- **totalBlessings**: The number of times they have successfully Blessed a Curse.
- **lastBlessing**: The timestamp of the last time they pulled a Curse.  This is used to time out inactive users.
- **limiter** : This is an integer that starts at and caps at 3.  Each Bless done reduces this by 1 and the user is barred from Blessing if the limiter is 0.  The limiter resets to 3 each day.


Curse App has 5 API endpoints:
- /api/auth/token
- /api/user
- /api/blessings
- /api/curses
- /api/quotes


A GET request to the Bless Router takes no parameters 
and returns all blessings and blessing_ids

Request to the User Router and Auth Router are extremely standard 
for login/registration functionality, but for those 
not familiar:

A POST reqest to the User Router requires 
Username, Password, and Name.
It is used to make an account.
It validates the password in various ways, demanding it is more than 7 characters, less than 72 characters, 
does not start or end with a space, and has at least one upper case, lower case, numeric, and special character.
It then returns the id, name, and username.

A GET request to the User Router requires you to have authorization by 
being logged in.  This uses user_id, name, username, totalblessings, lastblessing, and limiter, all 
of which are part of the req.user.  
It matches the user to the curse they are blessing.
It assigns a default emoji blessing to the curse if they did not make a decision before timing out.
It then returns the blessing and deletes the curse from the blesser.

A POST request to the Auth Router require username and password.  If these corespond to an existing 
account, an Auth Token is sent.

A GET request to the Curses Router requires user_id and returns a random curse that 
is not coresponding to the current user's user_id.

A POST request to the Curses Router handles both anonymous and logged in curses.
It only requires Curse, but can also accept user_id for logged in users.
It adds the curse to the Curse table and returns the curse and will also return the 
username if it recieved a user_id.

A PATCH request to the Curses Router flags a curse as Blessed, lowers the user's limiter attribute by 1, and resets a user's limiter back to 3 after 24 hours (subject to change...).
It requires user_id and blessing_id.

A GET request to the Quote Router returns a random quote and coresponding source.

