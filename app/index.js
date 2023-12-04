import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Icons from "react-native-vector-icons/FontAwesome";

function Home() {
  const [inputText, setInputText] = useState("");
  const [reminders, setReminders] = useState([]);

  const router = useRouter();

  function goto() {
    router.push("/lembrete");
  }

  function updateText(text) {
    setInputText(text);
  }

  async function addReminder() {
    var reminders = JSON.parse(await AsyncStorage.getItem("reminders")) || [];

    reminders.push({
      content: inputText,
      createdAt: new Date(),
    });

    await AsyncStorage.setItem("reminders", JSON.stringify(reminders));
    setReminders(reminders);
  }

  async function loadReminders() {
    const savedReminders = JSON.parse(
      (await AsyncStorage.getItem("reminders")) || []
    );

    setReminders(savedReminders);
  }

  function ComponenteLembrete({ item }) {
    return (
      <TouchableOpacity style={styles.lembrete} onPress={goto}>
        <Text style={styles.lembreteTexto}>{item.content}</Text>
        <TouchableOpacity style={styles.lembreteBotao}>
          <Icons name="trash" size={32} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  useEffect(() => {
    loadReminders();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cejam Reminder</Text>
      <FlatList
        style={{
          flex: 1,
        }}
        contentContainerStyle={styles.content}
        data={reminders}
        renderItem={({ item }) => {
          return <ComponenteLembrete item={item} />;
        }}
        ListEmptyComponent={<Text>Lista vazia...</Text>}
      />
      <View style={styles.bottomBar}>
        <TextInput
          placeholder="Digite seu lembrete"
          style={styles.input}
          value={inputText}
          onChangeText={updateText}
        />
        <TouchableOpacity style={styles.addButton} onPress={addReminder}>
          <Icons name="plus" size={24} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    margin: 24,
  },
  content: {
    padding: 24,
    gap: 18,
  },
  bottomBar: {
    height: 100,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 20,
  },
  input: {
    flex: 1,
    height: 55,
    backgroundColor: "#ECECEC",
    borderRadius: 32,
    paddingHorizontal: 24,
    fontSize: 18,
  },
  addButton: {
    width: 55,
    height: 55,
    backgroundColor: "#D9D9D9",
    borderRadius: 27.5,

    alignItems: "center",
    justifyContent: "center",
  },
  lembrete: {
    height: 100,
    borderRadius: 24,
    flexDirection: "row",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D9D9D9",
  },
  lembreteTexto: {
    fontSize: 24,
    flex: 1,
  },
  lembreteBotao: {
    width: 60,
    height: 60,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BEBEBE",
  },
});

export default Home;
