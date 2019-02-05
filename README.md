Bot
=================

Telegram bot that stores URLs, photos, and avatars from a chat in to an Airtable base. 

### How to install it

The installation process requires you to: 

1. Create a glitch project.
2. Create a base in Airtable and copy the tokens/credentials.
3. Create the Telegram bot
4. Invite your bot to a Telegram chat

### Creating a Glitch project

*In this step you'll create a Glitch project that will host a server to handle the communications between your Telegram bot and your Airtable base.*

1. Fork this repo.
2. Go to your [glitch.com](https://glitch.com) dashboard.
3. Create a new "hello-express" project.
4. Open the project options and click on "Advanced options".
5. Grant access to your GitHub account.
6. Click on "Import from GitHub".
7. In the prompt window write the path to the repo in github: `username/bot`.
8. Using the glitch browser to copy the contents of the `env.sample` file and use it to replace the contents of the secret `.env` file.

#### Creating a base in Airtable

*In this step you'll create and setup an Airtable base to collect URLs, photos, and avatars from a chat*

1. Go to [Airtable](https://airtable.com) and create a new base using `Import a spreadsheet`
2. Pick the option to create the table using a CSV file and use the CSV files in the `templates` folder.
3. Rename the base and copy the **name** → `AIRTABLE_BASE_NAME`
4. Go to [your account](https://airtable.com/account) and copy the **API key** → `AIRTABLE_API_KEY`

#### Create the Telegram bot

TBD

### Invite your bot to a Telegram chat

TBD
