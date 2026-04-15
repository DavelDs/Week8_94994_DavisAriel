import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { getPosts } from "../services/api";

type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

export default function Index() {
  const { createdPost } = useLocalSearchParams<{ createdPost?: string }>();
  // Separate state for API posts and user-created posts
  const [apiPosts, setApiPosts] = useState<Post[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]); // unlimited user posts
  const [posts, setPosts] = useState<Post[]>([]); // for rendering only
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getAllPosts();
  }, []);

  useEffect(() => {
    // Always update userPosts if createdPost param exists
    if (createdPost && !Array.isArray(createdPost)) {
      try {
        let newPost = JSON.parse(createdPost) as Post;
        setUserPosts((prev) => {
          // Assign unique id: max id in apiPosts/userPosts + 1
          const allIds = [...prev, ...apiPosts].map((p) => p.id);
          const nextId = allIds.length > 0 ? Math.max(...allIds) + 1 : 101;
          // Always assign new id, never replace
          return [{ ...newPost, id: nextId }, ...prev];
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [createdPost]);

  // Always update posts for rendering when apiPosts or userPosts changes
  useEffect(() => {
    // Show all user posts on top, then 100 from API
    setPosts([...userPosts, ...apiPosts.slice(0, 100)]);
  }, [userPosts, apiPosts]);

  const getAllPosts = () => {
    setLoading(true);
    setErrorMessage("");

    getPosts()
      .then((res) => {
        if (res.status === 200) {
          // Take 100 posts from API and sort descending by id
          let apiData = Array.isArray(res.data) ? res.data.slice(0, 100) : [];
          apiData = apiData.sort((a, b) => b.id - a.id);
          setApiPosts(apiData);
          // Combine with userPosts (if any)
          setPosts((prev) => {
            return [...userPosts, ...apiData];
          });
          return;
        }

        setErrorMessage("Gagal mengambil data post.");
      })
      .catch((error) => {
        console.log(error);

        // Always update posts for rendering when apiPosts or userPosts changes
        useEffect(() => {
          // Show all user posts on top, then 100 from API
          setPosts([...userPosts, ...apiPosts.slice(0, 100)]);
        }, [userPosts, apiPosts]);
        setErrorMessage("Terjadi error saat mengambil data post.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable
        style={{ padding: 10, backgroundColor: "blue", marginBottom: 10 }}
        onPress={() => router.push("/addPost")}
      >
        <Text style={{ color: "white" }}>Add New Post</Text>
      </Pressable>
      {loading ? <ActivityIndicator size="large" color="blue" /> : null}
      {errorMessage ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{errorMessage}</Text>
      ) : null}
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {posts.map((post) => (
          <Pressable
            key={post.id}
            style={{
              padding: 10,
              borderWidth: 1,
              backgroundColor: userPosts.find((p) => p.id === post.id)
                ? "#e0f7fa"
                : undefined,
            }}
            onPress={() =>
              router.push({
                pathname: "/postDetail",
                params: {
                  id: post.id,
                  userId: post.userId,
                },
              })
            }
          >
            <Text>Post Number: {post.id}</Text>
            <Text>User ID: {post.userId}</Text>
            <Text>Title: {post.title}</Text>
            <Text>Body: {post.body}</Text>
            {userPosts.find((p) => p.id === post.id) && (
              <Text style={{ color: "blue" }}>(Baru ditambah)</Text>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
