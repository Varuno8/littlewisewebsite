import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function Get(request) {
    try {
        const { userId } = getAuth(request)
        
        const isSeller=authSeller(userId)
        if(!isSeller){
            return NextResponse.json({ success: false, message: 'not authorized' })
        }

        const products=await Product.find({})
    } catch (error) {
        
    }
}