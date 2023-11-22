import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ChartOptions } from "chart.js/auto";
import ChartDataLabels from 'chartjs-plugin-datalabels';

interface ChartProductProps {
    api: string;
}

const ChartProduct: React.FC<ChartProductProps> = (props) => {
    const { api } = props;

    const initialData = {
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

    const [data, setData] = useState(initialData);

    const options: ChartOptions<"bar"> = {
        scales: {
            x: {
                type: 'category',
                labels: ['Red', 'Blue', 'Yellow'],
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    useEffect(() => {
        ChartJS.register(ChartDataLabels);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate fetching data from the API
                const newData = {
                    labels: ['Green', 'Orange', 'Purple'],
                    datasets: [{
                        label: 'My First Dataset',
                        data: [40, 30, 60],
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

                setData(newData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        // Call the fetchData function
        fetchData();
    }, [api]); // Dependency on the 'api' prop

    return (
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
    );
}

export default ChartProduct;
