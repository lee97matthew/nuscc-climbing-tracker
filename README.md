# NUS Climbing Club Attendance Tracker

Interaction only via [Telegram Bot](https://t.me/NUSCCAttendanceBot)

## Description 

This application was created to help the club semi-automate tracking of member's attendances.

Members are required to scan the QR codes at USC / UTown and key in their NUSNET ID minimally (as that is the key value we are using to update their attendance).

## Example
There are 2 functions on the Telegram Bot, Generating weekly attendance sheets and Updating of attendances.

### Creating a new week's attendance sheet
User will run the generate command as instructed by the bot, and the application will duplicate the template sheet and populate the weekly information respectively.

Command : <br />
![image](https://user-images.githubusercontent.com/79011015/195668688-152376fb-f94d-4127-a529-609bc980d1bd.png)

Template : 
![image](https://user-images.githubusercontent.com/79011015/195667182-eb99fe35-6aa9-42c7-857f-a82c358841b7.png)

Generated Sheet :
![image](https://user-images.githubusercontent.com/79011015/195668189-7ed68eb7-68fa-4df1-8aae-4ee7042591d0.png)

### Updating week's attendance [Incomplete]
The weekly attendance sheet is supposed to be updated to the master attendance sheet on a weekly basis. However due to time constraints, the functionality has not been completed yet.

Command :  <br />
![image](https://user-images.githubusercontent.com/79011015/195666964-2e68db99-6f1d-4453-849f-b7885b13ae62.png)

Master Attendance Sheet :
![image](https://user-images.githubusercontent.com/79011015/195669029-bc8a1e1e-a801-466c-934d-0c84821f1c2c.png)

## Support
Please contact [Matthew](https://t.me/Revengenc3x) if you face any issues.

### API
This project was created with NodeJs, ExpressJs, Heroku and the Google Sheets API  <br />
Google Sheets API Wrapper : [node google-spreadsheet](https://theoephraim.github.io/node-google-spreadsheet/#/)

## Making Changes
git add . <br />
git commit -m "message" <br />
git push heroku main <br />
git push

