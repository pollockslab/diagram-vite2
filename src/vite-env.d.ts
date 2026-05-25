/// <reference types="vite/client" />

declare module '*.png';
declare module '*.jpg';
declare module '*?worker' {
  const workerConstructor: { new (): Worker };
  export default workerConstructor;
}