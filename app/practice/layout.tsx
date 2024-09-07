export default function PracticeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#6D8672]">{children}</body>
    </html>
  );
}
