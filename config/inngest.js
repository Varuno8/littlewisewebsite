/*
Inngest is an excellent choice for developers looking to build scalable,
event-driven workflows without managing infrastructure complexity.
Its serverless nature, ease of use, and powerful orchestration capabilities make it a compelling option for modern web applications.
Whether you're building SaaS platforms, e-commerce solutions, or real-time notifications,
 Inngest provides the tools needed to enhance productivity and maintain scalability.

*/

import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "littlewise" });

//Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id:"sync-user-from-clerk"
    },
    {
        event:'clerk/user.created'
    },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + " " + last_name,
            imageUrl: image_url,        
        }
        await connectDB();
        await User.create(userData);
    }
)

// Inngest Function to update user data in database
export const syncUserUpdation = inngest.createFunction(
    {
        id:'update-user-from-clerk'
    },
    {
        event:'clerk/user.updated'
    },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + " " + last_name,
            imageUrl: image_url,
        }
        await connectDB();
        await User.findByIdAndUpdate(id, userData);
    }
)

// Inngest Function to delete user from database
export const syncUserDeletion = inngest.createFunction(
    {
        id:'delete-user-with-clerk'
    },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { id } = event.data
        
        await connectDB();
        await User.findByIdAndDelete(id);
    }
)
