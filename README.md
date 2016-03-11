## Front End Info
* Required Info
  * Project Description; String
  * Title; String
  * Start Date(Quarter/year); Date
  * Language/Engine/Framework(s); String(Enumeration maybe?)
  * Images/Videos
  * Category; String(Enumeration maybe)
  * Project Members
    * Member
      * Name
      * Major
      * Biggest challenge of the project
      * thoughts on the project

## Front End Pages
* Index page
    * lists all of the projects
    * (optional) lists them by category
* Create New Project Form page
  * Includes forms for the `Front End Info` listed above
  * (optional) use a WYSIWYG(What you see is what you get) editor
* Edit Project Form page
  * Includes forms for the `Front End Info` listed above
  * Additionally, includes a delete button.
* Individual Project
  * Includes the `Front End Info` listed above.
  * Uses the existing work already done for individual pages.

## User Stories  

### User story 1
  1. User Logins via OAuth + Github(no username/password necessary)
  2. User clicks on new project button
  3. User fills in forms for project information(create)
  4. User submits information
  5. Information is validated and saved to database
  6. User is redirected to their project page(view)
