# Handling GitHub rate limit for Rest API's

## Context
Git hub enforces rate limit to ensure that the API is fast and available for everyone. This is also to avoid any type of DDOS attacks or malicious
scanning of user data.  
Read more about it in detail [here](https://docs.github.com/en/developers/apps/building-github-apps/rate-limits-for-github-apps).

## Maximizing the rate limits

GitHub allows a higher rate limit for the API's if the request is authenticated.  
The user of this app can increase the rate limit by providing an access-token.  
Steps are mentioned [here](/README.md#optional-step).  

This increases the general API limit from 60 to 5000 and search API limit from 10 to 30.

## Optimizing search api requests

Search API requests have limitations which the app tries to address
- **Rate limit is small**  
but they also have smaller window (of one minute) before they reset.  
The app will wait till the limit resets if it is set to reset within next 10 seconds, otherwise aborts any further search requests

- **GitHub does not internally cache the repeated requests**
This is probably because the search results depend on the query string passed to it.
The app has its own internal cache for search apis based on the query string.

Reference: [GitHub doc](https://docs.github.com/en/rest/search#rate-limit)

## Other API requests

Once the app gets user details using the search API it also makes further requests to get
- Personal Details
- Repository list
- Number of commits for each repository

Although the app recommends [making conditional requests](https://docs.github.com/en/rest/guides/getting-started-with-the-rest-api#conditional-requests), 
the app does not make any additional effort to optimize the requests.  
These requests if made repeatedly will return cached response from the server automatically and do not count against the rate limit.  

