import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
} from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

function Lembrete({}) {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [reminderContent, setReminderContent] = useState("");
  const [reminderCreatedAt, setReminderCreatedAt] = useState(new Date());

  function back() {
    router.back();
  }

  async function loadReminder() {
    var reminders = JSON.parse(await AsyncStorage.getItem("reminders"));

    var reminder = reminders.filter((r, i) => {
      return i === Number(params.reminderIndex);
    })[0];

    setReminderContent(reminder.content);
    setReminderCreatedAt(new Date(reminder.createdAt));
  }

  async function saveReminder() {
    var reminders = JSON.parse(await AsyncStorage.getItem("reminders"));

    reminders[params.reminderIndex].content = reminderContent;

    await AsyncStorage.setItem("reminders", JSON.stringify(reminders));
    router.back();
  }

  useEffect(() => {
    loadReminder();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={back}>
        <SimpleLineIcons name="arrow-left" size={32} />
      </TouchableOpacity>

      <TextInput
        textAlignVertical="top"
        multiline={true}
        style={styles.input}
        placeholder="Digite o conteúdo do seu lembrete"
        value={reminderContent}
        onChangeText={(text) => setReminderContent(text)}
      />
      <Text style={styles.createdAt}>
        {reminderCreatedAt.getUTCDate().toString().padStart(2, "0") +
          "/" +
          (Number(reminderCreatedAt.getUTCMonth().toString().padStart(2, "0")) +
            1) +
          "/" +
          reminderCreatedAt.getUTCFullYear() +
          ", " +
          reminderCreatedAt.toLocaleTimeString()}
      </Text>

      <TouchableOpacity style={styles.botaoSalvar} onPress={saveReminder}>
        <Text style={styles.botaoSalvarText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    position: "relative",
  },
  input: {
    backgroundColor: "#D9D9D9",
    padding: 24,
    fontSize: 18,
    borderRadius: 24,
    minHeight: 250,
    marginTop: 56,
  },
  botaoSalvar: {
    width: "100%",
    backgroundColor: "#D9D9D9",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 24,
    marginLeft: 24,
  },
  botaoSalvarText: {
    fontSize: 24,
    fontWeight: "700",
  },
  createdAt: {
    width: "50%",
    marginTop: 32,
    backgroundColor: "#D9D9D9",
    borderRadius: 24,
    padding: 16,
    fontSize: 12,
  },
});

export default Lembrete;
