import Menu from "../headers/menu"
import Footer from "../footer/footer"
import DivisionForm from "./divisionForm";

interface DivisionProps {
    api: string
}

export default function Division(props: DivisionProps) {
    const { api } = props;
    return (
        <>
            <Menu api={api} />
            <DivisionForm api={api} />
            <Footer />
        </>
    )
}