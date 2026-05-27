

<!-- TABLAS-->
CREATE TABLE clientes (
    id_cliente      SERIAL PRIMARY KEY,
    nombre          VARCHAR(50) NOT NULL,
    apellido        VARCHAR(50) NOT NULL,
    documento       VARCHAR(20) UNIQUE NOT NULL,
    email           VARCHAR(100),
    telefono        VARCHAR(20)
);

CREATE TABLE habitaciones (
    id_habitacion   SERIAL PRIMARY KEY,
    numero          VARCHAR(10) NOT NULL UNIQUE,
    tipo            VARCHAR(20) NOT NULL,
    precio_noche    NUMERIC(10,2) NOT NULL,
    estado          VARCHAR(20) NOT NULL
);

CREATE TABLE reservas (
    id_reserva      SERIAL PRIMARY KEY,
    id_cliente      INTEGER NOT NULL REFERENCES clientes(id_cliente),
    id_habitacion   INTEGER NOT NULL REFERENCES habitaciones(id_habitacion),
    fecha_inicio    DATE NOT NULL,
    fecha_fin       DATE NOT NULL,
    estado          VARCHAR(20) NOT NULL
);

<!-- INSERT INTO-->
INSERT INTO clientes (nombre, apellido, documento, email, telefono) VALUES
('Ana',    'Pérez',    'CC1001', 'ana.perez@example.com',    '3001112233'),
('Luis',   'Gómez',    'CC1002', 'luis.gomez@example.com',   '3002223344'),
('María',  'López',    'CC1003', 'maria.lopez@example.com',  '3003334455'),
('Carlos', 'Ruiz',     'CC1004', 'carlos.ruiz@example.com',  '3004445566'),
('Sofía',  'Martínez', 'CC1005', 'sofia.martinez@example.com','3005556677');

INSERT INTO habitaciones (numero, tipo, precio_noche, estado) VALUES
('101', 'simple', 150000, 'disponible'),
('102', 'doble',  200000, 'disponible'),
('103', 'suite',  350000, 'disponible'),
('201', 'doble',  220000, 'ocupada'),
('202', 'suite',  380000, 'mantenimiento');

INSERT INTO reservas (id_cliente, id_habitacion, fecha_inicio, fecha_fin, estado) VALUES
(1, 1, '2026-06-01', '2026-06-03', 'reservada'),
(2, 2, '2026-06-05', '2026-06-07', 'reservada'),
(3, 3, '2026-06-10', '2026-06-15', 'reservada'),
(4, 1, '2026-06-20', '2026-06-22', 'cancelada'),
(5, 4, '2026-07-01', '2026-07-04', 'reservada');