/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bar } from "react-chartjs-2";
import { Card, Col, Container, Row } from "react-bootstrap";
import { ChartData, ChartOptions } from "chart.js/auto";
// import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from "axios";
import { useCallback, useEffect, useState } from "react";


interface ProductData {
    productName: string;
    qtyInStock: number;
    qtyMinimumStock: number;
}

interface Incoming {
    qtyReceived: number
    product: {
        productName: string;
    }
}

interface Packing {
    qtyWithdrawn: number,
    product: {
        productName: string;
    }

}

interface ChartProductProps {
    api: string;
}

export default function ChartProduct(props: ChartProductProps) {
    const { api } = props;
    const [Amount, setAmount] = useState<ProductData[]>([]);
    const [countIncom, setCountIncom] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [AmountPacking, setAmountPacking] = useState<Packing[]>([]);

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

    const fetchIncomingData = useCallback(async () => {
        try {
            const response = await axios.get<{ result: Incoming[] }>(`${api}/IncomingStockAPI`);
            if (response.status === 200) {
                const incomingData: Incoming[] = response.data.result;

                const groupedData = incomingData.reduce((acc, data) => {
                    const productName = data.product.productName;
                    const qtyReceived = data.qtyReceived;

                    if (!acc[productName]) {
                        acc[productName] = 0;
                    }

                    acc[productName] += qtyReceived;

                    return acc;
                }, {} as Record<string, number>);

                const labels = Object.keys(groupedData);
                const dataValues = Object.values(groupedData);

                setLabels(labels);
                setCountIncom(dataValues);
            }
        } catch (error) {
            console.log((error as Error).message);
        }
    }, [api]);

    const fetchPickings = useCallback(async () => {
        try {
            const response = await axios.get(`${api}/Picking_goodsDetailAPI/Chart`);
            if (response.status === 200) {
                const approvedItems = response.data.result.filter((d: any) => d.isApproved === 'Y');
                setAmountPacking(approvedItems);
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

    const dataIncom: ChartData<'bar'> = {
        labels: labels,
        datasets: [
            {
                label: "จำนวนสินค้านำเข้า",
                data: countIncom,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.9)',
                borderWidth: 2,
                order: 1
            },

        ],
    };
    const datapackin: ChartData<'bar'> = {
        labels: AmountPacking.map((data) => data.product.productName),
        datasets: [
            {
                label: 'จำนวนสินค้านำเข้า',
                data: AmountPacking.map((data) => data.qtyWithdrawn),
                borderColor: 'rgb(255, 70, 122)',
                backgroundColor: 'rgba(255, 70, 122, 0.8)',
                borderWidth: 1,
                order: 1,
            },
        ],
    };

    const options: ChartOptions<"bar"> = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                display: true,
            },
        },
    };

    // กำหนด options และใช้ ChartJS
    useEffect(() => {
        // ChartJS.register(ChartDataLabels);
        fetchData();
        fetchIncomingData();
        fetchPickings();
    }, [fetchData, fetchIncomingData, fetchPickings]);

    return (
        <>
            {api}
            <Container>
                <Row className="justify-content-center">
                    <Col md={12} className="mb-2">
                        <Card className="shadow">
                            <Card.Body>
                                <h2>จำนวนสินค้าทั้งหมด</h2>
                                <Bar data={data} options={options} height="70%" />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} className="mb-2">
                        <Card className="shadow">
                            <Card.Body>
                                <h2>จำนวนสินค้านำเข้า</h2>
                                <Bar data={dataIncom} options={options} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} className="mb-2">
                        <Card className="shadow">
                            <Card.Body>
                                <h2>จำนวนสินค้าถูกเบิก</h2>
                                <Bar data={datapackin} options={options} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}