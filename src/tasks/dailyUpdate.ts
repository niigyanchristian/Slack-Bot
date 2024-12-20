import UpdateModel from "../model/update";
import { app } from "../config/config";


export const dailyUpdate = async () => {

    try {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const updates = await UpdateModel.find({
            timestamp: { $gte: today },
        });

        if (updates.length === 0) {
            await app.client.chat.postMessage({
                channel: process.env.SLACK_CHANNEL_NAME as string,
                text: "✅ No updates have been reported today!"
            });
            return;
        }

        // Group updates by type and user
        const aggregatedUpdates = updates.reduce((acc, update) => {
            const user = update.userId;
            const type = update.type;

            if (!acc[user]) acc[user] = { yesterday: [], today: [], blockers: [] };
            acc[user][type].push(update.content);
            return acc;
        }, {} as Record<string, { yesterday: string[]; today: string[]; blockers: string[] }>);

        let summary = "*📋 Daily Standup Summary:*\n";
        summary += "\n> *Blockers*:\n";

        let hasBlockers = false;

        for (const [user, userUpdates] of Object.entries(aggregatedUpdates)) {

            const nonEmptyBlockers = userUpdates.blockers.filter(blocker => blocker.trim() !== '');

            if (nonEmptyBlockers.length === 0) continue;

            hasBlockers = true;
            summary += `\n*<@${user}>*\n`;
            summary += `${nonEmptyBlockers.map(blocker => `- ${blocker}`).join('\n')}`;
            summary += `\n`;
        }

        if (!hasBlockers) {
            summary += "\n_No blockers reported_\n";
        }


        await app.client.chat.postMessage({
            channel: process.env.SLACK_CHANNEL_NAME as string,
            text: summary
        });
    } catch (error) {
        console.error('Error fetching blockers:', error);
        await app.client.chat.postMessage({
            channel: process.env.SLACK_CHANNEL_NAME as string,
            text: '❌ Failed to fetch blockers. Please try again later.'
        });
    }
}
