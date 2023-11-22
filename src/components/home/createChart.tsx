/* eslint-disable @typescript-eslint/no-explicit-any */
import { defaults } from "chart.js/auto";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";

interface ChartProductProps {
    api: string;
}

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.color = "black";

export default function ChartProduct(props: ChartProductProps) {
    const { api } = props;

    return (
        <>

            <Container>
                <Row className="justify-content-center">
                    <Col md={12} className="mb-2">
                        <Card className="shadow">
                            <Card.Body>
                                {api}
                                <h2>จำนวนสินค้าทั้งหมด</h2>
                                <Doughnut
                                    data={{
                                        labels: ['Red', 'Blue', 'Yellow'],
                                        datasets: [
                                            {
                                                label: "Count",
                                                data: [65, 59, 80],
                                                backgroundColor: [
                                                    "rgba(43, 63, 229, 0.8)",
                                                    "rgba(250, 192, 19, 0.8)",
                                                    "rgba(253, 135, 135, 0.8)",
                                                ],
                                                borderColor: [
                                                    "rgba(43, 63, 229, 0.8)",
                                                    "rgba(250, 192, 19, 0.8)",
                                                    "rgba(253, 135, 135, 0.8)",
                                                ],
                                            },
                                        ],
                                    }}
                                    options={{
                                        plugins: {
                                            title: {
                                                text: "Revenue Sources",
                                            },
                                        },
                                    }}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}