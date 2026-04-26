package application.gradebookbackend.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
public class SupabaseAdminClient {

    private final RestClient restClient;

    public SupabaseAdminClient(
            @Value("${supabase.url}") String supabaseUrl,
            @Value("${supabase.service-role-key}") String serviceRoleKey) {
        this.restClient = RestClient.builder()
                .baseUrl(supabaseUrl + "/auth/v1/admin")
                .defaultHeader("Authorization", "Bearer " + serviceRoleKey)
                .defaultHeader("apikey", serviceRoleKey)
                .build();
    }

    public String createAuthUser(String email, String password) {
        Map<?, ?> response = restClient.post()
                .uri("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "email", email,
                        "password", password,
                        "email_confirm", true
                ))
                .retrieve()
                .body(Map.class);
        return (String) response.get("id");
    }

    public void deleteAuthUser(String uid) {
        restClient.delete()
                .uri("/users/" + uid)
                .retrieve()
                .toBodilessEntity();
    }
}
