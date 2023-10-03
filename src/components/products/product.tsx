import Menu from "../headers/menu";
import Footer from "../footer/footer";
import ProductTable from "./productTable"
interface Props {
  api: string;
}
export default function Products(props: Props) {
  const { api } = props;
  return (
    <>
      <Menu api={api} />
      <ProductTable api={api} />
      <Footer />
    </>
  );
}
