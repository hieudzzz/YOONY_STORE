import VoucherProvider from "../../contexts/VouchersContext"
import VouchersAdmin from "../../pages/admin/vouchers/VouchersAdmin"

const LayoutVoucherAdmin=()=>{
    return (
        <VoucherProvider>
            <VouchersAdmin />
        </VoucherProvider>
    )
}

export default LayoutVoucherAdmin