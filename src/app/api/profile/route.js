import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "@/models/User";


export async function PUT(request){
    mongoose.connect(process.env.MONGO_URI)
    const data = await request.json();
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if ('name' in data){
        // update 
        console.log('Updating user name', data.name, email);
        await User.updateOne({ email }, { name: data.name })
    }

    return Response.json(true)
}