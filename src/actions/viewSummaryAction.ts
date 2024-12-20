import { AckFn, DialogValidation, SayArguments, SlackAction } from "@slack/bolt";
import { generateDailySummary } from "../services/summary";
import type { WebClient } from '@slack/web-api';

export const viewSummaryAction = async ({ body, ack, client }: { body: SlackAction; ack: AckFn<void> | AckFn<string | SayArguments> | AckFn<DialogValidation>; client: WebClient }) => {
    await ack();
    await generateDailySummary(client, body.user.id);
}