export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  reactions: {likes: number, dislikes: number};
}
  