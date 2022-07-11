# Getting Started with Git Users Project

## Optional step

The app makes request to github which has [rate-limit](https://docs.github.com/en/rest/rate-limit) on api requests.  
To maximize the rate limit of the app provide `access-token` in **gitconfig.json**  
An access token can be created by visiting [token page](https://github.com/settings/tokens) if one has a github account.

## Running the app

In the project directory, you can run:
> npm start

Runs the app in the development mode.\
Open [http://localhost:3002](http://localhost:3002) to view it in the browser.

The app needs the user to input a csv file in order to provide input to begin the search.  
Once file is selected the app automatically starts showing the output on the page.  
`sample-input.txt` provided in the repo can be used to test run the app.

The user details are visible one by one as and when all the details are fetched for the user.  
**Which also means the order of output is not guaranteed to be same as the input list.**  

![image](https://user-images.githubusercontent.com/6827941/178158810-baca6b4d-d035-449a-a042-799ab0c679dc.png)
