import {
  getPostDetail,
  getUserDetail,
  getCommentsByPost,
} from "@/services/api";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

type User = {
  name: string;
  email: string;
};

type Post = {
  title: string;
  body: string;
};

type Comment = {
  id: number;
  name: string;
  email: string;
  body: string;
};

export default function PostDetail() {
  const { id, userId } = useLocalSearchParams<{ id: string; userId: string }>();

  const [user, setUser] = useState<User | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const postId = Number(id);
    const authorId = Number(userId);

    if (!postId || !authorId) {
      setErrorMessage("Parameter post tidak valid.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    Promise.all([
      getPostDetail(postId),
      getUserDetail(authorId),
      getCommentsByPost(postId),
    ])
      .then(([postResponse, userResponse, commentsResponse]) => {
        setPost(postResponse.data);
        setUser(userResponse.data);
        setComments(commentsResponse.data);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Terjadi error saat mengambil detail post.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, userId]);

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 20,
      }}
      contentContainerStyle={{
        alignItems: "stretch",
        paddingBottom: 24,
      }}
    >
      {loading ? <ActivityIndicator size="large" color="blue" /> : null}
      {errorMessage ? (
        <Text style={{ color: "red", textAlign: "center" }}>{errorMessage}</Text>
      ) : null}
      {post ? (
        <>
          <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 18 }}>
            {post.title}
          </Text>
          <Text style={{ textAlign: "center", marginTop: 8 }}>{post.body}</Text>
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: "bold" }}>Post Created By</Text>
            <Text>Name: {user?.name}</Text>
            <Text>Email: {user?.email}</Text>
          </View>
          <Text style={{ marginTop: 20, fontWeight: "bold" }}>Comments:</Text>

          {comments.map((comment) => (
            <View
              key={comment.id}
              style={{ borderWidth: 1, marginTop: 8, padding: 8 }}
            >
              <Text style={{ fontWeight: "bold" }}>{comment.name}</Text>
              <Text>{comment.email}</Text>
              <Text>{comment.body}</Text>
            </View>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}
