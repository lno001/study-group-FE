import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 960,
          margin: "0 auto",
          padding: 24,
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
