package com.sistemacontable.config;

import com.sistemacontable.security.AuthTokenFilter;
import com.sistemacontable.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthTokenFilter authTokenFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Auth endpoints siempre públicos
                .requestMatchers("/api/auth/**").permitAll()

                // Cuentas
                .requestMatchers(HttpMethod.GET, "/api/cuentas", "/api/cuentas/**")
                    .hasAnyAuthority("PLAN-CUENTAS_VER", "PLAN-CUENTAS_GESTIONAR")
                .requestMatchers(HttpMethod.POST, "/api/cuentas", "/api/cuentas/**")
                    .hasAuthority("PLAN-CUENTAS_GESTIONAR")
                .requestMatchers(HttpMethod.PATCH, "/api/cuentas/**")
                    .hasAuthority("PLAN-CUENTAS_GESTIONAR")

                // Usuarios
                .requestMatchers("/api/usuarios/**")
                    .hasAuthority("USUARIOS_GESTIONAR")

                // Asientos
                .requestMatchers(HttpMethod.GET, "/api/asientos/ultimos")
                    .hasAuthority("ASIENTOS_VER")
                .requestMatchers(HttpMethod.POST, "/api/asientos/crear")
                    .hasAuthority("ASIENTOS_GESTIONAR")

                // Libros contables
                .requestMatchers(HttpMethod.GET, "/api/libro-diario/**")
                    .hasAuthority("LIBRO-DIARIO_VER")
                .requestMatchers(HttpMethod.GET, "/api/libro-mayor/**")
                    .hasAuthority("LIBRO-MAYOR_VER")

                // Endpoint de errores siempre público
                .requestMatchers("/error").permitAll()

                // Cualquier otro request requiere autenticación
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}



