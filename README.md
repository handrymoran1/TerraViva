<div align="center">

# 🏨TerraViva

### Sistema de reservas para hotel boutique
*Aplicación web estática · HTML · CSS · JavaScript*

</div>

---

## 📖 Descripción

**VivaTerra** es un sistema de reservas para un hotel boutique, desarrollado como aplicación web estática con HTML, CSS y JavaScript puro. Permite a los usuarios registrarse, iniciar sesión, buscar disponibilidad, explorar habitaciones, realizar reservas y gestionar su perfil personal. Incluye además un panel de administración completo para la gestión del catálogo de habitaciones.

---

## 🛠️ Tecnologías utilizadas

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript_ES6-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=flat-square&logo=bootstrap&logoColor=white)

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura y marcado semántico |
| CSS3 | Estilos y diseño visual |
| JavaScript ES6 | Lógica de negocio e interactividad |
| Bootstrap 5 + Bootstrap Icons | Componentes UI y sistema de grilla |
| `localStorage` / `sessionStorage` | Persistencia de datos en el navegador |

---

## ✨ Características principales

### 👤 Para usuarios
- Página de inicio con carrusel visual, buscador de fechas y selección de huéspedes
- Registro con validaciones de correo, teléfono y contraseña
- Inicio de sesión con historial en `localStorage` y estado persistente
- Perfil editable: nombre, teléfono, avatar dinámico y navegación protegida
- Catálogo de habitaciones dinámico y responsive
- Página de detalle de reserva con habitación seleccionada, fechas, huéspedes, noches y total a pagar
- Confirmación de reserva con historial guardado en `localStorage`

### 🔧 Panel de administración
- Agregar nuevas habitaciones al catálogo
- Editar y eliminar habitaciones existentes
- Mostrar u ocultar habitaciones del catálogo público
- Contadores de habitaciones disponibles y ocupadas

---

## 📁 Estructura del proyecto

```
Terra-Viva/
│
├── index.html          # Página principal
├── html/               # Páginas secundarias (habitaciones, contacto, perfil, registro, etc.)
├── css/                # Estilos personalizados por sección
├── js/                 # Lógica de navegación, registro, login, administración y reservas
└── assets/             # Imágenes y recursos gráficos
```

---

## 🚀 Cómo ejecutar

> No requiere instalación de dependencias ni herramientas de build.

1. Clona el repositorio:
   ```bash
   git clone https://github.com/handrymoran1/Terra-Viva.git
   cd Terra-Viva
   ```

2. Abre `index.html` en tu navegador (o usa **Live Server** en VS Code).

---

## 🗺️ Flujo de uso

```
Abrir index.html
      ↓
Ingresar fechas y número de huéspedes
      ↓
Buscar disponibilidad → Catálogo de habitaciones
      ↓
Registrarse / Iniciar sesión
      ↓
Seleccionar habitación → Confirmar reserva
      ↓
Consultar historial desde el perfil
```

---

## 🔑 Credenciales de administrador

| Campo | Valor |
|---|---|
| Correo | `.....` |
| Contraseña | `......*` |

> El administrador accede al panel desde `html/dashboard.html`.

---

## 📝 Notas importantes

- El sistema es **100% estático**: no requiere backend ni servidor.
- Usuarios, habitaciones y reservas se almacenan en el **navegador del cliente**.
- Para limpiar datos de prueba, borrar el `localStorage` desde las herramientas de desarrollo del navegador (`F12 → Application → Local Storage → Clear`).

---

## 👥 Equipo de desarrollo

| Nombre | Rol |
|---|---|
| **Handry Morán** | Full Stack Developer |
| **Joan Triana** | Full Stack Developer |
| **Robinson Salamanca** | Full Stack Developer |
| **Brayan Velásquez** | Full Stack Developer |

---

<div align="center">

Hecho con 💚 por el equipo **Terra-Viva** · 2025

</div>
