import connectDB from "@/config/db";
import Address from "@/models/address";
import { getAuth } from "@clerk/nextjs/server";
import { err } from "inngest/types";
import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        const { userID } = getAuth(request)

        await connectDB()

        const addresses = await Address.find({ userID })

        return NextResponse.json({ success: true, addresses })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
        
    }
}