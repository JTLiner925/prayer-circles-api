# Prayer Circles

## https://prayer-circles.vercel.app/

![](/dashboard.png)
screenshot of the homepage in desktop and mobile version

### Prayer Circles Client Repo: https://github.com/JTLiner925/prayer-circles

NodeJS/Express/PostgreSQL/AWS

## Prayer Circles API Overview

The Prayer Circles API provides the database to store the users, groups, and events, prayers, and messages for Prayer Circles. 

### Authorization

You will not need authorization for making a POST to the users endpoint but we will use a token created when the user logs on for Authorization for creating groups or events.
Authorization with go in the headers.

Authorization: `Bearer ${window.localStorage.getItem("token")}`

### Endpoints

We provide the following API endpoints:

GET requests:
- /api/users
- /api/groups
- /api/events
- /api/needed
- /api/prayers
- /api/messages
- /api/photos

POST requests:
- /api/users/login  (user_email, user_password) *No Auth
- /api/users/register  (user_email, user_password, first_name) *No Auth
- /api/groups/joingroup  (group_name)
- /api/groups/creategroup  (leader_phone, group_location, time_date, ) *Auth Needed
- /api/events/createevent  (event_date, event_time, lesson_title, bible_passage,  question) *Auth Needed
- /api/needed *Auth Needed
- /api/needed/add-item (event_id, item_name) *Auth Needed
- /api/needed/update-item (user_id, item_name)
- /api/ *Auth Needed
- /api/prayers *Auth Needed
- /api/prayers/send-prayer (group_id, prayer_body, prayer_type) *Auth Needed
- /api/messages *Auth Needed
- /api/messages/send-messages (message_body, message_type, group_chat) *Auth Needed
- /api/getUrl (fileName, location) *Auth Needed
- /api/getUrl/get-photo-url (name, type, location) *Auth Needed
These endpoints have many optional body requests, required in parenthesis beside endpoint.