import Menu from "../headers/menu";
import Footer from "../footer/footer";
import ProductTable from "./productTable";
interface Props {
    api: string;
}

export default function ProductType(props: Props) {
    const api = props.api

    return (
        <>
            <Menu api={api} />
            <ProductTable api={api} />
            <Footer />
        </>
    )
}

