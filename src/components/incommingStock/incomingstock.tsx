import Menu from "../headers/menu";
import Footer from "../footer/footer";
interface IncomingstockProps {
  api: string;
}

export default function Incomingstock(props: IncomingstockProps) {
  const { api } = props;
  return (
    <>
      <Menu api={api} />
      <Footer />
    </>
  );
}
