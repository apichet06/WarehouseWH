
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { formatDate } from "../utility/dateUtils";
import { BsFiletypeDoc, BsFillChatSquareTextFill } from "react-icons/bs";
import ApprovedModals from "./approvedModals";
import { fetchData, fetchPickingGoodsDetails, fetchHistory } from './fetchFuntions.tsx';


interface Props {
    api: string
}

interface InventoryRequest {
    AutoID: number
    id: number
    requestCode: string
    transactionTime: string
    requesterUserId: string
    divisionId: string
    purpose: string
    isApproved: string
    users: {
        firstName: string
        lastName: string
        division: {
            dV_ID: string
            dV_Name: string
        },
    }

    approvedUsers: {
        firstName: string
        lastName: string
        division: {
            dV_ID: '',
            dV_Name: string
        },
    }
}



export default function ApprovedTable(props: Props) {

    const results: any = JSON.parse(localStorage.getItem("resulte") || "{}");


    const { api } = props;

    const filed = {
        requestCode: '',
        transactionTime: '',
        requesterUserId: '',
        divisionId: '',
        purpose: '',
        isApproved: '',
        users: {
            firstName: '',
            lastName: '',
            division: {
                dV_ID: '',
                dV_Name: ''
            },
        },

        approvedUsers: {
            firstName: '',
            lastName: '',
            division: {
                dV_ID: '',
                dV_Name: ''
            },
        }
    }

    const [data, setData] = useState<InventoryRequest[]>([]);
    const [dataHistory, setDataHistory] = useState<InventoryRequest[]>([]);
    const [show, setShow] = useState(false);
    const [dataDetail, setDataDetail] = useState(filed);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [pending, setPending] = useState(true);
    const [pendingProduct, setPendingProduct] = useState(true);
    const [pickingGoodsDetails, setPickingGoodsDetails] = useState([]);
    const [key, setKey] = useState('home');
    const handleSubmit = async (status: string, order: string) => {
        try {
            const Data = {
                IsApproved: status,
                requestCode: order,
            }
            const res = await axios.put(api + "/InventoryRequestAIP/" + results.userID, Data);

            if (res.status === 200) {
                handleClose()
                fetchData(api, setData, setPending, results.status, results.userID);
                fetchHistory(api, setDataHistory, setPending, results.status, results.userID)
            }

        } catch (e) {
            console.log(e);

        }

    }

    useEffect(() => {
        fetchData(api, setData, setPending, results.status, results.userID);
        fetchHistory(api, setDataHistory, setPending, results.status, results.userID)
    }, [api, results.status, results.userID])

    const columns = [
        { name: 'ลำดับ', selector: (row: InventoryRequest) => row.AutoID, sortactive: false, width: '70px' },
        { name: 'รหัสใบเบิก', selector: (row: InventoryRequest) => row.requestCode, sortactive: false, width: '200px' },
        { name: 'ผู้เบิก', selector: (row: InventoryRequest) => row.users.firstName + " " + row.users.lastName, sortactive: false, width: '190px' },
        { name: 'เหตุผล', selector: (row: InventoryRequest) => row.purpose, sortactive: false, width: '200px ' },
        { name: 'วันที่เบิก', selector: (row: InventoryRequest) => formatDate(row.transactionTime), sortactive: false, width: '170px', },
        {
            name: 'Review', cell: (row: InventoryRequest) => (<>
                <Button size="sm" variant="outline-secondary" onClick={() => handleReview(row.id)}> <BsFillChatSquareTextFill /></Button>
            </>),
        },

    ];

    const columnHistory = [
        { name: 'ลำดับ', selector: (row: InventoryRequest) => row.AutoID, sortactive: false, width: '70px' },
        { name: 'รหัสใบเบิก', selector: (row: InventoryRequest) => row.requestCode, sortactive: false, width: '177px' },
        { name: 'ผู้เบิก', selector: (row: InventoryRequest) => row.users.firstName + " " + row.users.lastName, sortactive: false, width: '150px' },
        { name: 'เหตุผล', selector: (row: InventoryRequest) => row.purpose, sortactive: false, width: '180px' },
        { name: 'วันที่เบิก', selector: (row: InventoryRequest) => formatDate(row.transactionTime), sortactive: false, width: '162px', },
        { name: 'Status', selector: (row: InventoryRequest) => row.isApproved == "Y" ? "ผ่าน" : "ไม่ผ่าน", sortactive: false, width: '70px', center: true },
        {
            name: 'ใบเบิก', cell: (row: InventoryRequest) => (<>
                <Button size="sm" variant="outline-secondary" onClick={() => handleHistory(row.id)}> <BsFiletypeDoc /></Button>
            </>), sortactive: false, width: '100px', center: true
        },
    ];

    const handleReview = (id: number) => {

        const row = data.find(r => r.id === id);

        if (row) {
            setDataDetail(row);
            fetchPickingGoodsDetails(api, row.requestCode, setPickingGoodsDetails, setPendingProduct)
        }
        handleShow()
    }

    const handleHistory = (id: number) => {
        const row = dataHistory.find(r => r.id === id);

        if (row) {
            setDataDetail(row);
            fetchPickingGoodsDetails(api, row.requestCode, setPickingGoodsDetails, setPendingProduct)
        }
        handleShow()
    }

    return (
        <>
            <ApprovedModals api={api} handleClose={handleClose} show={show} dataDetail={dataDetail}
                pickingGoodsDetails={pickingGoodsDetails} pendingProduct={pendingProduct} handleSubmit={handleSubmit} />
            <Container>
                <Row className="justify-content-center">
                    <Col md={9} className="mb-3">
                        <Card className="shadow">
                            <Card.Header>รายการรออนุมัติเบิก</Card.Header>
                            <Card.Body>
                                <Tabs
                                    id="controlled-tab-example"
                                    activeKey={key}
                                    onSelect={(k: any) => setKey(k)}
                                    className="mb-3"
                                >
                                    <Tab eventKey="home" title="รออนุมัติ">
                                        <DataTable
                                            columns={columns}
                                            data={data}
                                            progressPending={pending}
                                            pagination
                                        />
                                    </Tab>
                                    <Tab eventKey="profile" title="History">
                                        <DataTable
                                            columns={columnHistory}
                                            data={dataHistory}
                                            progressPending={pending}
                                            pagination
                                        />
                                    </Tab>
                                </Tabs>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )

}