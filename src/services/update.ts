import UpdateModel from "../model/update";

export const getTodayUpdate = async (userId: string) => {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Set the time to midnight

    // Query the database for updates today by this user
    try {
        // Fetch the update for the given user from today's date
        const update = await UpdateModel.find({
            userId: userId,
            timestamp: { $gte: today },
            // type: 'today',
        });

        // If an update is found, return it, otherwise return null
        return update ? update : null;
    } catch (error) {
        console.error('Error fetching today\'s update:', error);
        return null;
    }
};


export async function saveUpdate(userId: string, type: 'yesterday' | 'today' | 'blockers', content: string, logger: any) {
    try {
        // Save the update in the database
        await UpdateModel.create({
            userId,
            type,
            content,
        });
    } catch (error) {
        logger.error(`Failed to save ${type} update for user ${userId}: ${error}`);
    }
}
export async function updateData(userId: string, type: 'yesterday' | 'today' | 'blockers', content: string, logger: any) {
    try {
        // Save the update in the database
        await UpdateModel.findOneAndUpdate({
            userId,
            type,
        }, { content });
    } catch (error) {
        logger.error(`Failed to save ${type} update for user ${userId}: ${error}`);
    }
}

// Function to check if the user has already submitted an update for a given type (yesterday, today, blockers)
export async function checkExistingUpdate(userId: string, type: 'yesterday' | 'today' | 'blockers', logger: any) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set the date to midnight to compare only the date

        // Query the database to find if there's an existing update for the given type and user
        const existingUpdate = await UpdateModel.findOne({
            userId,
            type,
            timestamp: { $gte: today },
        });

        return existingUpdate;
    } catch (error) {
        logger.error(`Failed to check existing ${type} update for user ${userId}: ${error}`);
        return null; // Return null in case of an error
    }
}



