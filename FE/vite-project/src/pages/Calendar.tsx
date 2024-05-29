import Layout from "@/components/Layout";
import { Outlet } from "react-router-dom";

function Calendar() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default Calendar;
