package letscode.sarafan.controller;

import com.fasterxml.jackson.annotation.JsonView;
import letscode.sarafan.domain.User;
import letscode.sarafan.domain.Views;
import letscode.sarafan.repo.UserRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("user")
@Controller
public class UserController {
    private final UserRepo userRepo;

    @Autowired
    public UserController(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @GetMapping
    @JsonView(Views.IdName.class)
    public List<User> list() {
        return userRepo.findAll();
    }

    @GetMapping("{id_user}")
    @JsonView(Views.FullMessage.class)
    public User getOne(@PathVariable("id_user") User user) {
        return user;
    }

    @PostMapping
    public User create(@RequestBody User user) {
        user.setCreationDate(LocalDateTime.now());
        return userRepo.save(user);
    }

    @PutMapping("{id_user}")
    public User update(
            @PathVariable("id_user") User userFromDb,
            @RequestBody User user
    ) {
        BeanUtils.copyProperties(user, userFromDb, "id_user");

        return userRepo.save(userFromDb);
    }

    @DeleteMapping("{id_user}")
    public void delete(@PathVariable("id_user") User user) {
        userRepo.delete(user);
    }
}
