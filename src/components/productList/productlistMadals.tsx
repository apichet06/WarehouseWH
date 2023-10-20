import { Button, Modal } from "react-bootstrap"

interface Props {
    api: string
    handleClose: () => void
    show: boolean
    showData: {
        productID: string;
    }
}

export default function ProductlistMadals(props: Props) {
    const { api, handleClose, show, showData } = props
    return (
        <>
            {api}
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{showData.productID}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    I will not close if you click outside me. Don not even try to press
                    escape key.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}