import Menu from "../headers/menu";
import Footer from "../footer/footer";
import PositionTable from "./positionTable";
interface PositioinsProps {
  api: string;
}
export default function Positions(props: PositioinsProps) {
  const { api } = props;
  return (
    <>
      <Menu api={api} />
      <PositionTable api={api} />
      <Footer />
    </>
  );
}
