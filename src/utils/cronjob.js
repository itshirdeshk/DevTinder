const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");

cron.schedule("0 8 * * *", async () => {
    // Send emails to all people who got requests the previous day

    try {
        const yeaterday = subDays(new Date(), 1);
        const yesterdayStart = startOfDay(yeaterday);
        const yesterdayEnd = endOfDay(yeaterday);

        const pendingRequests = ConnectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lte: yesterdayEnd
            }
        }).populate("fromUserId toUserId");

        const listOfEmails = [...new Set(pendingRequests.map(req => req.toUserId.emailId))];

        for(const email of listOfEmails){
            // Send emails
        }
    } catch (error) {
        console.error(error);
    }
});

