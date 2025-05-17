# API LIST

-POST /Signup
-POST /Login
-POST /Logout

-GET /profile/view
-PATCH /profile/edit
-PATCH /profile/password

connectionRequestRouter
-POST /request/send/interested/:userId
-POST /request/send/ignored/:userId
-POST /request/review/accepted/:requestId
-POST /request/review/rejected/:requestId

userRouter

-GET /user/connections
-GET /user/requests
-GET /user/feed - Gets profile of other user on the platform

Status : accepted, rejected , ignored, interested