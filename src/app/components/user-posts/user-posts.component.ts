import { Component, Input } from '@angular/core';
import { Post } from '../../models/post.model';
import { Comment } from 'src/app/models/comment.model';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css'],
})
export class UserPostsComponent {
  @Input() posts: Post[] = [];
  @Input() comments!: { [key: number]: Comment[] };
}
