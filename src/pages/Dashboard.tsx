import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import CustomersNew from "./tabs/CustomersNew";
import CustomersList from "./tabs/CustomersList";
import TripRecord from "./tabs/TripRecord";
import TripEdit from "./tabs/TripEdit";
import PendingTrips from "./tabs/PendingTrips";
import ExportTrips from "./tabs/ExportTrips";
import UsersRoles from "./tabs/UsersRoles";
import { RoleGate } from "../components/RoleGate";

export default function Dashboard() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="trips/record" replace />} />

        <Route path="customers/new" element={<RoleGate allow={["admin"]}><CustomersNew /></RoleGate>} />
        <Route path="customers" element={<RoleGate allow={["admin"]}><CustomersList /></RoleGate>} />

        <Route path="trips/record" element={<TripRecord />} />
        <Route path="trips/edit" element={<TripEdit />} />

        <Route path="trips/pending" element={<RoleGate allow={["admin"]}><PendingTrips /></RoleGate>} />
        <Route path="trips/export" element={<RoleGate allow={["admin"]}><ExportTrips /></RoleGate>} />
        <Route path="users" element={<RoleGate allow={["admin"]}><UsersRoles /></RoleGate>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
}
