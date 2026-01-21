'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from './components/Toast';
import { API_ENDPOINTS, API_BASE_URL } from './utils/constants';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'USER' | 'ADMIN'>('USER');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:11',message:'handleLogin entry',data:{username,hasPassword:!!password},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    const apiUrl = API_ENDPOINTS.AUTHENTICATE;
    const requestBody = { username, password };
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:15',message:'Before fetch call',data:{apiUrl,requestBody},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    try {
      // #region agent log
      console.log('DEBUG: Attempting fetch to:', apiUrl);
      fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:20',message:'Fetch attempt starting',data:{apiUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:32',message:'Fetch response received',data:{status:response.status,statusText:response.statusText,ok:response.ok,headers:Object.fromEntries(response.headers.entries())},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion

      if (response.ok) {
        const data = await response.json();
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:36',message:'Login successful',data:{responseData:data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        console.log('Login successful:', data);
        console.log('User type from response:', data.userType || data.user_type);
        
        // Check user type from response (case-insensitive comparison)
        // Try multiple possible field names
        const userTypeFromResponse = (
          data.userType || 
          data.user_type || 
          ''
        ).toString().toUpperCase().trim();
        
        console.log('Normalized user type:', userTypeFromResponse);
        console.log('Full response data:', JSON.stringify(data, null, 2));
        
        // Store username, userType, and JWT token in localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('userType', userTypeFromResponse);
        if (data.jwtToken) {
          localStorage.setItem('token', data.jwtToken);
        }
        
        // Redirect based on user type
        if (userTypeFromResponse === 'ADMIN') {
          console.log('User is ADMIN - Redirecting to admin dashboard');
          router.push('/admin-dashboard');
        } else if (userTypeFromResponse === 'USER') {
          console.log('User is USER - Redirecting to user dashboard');
          router.push('/dashboard');
        } else {
          // Fallback: check username if userType is missing (shouldn't happen, but as backup)
          console.warn('User type not found in response, checking username as fallback');
          if (username && username.toLowerCase() === 'admin') {
            console.log('Fallback: Username is admin - Redirecting to admin dashboard');
            localStorage.setItem('userType', 'ADMIN');
            router.push('/admin-dashboard');
          } else {
            console.error('User type not recognized:', userTypeFromResponse, 'Full response:', data);
            showToast(`User type not recognized: ${userTypeFromResponse || 'missing'}. Please contact support.`, 'error');
          }
        }
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:48',message:'Response not ok',data:{status:response.status,statusText:response.statusText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        showToast(errorData.message || 'Login failed', 'error');
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
      fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:52',message:'Fetch error caught',data:errorData,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      // Provide user-friendly error message
      if (error instanceof TypeError && error.message.includes('fetch')) {
        showToast(`Cannot connect to the server. Please ensure the backend server is running on ${API_BASE_URL}`, 'error');
      } else {
        showToast('Error during login. Please try again.', 'error');
      }
      console.error('Error during login:', error);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password || !userType) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    const apiUrl = API_ENDPOINTS.SIGNUP;
    const requestBody = { username, password, userType };
    
    console.log('Sign up request:', { apiUrl, requestBody: { ...requestBody, password: '***' } });

    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:143',message:'Sign up fetch starting',data:{apiUrl,requestBody:{...requestBody,password:'***'}},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:152',message:'Sign up response received',data:{status:response.status,statusText:response.statusText,ok:response.ok,headers:Object.fromEntries(response.headers.entries())},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion

      console.log('Sign up response status:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:156',message:'Sign up successful',data:{responseData:data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        console.log('Sign up successful:', data);
        showToast('Sign up successful! Please login.', 'success');
        setIsSignUp(false);
        setUsername('');
        setPassword('');
      } else {
        let errorMessage = 'Sign up failed';
        try {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:163',message:'Attempting to parse error response as JSON',data:{status:response.status,statusText:response.statusText,contentType:response.headers.get('content-type'),ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion

          // Clone response to read it multiple times if needed
          const responseClone = response.clone();
          const errorData = await response.json();
          
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:165',message:'Error response parsed',data:{errorData,errorDataKeys:Object.keys(errorData),errorDataString:JSON.stringify(errorData),isEmpty:Object.keys(errorData).length===0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion

          console.error('Sign up error response:', errorData);
          
          // Check if errorData is empty object
          if (Object.keys(errorData).length === 0) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:172',message:'Error data is empty object, reading response as text',data:{status:response.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion
            
            const text = await responseClone.text().catch(() => '');
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:175',message:'Error response text from clone',data:{text,textLength:text.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion
            errorMessage = text || `Sign up failed (${response.status} ${response.statusText})`;
          } else {
            errorMessage = errorData.message || errorData.error || `Sign up failed (${response.status})`;
          }
        } catch (parseError) {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:180',message:'Failed to parse error as JSON',data:{parseError:parseError?.message,parseErrorName:parseError?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion

          console.error('Failed to parse error response:', parseError);
          const text = await response.text().catch(() => '');
          
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/9b6fcb71-25ae-47d5-af66-75cb1e69b7a8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/page.tsx:185',message:'Error response as text',data:{text,textLength:text.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion

          console.error('Error response text:', text);
          errorMessage = text || `Sign up failed (${response.status} ${response.statusText})`;
        }
        showToast(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Sign up exception:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        showToast(`Cannot connect to the server. Please ensure the backend server is running on ${API_BASE_URL}`, 'error');
      } else {
        showToast('Error during sign up. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-black mb-2">
            Welcome to Event Booking App
          </h1>
          <p className="text-black">
            {isSignUp ? 'Create a new account' : 'Please sign in to continue'}
          </p>
        </div>

        <div className="mb-6 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`px-4 py-2 rounded-l-lg transition ${
              !isSignUp
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`px-4 py-2 rounded-r-lg transition ${
              isSignUp
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-black mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition text-black"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition text-black"
              required
            />
          </div>

          {isSignUp && (
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-black mb-2">
                User Type
              </label>
              <select
                id="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value as 'USER' | 'ADMIN')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition text-black bg-white"
                required
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
