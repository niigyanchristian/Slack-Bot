import { openNewForm } from "../user_interfaces/form";

export const updateButtonAction = async ({ body, ack, client }: any) => {
    await ack();

    try {

        await openNewForm(body, client)
        // console.log('Modal opened successfully:', result);
    } catch (error) {
        console.error('Error opening modal:', error);
    }
}
