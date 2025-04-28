package th.ac.ku.kps.eng.cpe.config;


import javax.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import th.ac.ku.kps.eng.cpe.auth.JwtAuthorizationFilter;


@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	
    private final JwtAuthorizationFilter jwtAuthorizationFilter;
	
    public SecurityConfig(JwtAuthorizationFilter jwtAuthorizationFilter) {
        this.jwtAuthorizationFilter = jwtAuthorizationFilter;
    }
	
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
	        .cors()
	        .and()
	        .exceptionHandling()
            .authenticationEntryPoint((request, response, authException) -> {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Custom Error Message");
            })
            .accessDeniedHandler((request, response, accessDeniedException) -> {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Custom Access Denied Message");
            })
            .and()
            .authorizeRequests()
            	.antMatchers("/api/auth/**").authenticated()
            	.antMatchers("/api/**").permitAll()
                .anyRequest().authenticated() // All other requests require authentication
            .and()
            .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
	
}
