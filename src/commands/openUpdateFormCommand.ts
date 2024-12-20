import { AckFn, RespondArguments, RespondFn, SlashCommand } from "@slack/bolt";
import type { WebClient } from '@slack/web-api';
import { openUpdateForm } from "../user_interfaces/form";

export const openUpdateFormCommand = async ({ command, ack, respond, client }: { command: SlashCommand; ack: AckFn<string | RespondArguments>; respond: RespondFn, client: WebClient }) => {
    await ack();
    await openUpdateForm(command.user_id, client, command.trigger_id);
}