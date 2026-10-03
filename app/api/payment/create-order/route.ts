import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'dummy',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy',
    });

    const body = await req.json();
    const { amount } = body; // Amount in INR

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_${uuidv4()}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    console.error('Razorpay Error:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
