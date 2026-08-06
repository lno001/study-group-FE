import Footer from "./Footer";
import Header from "./Header";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="layout-main">{children}</main>
      <Footer />
    </div>
  );
}
