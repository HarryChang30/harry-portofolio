export interface PostMetadata {
    title: string;
    date: string;
    author: string;
    thumbnail?: string;
  }
  
  export interface PostModule {
    default: {
      metadata: PostMetadata;
    };
  }
  