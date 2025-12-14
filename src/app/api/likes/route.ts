"use server";

import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import prisma from "../../../../prisma";

interface likesTypes {
    authorId :string;
    feedId: string
}

const redis = Redis.fromEnv();
export async function GET(request: Request) {
  console.log("I am a cron runner api function");

  const getAllKey = await redis.hgetall("feed:reactions");

  const likesInsert: likesTypes[] = [];
  const dislikesDelete: likesTypes[] = [];
//   console.log("All keys : ", getAllKey);

if(!getAllKey || getAllKey == null) return NextResponse.json(
    { message: "redis is empty", status: true },
    { status: 200 }
  );;

  for (const [key, value] of Object.entries(getAllKey as any)) {
    const [feedId, authorId] = key.split(":");

    if (value === "liked") {
      likesInsert.push({
        authorId,
        feedId,
      });
    }

    if (value === "disliked") {
      dislikesDelete.push({
        authorId,
        feedId,
      });
    }
  }

  await prisma.$transaction(async (tx) => {
  if (likesInsert.length > 0) {
    await tx.feedsLikes.createMany({
      data: likesInsert
    });
  }

  if (dislikesDelete.length > 0) {
    await tx.feedsLikes.deleteMany({
      where: {
        OR: dislikesDelete.map(({ feedId, authorId }) => ({
          feedId,
          authorId,
        })),
      },
    });
  }
});


  await redis.del("feed:reactions");

  return NextResponse.json(
    { message: "All good", status: true },
    { status: 200 }
  );
}
