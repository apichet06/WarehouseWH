import Menu from "../headers/menu"
import Footer from "../footer/footer"
import DivisionTable from "./divisionTable";

interface DivisionProps {
    api: string
}

export default function Division(props: DivisionProps) {
    const { api } = props;
    return (
        <>
            <Menu api={api} />
            <DivisionTable api={api} />
            <Footer />
        </>
    )
}