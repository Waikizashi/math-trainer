# Browser authentication and CSRF contract

The browser and API share one origin. Sessions use the HttpOnly JSESSIONID cookie,
Secure by default, SameSite=Lax, with the configured 30-minute inactive timeout.
The explicit local dev profile permits HTTP. Session storage remains in the
application process: an application restart requires logging in again. Database
accounts and progress remain persistent. Durable sessions, account verification,
password recovery, global revocation and rate limits belong to later account work.

## Request flow

1. GET `/api/csrf` with credentials. Response: `{ "headerName": "X-CSRF-TOKEN",
   "token": "..." }`, Cache-Control: no-store. This resolves Spring's deferred,
   BREACH-masked token; the underlying token belongs to the server session.
2. Include that header on every POST/PUT/PATCH/DELETE, including register, login
   and logout. Authorization is still enforced independently of CSRF.
3. Successful login invokes ChangeSessionIdAuthenticationStrategy followed by
   CsrfAuthenticationStrategy. A new, separate SecurityContext is explicitly saved
   through the same SecurityContextRepository configured on the filter chain.
   The old session ID and pre-login CSRF token cannot authenticate/mutate.
4. After login, discard the cached token. Acquire a fresh one before the next
   mutation. Successful logout invalidates the session, clears authentication and
   expires the cookie; discard the token and acquire again for another login.
5. An expired session returns 401 for protected reads. An old CSRF token on a write
   returns 403; acquire a new token, then authenticate if the protected write is
   rejected with 401. A failed password attempt does not establish authentication.

The frontend API client restricts requests to relative `/api/` paths and sends
credentials through its own Axios instance. Token acquisition is shared across
concurrent writes. Tokens and account responses are not stored in localStorage.
Authentication-generation checks discard token acquisitions from an older login/
logout lifecycle. The API client clears AuthContext on protected API 401 errors.

## Error/retry contract

| HTTP response | Meaning | Client action |
|---|---|---|
| 403 `{ "error": "csrf_invalid" }` | CSRF filter rejected before controller mutation | Refresh token and retry once; propagate another failure |
| 403 `{ "error": "access_denied" }` | Insufficient permissions | Propagate; do not retry |
| 401 `{ "error": "authentication_required" }` | Protected route needs authentication | Clear browser auth state; do not replay mutation |
| 401 from login | Incorrect credentials | Display login failure; do not retry credentials |
| Network error / 5xx | Outcome may be unknown | Propagate; do not replay mutation |

The retry is specific to the CSRF error code, never a generic 403 retry. Foreign
origins are rejected by CORS and receive no token-reading allowance. Only explicit
configured origins can make credentialed cross-origin requests. No mutation route
is exempted from CSRF to make a client work.

## Verification

SessionHttpTest uses a real random-port Tomcat server and Spring authentication
provider with in-memory test accounts and a mocked account response service. It
checks cookie/ID rotation, old-cookie rejection, token rotation, logout, a real
one-second test-session timeout and fresh login, plus allowed/foreign CORS origins.
MVC tests retain the role/DTO checks with valid tokens and separately test missing/
invalid tokens. Frontend adapter tests exercise token caching, concurrency, renewal,
bounded retry, failure propagation and session-expiry notification.

CI additionally runs the full application with PostgreSQL and Nginx: actual account
registration/login, CSRF-protected progress writes, old token/cookie rejection,
logout/new login, application/database restart and independent dump/restore.
Actual results and tested commits are recorded in implementation-log.

References: [CSRF](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html)
and [authentication persistence/session management](https://docs.spring.io/spring-security/reference/servlet/authentication/session-management.html).
Implementation is compiled and tested against the repository's Spring Security version;
this milestone does not upgrade the dependency baseline.
