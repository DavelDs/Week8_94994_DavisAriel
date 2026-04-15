import { useState } from "react";
import { Text, TextInput, View, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { postData } from "@/services/api";

export default function AddPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [userId, setUserId] = useState("");

  const handleSubmit = () => {
    const parsedUserId = Number(userId.trim());

    if (!title.trim() || !body.trim() || !userId.trim()) {
      Alert.alert("Validation Error", "Title, body, dan userId wajib diisi.");
      return;
    }

    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      Alert.alert("Validation Error", "userId harus berupa angka lebih dari 0.");
      return;
    }

    const data = {
      title: title.trim(),
      body: body.trim(),
      userId: parsedUserId,
    };

    postData(data)
      .then((res) => {
        if (res.status === 201) {
          Alert.alert("Success", "Post berhasil dibuat!");
          router.replace({
            pathname: "/",
            params: {
              createdPost: JSON.stringify({
                id: Number(res.data?.id) || Date.now(),
                userId: data.userId,
                title: data.title,
                body: data.body,
              }),
            },
          });
        } else {
          Alert.alert("Error", "Gagal membuat post");
        }
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Error", "Terjadi masalah saat membuat post");
      });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginBottom: 10 }}
        placeholder="Masukkan judul post"
      />

      <Text>Body</Text>
      <TextInput
        value={body}
        onChangeText={setBody}
        style={{ borderWidth: 1, marginBottom: 10 }}
        placeholder="Masukkan isi post"
      />

      <Text>User ID</Text>
      <TextInput
        value={userId}
        onChangeText={setUserId}
        style={{ borderWidth: 1, marginBottom: 10 }}
        placeholder="Masukkan user ID"
        keyboardType="numeric"
      />

      <Pressable
        onPress={handleSubmit}
        style={{ backgroundColor: "green", padding: 10, marginBottom: 10 }}
      >
        <Text style={{ color: "white" }}>Submit</Text>
      </Pressable>

      <Pressable
        onPress={() => router.back()}
        style={{ backgroundColor: "gray", padding: 10 }}
      >
        <Text style={{ color: "white" }}>Cancel</Text>
      </Pressable>
    </View>
  );
}
