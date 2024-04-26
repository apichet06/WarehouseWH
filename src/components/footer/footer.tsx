import { Col, Stack } from "react-bootstrap";

export default function Footer() {
    return (
        <>
            <Stack className="fixed-bottom d-flex flex-wrap justify-content-between align-items-center py-2 border-top border-3 footer"  >
                <Col>
                    <Stack className="text-center">
                        <span className="mb-3 mb-md-0 text-muted">&copy; 2023 Mr. Apichet Singnakrong</span>
                    </Stack>
                </Col>
            </Stack>
        </>
    )

}
