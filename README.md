# ReNow

ReNow is a public marketplace for home services. The range of home services that the marketplace covers includes but is not limited to:

- Repairs  
- Renovation  
- Installation  
- Cleaning  

ReNow is primarily built on the following tech stack:

- **React Native (JavaScript)** for designing the application  
- **Expo** for deployment  
- **Supabase** for backend and database management  

---

# Accessing the App

---

# Signing Up

To sign up into ReNow, users can click on the highlighted **Don't have an Account? Sign Up** text which will bring the user to a **Sign Up** Screen.

The **Sign Up** screen will require 3 text inputs: Username, Password, and Confirm Password. Users should fill in all text inputs.

- Username should be at least 4 letters long  
- Password should be at least 8 letters long  
- Confirm Password must match Password exactly  

The failure to meet any of the 3 requirements will result in a corresponding error message

Upon filling the text inputs, users should click on the **Sign Up** button.  
(Note that failure to fill in the 3 aforementioned text inputs will result in an error message asking users to fill in all the required fields.)

After successfully filling in all 3 text fields users will be redirected to a **Log in** screen

## Developers' note

Currently, the username and password will be passed into 'Users' table in Supabase, for this project, we are not using Supabase's authentication system.  

This decision is made in part that that Supabase 's authentication system requires a valid email address and we are aware that some testers might not feel safe with using their own email address for this project.

However, for developers who wishes to use Supabase authentication, we have commented out a section of a code that uses Supabase authentication, please replace the code with the commented code.

---

# Logging in

On the **Log in** screen, users will see 2 text input boxes, 

- Username
- Password

Users should fill in both text inputs with the corresponding username and password that they signed up with
(Note that failure to do so will prompt an error message to states that username and password do not match)

After successfully filling in the text inputs, users should click on the **Log in** button which will direct users to the **Home** tab

---
# Main tabs of Renow

There is a total of 4 main tabs in Renow
- Home
- Listing
- Create Listing
- Profile

---

# Home

The **Home** Screen is the first screen the user sees upon logging in. It is mainly used for viewing Listings made by other users(as well as the user) and also to accept any requests or services.
In the **Home** Screen, there are 2 other tabs separated by a top tab, HomeRequest and HomeService, for Requests and Services respectively. Furthermore, any Listing can be expanded upon to be viewed in
greater detail in another screen called ItemDetails.

This section walks through:

- Purpose and key features  
- User flow  
- User input and validations
- Error handling
- Backend data handling with Supabase

Developers' note: **Home** 's file is located in HomeScreen.js. The two tabs are HomeRequest.js and HomeService.js respectively. The detailed item screen is ItemDetail.js

## Purpose and key features

As mentioned previously, the **Home** screen is mainly used for user to view Listings. It supports the following operations
- Viewing of Listings in its condensed form
- Viewing of Listings in detailed form
- Seperation of Requests and Services
- A search bar to find Listings based on name (to be implemented)
- A filter button/function to filter Listings based on specific requires (to be implemented)
- A calender in the detailed view to facilitate scheduling (to be implemented)
- Storing and updating Listings using supabase

(Refreshing can be done manually or upon entering the page each time)

## User flow

The user will navigate to the **Home** screen by default after logging in, otherwise they can simply tap on the Home tab on the bottom tabs to navigate to **Home**.

Upon entering the **Home** page the user will see 2 different tabs on top, Request and Service, as well as a bunch of Listings represented as an Item Card.
An Item Card con tainsthe following:
- Listing image
- Title
- Type (Cleaning, Repair, etc...)
- Price
- Brief description
- A view button

If the user wishes to view the Listing, they may click on the **View** button to bring them to the detailed view, which is a page on top of the **Home** screen
In the detailed view, the user may see the previously mentioned information with an addition of:
- All images uploaded by the poster
- Detailed Description
- A calendar for the user to choose a date (to be implemented)
- An accept button

