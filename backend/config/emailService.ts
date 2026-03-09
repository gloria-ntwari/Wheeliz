import 'dotenv/config';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev';

console.log('--- Email Service (Resend API) ---');
console.log('Resend Initialized with Key Length:', (process.env.RESEND_API_KEY || '').length);
console.log('From Email:', FROM_EMAIL);
console.log('--- --- --- --- --- ---');

export const sendVerificationEmail = async (to: string, code: string) => {
    try {
        // REDIRECT FOR TESTING: Resend sandbox only allows sending to the account owner
        const recipient = process.env.NODE_ENV === 'production' ? to : 'gloriantwari@gmail.com';
        
        const { data, error } = await resend.emails.send({
            from: `Wheeliz Noreply <${FROM_EMAIL}>`,
            to: [recipient],
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
        });

        if (error) {
            console.error('Error sending verification email via Resend:', error);
            return false;
        }

        console.log('Verification email sent via Resend:', data?.id);
        return true;
    } catch (error) {
        console.error('Resend Exception (Verification):', error);
        return false;
    }
};

export const sendPasswordSetupEmail = async (to: string, name: string, setupLink: string) => {
    try {
        // REDIRECT FOR TESTING
        const recipient = process.env.NODE_ENV === 'production' ? to : 'gloriantwari@gmail.com';

        const { data, error } = await resend.emails.send({
            from: `Wheeliz Noreply <${FROM_EMAIL}>`,
            to: [recipient],
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
        });

        if (error) {
            console.error('Error sending setup email via Resend:', error);
            return false;
        }

        console.log('Setup email sent via Resend:', data?.id);
        return true;
    } catch (error) {
        console.error('Resend Exception (Setup):', error);
        return false;
    }
};

export const sendForgotPasswordEmail = async (to: string, name: string, resetLink: string) => {
    try {
        // REDIRECT FOR TESTING
        const recipient = process.env.NODE_ENV === 'production' ? to : 'gloriantwari@gmail.com';

        const { data, error } = await resend.emails.send({
            from: `Wheeliz Noreply <${FROM_EMAIL}>`,
            to: [recipient],
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
        });

        if (error) {
            console.error('Error sending reset email via Resend:', error);
            return false;
        }

        console.log('Reset email sent via Resend:', data?.id);
        return true;
    } catch (error) {
        console.error('Resend Exception (Reset):', error);
        return false;
    }
};
