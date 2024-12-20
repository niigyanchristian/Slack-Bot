import UpdateModel from "../model/update";
import { app } from "../config/config";

export const dailyReminder = async () => {
    try {
        const result = await app.client.users.list({});
        const users = result.members || [];

        // Filter active users (exclude bots and deleted users)
        const activeUsers = users.filter(user => user.is_bot === false && user.deleted === false);

        for (const user of activeUsers) {
            if (user.id) {
                await app.client.chat.postMessage({
                    channel: user.id,
                    text: `🚀 Good morning ${user.name}! This is your daily standup reminder. Please submit your update. 😊`,
                    blocks: [
                        {
                            type: 'section',
                            text: {
                                type: 'mrkdwn',
                                text: 'Click the button below to submit your daily update.',
                            },
                            accessory: {
                                type: 'button',
                                text: {
                                    type: 'plain_text',
                                    text: 'Submit Update',
                                },
                                action_id: 'update_button',
                            },
                        },
                    ],
                });


                console.log(`Reminder sent to ${user.name}`);
            }
        }
    } catch (error) {
        console.error('Error sending reminders:', error);
    }
}