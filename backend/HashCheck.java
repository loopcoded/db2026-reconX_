import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashCheck {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println(encoder.matches("admin123", "$2y$10$L9iP3BfsBS2LbVJRfc86TuWnJvP.AohjX3PNLwdtjlZfyB7YSp87C"));
        System.out.println(encoder.encode("admin123"));
    }
}
