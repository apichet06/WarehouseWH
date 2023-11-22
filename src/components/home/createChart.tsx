/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Container, Row } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { ChartData, defaults } from "chart.js/auto";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

interface ChartProductProps {
    api: string;
}

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.color = "black";
interface ProductData {
    productName: string;
    qtyInStock: number;
    qtyMinimumStock: number;
}
export default function ChartProduct(props: ChartProductProps) {
    const { api } = props;

    const [Amount, setAmount] = useState<ProductData[]>([]);
    // const initialData = {
    //     labels: ['Red', 'Blue', 'Yellow'],
    //     datasets: [{
    //         label: 'My First Dataset',
    //         data: [65, 59, 80],
    //         backgroundColor: 'rgba(255, 99, 132, 0.2)',
    //         borderColor: 'rgb(255, 99, 132)',
    //         borderWidth: 1
    //     }]
    // };

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`${api}/productAPI`);
            if (response.status === 200) {

                setAmount(response.data.result);
            }
        } catch (error: any) {
            console.log(error.message);
        }
    }, [api]);

    const data: ChartData<'bar'> = {
        labels: Amount.map((data) => data.productName),
        datasets: [
            {
                label: "จำนวนสินค้าทั้งหมด",
                data: Amount.map((data) => data.qtyInStock),
                borderColor: 'rgb(60, 179, 113)',
                backgroundColor: 'rgba(60, 179, 113, 0.8)',
                borderWidth: 1,
                order: 1,
                type: 'bar',
            },
            {
                label: "MinStock",
                data: Amount.map((data) => data.qtyMinimumStock),
                borderColor: 'rgb(255, 70, 122)',
                backgroundColor: 'rgba(255, 70, 122, 0.8)',
                borderWidth: 2,
                order: 0,
            },
        ],
    };

    // กำหนด options และใช้ ChartJS
    useEffect(() => {
        // ChartJS.register(ChartDataLabels);
        fetchData();

    }, [fetchData,]);


    return (
        <>

            <Container>
                <Row className="justify-content-center">
                    <Col md={12} className="mb-2">
                        <Card className="shadow">
                            <Card.Body>
                                <h2>จำนวนสินค้าทั้งหมด</h2>
                                <Bar data={data} height="70%" />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}