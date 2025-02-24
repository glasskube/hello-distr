import { getApiHost } from "@/config/api";

export async function getLatestMessage(): Promise<string> {
  const response = await fetch(`${getApiHost()}/api/latest-message`);

  return response.text();
}
