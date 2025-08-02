export const metadata = {
  title: "SaintVisionAI - HACP Patent Platform",
  description: "U.S. Patent No. 10,290,222 - Advanced AI Collaboration",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  )
}
