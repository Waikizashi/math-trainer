package com.stuba.mathtrainerapi;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stuba.mathtrainerapi.api.dto.UserResponse;
import com.stuba.mathtrainerapi.api.service.UserService;
import com.stuba.mathtrainerapi.configuration.SecurityConfig;
import com.stuba.mathtrainerapi.controller.AuthController;
import com.stuba.mathtrainerapi.controller.CsrfController;
import org.apache.catalina.Context;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.web.embedded.tomcat.TomcatWebServer;
import org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/** Real socket, Tomcat cookie/session and Spring authentication-provider checks; no mocked filter chain. */
@SpringBootTest(classes = SessionHttpTest.TestApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {"server.servlet.session.cookie.secure=false", "app.cors.allowed-origins=http://localhost:3000"})
class SessionHttpTest {
    private static final String LOGIN = "{\"username\":\"alice\",\"password\":\"isolated-account-password\"}";
    @LocalServerPort int port;
    @Autowired ObjectMapper json;
    @Autowired UserService users;
    @Autowired ServletWebServerApplicationContext application;

    @Configuration(proxyBeanMethods = false)
    @EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class, HibernateJpaAutoConfiguration.class,
            FlywayAutoConfiguration.class})
    @Import({SecurityConfig.class, AuthController.class, CsrfController.class})
    static class TestApplication {
        @Bean UserService users() { return mock(UserService.class); }
        @Bean UserDetailsService testAccounts(PasswordEncoder encoder) {
            return new InMemoryUserDetailsManager(User.withUsername("alice")
                    .password(encoder.encode("isolated-account-password")).roles("USER").build());
        }
    }

    @BeforeEach void fixture() {
        reset(users);
        UserResponse alice = new UserResponse(); alice.setId(1L); alice.setUsername("alice");
        alice.setEmail("alice@example.com"); alice.setRole("USER");
        when(users.findByUsername("alice")).thenReturn(Optional.of(alice));
        when(users.isUserUnique("alice", "alice@example.com")).thenReturn(true);
        when(users.registerUser(any())).thenReturn(alice);
    }

    @Test void loginRotatesSessionAndCsrfLogoutInvalidatesBothAndFreshLoginWorks() throws Exception {
        Browser browser = new Browser();
        HttpResponse<String> guest = browser.send("GET", "/api/current/user", null, null);
        assertEquals(401, guest.statusCode());
        assertTrue(guest.headers().allValues("Set-Cookie").isEmpty(), "A guest read should not create a session");
        assertEquals(403, browser.send("POST", "/api/register", "{}", null).statusCode());
        verify(users, never()).registerUser(any());
        String beforeLoginToken = browser.csrf();
        String anonymousSession = browser.sessionId();
        assertTrue(browser.cookies.getCookieStore().getCookies().stream().anyMatch(c -> c.isHttpOnly()));

        assertEquals(201, browser.send("POST", "/api/register",
                "{\"username\":\"alice\",\"email\":\"alice@example.com\",\"password\":\"isolated-account-password\"}",
                beforeLoginToken).statusCode());
        assertEquals(200, browser.send("POST", "/api/login", LOGIN, beforeLoginToken).statusCode());
        String authenticatedSession = browser.sessionId();
        assertNotEquals(anonymousSession, authenticatedSession);
        assertEquals(401, withCookie(anonymousSession, "/api/current/user").statusCode(), "Old cookie must not authenticate");
        assertEquals(200, browser.send("GET", "/api/current/user", null, null).statusCode());
        HttpResponse<String> stale = browser.send("POST", "/api/login", LOGIN, beforeLoginToken);
        assertEquals(403, stale.statusCode());
        assertEquals("csrf_invalid", json.readTree(stale.body()).get("error").asText());
        String token = browser.csrf();
        assertEquals(403, browser.send("POST", "/api/logout", null, "wrong-token").statusCode());
        assertEquals(403, browser.send("POST", "/api/logout", null, null).statusCode());
        assertEquals(403, browser.send("GET", "/api/logout", null, null).statusCode());
        assertEquals(200, browser.send("GET", "/api/current/user", null, null).statusCode());
        HttpResponse<String> logout = browser.send("POST", "/api/logout", null, token);
        assertEquals(200, logout.statusCode());
        assertTrue(logout.headers().allValues("Set-Cookie").stream().anyMatch(s -> s.contains("Max-Age=0")));
        assertEquals(401, withCookie(authenticatedSession, "/api/current/user").statusCode());
        assertEquals(401, browser.send("GET", "/api/current/user", null, null).statusCode());
        assertEquals(403, browser.send("POST", "/api/login", LOGIN, token).statusCode());
        String fresh = browser.csrf();
        assertEquals(401, browser.send("POST", "/api/login", LOGIN.replace("isolated-account-password", "wrong-password"), fresh).statusCode());
        assertEquals(401, browser.send("GET", "/api/current/user", null, null).statusCode());
        assertEquals(200, browser.send("POST", "/api/login", LOGIN, fresh).statusCode());
        assertEquals(200, browser.send("GET", "/api/current/user", null, null).statusCode());
        assertEquals(200, browser.send("POST", "/api/logout", null, browser.csrf()).statusCode());
    }

    @Test void sessionTimeoutRejectsOldTokenAndAllowsANewLogin() throws Exception {
        Browser browser = new Browser();
        assertEquals(200, browser.send("POST", "/api/login", LOGIN, browser.csrf()).statusCode());
        String staleToken = browser.csrf();
        String oldSession = browser.sessionId();
        TomcatWebServer server = (TomcatWebServer) application.getWebServer();
        Context context = (Context) server.getTomcat().getHost().findChildren()[0];
        // Set a one-second lifetime on this test's session, avoiding a production timeout/config change.
        context.getManager().findSession(oldSession).setMaxInactiveInterval(1);
        Thread.sleep(2100);
        assertEquals(401, browser.send("GET", "/api/current/user", null, null).statusCode());
        assertEquals(403, browser.send("POST", "/api/login", LOGIN, staleToken).statusCode());
        String fresh = browser.csrf();
        assertNotEquals(oldSession, browser.sessionId());
        assertEquals(200, browser.send("POST", "/api/login", LOGIN, fresh).statusCode());
        assertEquals(200, browser.send("GET", "/api/current/user", null, null).statusCode());
    }

    @Test void configuredCorsOriginIsAllowedAndForeignOriginCannotReadTokensOrSubmit() throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        for (String origin : new String[]{"http://localhost:3000", "https://untrusted.example"}) {
            HttpResponse<String> response = client.send(HttpRequest.newBuilder(uri("/api/login"))
                    .header("Origin", origin).header("Access-Control-Request-Method", "POST")
                    .header("Access-Control-Request-Headers", "Content-Type,X-CSRF-TOKEN")
                    .method("OPTIONS", HttpRequest.BodyPublishers.noBody()).build(), HttpResponse.BodyHandlers.ofString());
            assertEquals(origin.startsWith("http://localhost") ? 200 : 403, response.statusCode());
            if (response.statusCode() == 200) {
                assertEquals(origin, response.headers().firstValue("Access-Control-Allow-Origin").orElseThrow());
                assertEquals("true", response.headers().firstValue("Access-Control-Allow-Credentials").orElseThrow());
            } else assertTrue(response.headers().firstValue("Access-Control-Allow-Origin").isEmpty());
        }
        Browser browser = new Browser();
        String token = browser.csrf();
        for (String path : new String[]{"/api/csrf", "/api/login"}) {
            HttpRequest.Builder request = HttpRequest.newBuilder(uri(path)).header("Origin", "https://untrusted.example");
            if (path.endsWith("login")) request.header("Content-Type", "application/json").header("X-CSRF-TOKEN", token)
                    .POST(HttpRequest.BodyPublishers.ofString(LOGIN));
            HttpResponse<String> response = browser.client.send(request.build(), HttpResponse.BodyHandlers.ofString());
            assertEquals(403, response.statusCode());
            assertTrue(response.headers().firstValue("Access-Control-Allow-Origin").isEmpty());
        }
        assertEquals(401, browser.send("GET", "/api/current/user", null, null).statusCode());
    }

    private URI uri(String path) { return URI.create("http://127.0.0.1:" + port + path); }
    private HttpResponse<String> withCookie(String sessionId, String path) throws Exception {
        return HttpClient.newHttpClient().send(HttpRequest.newBuilder(uri(path)).header("Cookie", "JSESSIONID=" + sessionId)
                .build(), HttpResponse.BodyHandlers.ofString());
    }
    private class Browser {
        final CookieManager cookies = new CookieManager(null, CookiePolicy.ACCEPT_ALL);
        final HttpClient client = HttpClient.newBuilder().cookieHandler(cookies).connectTimeout(Duration.ofSeconds(5)).build();
        HttpResponse<String> send(String method, String path, String body, String csrf) throws Exception {
            HttpRequest.Builder request = HttpRequest.newBuilder(uri(path)).timeout(Duration.ofSeconds(10));
            if (csrf != null) request.header("X-CSRF-TOKEN", csrf);
            if (body != null) request.header("Content-Type", "application/json");
            return client.send(request.method(method, body == null ? HttpRequest.BodyPublishers.noBody()
                    : HttpRequest.BodyPublishers.ofString(body)).build(), HttpResponse.BodyHandlers.ofString());
        }
        String csrf() throws Exception {
            HttpResponse<String> response = send("GET", "/api/csrf", null, null);
            assertEquals(200, response.statusCode());
            assertEquals("no-store", response.headers().firstValue("Cache-Control").orElseThrow());
            JsonNode token = json.readTree(response.body());
            assertEquals("X-CSRF-TOKEN", token.get("headerName").asText());
            assertFalse(token.get("token").asText().isBlank());
            return token.get("token").asText();
        }
        String sessionId() {
            return cookies.getCookieStore().getCookies().stream().filter(c -> c.getName().equals("JSESSIONID"))
                    .findFirst().orElseThrow().getValue();
        }
    }
}
