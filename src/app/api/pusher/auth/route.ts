
import { getPusherInstance } from "@/lib/pusher/server/index";

const pusherServer = getPusherInstance();

export async function POST(req: Request) {
  console.log("authenticating pusher perms...")
  const data = await req.text();
  const [socketId, channelName] = data
    .split("&")
    .map((str) => str.split("=")[1]);

  // logic to check user permissions

  const authResponse = pusherServer.authorizeChannel(socketId, channelName);

  return new Response(JSON.stringify(authResponse));
}