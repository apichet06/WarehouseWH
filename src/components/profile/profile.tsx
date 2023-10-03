import Menu from "../headers/menu";
import Footer from "../footer/footer";
import ProfileFrom from "./profileForm";
interface Props {
  api: string;
}
export default function Profile(props: Props) {
  const { api } = props;
  return (
    <>
      <Menu api={api} />
      <ProfileFrom api={api} />
      <Footer />
    </>
  );
}
