// test- ignore me
import { App, LogLevel } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import * as dotenv from 'dotenv';

dotenv.config();

let main_channel = "C08N0R86DMJ";
let bulletin_channel = "C08KH979K9U";
let help_channel = "C08KS9QGYRY";

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
    logLevel: LogLevel.WARN,
});

const adminClient = new WebClient(process.env.SLACK_ADMIN_TOKEN);

app.event('member_joined_channel', async ({ event, client, logger }) => {

    console.log("Event: ", event);

    if (event.channel !== main_channel && event.channel !== bulletin_channel && event.channel !== help_channel) return;

    for (const channel of [main_channel, bulletin_channel, help_channel]) {
        if (event.channel !== channel) {
            try {
                await adminClient.conversations.invite({
                    channel: channel,
                    users: event.user
                });
                
                logger.info(`User ${event.user} was invited to channel ${channel}`);
            } catch (error) {
                logger.error(`Error inviting user to channel ${channel}: ${error}`);
            }
        }
    }
});


(async () => {
    await app.start();
    console.log(`⚡️ Slack Bolt app is running!`);
})();