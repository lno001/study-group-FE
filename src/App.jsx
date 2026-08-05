import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GroupList from "./pages/GroupList";
import GroupDetail from "./pages/GroupDetail";
import GroupCreate from "./pages/GroupCreate";
import GroupEdit from "./pages/GroupEdit";
import MyPage from "./pages/MyPage";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/groups/create" element={<GroupCreate />} />
          <Route path="/groups/:groupId/edit" element={<GroupEdit />} />
          <Route path="/groups/:groupId" element={<GroupDetail />} />
          <Route path="/groups" element={<GroupList />} />
          <Route path="/me" element={<MyPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
