import AddOrUpdateSupplier from "./AddOrUpdateSupplier"
import ListSuppliers from "./ListSuppliers"


const SuppliersAdmin = () => {
  return (
    <div className="grid grid-cols-12 gap-5">
        <AddOrUpdateSupplier />
        <ListSuppliers />
    </div>
  )
}

export default SuppliersAdmin