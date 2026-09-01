<Routes>

  <Route
    path="/events"
    element={<EventsPage />}
  />

  <Route
    path="/events/:id"
    element={
      <EventDetailPage />
    }
  />

  <Route
    path="/my-tickets"
    element={
      <MyTicketsPage />
    }
  />

  <Route
    path="/login"
    element={<LoginPage />}
  />

  <Route
    path="/admin/new"
    element={
      <AdminNewEventPage />
    }
  />

</Routes>