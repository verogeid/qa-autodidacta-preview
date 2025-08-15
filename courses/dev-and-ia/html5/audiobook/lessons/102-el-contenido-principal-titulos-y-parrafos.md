**Capítulo 2: El contenido principal: Títulos y Párrafos**  

{4: En el capítulo anterior, creamos el esqueleto de nuestra página web. Ahora, es momento de empezar a darle contenido, a rellenar ese *<body>* que está vacío.{En el capítulo anterior, creamos el esqueleto de nuestra página web. Ahora, es momento de empezar a darle contenido, a rellenar ese body que está vacío}}
[pause]

Imagina que estás escribiendo un informe o un artículo. Necesitas títulos para organizar tus ideas y párrafos para desarrollar el texto. En HTML, tenemos etiquetas específicas para eso.
[pause]

{4: Vamos a empezar con los **títulos**. HTML nos ofrece seis niveles de títulos, desde el más importante, ***<h1>***, hasta el menos importante, ***<h6>***. Piensa en ellos como los títulos y subtítulos de un libro. El *<h1>* sería el título principal del capítulo, el *<h2>* un subtítulo importante, y así sucesivamente. {Vamos a empezar con los títulos. HTML nos ofrece seis niveles de títulos, desde el más importante, h 1, hasta el menos importante, h 6. Piensa en ellos como los títulos y subtítulos de un libro. El h 1 sería el título principal del capítulo, el h 2 un subtítulo importante, y así sucesivamente.}}
[pause]

{4: Es una buena práctica usar solo un *<h1>* por página, ya que representa el tema principal de todo el documento. Los demás títulos, *<h2>* a *<h6>*, los puedes usar tantas veces como necesites para organizar tu contenido.{Es una buena práctica usar solo un h 1 por página, ya que representa el tema principal de todo el documento. Los demás títulos, h 2 a h 6, los puedes usar tantas veces como necesites para organizar tu contenido.}}  
[long pause]

{4: Ahora, abre el archivo 'mi-primera-pagina.html' que creamos antes en tu editor de texto. Vamos a añadir un título principal dentro de la etiqueta *<body>*.{Ahora, abre el archivo mi primera página punto h t m l que creamos antes en tu editor de texto. Vamos a añadir un título principal dentro de la etiqueta body.}}
[pause]

{4: Recuerda que todo lo que queremos que sea visible en nuestra página debe ir dentro de *<body>* y *</body>*.{Recuerda que todo lo que queremos que sea visible en nuestra página debe ir dentro de body y barra body.}}
[long pause]

{4: Dentro de tu etiqueta *<body>*, añade lo siguiente:{Dentro de tu etiqueta body, añade lo siguiente:}}

{1: &nbsp;&nbsp;&nbsp;<h1>¡Mi primera página con contenido!</h1>{menor que. h 1. mayor que. ¡Mi primera página con contenido!. menor que. barra h 1. mayor que}}

Guarda el archivo y actualiza la página en tu navegador.
[pause]

{4: ¡Verás que ahora tienes un título grande en tu página! Ese es el efecto de la etiqueta <h1>.{¡Verás que ahora tienes un título grande en tu página! Ese es el efecto de la etiqueta h 1.}}
[long pause]

{4: Ahora, vamos a añadir un **párrafo de texto**. Para eso, usamos la etiqueta **<p>**. La p viene de 'párrafo'.{Ahora, vamos a añadir un párrafo de texto. Para eso, usamos la etiqueta p. La p viene de párrafo.}}  
[pause]

Un párrafo es simplemente un bloque de texto. Es la etiqueta más común para el contenido textual de una página web.  
[long pause]

{4: Cuando usas la etiqueta *<p>*, el navegador automáticamente añade un espacio antes y después del párrafo. Piensa en ello como si cada párrafo tuviera su propio "espacio personal" que lo separa de lo que viene antes y después. Esto ayuda a que el texto se vea más ordenado y fácil de leer.{Cuando usas la etiqueta p, el navegador automáticamente añade un espacio antes y después del párrafo. Piensa en ello como si cada párrafo tuviera su propio espacio personal que lo separa de lo que viene antes y después. Esto ayuda a que el texto se vea más ordenado y fácil de leer.}}
[long pause]

