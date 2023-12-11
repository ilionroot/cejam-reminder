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
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";

function Lembrete() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderContent, setReminderContent] = useState("");
  const [reminderCreatedAt, setReminderCreatedAt] = useState(new Date());

  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [dateTimeMode, setDateTimeMode] = useState("date");

  const [reminderDate, setReminderDate] = useState();
  const [reminderTime, setReminderTime] = useState();

  function back() {
    router.back();
  }

  async function loadReminder() {
    var reminders = JSON.parse(await AsyncStorage.getItem("reminders"));

    var reminder = reminders.filter((r, i) => {
      return i === Number(params.reminderIndex);
    })[0];

    setReminderTitle(reminder.title);
    setReminderContent(reminder.content);
    setReminderCreatedAt(new Date(reminder.createdAt));

    if (reminder.datetime) {
      setReminderDate(new Date(reminder.datetime));
      setReminderTime(new Date(reminder.datetime));
    }
  }

  async function saveReminder() {
    var datetime = new Date(
      Date.UTC(
        reminderDate.getUTCFullYear(),
        reminderDate.getUTCMonth(),
        reminderDate.getUTCDate(),
        reminderTime.getUTCHours(),
        reminderTime.getUTCMinutes(),
        reminderTime.getUTCSeconds()
      )
    );

    var reminders = JSON.parse(await AsyncStorage.getItem("reminders"));

    reminders[params.reminderIndex].title = reminderTitle;
    reminders[params.reminderIndex].content = reminderContent;
    reminders[params.reminderIndex].datetime = datetime;

    await AsyncStorage.setItem("reminders", JSON.stringify(reminders));

    await scheduleNotification();

    router.back();
  }

  function onDateTimePickerChange(event, selectedValue) {
    setShowDateTimePicker(false);

    if (dateTimeMode === "date") {
      setReminderDate(selectedValue);
    } else if (dateTimeMode === "time") {
      setReminderTime(selectedValue);
    }
  }

  function getDate() {
    setShowDateTimePicker(true);
    setDateTimeMode("date");
  }

  function getTime() {
    setShowDateTimePicker(true);
    setDateTimeMode("time");
  }

  const getSecondsUntilDate = ({ day, month, year, hour, minute }) => {
    const now = new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000
    );
    let date = new Date(Date.UTC(year, month, day, hour, minute, 0));
    let diff = date.getTime() - now.getTime();

    if (diff > 0) {
      return Math.floor(diff / 1000);
    } else {
      date = new Date(year + 1, month, day, hour, minute);
      diff = date.getTime() - now.getTime();
      return Math.floor(diff / 1000);
    }
  };

  async function scheduleNotification() {
    var date = new Date(reminderDate);
    var time = new Date(reminderTime);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: reminderTitle,
        body: reminderContent,
      },
      trigger: {
        channelId: "reminders",
        seconds: getSecondsUntilDate({
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate(),
          hour: time.getHours(),
          minute: time.getMinutes(),
        }),
        repeats: false,
      },
    });
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
        style={styles.title}
        placeholder="Digite o título do seu lembrete"
        value={reminderTitle}
        onChangeText={(text) => setReminderTitle(text)}
      />
      <TextInput
        textAlignVertical="top"
        multiline={true}
        style={styles.input}
        placeholder="Digite o conteúdo do seu lembrete"
        value={reminderContent}
        onChangeText={(text) => setReminderContent(text)}
      />

      <View style={styles.datetimeContainer}>
        <TouchableOpacity style={styles.datetimeButton} onPress={getDate}>
          <Text style={styles.datetimeButtonText}>
            {reminderDate
              ? reminderDate.toLocaleDateString("pt-BR")
              : "Adicionar data"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.datetimeButton} onPress={getTime}>
          <Text style={styles.datetimeButtonText}>
            {reminderTime
              ? reminderTime.toLocaleTimeString("pt-BR")
              : "Adicionar horário"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.createdAt}>
        {reminderCreatedAt.toLocaleString("pt-BR")}
      </Text>

      <TouchableOpacity style={styles.botaoSalvar} onPress={saveReminder}>
        <Text style={styles.botaoSalvarText}>Salvar</Text>
      </TouchableOpacity>

      {showDateTimePicker === true && (
        <DateTimePicker
          value={
            dateTimeMode === "date"
              ? reminderDate || new Date()
              : reminderTime || new Date()
          }
          mode={dateTimeMode}
          is24Hour={true}
          onChange={onDateTimePickerChange}
        />
      )}
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
    marginTop: 32,
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
    // Android
    elevation: 10,
    // IOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 24,
    shadowOpacity: 0.5,
  },
  botaoSalvarText: {
    fontSize: 24,
    fontWeight: "700",
  },
  createdAt: {
    width: "50%",
    marginTop: 24,
    backgroundColor: "#D9D9D9",
    borderRadius: 24,
    padding: 16,
    fontSize: 12,
  },
  title: {
    backgroundColor: "#D9D9D9",
    padding: 24,
    fontSize: 24,
    borderRadius: 24,
    marginTop: 32,
    fontWeight: "700",
  },
  datetimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginTop: 24,
  },
  datetimeButton: {
    backgroundColor: "#D9D9D9",
    padding: 16,
    borderRadius: 24,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  datetimeButtonText: {
    fontWeight: "600",
    fontSize: 16,
    opacity: 0.85,
  },
});

export default Lembrete;
