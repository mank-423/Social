declare module 'react-infinite-scroll-component' {
  import { Component } from 'react';
  
  interface InfiniteScrollProps {
    dataLength: number;
    next: () => void;
    hasMore: boolean;
    loader?: React.ReactNode;
    endMessage?: React.ReactNode;
    children?: React.ReactNode;
    scrollableTarget?: string;
    style?: React.CSSProperties;
    className?: string;
  }
  
  class InfiniteScroll extends Component<InfiniteScrollProps> {}
  
  export default InfiniteScroll;
}