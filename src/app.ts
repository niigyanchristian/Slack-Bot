import dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import MongoDB from './config/database';
import { app } from './config/config';
import { dailyUpdate, dailyReminder } from './tasks';
import { newSubmissionView, updateSubmissionView } from './views';
import { openHomePageEvent } from './events/appHomeOpenedEvent';
import { viewSummaryAction, openUpdateFormAction, updateButtonAction } from './actions';
import { viewSummaryCommand, openNewFormCommand, openUpdateFormCommand } from './commands';

MongoDB();

// Schedule the daily reminder to run every day at 9AM
cron.schedule('0 9 * * *', dailyReminder);

// Schedule the task to run every day at 12 AM
cron.schedule('0 0 * * *', dailyUpdate);

app.command('/view_summary', viewSummaryCommand);

app.command('/open_form', openNewFormCommand);

app.command('/update_post', openUpdateFormCommand);

app.action('view_summary_button', viewSummaryAction);

app.action('view_update_post', openUpdateFormAction);

app.action('update_button', updateButtonAction);

app.event('app_home_opened', openHomePageEvent);

app.view('view_1', newSubmissionView);

app.view('view_2', updateSubmissionView);


(async () => {
    try {
        await app.start(process.env.PORT || 3000);
        console.log('⚡️ Bolt app is running!');
    } catch (error) {
        console.error('❌ Failed to start Bolt app:', error);
    }
})();