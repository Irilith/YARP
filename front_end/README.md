# YARP - Front End

## Setup Instructions

Detailed setup information can be found in the main `README.md` file. Please refer to it for comprehensive guidance.

## Configuration

To properly configure the front-end application, you need to update the backend IP address in the following files:

1. `app/components/Sections/Account.tsx`
   - Update line 58
   - Update line 163

2. `app/routes/login.tsx`
   - Update the backend IP address

3. `app/routes/signup.tsx`
   - Update the backend IP address

Ensure that you use the correct IP address for your backend server in all these locations to establish proper communication between the front-end and back-end components of YARP.
