/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Container, Row } from "react-bootstrap";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect } from "react";
interface ChartProductProps {
    api: string;
}

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.color = "black";

export default function ChartProduct(props: ChartProductProps) {
    const { api } = props;

    const initialData = {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [{
            label: 'My First Dataset',
            data: [65, 59, 80],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1
        }]
    };

    useEffect(() => {
        ChartJS.register(ChartDataLabels);

    }, []);
    return (
        <>

            <Container>
                <Row className="justify-content-center">
                    <Col md={12} className="mb-2">
                        <Card className="shadow">
                            <Card.Body>
                                {api}
                                <h2>จำนวนสินค้าทั้งหมด</h2>
                                <Bar data={initialData} height="70%" />
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