import Footer from "../footer/footer"
import Menu from "../headers/menu"
import ApprovedTable from "./approvedTable"

interface Props {
    api: string
}


export default function Approved(porps: Props) {
    const { api } = porps

    return (
        <>
            <Menu api={api} />
            <ApprovedTable api={api} />
            <Footer />
        </>
    )
}