export interface Comment {
  id: number;
  postId: number;
  user: { id: number; username: string };
  body: string;
}
