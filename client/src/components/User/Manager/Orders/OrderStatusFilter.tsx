import React, { useState } from 'react';
import { Checkbox } from 'antd';
import type { MenuProps } from 'antd';

const OrderStatusFilter: React.FC<{ onStatusChange: (statuses: string[]) => void }> = ({ onStatusChange }) => {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const statusOptions = [
    { value: "pending", label: "Chờ xác nhận" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "preparing_goods", label: "Đang chuẩn bị hàng" },
    { value: "shipping", label: "Đang vận chuyển" },
    { value: "delivered", label: "Đã giao hàng" },
    { value: "canceled", label: "Đã hủy" },
  ];

  const handleStatusChange = (checkedValues: string[]) => {
    setSelectedStatuses(checkedValues);
    onStatusChange(checkedValues);
  };

  const handleCheckAll = (e: { target: { checked: boolean } }) => {
    const allValues = statusOptions.map(option => option.value);
    setSelectedStatuses(e.target.checked ? allValues : []);
    onStatusChange(e.target.checked ? allValues : []);
  };

  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <div className="p-2 min-w-[200px]">
          <div className="mb-2 font-medium">Trạng thái đơn hàng</div>
          <div className="border-b pb-2 mb-2">
            <Checkbox 
              onChange={handleCheckAll}
              checked={selectedStatuses.length === statusOptions.length}
              indeterminate={selectedStatuses.length > 0 && selectedStatuses.length < statusOptions.length}
            >
              Tất cả
            </Checkbox>
          </div>
          <Checkbox.Group 
            options={statusOptions.map(status => ({
              label: (
                <div className="checkbox-label-container">
                  <span>{status.label}</span>
                </div>
              ),
              value: status.value
            }))}
            value={selectedStatuses}
            onChange={handleStatusChange}
            className="flex flex-col gap-2"
          />
        </div>
      ),
    }
  ];

  return menuItems;
};

export default OrderStatusFilter;
