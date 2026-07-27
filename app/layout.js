export const metadata = {
  title: 'LINGO//PRIME - Multi-Language HUD',
  description: 'Lohas Care Translate LM',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-HK">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#080B11' }}>
        {children}
      </body>
    </html>
  );
}
