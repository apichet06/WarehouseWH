import Menu from "../headers/menu";
import Footer from "../footer/footer";
interface OutgoingstocksProps {
  api: string;
}
export default function Outgoingstock(props: OutgoingstocksProps) {
  const { api } = props;

  return (
    <>
      <Menu api={api} />
      <Footer />
    </>
  );
}
