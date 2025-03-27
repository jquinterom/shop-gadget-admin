"use server";

import { createClient } from "@/src/supabase/server";

type PushNotificationProps = {
  expoPushToken: string;
  title: string;
  body: string;
};

async function sendPushNotification({
  expoPushToken,
  title,
  body,
}: PushNotificationProps) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

export const getUserNotificationToken = async (userId: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("expo_notification_token")
    .eq("id", userId)
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const sendNotification = async (userId: string, status: string) => {
  const tokenData = await getUserNotificationToken(userId);

  if (!tokenData.expo_notification_token) return;

  await sendPushNotification({
    expoPushToken: tokenData.expo_notification_token,
    title: "Your order has been update!",
    body: `Your order is now ${status} 🚀`,
  });
};
