import UpdateModel from "../model/update";
import type { WebClient } from '@slack/web-api';

export async function generateDailySummary(client: WebClient, userId: string) {
    // Get the current date and set the time to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch updates from the database for today
    const updates = await UpdateModel.find({
        timestamp: { $gte: today },
    });

    if (updates.length === 0) {
        await client.chat.postMessage({
            channel: userId,
            text: "✅ No updates have been reported today!",
        });
        return;
    }

    // Group updates by user and type
    const aggregatedUpdates = updates.reduce((acc, update) => {
        const user = update.userId;
        const type = update.type;
        if (!acc[user]) acc[user] = { yesterday: [], today: [], blockers: [] };
        acc[user][type].push(update.content);
        return acc;
    }, {} as Record<string, { yesterday: string[]; today: string[]; blockers: string[] }>);

    // Build the summary message
    let summary = "*📋 Daily Standup Summary:*\n";
    for (const [user, userUpdates] of Object.entries(aggregatedUpdates)) {
        const yesterdayUpdates = userUpdates.yesterday.length > 0
            ? userUpdates.yesterday.map(update => ` ${update}`).join('\n')
            : '_No updates_';

        const todayUpdates = userUpdates.today.length > 0
            ? userUpdates.today.map(update => ` ${update}`).join('\n')
            : '_No updates_';

        const blockers = userUpdates.blockers.length > 0
            ? userUpdates.blockers.map(blocker => ` ${blocker != ' ' ? blocker : '_No blocker_'}`).join('\n')
            : '_No blockers_';

        summary += `
            *\n<@${user}>*
            \n> *Yesterday*:${yesterdayUpdates}
            \n> *Today*:${todayUpdates}
            \n> *Blockers*:${blockers}
            `;
    }


    // Send the summary to the user
    await client.chat.postMessage({
        channel: userId,
        text: summary,
    });
}