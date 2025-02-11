import { App, StringIndexed } from '@slack/bolt';

export const app: App<StringIndexed> = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET!,
    token: process.env.SLACK_BOT_TOKEN!,
    appToken: process.env.SLACK_APP_TOKEN!,
    socketMode: true
});