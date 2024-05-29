import Layout from "@/components/Layout";
import { Outlet } from "react-router-dom";

function Home() {
  return (
    <Layout>
      <Outlet/>
    </Layout>
  );
}

export default Home;