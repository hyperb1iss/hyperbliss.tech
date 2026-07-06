// app/types/global.d.ts

declare module '*.jpg' {
  const image: import('next/image').StaticImageData
  export default image
}

interface Window {
  hyperbliss: {
    activate: () => string
  }
}