{4: Debajo de tu título *<h1>*, añade un párrafo. Tu código debería verse así:{Debajo de tu título h 1, añade un párrafo. Tu código debería verse así:}}

{1: &nbsp;&nbsp;&nbsp;<body>{menor que. body. mayor que. intro}}
{1: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h1>¡Mi primera página con contenido!</h1>{menor que. h 1. mayor que. ¡Mi primera página con contenido!. menor que. barra. h 1. mayor que. intro}}
{1: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<p>Este es mi primer párrafo de texto en HTML. Estoy aprendiendo a estructurar mi contenido web.</p>{menor que. pe. mayor que. Este es mi primer párrafo de texto en HTML. punto. Estoy aprendiendo a estructurar mi contenido web. menor que. barra pe. mayor que. intro}}
{1: &nbsp;&nbsp;&nbsp;</body>{menor que. barra body. mayor que}}

Guarda el archivo y actualiza la página en tu navegador.
[pause]

¡Excelente! Ahora tienes un título y un párrafo de texto en tu página, y puedes ver ese espacio que los separa.
[long pause]

{4: Pero, ¿qué pasa si quieres un **salto de línea** dentro de un párrafo, sin que se cree un nuevo párrafo con todo ese espacio extra? Para eso, tenemos la etiqueta ***<br>***.{Pero, ¿qué pasa si quieres un salto de línea dentro de un párrafo, sin que se cree un nuevo párrafo con todo ese espacio extra? Para eso, tenemos la etiqueta b r.}}
[pause]

{4: La etiqueta *<br>* significa 'break' o 'salto de línea'. Es una de esas etiquetas especiales que no necesita una etiqueta de cierre, como *</br>*. Simplemente la escribes donde quieres que el texto salte a la siguiente línea.{La etiqueta b r significa break o salto de línea. Es una de esas etiquetas especiales que no necesita una etiqueta de cierre, como barra b r. Simplemente la escribes donde quieres que el texto salte a la siguiente línea.}}  
[long pause]

Vamos a modificar nuestro párrafo para que tenga un salto de línea.
[pause]

Modifica tu párrafo para que se vea así:

{1: &nbsp;&nbsp;&nbsp;<p>Este es mi primer párrafo de texto en HTML.<br>Estoy aprendiendo a estructurar mi contenido web.</p>{menor que. pe. mayor que. Este es mi primer párrafo de texto en HTML. punto. menor que. b r. mayor que. Estoy aprendiendo a estructurar mi contenido web. menor que. barra pe. mayor que}}

Guarda el archivo y actualiza la página en tu navegador.
[pause]

{4: ¿Ves la diferencia? Ahora el texto 'Estoy aprendiendo a estructurar mi contenido web.' ha saltado a la siguiente línea, pero sin el espacio adicional que tendríamos si hubiéramos usado otra etiqueta *<p>*.{¿Ves la diferencia? Ahora el texto Estoy aprendiendo a estructurar mi contenido web ha saltado a la siguiente línea, pero sin el espacio adicional que tendríamos si hubiéramos usado otra etiqueta p.}}
[long pause]

{4: Puedes experimentar un poco. Intenta añadir otro párrafo, o cambia el texto de tu título. Incluso puedes probar a usar un *<h2>* o un *<h3>* para ver cómo cambia el tamaño del texto.{Puedes experimentar un poco. Intenta añadir otro párrafo, o cambia el texto de tu título. Incluso puedes probar a usar un h 2 o un h 3 para ver cómo cambia el tamaño del texto.}}
[pause]

Recuerda siempre guardar los cambios en tu archivo y luego actualizar la página en el navegador para ver el resultado.
[long pause]

En el próximo capítulo, exploraremos cómo añadir listas y enlaces a nuestra página, para que puedas organizar información y conectar tu web con otras. ¡Sigue así!
[long pause]
