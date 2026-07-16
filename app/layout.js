import "./globals.css";

export const metadata = {
  title: "Y.W.C.関東case | 案件管理",
  description: "BPO業務向け案件管理システム",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <div className="mx-auto min-h-screen max-w-[480px] bg-inkbg">{children}</div>
      </body>
    </html>
  );
}
