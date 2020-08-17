# Curse App API
##### https://warm-garden-23848.herokuapp.com/


<!-- The Curse App API uses 4 tables:
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

The Users table has 8 attributes:
- **user_id**: Assigns an identifier integer to a user.
- **name**: An easily changable alias that does not affect login credentials.
- **username**: The first half of login credentials.
- **password**: The second half of login credentials.
- **totalblessings**: The number of times they have successfully Blessed a Curse.
- **lastblessing**: The timestamp of the last time they pulled a Curse.  This is used to time out inactive users.
- **limiter** : This is an integer that starts at and caps at 3.  Each Bless done reduces this by 1 and the user is barred from Blessing if the limiter is 0.  The limiter resets to 3 each day.
- **blocklist**: An array of the user_id's of any user the current user does not with see any curses from -->


## BlessCurse has 5 API endpoints:
- /api/auth/token
- /api/user
- /api/blessings
- /api/curses
- /api/quotes

### Authorization - '/api/auth/token'
---
#### POST
  - Parameters
    - username
    - password
  - Returns
    - If the username and password both match an existing user, an auth token is provided
---
---
### User - '/api/user'
---
#### POST
  - Parameters
    - name
    - username 
      - Must be unique
    - password
      - Must be more than 7 characters
      - Must be less than 72 characters
      - Must not start or end with a space
      - Must have an upper case letter
      - Must have a lower case letter
      - Must have a number
      - Must have a special character
  - Returns
    - Creates a new account on the database and returns the created user

#### GET - Authorization required
  - Parameters
    - none
  - Returns
    - The current user's data
    - All blessed curses that belong to that user

#### PATCH - Authorization required
  - Parameters
    - curse_id - the curse_id belonging to the user you wish to block
  - Returns
    - Adds the owner of the curse to be added to the current user's blocklist. No curses from that user will be displayed to the current user thereafter
---
---
### Blessings - '/api/blessings' 
---
#### GET
  - Parameters
    - None
  - Returns
    - All blessings and blessing_ids in an array
---
---
### Curses - '/api/curses'
---
#### GET - Requires authorization
  - Parameters
    - None
  - Returns
    - If available curses exist for the user
      - A random curse from the pool of available curses is provided to the user
      - Available curses are curses that
        - Do not belong to the current user
        - Do not belong to any of the users on the current user's blocklist
        - Have not being previously pulled or blessed by any user
    - If no curses exist for the user
      - 'No available curses'
#### POST
  - Parameters
    - curse
      - A curse message cannot
        - Be empty
        - Be less than 10 characters
        - Be less than 4 words
        - Be more than 400 characters
  - Returns
    - Adds the curse to the database
    - Send a message and submitted information to the user as an object
      - If logged in
        - user: username
        - curse: curse sent to the database
        - message: 'Curse sent as (username)'
      - If not logged in
        - user: null
        - curse: curse sent to the database
        - message: 'Curse sent anonymously'
#### PATCH - Requires authorization
  - Parameters
    - blessing_id - the blessing to apply to the curse
    - curse_id - the curse to be blessed
  - Returns
    - Blesses the curse within the database and assigns the desired blessing to it
    - Message: 'Curse blessed with blessing (blessing_id)'
#### DELETE - Requires authorization
  - Parameters
    - curse_id - the curse_id of the curse to be blessed
  - Returns
    - The authorized user must be the owner of the curse being deleted
    - If owner, returns an object
      - {deletedCurse: (all curse data)}
    - If not owner
      - 'User is not the owner of the provided curse'
---
---
### Quotes - '/api/quotes'
---
#### GET - Requires authorization
  - Parameters
    - None
  - Returns
    - A random quote from the database table
    - The quote will include the quote and the source as an object: {quote, source}
