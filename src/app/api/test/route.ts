import { NextResponse } from 'next/server'
import { getPusherInstance } from '@/lib/pusher/server/index';
import prisma from '../../../../prisma';
import { GetUserDetails } from '../../../../actions/GetUserDetails';
const pusherServer = getPusherInstance();

export async function POST(req: Request, res: Response) {
    const { message, roomId, receiver, senderId } = await req.json();
    console.log(message, roomId)
    try {

        await pusherServer.trigger(
            roomId,
            "chat",
            {
                senderId,
                text: message,
                user: "ree",
                createdAt: new Date(),
            }
        )

        const getSenderDetails = await GetUserDetails();
        await prisma.chat.create({
            data: {
                text: message,
                senderId: getSenderDetails?.decodeCookieValue?.id,
                receiverId: receiver
            }
        })

        return NextResponse.json({ message: "Sockets tested" }, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Failed to test sockets", error: error }, { status: 500 })
    }
}