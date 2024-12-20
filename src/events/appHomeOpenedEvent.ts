export const openHomePageEvent = async ({ event, client }: { event: any; client: any }) => {
    try {

        await client.views.publish({
            user_id: event.user,
            view: {
                type: 'home',
                callback_id: 'home_view',
                blocks: [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "*Welcome to the Daily Standup App* :wave:\nThis app helps you to easily track your daily updates, progress, and blockers. You can submit updates, view summaries, and change your previous updates."
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Choose an action to get started!"
                        }
                    },
                    {
                        "type": "actions",
                        "elements": [
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Update"
                                },
                                "action_id": "update_button"
                            },
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "View Summary"
                                },
                                "action_id": "view_summary_button"
                            },
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": "Change Today's Update"
                                },
                                "action_id": "view_update_post"
                            }
                        ]
                    }
                ]
            }
        });
    } catch (error) {
        console.error(error);
    }
}