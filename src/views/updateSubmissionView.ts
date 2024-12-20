import { checkExistingUpdate, updateData } from "../services/update";


export const updateSubmissionView = async ({ ack, body, view, client, logger }: any) => {
    // Acknowledge the submission
    await ack();

    // Extract the input data
    const userId = body.user.id; // User who submitted the modal
    const yesterdayUpdate = view.state.values['yesterday_update']['yesterday_input'].value; // Yesterday's update
    const todayPlan = view.state.values['today_update']['today_input'].value; // Today's plan
    const blockers = view.state.values['blockers_update']['blockers_input'].value || ' ';

    try {
        // Check if the user has already submitted an update for each type
        const existingYesterdayUpdate = await checkExistingUpdate(userId, 'yesterday', logger);
        const existingTodayUpdate = await checkExistingUpdate(userId, 'today', logger);
        const existingBlockers = await checkExistingUpdate(userId, 'blockers', logger);

        // Handle already submitted updates for each type
        if (!existingYesterdayUpdate || !existingTodayUpdate || !existingBlockers) {
            await client.chat.postMessage({
                channel: userId,
                text: " ",
                blocks: [
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `⚠️ You haven't submitted your update for today yet. Please submit your update first.`
                        },
                        accessory: {
                            type: 'button',
                            text: {
                                type: 'plain_text',
                                text: 'Update',
                            },
                            action_id: 'update_button',
                        },
                    },
                ],
            });
            return;
        }


        // Save the updates using the helper function
        if (yesterdayUpdate) {
            await updateData(userId, 'yesterday', yesterdayUpdate, logger);
        }

        if (todayPlan) {
            await updateData(userId, 'today', todayPlan, logger);
        }

        if (blockers) {
            await updateData(userId, 'blockers', blockers, logger);
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