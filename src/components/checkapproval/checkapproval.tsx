import Menu from "../headers/menu";
import Footer from "../footer/footer";
import CheckApprovalTable from "./checkapprovalTable";

interface CheckApprovalProps {
  api: string;
}

export default function CheckApproval(props: CheckApprovalProps) {
  const { api } = props;
  return (
    <>
      <Menu api={api} />
      <CheckApprovalTable api={api} />
      <Footer />
    </>
  );
}
