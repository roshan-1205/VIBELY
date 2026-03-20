# Vibely Integration Test Guide

## Complete System Validation

This guide validates the fully integrated Vibely system with all features working together.

### Prerequisites

1. **Backend Setup**
```bash
cd VIBELY/backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

2. **Frontend Setup**
```bash
cd VIBELY/frontend
npm install
npm run dev
```

3. **Environment Variables**
- Backend: `.env` with database and JWT settings
- Frontend: `.env` with `VITE_API_BASE_URL=http://localhost:8000/api/v1` and `VITE_WS_URL=ws://localhost:8000/ws`

### Integration Test Checklist

#### ✅ 1. Authentication System
- [ ] Register new user works
- [ ] Login with credentials works
- [ ] JWT tokens are stored in localStorage
- [ ] Automatic token refresh works (test by waiting for token expiry)
- [ ] Logout clears tokens and redirects
- [ ] Protected routes redirect to login when unauthenticated

#### ✅ 2. API Client Integration
- [ ] All API calls include Authorization header
- [ ] 401 responses trigger token refresh
- [ ] Failed refresh triggers logout
- [ ] API errors are properly normalized
- [ ] Loading states work correctly

#### ✅ 3. Feed System
- [ ] Feed loads with pagination
- [ ] Infinite scroll works
- [ ] Skeleton loading states display
- [ ] Error states display properly
- [ ] Feed refreshes on pull-to-refresh

#### ✅ 4. Post Creation
- [ ] Create post form works
- [ ] Post appears in feed immediately (optimistic update)
- [ ] Image upload works (if implemented)
- [ ] Validation errors display
- [ ] Success toast appears

#### ✅ 5. Like System
- [ ] Like button toggles immediately (optimistic update)
- [ ] Like count updates in real-time
- [ ] Unlike works correctly
- [ ] Optimistic updates rollback on error
- [ ] Error toasts appear on failure

#### ✅ 6. WebSocket Real-time Updates
- [ ] WebSocket connects on login
- [ ] WebSocket disconnects on logout
- [ ] Real-time like updates work across browser tabs
- [ ] Connection status indicator works
- [ ] Automatic reconnection works after network issues

#### ✅ 7. Notification System
- [ ] Like notifications are created
- [ ] Real-time notifications appear via WebSocket
- [ ] Browser notifications work (if permission granted)
- [ ] Notification count updates in real-time
- [ ] Mark as read works
- [ ] Mark all as read works
- [ ] Notification deletion works

#### ✅ 8. Error Handling & Toast System
- [ ] Success toasts appear for successful actions
- [ ] Error toasts appear for failed actions
- [ ] Toasts auto-dismiss after timeout
- [ ] Error toasts don't auto-dismiss
- [ ] Toast close button works
- [ ] Multiple toasts stack properly

#### ✅ 9. Performance & Caching
- [ ] React Query caching works (check network tab)
- [ ] Stale-while-revalidate behavior works
- [ ] Background refetching works
- [ ] Cache invalidation works after mutations
- [ ] No unnecessary API calls

#### ✅ 10. Production Readiness
- [ ] No console errors in browser
- [ ] No TypeScript errors
- [ ] No Python errors in backend logs
- [ ] Proper error boundaries catch errors
- [ ] Loading states prevent user confusion
- [ ] Responsive design works on mobile

### Test Scenarios

#### Scenario 1: Complete User Journey
1. Register new account
2. Login with credentials
3. Create a new post
4. Like your own post (should not create notification)
5. Open second browser tab, login as different user
6. Like the first user's post
7. Verify first user receives real-time notification
8. Mark notification as read
9. Create another post from second user
10. Verify real-time feed updates

#### Scenario 2: Network Resilience
1. Login and create posts
2. Disconnect internet
3. Try to like posts (should show error toast)
4. Reconnect internet
5. Verify WebSocket reconnects automatically
6. Verify failed actions can be retried

#### Scenario 3: Token Refresh
1. Login and wait for token to expire (or manually expire it)
2. Make an API call
3. Verify token refresh happens automatically
4. Verify original request succeeds after refresh

### Expected Results

All checkboxes should be ✅ for a fully working system.

### Common Issues & Solutions

1. **CORS Errors**: Ensure backend CORS allows frontend origin
2. **WebSocket Connection Failed**: Check WebSocket URL and JWT token
3. **Token Refresh Loop**: Verify refresh token endpoint and storage
4. **Real-time Updates Not Working**: Check WebSocket event handlers
5. **Notifications Not Appearing**: Verify notification service integration

### Performance Metrics

- Initial page load: < 2 seconds
- API response time: < 500ms
- WebSocket connection time: < 1 second
- Feed scroll performance: 60fps
- Memory usage: Stable (no leaks)

### Browser Compatibility

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

### Production Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Redis configured (if using)
- [ ] WebSocket proxy configured
- [ ] HTTPS certificates installed
- [ ] CDN configured for static assets
- [ ] Error monitoring configured
- [ ] Performance monitoring configured