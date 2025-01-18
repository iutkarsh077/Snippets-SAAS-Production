"use server";

import { NextResponse } from "next/server";
import { GetUserDetails } from "../../../../actions/GetUserDetails";
import prisma from "../../../../prisma";

export async function POST(req: Request) {
    try {
        const { text, startDate, endDate, status } = await req.json();

        if (!text || !startDate || !endDate || !status) {
            return NextResponse.json(
                { msg: "Missing required fields", status: false },
                { status: 400 }
            );
        }

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

      

        const getUser = await GetUserDetails();
        if (!getUser?.decodeCookieValue?.id) {
            return NextResponse.json(
                { msg: "Unauthorized access", status: false },
                { status: 401 }
            );
        }

        const data = await prisma.bugTracker.create({
            data: {
                status,
                bugText: text,
                startDate: parsedStartDate,
                endDate: parsedEndDate,
                userId: getUser.decodeCookieValue.id,
            },
        });


        return NextResponse.json({ msg: "All Set", status: true }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /bugTracker:", error);
        return NextResponse.json(
            { msg: "Internal Server Error", status: false },
            { status: 500 }
        );
    }
}
