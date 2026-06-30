// =====================================================================
// CLOUD FUNCTION: BILL DUE DATE EMAIL REMINDER
// =====================================================================
// Eta proti din ekbar automatic run hoy (scheduled function) ar check
// kore j kar kar bill-er due date 3 din ba tar kom baki ache, ar tader
// email pathiye dey reminder hisebe.
//
// KIBHABE DEPLOY KORBEN:
// 1. Firebase project-e "Blaze" plan e upgrade korte hobe (scheduled
//    function o email pathanor jonno lagbe - free tier e eta available na,
//    kintu Blaze plan-er small usage-er jonno practically free thake)
// 2. Terminal e: firebase login
// 3. Terminal e: firebase init functions (already kora ache ei project e)
// 4. Gmail App Password set korun (niche dekhun)
// 5. Terminal e: firebase deploy --only functions
//
// GMAIL APP PASSWORD KIBHABE BANABEN:
// 1. https://myaccount.google.com/security e jan
// 2. "2-Step Verification" on করুন (jodi na thake)
// 3. "App passwords" e jan, notun app password banান
// 4. Niche-r command diye eta Firebase-e secret hisebe save korun:
//    firebase functions:config:set gmail.email="apnar@gmail.com" gmail.password="app_password_ekhane"
//    (notun Firebase version-e "firebase functions:secrets:set" use korte hobe,
//    eta Firebase-er documentation dekhe age check kore nin)
// =====================================================================

const { onSchedule } = require("firebase-functions/v2/scheduler");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const nodemailer = require("nodemailer");

initializeApp();
const db = getFirestore();

// Gmail diye email pathanor jonno transporter setup
// GMAIL_EMAIL ar GMAIL_APP_PASSWORD environment variable theke asbe
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Proti din shokal 9 tay (Bangladesh time) ei function automatic run hobe
exports.checkDueBillsAndSendReminder = onSchedule(
  {
    schedule: "0 9 * * *", // proti din shokal 9:00 AM
    timeZone: "Asia/Dhaka",
  },
  async () => {
    console.log("Due bill check shuru hocche...");

    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    // Shob unpaid bill anchi Firestore theke
    const billsSnapshot = await db
      .collection("bills")
      .where("isPaid", "==", false)
      .get();

    // Shob member-er email map kore rakhi (memberId -> email)
    const membersSnapshot = await db.collection("members").get();
    const memberEmailMap = {};
    membersSnapshot.forEach((doc) => {
      memberEmailMap[doc.id] = doc.data().email;
    });
    const allEmails = membersSnapshot.docs.map((doc) => doc.data().email);

    let emailsSent = 0;

    for (const billDoc of billsSnapshot.docs) {
      const bill = billDoc.data();
      const dueDate = new Date(bill.dueDate);

      // Jodi due date 3 diner moddhe ese jay, tahole email pathano hobe
      if (dueDate <= threeDaysLater) {
        // memberId === "all" hole shobaike email jabe, na hole shudhu shei member-ke
        const recipients =
          bill.memberId === "all"
            ? allEmails
            : [memberEmailMap[bill.memberId]].filter(Boolean);

        for (const email of recipients) {
          try {
            await transporter.sendMail({
              from: `"MessManager" <${process.env.GMAIL_EMAIL}>`,
              to: email,
              subject: `Bill Reminder: ${bill.type} due date kache ese gechhe`,
              html: `
                <p>Assalamu Alaikum,</p>
                <p>Apnar <b>${bill.month}</b> mash-er <b>${bill.type}</b> bill-er due date kache ese gechhe.</p>
                <p><b>Taka:</b> ৳${bill.amount}<br/>
                <b>Due Date:</b> ${bill.dueDate}</p>
                <p>Tratari payment kore felun, dhonyobad.</p>
                <p>— MessManager</p>
              `,
            });
            emailsSent++;
          } catch (err) {
            console.error(`Email pathate parlam na ${email} ke:`, err);
          }
        }
      }
    }

    console.log(`Total ${emailsSent} ti email pathano hoyeche.`);
  }
);
