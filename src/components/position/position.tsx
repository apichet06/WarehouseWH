import Menu from "../headers/menu";
import Footer from "../footer/footer";
interface PositioinsProps {
  api: string;
}
export default function Positions(props: PositioinsProps) {
  const { api } = props;
  return (
    <>
      <Menu api={api} />
      <Footer />
    </>
  );
}
