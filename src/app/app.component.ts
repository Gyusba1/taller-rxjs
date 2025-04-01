import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user.model';
import { Post } from './models/post.model';
import { Comment } from './models/comment.model';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

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

    this.http
      .get<{ users: User[] }>(`${this.ROOT_URL}/users/filter?key=username&value=${this.username}`)
      .pipe(
        switchMap((response) => {
          if (response.users.length > 0) {
            this.user = response.users[0];
            return this.getPosts(this.user.id);
          } else {
            this.errorMessage = 'No existe';
            return of([]); // Return an empty array if no user is found
          }
        }),
        catchError((error) => {
          this.errorMessage = 'An error occurred while fetching user data.';
          return of([]); // Handle errors gracefully
        })
      )
      .subscribe((posts) => {
        this.posts = posts;
        if (posts.length > 0) {
          this.getCommentsForPosts(posts);
        }
      });
  }

  getPosts(userId: number) {
    return this.http
      .get<{ posts: Post[] }>(`${this.ROOT_URL}/posts/user/${userId}`)
      .pipe(map((response) => response.posts));
  }

  getCommentsForPosts(posts: Post[]) {
    const commentRequests = posts.map((post) =>
      this.http
        .get<{ comments: Comment[] }>(`${this.ROOT_URL}/comments/post/${post.id}`)
        .pipe(map((response) => ({ postId: post.id, comments: response.comments })))
    );

    forkJoin(commentRequests).subscribe((commentsData) => {
      commentsData.forEach((data) => {
        this.comments[data.postId] = data.comments;
      });
    });
  }
}
