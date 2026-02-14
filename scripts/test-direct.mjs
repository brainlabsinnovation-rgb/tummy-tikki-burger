import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function sendManual() {
    console.log('🚀 Sending manual test email...');
    const mailOptions = {
        from: `"Tummy Tikki Burger" <${process.env.SMTP_FROM}>`,
        to: 'namya.vishal.shah.campus@gmail.com',
        subject: `Order Confirmed! Burger #1771048359061 is on its way! 🍔`,
        html: `<h1>Order Confirmed!</h1><p>This is a manual test to verify your SMTP settings for order #1771048359061.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Manual test email sent!');
    } catch (error) {
        console.error('❌ Failed:', error);
    }
}

sendManual();
