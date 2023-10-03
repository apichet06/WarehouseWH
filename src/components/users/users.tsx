import Menu from "../headers/menu";
import Footer from "../footer/footer";
import UsersTable from "./usersTable";
interface Props {
  api: string;
}
export default function Users(props: Props) {
  const { api } = props;
  return (
    <>
      <Menu api={api} />
      <UsersTable api={api} />
      <Footer />
    </>
  );
}
