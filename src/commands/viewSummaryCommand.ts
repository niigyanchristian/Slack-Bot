import { AckFn, RespondArguments, RespondFn, SlashCommand } from "@slack/bolt";
import type { WebClient } from '@slack/web-api';
import { generateDailySummary } from "../services/summary";

export const viewSummaryCommand = async ({ command, ack, respond, client }: { command: SlashCommand; ack: AckFn<string | RespondArguments>; respond: RespondFn, client: WebClient }) => {
    await ack();
    await generateDailySummary(client, command.user_id);
}