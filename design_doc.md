# SenseAble
Senseable is an AI application that helps people with certain accessbility needs to help rephrase text content similiar to quillbot but with added features to help with accessibility. The user will paste text contents (short or long) into this tool and the tool will rephrase it and highlight certain sections for possible rephrasing. The user can add tags on phrases such as "not familiar", "somewhat familiar", etc. 
The frontend can be a simple react app in typescript and the backend can use python, fastapi, mysql. 
The backend will make api calls to openapi endpoints (or claude) to rephrase the contents. The tags can be stored in a graph db (later enhancement) to remember the preferences for the user. 
It has two pages. 
	- user account : takes up user information and preferences
	- landing page: copy content, rephrase, highlight, tag, and show multiple versions of the rephrase on the right.
		- it also has a section in the side with two subsection. 
			- 1. shows tags and the suggested versions for the selected phase.
			- 2. shows about-you based on data captured in user account. It can be modified. 

- build the frontend by checking the png screenshots in /screens (numbered 01 .. 05)
- build a backend for this in python fastapi and clear endpoints for the features.
- start with a design plan, any docs go to docs/
- then proceed to implementation of frontend first
- then build the backend

It will have a user account page where it will ask basic details about the user and the persons accessibility needs. This will be stored in the database to generate the content (rephrase content) according to specific needs. 
	eg: - colorblind will have tag colors as specific color pallete

## Screens
- 01-user_account.png
- 02-rephrase-text.png
- 03-rephrase-text-tag.png
- 04-rephrase-text-add-new-tags.png
- 05-rephrase-text-rephrase-again.png