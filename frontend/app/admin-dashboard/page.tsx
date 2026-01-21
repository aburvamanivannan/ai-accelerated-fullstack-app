'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '../components/Toast';
import { authenticatedFetch } from '../utils/api';
import { API_ENDPOINTS } from '../utils/constants';

export default function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [approvedEvents, setApprovedEvents] = useState<any[]>([]);
  const [rejectedEvents, setRejectedEvents] = useState<any[]>([]);
  const [filteredPendingEvents, setFilteredPendingEvents] = useState<any[]>([]);
  const [filteredApprovedEvents, setFilteredApprovedEvents] = useState<any[]>([]);
  const [filteredRejectedEvents, setFilteredRejectedEvents] = useState<any[]>([]);
  const [username, setUsername] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  useEffect(() => {
    // #region agent log
    console.log('DEBUG: Admin dashboard mounted, checking localStorage');
    fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin-dashboard/page.tsx:16',message:'Admin dashboard useEffect - checking username and userType',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    const storedUsername = localStorage.getItem('username');
    const storedUserType = localStorage.getItem('userType');
    
    // #region agent log
    console.log('DEBUG: Stored username from localStorage:', storedUsername);
    console.log('DEBUG: Stored userType from localStorage:', storedUserType);
    fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin-dashboard/page.tsx:20',message:'Username and userType from localStorage',data:{storedUsername,storedUserType},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    if (!storedUsername) {
      // #region agent log
      console.log('DEBUG: No username found, redirecting to login');
      fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin-dashboard/page.tsx:32',message:'Redirecting to login - no username',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      router.push('/');
      return;
    }
    
    // Check if user is ADMIN (use userType if available, fallback to username check for backward compatibility)
    const isAdmin = storedUserType ? storedUserType.toUpperCase() === 'ADMIN' : storedUsername.toLowerCase() === 'admin';
    
    if (!isAdmin) {
      // #region agent log
      console.log('DEBUG: User is not ADMIN, redirecting to user dashboard');
      fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin-dashboard/page.tsx:23',message:'Redirecting to user dashboard - not admin',data:{storedUsername,storedUserType,isAdmin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      router.push('/dashboard');
      return;
    }
    
    // #region agent log
    console.log('DEBUG: User is ADMIN, setting username state');
    fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin-dashboard/page.tsx:28',message:'Setting username state',data:{storedUsername,storedUserType,isAdmin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    setUsername(storedUsername);
  }, [router]);

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    const isAdmin = storedUserType ? storedUserType.toUpperCase() === 'ADMIN' : username.toLowerCase() === 'admin';
    
    // #region agent log
    console.log('DEBUG: Admin dashboard useEffect triggered', { username, storedUserType, isAdmin });
    fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin-dashboard/page.tsx:29',message:'useEffect triggered',data:{username,storedUserType,isAdmin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    if (username && isAdmin) {
      // #region agent log
      console.log('DEBUG: Calling fetchAllEvents');
      fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin-dashboard/page.tsx:33',message:'About to call fetchAllEvents',data:{username,isAdmin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      fetchAllEvents();
    } else {
      // #region agent log
      console.log('DEBUG: Not calling fetchAllEvents - user is not admin', { username, storedUserType, isAdmin });
      fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin-dashboard/page.tsx:38',message:'Not calling fetchAllEvents - user check failed',data:{username,storedUserType,isAdmin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
    }
  }, [username]);

  const applyFilters = useCallback((eventsToFilter: any[]) => {
    let filtered = eventsToFilter;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.eventName?.toLowerCase().includes(query) ||
        event.requestedUser?.toLowerCase().includes(query) ||
        event.eventDate?.toLowerCase().includes(query) ||
        event.createdDate?.toLowerCase().includes(query) ||
        event.rejectionReason?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery]);

  useEffect(() => {
    // Filter events by status
    const pending = events.filter(e => e.status === 'PENDING');
    const approved = events.filter(e => e.status === 'APPROVED');
    const rejected = events.filter(e => e.status === 'REJECTED');

    setPendingEvents(pending);
    setApprovedEvents(approved);
    setRejectedEvents(rejected);

    // Apply search filter to each category
    if (statusFilter === 'ALL' || statusFilter === 'PENDING') {
      setFilteredPendingEvents(applyFilters(pending));
    } else {
      setFilteredPendingEvents([]);
    }

    if (statusFilter === 'ALL' || statusFilter === 'APPROVED') {
      setFilteredApprovedEvents(applyFilters(approved));
    } else {
      setFilteredApprovedEvents([]);
    }

    if (statusFilter === 'ALL' || statusFilter === 'REJECTED') {
      setFilteredRejectedEvents(applyFilters(rejected));
    } else {
      setFilteredRejectedEvents([]);
    }
  }, [events, searchQuery, statusFilter, applyFilters]);

  // Force LTR direction on textarea when it becomes visible
  useEffect(() => {
    if (selectedEventId && rejectionTextareaRef.current) {
      const textarea = rejectionTextareaRef.current;
      textarea.setAttribute('dir', 'ltr');
      textarea.setAttribute('lang', 'en');
      textarea.style.direction = 'ltr';
      textarea.style.textAlign = 'left';
      textarea.style.unicodeBidi = 'embed';
      
      // Force focus to ensure direction is applied
      setTimeout(() => {
        textarea.focus();
      }, 100);
    }
  }, [selectedEventId]);

  const fetchAllEvents = async () => {
    const apiUrl = API_ENDPOINTS.ADMIN_EVENTS;
    
    // #region agent log
    console.log('DEBUG: Attempting to fetch admin events from:', apiUrl);
    fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin-dashboard/page.tsx:42',message:'Before fetchAllEvents call',data:{apiUrl,username},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin-dashboard/page.tsx:48',message:'Fetch attempt starting',data:{apiUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      const response = await authenticatedFetch(apiUrl, {
        method: 'GET',
      });

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin-dashboard/page.tsx:57',message:'Fetch response received',data:{status:response.status,statusText:response.statusText,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion

      if (response.ok) {
        const data = await response.json();
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin-dashboard/page.tsx:62',message:'Events fetched successfully',data:{eventCount:data.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        setEvents(data);
      } else {
        // #region agent log
        const errorText = await response.text().catch(() => 'Unable to read error');
        fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin-dashboard/page.tsx:68',message:'Response not ok',data:{status:response.status,statusText:response.statusText,errorText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
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
      fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/admin-dashboard/page.tsx:76',message:'Fetch error caught',data:errorData,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.error('Error fetching events:', error);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const handleApprove = async (eventId: number) => {
    if (!username) return;

    try {
      const response = await authenticatedFetch(API_ENDPOINTS.ADMIN_EVENTS_APPROVE(eventId), {
        method: 'POST',
        body: JSON.stringify({
          username,
        }),
      });

      if (response.ok) {
        showToast('Event approved successfully!', 'success');
        fetchAllEvents();
      } else {
        const errorData = await response.json();
        showToast('Failed to approve event: ' + (errorData.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Error approving event:', error);
      showToast('Error approving event. Please try again.', 'error');
    }
  };

  const handleReject = async (eventId: number) => {
    if (!username) return;
    if (!rejectionReason.trim()) {
      showToast('Please provide a rejection reason', 'error');
      return;
    }

    try {
      const response = await authenticatedFetch(API_ENDPOINTS.ADMIN_EVENTS_REJECT(eventId), {
        method: 'POST',
        body: JSON.stringify({
          username,
          rejectionReason,
        }),
      });

      if (response.ok) {
        showToast('Event rejected successfully!', 'success');
        setRejectionReason('');
        setSelectedEventId(null);
        fetchAllEvents();
      } else {
        const errorData = await response.json();
        showToast('Failed to reject event: ' + (errorData.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Error rejecting event:', error);
      showToast('Error rejecting event. Please try again.', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
    localStorage.removeItem('token');
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const rejectionTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleRejectionReasonChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setRejectionReason(value);
    
    // Force LTR direction on the textarea element
    if (rejectionTextareaRef.current) {
      rejectionTextareaRef.current.setAttribute('dir', 'ltr');
      rejectionTextareaRef.current.style.direction = 'ltr';
      rejectionTextareaRef.current.style.textAlign = 'left';
      rejectionTextareaRef.current.setAttribute('lang', 'en');
    }
  }, []);

  const handleCancelReject = useCallback(() => {
    setSelectedEventId(null);
    setRejectionReason('');
  }, []);

  const EventCard = ({ event }: { event: any }) => (
    <div className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition bg-white">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-black mb-2">{event.eventName}</h3>
        <div className="space-y-1 text-sm text-black">
          <p><span className="font-medium">Requested User:</span> {event.requestedUser}</p>
          <p><span className="font-medium">Created Date:</span> {formatDate(event.createdDate)}</p>
          <p><span className="font-medium">Event Date:</span> {formatDate(event.eventDate)}</p>
        </div>
      </div>
      {event.status === 'PENDING' && (
        <div className="mt-3 space-y-2">
          <button
            onClick={() => handleApprove(event.eventId)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Approve
          </button>
          <button
            onClick={() => setSelectedEventId(event.eventId)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Reject
          </button>
          {selectedEventId === event.eventId && (
            <div className="mt-2 space-y-2" dir="ltr" lang="en" style={{ direction: 'ltr', textAlign: 'left' }}>
              <textarea
                ref={rejectionTextareaRef}
                key={`reject-${event.eventId}`}
                value={rejectionReason}
                onChange={handleRejectionReasonChange}
                onFocus={(e) => {
                  e.target.setAttribute('dir', 'ltr');
                  e.target.style.direction = 'ltr';
                  e.target.style.textAlign = 'left';
                  e.target.setAttribute('lang', 'en');
                }}
                placeholder="Enter rejection reason..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-black resize-none"
                style={{ 
                  direction: 'ltr', 
                  textAlign: 'left',
                  unicodeBidi: 'embed',
                  writingMode: 'horizontal-tb',
                  textDirection: 'ltr'
                } as React.CSSProperties}
                dir="ltr"
                lang="en"
                inputMode="text"
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleReject(event.eventId)}
                  className="flex-1 bg-red-700 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Confirm Reject
                </button>
                <button
                  onClick={handleCancelReject}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {event.status === 'REJECTED' && event.rejectionReason && (
        <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
          <span className="font-medium">Rejection Reason:</span> {event.rejectionReason}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
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
              Admin Dashboard
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 bg-white rounded-lg shadow-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-black mb-2">
                Search Events
              </label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by event name, user, date..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none text-black"
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left' }}
              />
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-black mb-2">
                Filter by Status
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none text-black bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Three Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Request Section */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-black mb-4 pb-2 border-b-2 border-yellow-400">
              Pending Request ({filteredPendingEvents.length} / {pendingEvents.length})
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredPendingEvents.length === 0 ? (
                <p className="text-black text-center py-8">
                  {pendingEvents.length === 0 ? 'No pending requests' : 'No matching pending requests'}
                </p>
              ) : (
                filteredPendingEvents.map((event) => (
                  <EventCard key={event.eventId} event={event} />
                ))
              )}
            </div>
          </div>

          {/* Approved Request Section */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-black mb-4 pb-2 border-b-2 border-green-400">
              Approved Request ({filteredApprovedEvents.length} / {approvedEvents.length})
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredApprovedEvents.length === 0 ? (
                <p className="text-black text-center py-8">
                  {approvedEvents.length === 0 ? 'No approved requests' : 'No matching approved requests'}
                </p>
              ) : (
                filteredApprovedEvents.map((event) => (
                  <EventCard key={event.eventId} event={event} />
                ))
              )}
            </div>
          </div>

          {/* Rejected Request Section */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-bold text-black mb-4 pb-2 border-b-2 border-red-400">
              Rejected Request ({filteredRejectedEvents.length} / {rejectedEvents.length})
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredRejectedEvents.length === 0 ? (
                <p className="text-black text-center py-8">
                  {rejectedEvents.length === 0 ? 'No rejected requests' : 'No matching rejected requests'}
                </p>
              ) : (
                filteredRejectedEvents.map((event) => (
                  <EventCard key={event.eventId} event={event} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
