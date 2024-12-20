import { checkExistingUpdate, saveUpdate } from "../services/update";

export const newSubmissionView = async ({ ack, body, view, client, logger }: any) => {
    // Acknowledge the submission
    await ack();

    // Extract the input data

    const userId = body.user.id; // User who submitted the modal
    const yesterdayUpdate = view.state.values['yesterday_update']['yesterday_input'].value;
    const todayPlan = view.state.values['today_plan']['today_input'].value;
    const blockers = view.state.values['blockers']['blockers_input'].value || ' ';

    try {
        // Check if the user has already submitted an update for each type
        const existingYesterdayUpdate = await checkExistingUpdate(userId, 'yesterday', logger);
        const existingTodayUpdate = await checkExistingUpdate(userId, 'today', logger);
        const existingBlockers = await checkExistingUpdate(userId, 'blockers', logger);

        // Handle already submitted updates for each type
        if (existingTodayUpdate || existingYesterdayUpdate || existingBlockers) {
            await client.chat.postMessage({
                channel: userId,
                text: '',
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: '⚠️ You have already submitted your Today’s Plan for today. Please update your existing submission if needed',
                        },
                        accessory: {
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: 'Change Today\s Update',
                            },
                            action_id: 'view_update_post',
                        },
                    },
                ],
            });
            return;
        }



        // Save the updates using the helper function
        if (yesterdayUpdate) {
            await saveUpdate(userId, 'yesterday', yesterdayUpdate, logger);
        }

        if (todayPlan) {
            await saveUpdate(userId, 'today', todayPlan, logger);
        }

        if (blockers) {
            await saveUpdate(userId, 'blockers', blockers, logger);
        }

        // Send confirmation message
        await client.chat.postMessage({
            channel: userId,
            text: `Thank you for your updates! Here's what you submitted:\n\n*Yesterday's Update:* ${yesterdayUpdate}\n*Today's Plan:* ${todayPlan}\n*Blockers:* ${blockers}`,
        });

    } catch (error) {
        logger.error(error);
    }
}