Any user can click on the accept button to accepted any Listing(except their own), after which they will be prompted to confirm their decision through a modal.
Upon confirmation of acceptance, to user will be brought to their **Accepted Listing** Screen.

If the user views their own Listing in detail, the accept button is greyed out an clicking it will do nothing.


##
##
##

# Listing

---

# Create Listing

The **Create Listing** feature in ReNow allows users to create and post new home service listings, which may include repairs, renovations, installations, and cleaning services. This section walks through:

- Purpose and key features  
- User flow  
- User input fields and validations
- Error handling
- Backend data handling with Supabase  


Developers' note: **Create Listing** 's file is located in PostingScreen.js

## Purpose and Key Features

The **Create Listing** screen enables users to share their home service requests or offer services to the marketplace. It supports:

- Creating new listings  
- Specifying the service type  
- Setting a price  
- Choosing the post type (Request or Service)
- Image Uploads (to be implemented)
- Selection of available dates (to be implemented, cannot be seen currently)
- Storing and updating listings in the Supabase backend

## User flow

The user navigates to the **Create Listing** screen from the app’s main tabs. Users should see a total of 7 components. The **Create Listing** page employs a ScrollView.

**Components:**  
1. Upload images  (Currently serves no purpose, to be implemented)
2. Enter a title  
3. Write a description  
4. Select a service type  
5. Enter a price  
6. Choose to post as a “Request” or “Service”  
7. Submit the listing  

The user should fill in all the text fields (refer to the next section for which inputs are needed to be filled)

After successfully filling in the required inputs, please click on the **Post** button to post the listing. Upon successful posting, the user will be redirected to the **Listing** tab.

On submission, the app validates the inputs, shows errors if needed, and saves the data to Supabase.

## User Input Fields and Validations

The listing creation form uses several custom and third-party components for a better UX.

### Title
- **Placeholder:** “Enter Title”  
- **Validation:** Cannot be empty  
- **Initial Value:** empty
  
The title input allow users to write down the title of their request/service. The title should not be left empty. The title should be brief and should be under 50 characters.

### Description
- **Placeholder:** “Enter description”  
- **Validation:** Cannot be empty  
- **Initial Value:**  empty

The description input allow users to share more details about their request/service. The description should not be left empty. The description input allows up to a maximum of 500 characters.

### Service Type
- **Default Value:** “Cleaning”  
- **Available Options:**  
  - Cleaning  
  - Installation  
  - Renovation  
  - Repairs  
  - Others  
- **Validation:** Must select one  

The service type allows user to select the type of service they require/offer.

### Price
- **Placeholder:** “Enter price”  
- **Validation:** Cannot be empty  

The price input allows users to share the budget/price of their request/service. The price input is associated with a dollar sign icon. (Note that for Renow, the dollar sign represents the Singaporean currency) The price should not be left empty. The price input allows up to a maximum of 10 characters. (We do not expect a home service/request that costs over a billion Singaporean dollars.)

### Post Type
- **Options:**  
  - Request  
  - Service  
- **Default:** Request  

The post type allows users to choose whether to upload their post as a request or service. Note that the posting will be uploaded on their respective marketplace tabs (Requests/Services) based on the post type that users selected.

### Error Handling
If the user tries to submit without filling in all fields (title, description, price), an error message is displayed in red.

## Backend handling with Supabase

When the user presses the **Post** button:

- **Step 1:** The app verifies that all required fields are filled in.  
- **Step 2:** It requests for the username from the global user context. 
- **Step 3:** Constructs a listing object (`info`) with all required fields:  
  - `user_id`  (taken from 'Users' table)
  - `title`  (text)
  - `description`  (text)
  - `price`  (text)
  - `type` (text)  
  - `request` (true/false based on Post Type)  
  - `created_at` (timestamp)  

- **Step 4:**    
  - It inserts a new record into the “Listings” table.  

- **Step 5:**  
  - If successful, clears the form and navigates the user back to the **Listing** tab.  
  - If there’s an error, displays an appropriate error message.
    
---

# Profile
