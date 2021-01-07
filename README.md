# CoFoundersTownTask

The assignment task for CoFoundersTown

## URLS

Application

1.  Home: https://cofounderstown.herokuapp.com/
2.  Login Page: https://cofounderstown.herokuapp.com/login
3.  Publish: https://cofounderstown.herokuapp.com/publish
4.  Profile: https://cofounderstown.herokuapp.com/user/yashm
5.  Tag based search: Can be done from Home

## Tech stack

This section discusses the application architecture:

### Database

Mongodb based data persistence along with schema validation and permission checks for the user.

### Frontend

The application is powered by Next.js which allows for SSR. Code is written using `typescript` and uses `chakra-ui` for the UI.

### Backend

Backend is a node.js - express - mongodb powered API. It is also written using `typescript` and uses `typegoose` for type-safe database interaction.

### Deployment

The application is combined into a single server for the sake of deployment. Same node.js based server handles the backend and the frontend application. The components are decoupled and can be deployed seperately with minimal efforts.

## Scope for improvement

1. **Auth:** It currently works by using `jwt cookies`. A more secure and robust `OAuth` or any other flow with refresh tokens can be used.
2. **Accessibility:** While chakra-ui is one of the most accessible frameworks (read more accessible than Material-UI), a few a11y tweaks remain.
3. **Optimal data fetching:** While the application is functional, data fetching can be reduced in a place or two.
4. **Better UX:** The application has a very basic UI. It can be made more seamless. Some redirections (like from publish page) are made directly by the backend and can be delegated to client side for a better experience.
5. **Better Pagination:** The application has a basic forwards pagination API based on time of creation of article. A more robust cursor along with more options can be used.
6. **Test cases:** There are no test cases. A BDD approach is resillient but time consuming.
