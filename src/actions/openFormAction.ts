import { AckFn, BlockAction, DialogValidation, SayArguments, SlackAction } from "@slack/bolt";
import type { WebClient } from '@slack/web-api';
import { openUpdateForm } from "../user_interfaces/form";

export const openUpdateFormAction = async ({ body, ack, client }: { body: SlackAction; ack: AckFn<void> | AckFn<string | SayArguments> | AckFn<DialogValidation>; client: WebClient }) => {
    await ack();
    const triggerId = (body as BlockAction).trigger_id;
    await openUpdateForm(body.user.id, client, triggerId);
}