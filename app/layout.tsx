
import "./../styles/globals.css";
import Header from "@/components/Header";

export const metadata = { title: "PontoFito", description: "Registro de ponto COFFITO" };

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="pt-BR">
      <body>
        <Header signedIn={false} />
        <div className="container">
          {children}
        </div>
        <footer className="footer">PontoFito • COFFITO</footer>
      </body>
    </html>
  );
}
