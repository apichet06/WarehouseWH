/* eslint-disable @typescript-eslint/no-unused-vars */

import Menu from "../headers/menu";
import Footer from "../footer/footer";

interface CheckApprovalProps {
  api: string;
}

export default function CheckApproval(props: CheckApprovalProps) {
  const { api } = props;
  return (
    <>
      <Menu api={api} />
      <Footer />
    </>
  );
}
