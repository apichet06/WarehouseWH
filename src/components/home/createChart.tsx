/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Container, Row } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect } from "react";
interface ChartProductProps {
    api: string;
}


export default function ChartProduct(props: ChartProductProps) {
    const { api } = props;

    const data = {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [{
            label: 'My First Dataset',
            data: [65, 59, 80],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
            ],
            borderWidth: 1
        }]
    };

    const options = {
        scales: {
            x: {
                type: 'category', // Specify the type as 'category'
                labels: ['Red', 'Blue', 'Yellow'], // Add the labels here as well
            },
            y: {
                beginAtZero: true,
            },
        },
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
                                <Bar data={data} options={options} height="70%" />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}