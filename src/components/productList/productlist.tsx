import ProductlistForm from "./productlistForm";
import Menu from "../headers/menu";
import Footer from "../footer/footer";
interface Props {
    api: string;
}

export default function ProductList(props: Props) {
    const { api } = props

    return (
        <>
            <Menu api={api} />
            <ProductlistForm api={api} />
            <Footer />
        </>)


}