const nodemailer = require('nodemailer');

let transporter;

const getTransporter = () => {
    if (transporter) {
        return transporter;
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
        throw new Error("SMTP_USER and SMTP_PASS must be configured to send reset emails");
    }

    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    });

    return transporter;
};

const sendPasswordResetEmail = async ({ toEmail, firstName, resetUrl }) => {
    const mailTransporter = getTransporter();

    await mailTransporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: toEmail,
        subject: 'Reset your LeetCode password',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
                <h2 style="margin-bottom: 8px;">Password Reset Request</h2>
                <p>Hello ${firstName || 'User'},</p>
                <p>We received a request to reset your password. Click the button below to set a new password.</p>
                <p style="margin: 24px 0;">
                    <a href="${resetUrl}" style="background: #2563eb; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 8px; display: inline-block;">
                        Reset Password
                    </a>
                </p>
                <p>If the button does not work, copy and paste this link into your browser:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                <p>This link will expire in 15 minutes.</p>
                <p>If you did not request this, you can safely ignore this email.</p>
            </div>
        `,
    });
};

module.exports = {
    sendPasswordResetEmail,
};
