import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store"
import { useCallback } from "react"
import { fetchDashboardAsync } from "../store/dashBoardSlice";
import toast from "react-hot-toast";


export const useDashBoard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { dashboard } = useSelector((state: RootState) => state.dashBoard)

    //fetch dashboard
    const fetchDashBoard = useCallback(
        async (startDate: string, endDate: string) => {
            try {
                return await dispatch(fetchDashboardAsync({ startDate, endDate })).unwrap();
            }
            catch (err: any) {
                toast.error(err || "Failed to fetch total revenue");
                throw err;
            }
        }, [dispatch]
    );

    return {
        //state
        dashboard,

        //action
        fetchDashBoard
    }
}