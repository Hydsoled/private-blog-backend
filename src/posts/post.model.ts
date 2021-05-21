export class Post {
  constructor(
    public id: string,
    public author: string,
    public title: string,
    public description: string,
    public createdAt: number,
    public updatedAt: number,
    public imageUrl: string,
  ) {
  }
}
