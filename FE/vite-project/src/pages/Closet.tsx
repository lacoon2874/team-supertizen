import Layout from "@/components/Layout";
import { Outlet } from "react-router-dom";

function Closet() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default Closet;
// ${(props) => props.theme.colors.pointcolor};
