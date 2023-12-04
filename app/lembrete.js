import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
} from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useRouter } from "expo-router";

function Lembrete() {
  const router = useRouter();

  function back() {
    router.back();
  }

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
      />

      <TouchableOpacity style={styles.botaoSalvar}>
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
});

export default Lembrete;
