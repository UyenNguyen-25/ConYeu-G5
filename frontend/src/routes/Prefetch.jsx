/* eslint-disable react-hooks/exhaustive-deps */
import { useGetOrdersQuery } from '@/redux/features/orders/ordersApiSlice';
import { useEffect } from 'react';
import { toast } from 'sonner';

const Prefetch = ({ children }) => {
    const status = "pending"
    const { data: orders } = useGetOrdersQuery({
        phoneNumber: "",
        status: status,
        from: "",
        to: ""
    },
        {
            refetchOnFocus: true,
            refetchOnReconnect: true,
        })

    useEffect(() => {
        if (orders?.length > 0) {
            toast.warning(`${orders?.length} orders is pending`, { duration: 5000 })
        }
    }, [orders])

    return children
}
export default Prefetch