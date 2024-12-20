import { AckFn, RespondArguments, RespondFn, SlashCommand } from "@slack/bolt";
import type { WebClient } from '@slack/web-api';
import { openNewForm } from "../user_interfaces/form";

export const openNewFormCommand = async ({ command, ack, respond, client }: { command: SlashCommand; ack: AckFn<string | RespondArguments>; respond: RespondFn, client: WebClient }) => {
    await ack();
    await openNewForm(command, client);
}