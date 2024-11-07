import EventAddOrUpdateForm from "../../pages/admin/events/EventAddOrUpdateForm";
import EventsAdminList from "../../pages/admin/events/EventsAdminList";
import EventProvider from "../../providers/EventProvider";

const LayoutEventAdmin = () => {
  return (
    <EventProvider>
      <div className="grid grid-cols-11 gap-5">
        <EventAddOrUpdateForm />
        <EventsAdminList />
      </div>
    </EventProvider>
  );
};

export default LayoutEventAdmin;
