require('dotenv').config();
const { google } = require('googleapis');

async function fetchEmails() {
    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GMAIL_CLIENT_ID,
            process.env.GMAIL_CLIENT_SECRET
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.GMAIL_REFRESH_TOKEN
        });

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        // Fetch unread emails
        const res = await gmail.users.messages.list({
            userId: 'me',
            q: 'from:nptel@xyz.com is:unread' // Change 'nptel@xyz.com' to the correct sender email
        });

        if (!res.data.messages) {
            console.log('No new emails found.');
            return;
        }

        // Process Emails
        for (let msg of res.data.messages) {
            let email = await gmail.users.messages.get({
                userId: 'me',
                id: msg.id
            });

            console.log('Email:', email.data.snippet);
        }
    } catch (error) {
        console.error('Error fetching emails:', error.message);
    }
}

fetchEmails();
