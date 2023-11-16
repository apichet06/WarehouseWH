/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Col, Container, Dropdown, DropdownButton, Modal, Row, Table } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { formatDate } from "../utility/dateUtils";
import { customStyles } from "./customStyles";
interface Props {
    api: string
    show: boolean
    handleClose: () => void
    dataDetail: {
        requestCode: string,
        transactionTime: string,
        requesterUserId: string,
        divisionId: string,
        purpose: string,
        isApproved: string
        users: {
            firstName: string,
            lastName: string,
            division: {
                dV_ID: string
                dV_Name: string
            },
        },

        approvedUsers: {
            firstName: string,
            lastName: string,
            division: {
                dV_ID: string
                dV_Name: string
            },
        }
    }
    pickingGoodsDetails: any
    pendingProduct: boolean
    handleSubmit: (status: string, order: string) => void
}
interface Picking_GoodsDetail {
    id: number
    AutoID: number
    picking_goodsID: string
    productID: string
    qtyWithdrawn: number
    unitPrice: number
    firstName: string
    lastName: string
    product: {
        productID: string
        productName: string
        productType: {
            typeName: string
        }

    }

}

export default function ApprovedModals(props: Props) {
    const results: any = JSON.parse(localStorage.getItem("resulte") || "{}");
    const { show, handleClose, dataDetail, pickingGoodsDetails, pendingProduct, handleSubmit } = props;

    const columns = [
        { name: "ลำดับ", selector: (row: Picking_GoodsDetail) => row.AutoID, sortable: false, width: "70px" },
        { name: "รหัสสินค้า", selector: (row: Picking_GoodsDetail) => row.product.productID, sortable: false, width: "150px" },
        { name: "ชื่อสินค้า", selector: (row: Picking_GoodsDetail) => row.product.productName, sortable: false, width: "200px" },
        { name: "ประเภทสินค้า", selector: (row: Picking_GoodsDetail) => row.product.productType.typeName, sortable: false, width: "200px" },
        { name: "จำนวน", selector: (row: Picking_GoodsDetail) => row.qtyWithdrawn, sortable: false, width: "90px", center: true },
        { name: "ราคาต่อหน่วย", selector: (row: Picking_GoodsDetail) => row.unitPrice.toLocaleString(), sortable: false, width: "110px", right: true },
        { name: "ราคาต่อหน่วยรวม", selector: (row: Picking_GoodsDetail) => (row.qtyWithdrawn * row.unitPrice).toLocaleString(), sortable: false, width: "140px", right: true },
    ];


    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                size="xl"
            >
                <Modal.Header  >
                    <Modal.Title>{dataDetail.requestCode}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row className="justify-content-end" >
                            <Col md={5}>
                                <Table striped bordered hover size="sm" className="mb-1">
                                    <thead>
                                        <tr>
                                            <td> เลขที่เอกสาร</td>
                                            <td>{dataDetail.requestCode}</td>
                                        </tr>
                                        <tr>
                                            <td>วันที่เอกสาร</td>
                                            <td>{formatDate(dataDetail.transactionTime)}</td>
                                        </tr>
                                    </thead>
                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={7}>
                                <Table bordered hover size="sm" className="mb-1">
                                    <thead>
                                        <tr>
                                            <td>ผู้เบิก</td>
                                            <td>{dataDetail.divisionId}</td>
                                            <td> {"คุณ" + dataDetail.users.firstName + " " + dataDetail.users.lastName}</td>

                                        </tr>
                                        <tr>
                                            <td>เหตุผล</td>
                                            <td colSpan={2}>{dataDetail.purpose}</td>
                                        </tr>
                                    </thead>
                                </Table>
                            </Col>
                            <Col md={5}>
                                <Table striped bordered hover size="sm" className="mb-1">
                                    <thead>
                                        <tr>
                                            <td width={100}>ผู้อนุมัติ</td>
                                            <td colSpan={3}>{dataDetail.approvedUsers.firstName ? (dataDetail.approvedUsers.firstName + " " + dataDetail.approvedUsers.lastName) : "-"}</td>
                                        </tr>
                                        <tr>
                                            <td>รหัสแผนก</td>
                                            <td>{dataDetail.approvedUsers.firstName ? dataDetail.approvedUsers.division.dV_ID : "-"}</td>
                                            <td>{dataDetail.approvedUsers.firstName ? dataDetail.approvedUsers.division.dV_Name : "-"}</td>
                                            <td>{dataDetail.approvedUsers.firstName ? dataDetail.isApproved == "N" ? "ไม่ผ่าน" : "ผ่าน" : "-"}</td>
                                        </tr>
                                    </thead>
                                </Table>
                            </Col>
                            <Col md={12}>
                                <DataTable
                                    columns={columns}
                                    data={pickingGoodsDetails}
                                    progressPending={pendingProduct}
                                    customStyles={customStyles}
                                    dense
                                />
                            </Col>
                        </Row>
                    </Container>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" size="sm" onClick={handleClose}>
                        Close
                    </Button>
                    {!dataDetail.approvedUsers.firstName && results.status !== "พนักงาน" ? <DropdownButton variant="success" title="เลือก" size="sm">
                        <Dropdown.Item href="" onClick={() => handleSubmit("Y", dataDetail.requestCode)}>อนุมัติ</Dropdown.Item>
                        <Dropdown.Item href="" onClick={() => handleSubmit("N", dataDetail.requestCode)}>ไม่อนุมัติ</Dropdown.Item>
                    </DropdownButton> : ""}
                </Modal.Footer>
            </Modal >
        </>
    )
}
