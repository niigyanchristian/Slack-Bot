import { BlockAction } from "@slack/bolt";
import { getTodayUpdate } from "../services/update";

export const openNewForm = async (body: any, client: any): Promise<void> => {
    const triggerId = (body as BlockAction).trigger_id;
    const result = await client.views.open({
        trigger_id: triggerId,
        view: {
            type: 'modal',
            callback_id: 'view_1',
            title: {
                type: 'plain_text',
                text: 'Daily Updates'
            },
            blocks: [
                {
                    type: 'input',
                    block_id: 'yesterday_update',
                    label: {
                        type: 'plain_text',
                        text: "What did you accomplish yesterday?"
                    },
                    element: {
                        type: 'plain_text_input',
                        action_id: 'yesterday_input',
                        multiline: true
                    }
                },
                {
                    type: 'input',
                    block_id: 'today_plan',
                    label: {
                        type: 'plain_text',
                        text: "What is your plan for today?"
                    },
                    element: {
                        type: 'plain_text_input',
                        action_id: 'today_input',
                        multiline: true
                    }
                },
                {
                    type: 'input',
                    block_id: 'blockers',
                    label: {
                        type: 'plain_text',
                        text: "Do you have any blockers?"
                    },
                    element: {
                        type: 'plain_text_input',
                        action_id: 'blockers_input',
                        multiline: true,
                        initial_value: ' '
                    },
                    optional: true
                }
            ],
            submit: {
                type: 'plain_text',
                text: 'Submit'
            }
        }
    });
}


export const openUpdateForm = async (userId: string, client: any, triggerId: string) => {
    const update = await getTodayUpdate(userId);

    const todayUpdate = update?.find((item) => item.type == 'today');
    const yesterdayUpdate = update?.find((item) => item.type == 'yesterday');
    const blockersUpdate = update?.find((item) => item.type == 'blockers');


    if (!todayUpdate) {
        await client.chat.postMessage({
            channel: userId,
            text: "",

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


    const result = await client.views.open({
        trigger_id: triggerId,
        view: {
            type: 'modal',
            callback_id: 'view_2',
            title: {
                type: 'plain_text',
                text: 'Update Today\'s Progress',
            },
            blocks: [
                {
                    type: 'input',
                    block_id: 'yesterday_update',
                    label: {
                        type: 'plain_text',
                        text: "What did you accomplish yesterday?",
                    },
                    element: {
                        type: 'plain_text_input',
                        action_id: 'yesterday_input',
                        multiline: true,
                        initial_value: yesterdayUpdate?.content || '',
                    },
                },
                {
                    type: 'input',
                    block_id: 'today_update',
                    label: {
                        type: 'plain_text',
                        text: "What did you accomplish today?",
                    },
                    element: {
                        type: 'plain_text_input',
                        action_id: 'today_input',
                        multiline: true,
                        initial_value: todayUpdate?.content || '',
                    },
                },
                {
                    type: 'input',
                    block_id: 'blockers_update',
                    label: {
                        type: 'plain_text',
                        text: "Do you have any blockers?",
                    },
                    element: {
                        type: 'plain_text_input',
                        action_id: 'blockers_input',
                        multiline: true,
                        initial_value: blockersUpdate?.content || '',
                    },
                    optional: true
                },
            ],
            submit: {
                type: 'plain_text',
                text: 'Submit',
            },
        },
    });

    if (!result.ok) {
        console.error('Error opening the modal:', result.error);
    }
};