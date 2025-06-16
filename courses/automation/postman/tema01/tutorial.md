# Tutorial: Fundamentos de Postman

## ¿Qué es Postman?

Imagina que quieres comunicarte con un restaurante para hacer pedidos, cancelar, o preguntar el menú. Postman es la app que te permite hacer estas "llamadas" a un restaurante digital llamado API, donde cada pedido es una *request* que haces.

## Paso 1: Instalar Postman

1. Descarga Postman desde [https://www.postman.com/downloads](https://www.postman.com/downloads)
2. Instálalo en tu sistema operativo.
3. Crea una cuenta o accede con Google para guardar tus pedidos y colecciones.

## Paso 2: Crear tu primera colección

Una *colección* es como una carpeta donde guardas todas tus recetas para pedir datos al restaurante digital.

1. Haz clic en "Collections" > "New Collection".
2. Nombra tu colección `Mi Primera API`.
3. Crea una nueva petición con:
   - Método: `GET` (que sería como pedir el menú para ver qué hay)
   - URL: `https://jsonplaceholder.typicode.com/posts/1`
4. Haz clic en “Send” y mira la respuesta, que es como la carta que te devuelve el restaurante.

## Paso 3: Prueba otros métodos

Cada método es un tipo distinto de pedido:

- `POST` es como hacer un nuevo pedido.
- `PUT` es modificar un pedido que ya hiciste.
- `DELETE` es cancelar un pedido.

Inténtalo enviando:

```json
{
  "title": "foo",
  "body": "bar",
  "userId": 1
}
```

a la URL con el método correspondiente.

## Paso 4: Introducción a entornos

Imagina que tienes varios restaurantes en diferentes ciudades. Para no cambiar cada vez la dirección manualmente, usas un entorno que guarda esa dirección y sólo cambias el entorno según la ciudad.

1. Crea un entorno con variable `base_url = https://jsonplaceholder.typicode.com`.
2. Modifica tus peticiones para usar `{{base_url}}/posts`.

## Resultado esperado

Tu colección debe tener 4 peticiones funcionando y usando la variable del entorno.

---

- [Volver al indice](../readme.md)
- [>> Variables y entornos en Postman](../tema02/readme.md)

---

- [Ir al resumen](./tutorial.md)
- [Ejercicios](./ejercicios.md)
- [Ver soluciones propuestas]
