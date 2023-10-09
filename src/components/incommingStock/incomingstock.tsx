import Menu from "../headers/menu";
import Footer from "../footer/footer";
import IncommingStockTable from "./incomingstockTable";
interface IncomingstockProps {
  api: string;
}

export default function Incomingstock(props: IncomingstockProps) {
  const { api } = props;
  return (
    <>
      <Menu api={api} />
      <IncommingStockTable api={api} />
      <Footer />
    </>
  );
}
