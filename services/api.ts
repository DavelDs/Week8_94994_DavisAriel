import axios from "axios";

const DEFAULT_API_URL = "https://jsonplaceholder.typicode.com/";
const baseURL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL;

const api = axios.create({
  baseURL: baseURL.endsWith("/") ? baseURL : `${baseURL}/`,
});

export const getPosts = () => {
  return api.get("posts");
};

export const postData = (data: {
  title: string;
  body: string;
  userId: number;
}) => {
  return api.post("posts", data);
};

export const getPostDetail = (id: number) => {
  return api.get(`posts/${id}`);
};

export const getUserDetail = (id: number) => {
  return api.get(`users/${id}`);
};

export const getCommentsByPost = (postId: number) => {
  return api.get(`posts/${postId}/comments`);
};
