import prisma from "./prisma";

// Generic SMS sending function using configured SMS service
export async function sendSMS(phone: string, message: string) {
  try {
    let settings;
    try {
      settings = await prisma.systemSettings.findFirst();
    } catch (dbError) {
      console.warn("Could not fetch settings for SMS, skipping SMS send:", dbError);
      return { success: false, error: "Database unreachable" };
    }

    if (!settings?.smsApiKey || !settings?.smsApiSecret) {
      console.log("SMS not configured, skipping SMS send");
      return { success: false, error: "SMS service not configured" };
    }

    // Example integration with Twilio-like service
    // You would replace this with your actual SMS provider API

    // For demonstration purposes, we'll log the SMS
    console.log("SMS would be sent:", {
      to: phone,
      from: settings.smsSenderId,
      message: message,
    });

    // In production, you would use an actual SMS service like:
    /*
    const response = await fetch("https://api.sms-provider.com/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${settings.smsApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: phone,
        from: settings.smsSenderId,
        message: message,
      }),
    });

    if (!response.ok) {
      throw new Error("SMS sending failed");
    }
    */

    return { success: true };
  } catch (error) {
    console.error("SMS sending error:", error);
    return { success: false, error: "Failed to send SMS" };
  }
}

// Send password reset SMS
export async function sendPasswordResetSMS(phone: string, name: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
  const message = `Hello ${name}, You requested a password reset. Click here to reset your password: ${resetUrl} (Link expires in 1 hour)`;
  
  return await sendSMS(phone, message);
}

// Send welcome SMS
export async function sendWelcomeSMS(
  phone: string,
  name: string,
  username: string,
  temporaryPassword: string
) {
  const message = `Welcome ${name}! Your account has been created. Username: ${username}, Temporary Password: ${temporaryPassword}. Please login and change your password.`;
  
  return await sendSMS(phone, message);
}

// Send notification SMS
export async function sendNotificationSMS(phone: string, message: string) {
  return await sendSMS(phone, message);
}

// Send attendance alert SMS to parent
export async function sendAttendanceAlertSMS(
  parentPhone: string,
  studentName: string,
  date: string,
  status: string
) {
  const message = `Attendance Alert: ${studentName} was marked ${status} on ${date}.`;
  
  return await sendSMS(parentPhone, message);
}

// Send fee reminder SMS
export async function sendFeeReminderSMS(
  phone: string,
  name: string,
  feeTitle: string,
  amount: number,
  dueDate: string
) {
  const message = `Fee Reminder for ${name}: ${feeTitle} - Amount: GH₵${amount.toFixed(2)}, Due Date: ${dueDate}. Please pay before the due date.`;
  
  return await sendSMS(phone, message);
}

// Send exam/assignment notification SMS
export async function sendExamNotificationSMS(
  phone: string,
  studentName: string,
  examTitle: string,
  date: string
) {
  const message = `Exam Notification: ${studentName} has an upcoming exam - ${examTitle} on ${date}. Good luck!`;
  
  return await sendSMS(phone, message);
}

