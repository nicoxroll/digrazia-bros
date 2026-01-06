import { useEffect, useRef } from "react";
import { SmoothContainerScroll } from "../utils/smoothScroll";

export const useSmoothContainerScroll = () => {
  const scrollRef = useRef<SmoothContainerScroll | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    return () => {
      if (scrollRef.current) {
        scrollRef.current.destroy();
        scrollRef.current = null;
      }
    };
  }, []);

  const initScroll = (element: HTMLElement) => {
    if (scrollRef.current) {
      scrollRef.current.destroy();
    }
    containerRef.current = element;
    scrollRef.current = new SmoothContainerScroll(element);
  };

  const scrollTo = (target: number | HTMLElement, options?: any) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(target, options);
    }
  };

  const stop = () => {
    if (scrollRef.current) {
      scrollRef.current.stop();
    }
  };

  const start = () => {
    if (scrollRef.current) {
      scrollRef.current.start();
    }
  };

  return {
    initScroll,
    scrollTo,
    stop,
    start,
    containerRef: containerRef.current,
  };
};
