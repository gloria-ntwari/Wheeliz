import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
   secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendVerificationEmail = async (to: string, code: string) => {
    const mailOptions = {
        from: `"Wheeliz" <${process.env.EMAIL_FROM}>`,
        to,
        subject: 'Verify your Wheeliz account',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #681618; text-align: center;">Welcome to Wheeliz!</h2>
                <p>Hello,</p>
                <p>Thank you for signing up. Please use the following verification code to complete your registration:</p>
                <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333; border-radius: 5px; margin: 20px 0;">
                    ${code}
                </div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't create an account, you can safely ignore this email.</p>
                <br>
                <p>Best regards,<br>The Wheeliz Team</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

export const sendPasswordSetupEmail = async (to: string, name: string, setupLink: string) => {
    const mailOptions = {
        from: `"Wheeliz" <${process.env.EMAIL_FROM}>`,
        to,
        subject: 'Welcome to Wheeliz – Set Up Your Password',
        html: `
            <div style="font-family: 'Barlow', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h2 style="color: #681618;">Welcome to Wheeliz, ${name}! 🎉</h2>
                </div>
                <p>Hi ${name},</p>
                <p>Your account has been created by an admin. To get started, please set up your password by clicking the button below:</p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${setupLink}" style="background-color: #68161c; color: white; padding: 14px 32px; text-decoration: none; border-radius: 24px; font-weight: bold; font-size: 16px; display: inline-block;">
                        Set Up My Password
                    </a>
                </div>
                <p style="color: #888; font-size: 13px;">This link will expire in 24 hours. If you didn't expect this email, you can safely ignore it.</p>
                <br>
                <p>Best regards,<br>The Wheeliz Team</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Password setup email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending password setup email:', error);
        return false;
    }
};

export const sendForgotPasswordEmail = async (to: string, name: string, resetLink: string) => {
    const mailOptions = {
        from: `"Wheeliz" <${process.env.EMAIL_FROM}>`,
        to,
        subject: 'Wheeliz – Reset Your Password',
        html: `
            <div style="font-family: 'Barlow', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h2 style="color: #681618;">Password Reset Request</h2>
                </div>
                <p>Hi ${name},</p>
                <p>We received a request to reset the password for your Wheeliz account. Click the button below to choose a new password:</p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${resetLink}" style="background-color: #68161c; color: white; padding: 14px 32px; text-decoration: none; border-radius: 24px; font-weight: bold; font-size: 16px; display: inline-block;">
                        Reset My Password
                    </a>
                </div>
                <p style="color: #888; font-size: 13px;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
                <br>
                <p>Best regards,<br>The Wheeliz Team</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Forgot password email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending forgot password email:', error);
        return false;
    }
};
