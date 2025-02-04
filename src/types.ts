export interface PostMetadata {
  slug: string | Promise<string>;
  content: string | Promise<string>;
}
  
  export interface PostModule {
    default: {
      metadata: PostMetadata;
    };
  }
  