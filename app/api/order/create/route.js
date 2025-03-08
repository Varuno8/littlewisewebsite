import connectDB from "@/config/db";
import Product from "@/models/product";
import User from "@/models/user";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function POST(request) {
    try {

        const { userId } = getAuth(request)
        const { address, items } = await request.json();

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid data" });
        }

        // calculate amount using items
        const amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.productId);
            return acc + (Product.offerPrice * item.quantity);
        }, 0)
        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                address,
                items,
                amount:amount+Math.floor(amount*0.02),//added 2% tax
                date: Date.now() 
                
            }
        })

        //clear user cartData
        const user = await User.findById(userId);
        user.cartItems = {};
        await user.save();

        return NextResponse.json({ success: true ,message: 'Order placed'});
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}