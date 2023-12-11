import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Icons from "react-native-vector-icons/FontAwesome";

function Home() {
  const [inputText, setInputText] = useState("");
  const [reminders, setReminders] = useState([]);
  const [pesquisa, setPesquisa] = useState("");

  const router = useRouter();

  function goto(index) {
    router.push({
      pathname: "/lembrete",
      params: {
        reminderIndex: index,
      },
    });
  }

  function updateText(text) {
    setInputText(text);
  }

  async function addReminder() {
    if (inputText === "" || !inputText) {
      Alert.alert("Aviso", "Campo vazio... digite antes de adicionar");
      return;
    }

    var reminders = JSON.parse(await AsyncStorage.getItem("reminders")) || [];

    reminders.push({
      title: inputText,
      content: "",
      datetime: null,
      createdAt: new Date(),
    });

    await AsyncStorage.setItem("reminders", JSON.stringify(reminders));
    setReminders(reminders);
    setInputText("");
    Keyboard.dismiss();
  }

  async function loadReminders() {
    const savedReminders = JSON.parse(
      (await AsyncStorage.getItem("reminders")) || []
    );

    setReminders(savedReminders);
  }

  async function removeReminder(index) {
    var reminders = JSON.parse(await AsyncStorage.getItem("reminders")) || [];

    reminders.splice(index, 1);

    await AsyncStorage.setItem("reminders", JSON.stringify(reminders));
    setReminders(reminders);
  }

  function ComponenteLembrete({ item, index }) {
    return (
      <TouchableOpacity
        style={styles.lembrete}
        onPress={() => {
          goto(index);
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Text style={styles.lembreteTexto}>{item.title}</Text>
          <Text style={styles.lembreteTextoConteudo}>{item.content}</Text>
        </View>
        <TouchableOpacity
          style={styles.lembreteBotao}
          onPress={() => {
            removeReminder(index);
          }}
        >
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

      <TextInput
        style={styles.barraDePesquisa}
        placeholder="Pesquise um lembrete"
        value={pesquisa}
        onChangeText={(text) => setPesquisa(text)}
      />

      <FlatList
        style={{
          flex: 1,
        }}
        contentContainerStyle={styles.content}
        data={reminders.filter((reminder) => {
          if (
            reminder.title
              .toLowerCase()
              .replace(" ", "")
              .includes(pesquisa.toLowerCase().replace(" ", ""))
          ) {
            return reminder;
          }
        })}
        renderItem={({ item, index }) => {
          return <ComponenteLembrete item={item} index={index} />;
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
    paddingTop: 24,
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
    gap: 12,
  },
  lembreteTexto: {
    fontSize: 24,
    fontWeight: "500",
  },
  lembreteBotao: {
    width: 60,
    height: 60,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#BEBEBE",
  },
  lembreteTextoConteudo: {
    opacity: 0.5,
  },
  barraDePesquisa: {
    height: 55,
    backgroundColor: "#ECECEC",
    borderRadius: 32,
    paddingHorizontal: 24,
    fontSize: 18,
    marginHorizontal: 24,
    marginBottom: 12,
  },
});

export default Home;
