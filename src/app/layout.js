import './globals.css'

export const metadata = {
  title: 'My AI OCR App',
  description: 'An app to extract text from images using OCR and chat with AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
