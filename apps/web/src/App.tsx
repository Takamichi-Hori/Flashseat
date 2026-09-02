import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AdminNewEventPage } from "./pages/AdminNewEventPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import { EventsPage } from "./pages/EventsPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/events" replace />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />
                <Route path="/admin/new" element={<AdminNewEventPage />} />
                <Route path="*" element={<Navigate to="/events" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
