import { useEffect } from "react";
import { Slot } from "expo-router";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

export default function Layout() {
  async function setupNotifications() {
    const permission = await Notifications.getPermissionsAsync();

    if (!permission.granted) {
      return Alert.alert(
        "Aviso",
        "Permissão de notificações negada! Por favor habilite para utilizar todas as nossas funcionalidades"
      );
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("reminders", {
        name: "Lembretes",
        description: "Canal utilizado para lembretes do app CEJAM Reminder",
        importance: Notifications.AndroidImportance.MAX,
      });
    }
  }

  useEffect(() => {
    setupNotifications();
  }, []);

  return <Slot />;
}
