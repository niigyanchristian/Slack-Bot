// import { AckFn, RespondArguments, SayFn, SlashCommand } from "@slack/bolt";
// import UpdateModel from "../model/update";
// import { convertToArray } from "../utils";


// export const summaryControllers = async ({ command, ack, say }: { command: SlashCommand; ack: AckFn<string | RespondArguments>; say: SayFn }) => {
//     await ack();

//     try {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         const updates = await UpdateModel.find({
//             timestamp: { $gte: today },
//         });

//         if (updates.length === 0) {
//             await say("✅ No updates have been reported today!");
//             return;
//         }

//         // Group updates by type and user
//         const aggregatedUpdates = updates.reduce((acc, update) => {
//             const user = update.userId;
//             const type = update.type;

//             if (!acc[user]) acc[user] = { yesterday: [], today: [], blockers: [] };
//             acc[user][type].push(...update.content);
//             return acc;
//         }, {} as Record<string, { yesterday: string[]; today: string[]; blockers: string[] }>);


//         let summary = "*📋 Daily Standup Summary:*\n";
//         for (const [user, userUpdates] of Object.entries(aggregatedUpdates)) {
//             summary += `\n*<@${user}>*\n`;
//             summary += `> *Yesterday*:\n${userUpdates.yesterday.length > 0 ? userUpdates.yesterday.map(update => `- ${update}`).join('\n') : '_No updates_'}`;
//             summary += `\n> *Today*:\n${userUpdates.today.length > 0 ? userUpdates.today.map(update => `- ${update}`).join('\n') : '_No updates_'}`;
//             summary += `\n> *Blockers*:\n${userUpdates.blockers.length > 0 ? userUpdates.blockers.map(blocker => `- ${blocker}`).join('\n') : '_No blockers_'}`;
//             summary += `\n`;
//         }

//         await say(summary);
//     } catch (error) {
//         console.error('Error fetching updates:', error);
//         await say('❌ Failed to fetch updates. Please try again later.');
//     }

// }



// const handleSubmission = async ({
//     command,
//     ack,
//     say,
//     type,
//     formatError,
//     alreadySubmittedMessage,
//     successMessage,
// }: {
//     command: SlashCommand;
//     ack: AckFn<string | RespondArguments>;
//     say: SayFn;
//     type: 'yesterday' | 'today' | 'blockers';
//     formatError: string;
//     alreadySubmittedMessage: string;
//     successMessage: string;
// }) => {
//     await ack();

//     const input = convertToArray(command.text.trim());
//     if (input) {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         const existingUpdate = await UpdateModel.findOne({
//             userId: command.user_id,
//             type,
//             timestamp: { $gte: today },
//         });

//         if (existingUpdate) {
//             await say(alreadySubmittedMessage);
//             return;
//         }

//         await UpdateModel.create({
//             userId: command.user_id,
//             type,
//             content: input,
//         });

//         await say(successMessage.replace('${input}', input.join(', ')));
//     } else {
//         await say(formatError);
//     }
// };

// export const yesterdayControllers = async (args: { command: SlashCommand; ack: AckFn<string | RespondArguments>; say: SayFn }) => {
//     await handleSubmission({
//         ...args,
//         type: 'yesterday',
//         formatError: "❌ Invalid format. Please use the format: `['update1', 'update2']`",
//         alreadySubmittedMessage: "⚠️ You've already submitted updates for 'yesterday' today. Please update your existing submission if needed.",
//         successMessage: "✅ Yesterday's updates recorded: ${input}",
//     });
// };

// export const todayControllers = async (args: { command: SlashCommand; ack: AckFn<string | RespondArguments>; say: SayFn }) => {
//     await handleSubmission({
//         ...args,
//         type: 'today',
//         formatError: "❌ Invalid format. Please use the format: `['plan1', 'plan2']`",
//         alreadySubmittedMessage: "⚠️ You've already submitted plans for 'today' today. Please update your existing submission if needed.",
//         successMessage: "✅ Today's plans recorded: ${input}",
//     });
// };


// export const blockersControllers = async (args: { command: SlashCommand; ack: AckFn<string | RespondArguments>; say: SayFn }) => {
//     await handleSubmission({
//         ...args,
//         type: 'blockers',
//         formatError: "❌ Invalid format. Please use the format: `['blocker1', 'blocker2']`",
//         alreadySubmittedMessage: "⚠️ You've already submitted blockers for today. Please update your existing submission if needed.",
//         successMessage: "✅ Blockers recorded: ${input}",
//     });
// };
