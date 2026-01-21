'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '../components/Toast';
import { authenticatedFetch } from '../utils/api';
import { API_ENDPOINTS } from '../utils/constants';

export default function UserDashboard() {
  const router = useRouter();
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [username, setUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  useEffect(() => {
    // Get username and userType from localStorage
    const storedUsername = localStorage.getItem('username');
    const storedUserType = localStorage.getItem('userType');
    
    if (!storedUsername) {
      // If no username, redirect to login
      router.push('/');
      return;
    }
    
    // If user is ADMIN, redirect to admin dashboard
    const isAdmin = storedUserType ? storedUserType.toUpperCase() === 'ADMIN' : storedUsername.toLowerCase() === 'admin';
    if (isAdmin) {
      router.push('/admin-dashboard');
      return;
    }
    
    setUsername(storedUsername);
  }, [router]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username) {
      showToast('Username not found. Please login again.', 'error');
      return;
    }
    
    try {
      const response = await authenticatedFetch(API_ENDPOINTS.EVENTS, {
        method: 'POST',
        body: JSON.stringify({
          eventName,
          eventDate,
          username,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Event created:', data);
        // Refresh event list
        fetchEvents();
        // Reset form
        setEventName('');
        setEventDate('');
        showToast('Event created successfully!', 'success');
      } else {
        const errorData = await response.json();
        console.error('Failed to create event:', errorData);
        showToast('Failed to create event: ' + (errorData.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      showToast('Error creating event. Please try again.', 'error');
    }
  };

  const fetchEvents = async () => {
    if (!username) {
      // #region agent log
      console.log('DEBUG: fetchEvents skipped - no username');
      fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/page.tsx:68',message:'fetchEvents skipped - no username',data:{username},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      return;
    }
    
    const apiUrl = `${API_ENDPOINTS.EVENTS_MINE}?username=${encodeURIComponent(username)}`;
    
    // #region agent log
    console.log('DEBUG: Attempting to fetch events from:', apiUrl);
    fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/page.tsx:72',message:'Before fetchEvents call',data:{apiUrl,username},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/page.tsx:78',message:'Fetch attempt starting',data:{apiUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      const response = await authenticatedFetch(apiUrl, {
        method: 'GET',
      });

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/page.tsx:87',message:'Fetch response received',data:{status:response.status,statusText:response.statusText,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion

      if (response.ok) {
        const data = await response.json();
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/page.tsx:92',message:'Events fetched successfully',data:{eventCount:data.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        setEvents(data);
        applyFilters(data);
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/page.tsx:97',message:'Response not ok',data:{status:response.status,statusText:response.statusText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        console.error('Failed to fetch events');
      }
    } catch (error) {
      // #region agent log
      const errorData = {
        errorName: error?.name || 'Unknown',
        errorMessage: error?.message || String(error),
        errorStack: error?.stack || 'No stack trace',
        errorType: error instanceof TypeError ? 'TypeError' : error instanceof Error ? 'Error' : 'Unknown',
        isNetworkError: error?.message?.includes('fetch') || error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')
      };
      console.log('DEBUG: Fetch error details:', errorData);
      fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/dashboard/page.tsx:102',message:'Fetch error caught',data:errorData,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.error('Error fetching events:', error);
    }
  };

  const applyFilters = (eventsToFilter: any[]) => {
    let filtered = eventsToFilter;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.eventName.toLowerCase().includes(query) ||
        event.eventDate.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    setFilteredEvents(filtered);
  };

  useEffect(() => {
    applyFilters(events);
  }, [searchQuery, statusFilter, events]);

  useEffect(() => {
    if (username) {
      fetchEvents();
    }
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">
              Welcome, {username}!
            </h1>
            <p className="text-black">
              User Dashboard
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Event Section */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-black mb-6">
              Create Event
            </h2>
            <form onSubmit={handleCreateEvent} className="space-y-6">
              <div>
                <label htmlFor="eventName" className="block text-sm font-medium text-black mb-2">
                  Event Name
                </label>
                <input
                  id="eventName"
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Enter event name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-black"
                />
              </div>

              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-black mb-2">
                  Event Date
                </label>
                <input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-black"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                Create Event
              </button>
            </form>
          </div>

          {/* Event Transaction History Section */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-black mb-6">
              Event Transaction History
            </h2>
            
            {/* Search and Filter Controls */}
            <div className="mb-6 space-y-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-black mb-2">
                  Search Events
                </label>
                <input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by event name or date..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-black"
                />
              </div>
              
              <div>
                <label htmlFor="statusFilter" className="block text-sm font-medium text-black mb-2">
                  Filter by Status
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-black"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {events.length === 0 ? (
                <p className="text-black text-center py-8">
                  No events found. Create your first event!
                </p>
              ) : filteredEvents.length === 0 ? (
                <p className="text-black text-center py-8">
                  No events match your search/filter criteria.
                </p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.eventId}
                      className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-black">
                          {event.eventName}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            event.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : event.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <p className="text-sm text-black mb-1">
                        <span className="font-medium">Date:</span> {event.eventDate}
                      </p>
                      <p className="text-sm text-black mb-1">
                        <span className="font-medium">Created:</span>{' '}
                        {event.createdDate
                          ? new Date(event.createdDate).toLocaleDateString()
                          : 'N/A'}
                      </p>
                      {event.decisionDate && (
                        <p className="text-sm text-black mb-1">
                          <span className="font-medium">Decision Date:</span>{' '}
                          {new Date(event.decisionDate).toLocaleDateString()}
                        </p>
                      )}
                      {event.rejectionReason && (
                        <p className="text-sm text-red-600 mt-2">
                          <span className="font-medium">Reason:</span>{' '}
                          {event.rejectionReason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {events.length > 0 && (
              <div className="mt-4 text-sm text-black">
                Showing {filteredEvents.length} of {events.length} events
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
