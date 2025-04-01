import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user.model';
import { Post } from './models/post.model';
import { Comment } from './models/comment.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  username: string = '';
  user: User | null = null;
  posts: Post[] = [];
  comments: { [key: number]: Comment[] } = {};
  errorMessage: string = '';
  ROOT_URL = 'https://dummyjson.com';

  constructor(private http: HttpClient) {}

  searchUser() {
    this.user = null;
    this.posts = [];
    this.comments = {};
    this.errorMessage = '';

    this.http.get<{ users: User[] }>(`${this.ROOT_URL}/users/filter?key=username&value=${this.username}`).subscribe(
        (response) => {
          if (response.users.length > 0) {
            this.user = response.users[0];
            this.getPost(this.user.id);
          } else {
            this.errorMessage = 'No existe  ';
          }
        }
      );
  }

  getPost(userId: number) {
    this.http.get<{ posts: Post[] }>(`${this.ROOT_URL}/posts/user/${userId}`).subscribe(
      (response) => {
        console.log("Posts", response.posts);
        this.posts = response.posts;
        this.getComment();
      }
    );
  }
  

  getComment() {
    this.posts.forEach((post) => {
      this.http.get<{ comments: Comment[] }>(`${this.ROOT_URL}/comments/post/${post.id}`).subscribe(
        (response) => {
          this.comments[post.id] = response.comments;
        }
      );
    });
  }
}
