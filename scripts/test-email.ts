import { sendOrderConfirmation } from './src/lib/mail';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Mock order data based on the one in screenshot
const testOrder = {
    id: 'test-id',
    orderNumber: '1771048359061',
    deliveryName: 'MCP server',
    deliveryEmail: 'namya.vishal.shah.campus@gmail.com',
    deliveryPhone: '7984495111',
    addressLine1: 'ahmedabad gujarat',
    addressLine2: 'gwrg',
    city: 'AHMEDABAD',
    state: 'GUJARAT',
    pincode: '546153',
    total: 238.35,
    orderItems: [
        { itemName: 'Peri Peri Fries', quantity: 1, price: 99 },
        { itemName: 'Double Tikki Burger', quantity: 1, price: 128 }
    ]
};

console.log('🚀 Sending manual test email...');
sendOrderConfirmation(testOrder)
    .then(() => console.log('✅ Manual test completed!'))
    .catch(err => console.error('❌ Manual test failed:', err));
