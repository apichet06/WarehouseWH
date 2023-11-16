/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import axios from 'axios';

export async function fetchData(api: string, setData: Function, setPending: Function, status: string, userId: string) {
    try {
        const response = await axios.get(api + "/InventoryRequestAIP");
        if (response.status === 200) {
            if (status === "พนักงาน") {
                setData(response.data.result
                    .filter((item: any) => item.isApproved === "i" && item.requesterUserId === userId)
                    .map((item: any, index: number) => ({ ...item, AutoID: index + 1 }))

                );
            } else {

                // admin
                setData(response.data.result
                    .filter((item: any) => item.isApproved === "i")
                    .map((item: any, index: number) => ({ ...item, AutoID: index + 1 }))

                );
            }

            setPending(false);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

export async function fetchHistory(api: string, setData: Function, setPending: Function, status: string, userId: string) {
    try {
        const response = await axios.get(api + "/InventoryRequestAIP");
        if (response.status === 200) {
            if (status === "พนักงาน") {
                setData(response.data.result
                    .filter((item: any) => item.isApproved !== "i" && item.requesterUserId === userId)
                    .map((item: any, index: number) => ({ ...item, AutoID: index + 1 }))
                );
            } else {
                setData(response.data.result
                    .filter((item: any) => item.isApproved !== "i")
                    .map((item: any, index: number) => ({ ...item, AutoID: index + 1 }))
                );
            }

            setPending(false);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

export async function fetchPickingGoodsDetails(api: string, requestCode: string, setPickingGoodsDetails: Function, setPendingProduct: Function) {
    try {
        const resonse = await axios.get(api + "/InventoryRequestAIP/Picking_GoodsDetail/" + requestCode);
        if (resonse.status === 200) {
            const newData = resonse.data.result.map((item: any, index: any) => ({
                ...item, AutoID: index + 1
            }))
            setPickingGoodsDetails(newData)
            setPendingProduct(false)
        }
    } catch (e) {
        console.log(e);
    }
}
