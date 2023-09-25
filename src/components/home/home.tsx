import Menu from "../headers/menu";
import Footer from "../footer/footer";
interface HomeProps {
  api: string;
}
export default function Home(props: HomeProps) {
  const { api } = props;
  return (
    <>
      <Menu api={api} />
      <Footer />
    </>
  );
}
