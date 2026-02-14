import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendOrderConfirmation(order: any) {
    if (!order.deliveryEmail) return;

    const itemsList = order.orderItems
        ? order.orderItems
            .map(
                (item: any) =>
                    `<li>${item.quantity}x ${item.itemName} - ₹${item.price * item.quantity}</li>`
            )
            .join('')
        : 'Order details attached';

    const mailOptions = {
        from: `"Tummy Tikki Burger" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: order.deliveryEmail,
        subject: `Order Confirmed! Burger #${order.orderNumber} is on its way! 🍔`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 20px; overflow: hidden;">
                <div style="background-color: #FF5722; padding: 40px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 32px;">Order Confirmed!</h1>
                    <p style="font-size: 18px; opacity: 0.9;">Thank you for ordering from Tummy Tikki Burger.</p>
                </div>
                <div style="padding: 40px;">
                    <h2 style="color: #333;">Order #${order.orderNumber}</h2>
                    <p style="color: #666;">Hi ${order.deliveryName || 'Burger Lover'},</p>
                    <p style="color: #666;">We've received your order and we're starting to prepare it right now!</p>
                    
                    <div style="background: #fdf2f0; padding: 20px; border-radius: 15px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #FF5722;">What you ordered:</h3>
                        <ul style="padding-left: 20px; color: #444;">
                            ${itemsList}
                        </ul>
                        <hr style="border: 0; border-top: 1px solid #ffccbc;">
                        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; color: #333;">
                            <span>Total Paid:</span>
                            <span>₹${order.total}</span>
                        </div>
                    </div>

                    <p style="color: #666;"><b>Delivery Address:</b><br/>
                    ${order.addressLine1}${order.addressLine2 ? ', ' + order.addressLine2 : ''}<br/>
                    ${order.city}, ${order.state} - ${order.pincode}</p>

                    <div style="text-align: center; margin-top: 40px;">
                        <a href="${process.env.NEXTAUTH_URL}/orders/${order.id}" 
                           style="background-color: #FF5722; color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold;">
                           Track Your Order
                        </a>
                    </div>
                </div>
                <div style="background-color: #f9f9f9; padding: 20px; text-align: center; color: #999; font-size: 12px;">
                    <p>© 2026 Tummy Tikki Burger. All rights reserved.</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✉️ Order confirmation email sent to ${order.deliveryEmail}`);
    } catch (error) {
        console.error('❌ Failed to send order confirmation email:', error);
    }
}
