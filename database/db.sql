CREATE DATABASE test_biblio;

USE test_biblio;

--TABLA USUARIOS
CREATE TABLE users(
    id INT(11) NOT NULL,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL
);

/*creamos id como llave primaria*/
ALTER TABLE users
    ADD PRIMARy KEY (id);

/*alteramos la tabla para que el id se autoincremente*/
ALTER TABLE users
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT;

DESCRIBE users;

--TABLA IMAGENES
CREATE TABLE libros(
    id INT(11) NOT NULL,
    title VARCHAR(150) NOT NULL,
    image VARCHAR(80) NOT NULL,
    archivo VARCHAR(80) NOT NULL,
    description TEXT,
    user_id INT(11),
    created_at timestamp NOT NULL DEFAULT current_timestamp,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
    );

ALTER TABLE libros
    ADD PRIMARy KEY (id);

ALTER TABLE libros
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT;

