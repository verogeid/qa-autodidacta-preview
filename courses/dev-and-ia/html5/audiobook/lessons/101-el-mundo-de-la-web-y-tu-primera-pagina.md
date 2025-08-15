**Capítulo 1: El mundo de la web y tu primera página**  

Para empezar, necesitamos un lugar donde escribir nuestro código.
[pause]

Si tienes un editor de texto como *Visual Studio Code* o *Sublime Text*, ¡excelente!. Si no, puedes usar el *Bloc de Notas*, en Windows, o *TextEdit*, en Mac.  
Por ahora, cualquier lugar donde puedas escribir texto plano servirá.
[long pause]

Una vez que tengas tu editor abierto, vamos a crear el esqueleto más básico de una página web. Es como el 'Hola mundo' del desarrollo web.
[pause]

Primero, guardemos este archivo para que el navegador sepa que es una página web.
[pause]

Ve a 'Archivo' y luego a 'Guardar como...'.
[pause]

{4: Dale el nombre que quieras, pero con una regla muy importante: debe terminar con la extensión '.html'{Dale el nombre que quieras, pero con una regla muy importante: debe terminar con la extensión punto h t m l}}.
[pause]

{4: Por ejemplo, 'mi-primera-pagina.html'{Por ejemplo, mi. guión medio. primera. guión medio. página. punto. h t m l}}.
[pause]

Ahora, un punto **muy importante** sobre los nombres de tus archivos y carpetas en la web. Para evitar problemas, hay algunas reglas de oro que debes seguir, y esto aplica a todos los archivos que uses en tu web, no solo a los HTML:
[pause]

{4: 1. **Todo en minúsculas**: Al igual que con las etiquetas HTML, todos los nombres de tus archivos y carpetas deben estar en minúsculas. Esto es porque muchos servidores web, especialmente los que usan Linux, son sensibles a mayúsculas y minúsculas. Si tu archivo se llama 'MiFoto.jpg' y en tu código lo llamas 'mifoto.jpg', en tu ordenador Windows o Mac podría funcionar, pero al subirlo a un servidor Linux, ¡simplemente no se encontrará!{1. Todo en minúsculas: Al igual que con las etiquetas HTML, todos los nombres de tus archivos y carpetas deben estar en minúsculas. Esto es porque muchos servidores web, especialmente los que usan Linux, son sensibles a mayúsculas y minúsculas. Si tu archivo se llama Mi Foto punto j p g, en mayúsculas, y en tu código lo llamas mi foto punto j p g', en minúsculas, en tu ordenador Windows o Mac podría funcionar, pero al subirlo a un servidor Linux, ¡simplemente no se encontrará!}}
[pause]

{4: 2. **Sin espacios**: Los nombres de archivos y carpetas no deben contener espacios. Si necesitas separar palabras, usa guiones medios (-). Por ejemplo, 'mi-primera-imagen.jpg' es correcto. Si usas espacios, los navegadores los convierten en caracteres extraños como '%20', lo que hace las URLs más difíciles de leer y puede causar problemas. Además, usar guiones para separar palabras es mejor para el SEO, ya que los motores de búsqueda los interpretan como separadores de palabras.{2. Sin espacios: Los nombres de archivos y carpetas no deben contener espacios. Si necesitas separar palabras, usa guiones medios. Por ejemplo, mi guión medio primera guión medio imagen punto jpg es correcto. Si usas espacios, los navegadores los convierten en caracteres extraños como porcentaje 20, lo que hace las URLs más difíciles de leer y puede causar problemas. Además, usar guiones para separar palabras es mejor para el SEO, ya que los motores de búsqueda los interpretan como separadores de palabras.}}
[pause]

{4: ***SEO*** son las siglas en inglés de 'Search Engine Optimization', u 'optimización para motores de búsqueda'.  En pocas palabras, se trata de un conjunto de técnicas y estrategias para ayudar a que tu página web aparezca en los primeros resultados de buscadores como Google, cuando alguien busca algo relacionado con tu contenido.  Cuanto mejor sea tu SEO, más fácil será que la gente encuentre tu página.{SEO son las siglas en inglés de Search Engine Optimization, u optimización para motores de búsqueda.  En pocas palabras, se trata de un conjunto de técnicas y estrategias para ayudar a que tu página web aparezca en los primeros resultados de buscadores como Google, cuando alguien busca algo relacionado con tu contenido.  Cuanto mejor sea tu SEO, más fácil será que la gente encuentre tu página.}}  

{4: 3. **Solo letras, números y guiones**: Evita cualquier carácter especial, incluyendo acentos, la letra 'ñ', o símbolos como !, @, #, $, %, &, *, (), [], ;, :, ', ", ,, ?, /, \ o |. Estos caracteres pueden causar errores o ser interpretados de forma inesperada por los servidores y navegadores.{3. Solo letras, números y guiones: Evita cualquier carácter especial, incluyendo acentos, la letra eñe, o símbolos como exclamación, arroba, almohadilla, dollar, porcentaje, ampersand, asterisco, paréntesis, corchetes, llaves, punto y coma, dos puntos, comilla simple, comilla doble, coma, interrogante, barra, barra invertida o barra vertical. Estos caracteres pueden causar errores o ser interpretados de forma inesperada por los servidores y navegadores.}}
[long pause]

Ahora, vamos a escribir la estructura fundamental. No te preocupes si no lo entiendes todo de inmediato. Lo explicaremos en un momento.
[pause]

Escribe lo siguiente:

{1: &nbsp;&nbsp;<!DOCTYPE html>{menor que. exclamación. en mayúsculas doc type. espacio. en minúsculas h t m l. mayor que. intro}}  
{1: &nbsp;&nbsp;<html> {menor que. h t m l. mayor que. intro}}  
{1: &nbsp;&nbsp;&nbsp;&nbsp;<head> {menor que. head. mayor que. intro}}  
{1: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<title>Mi primera página web</title> {menor que. title. mayor que. Mi primera página web. menor que. barra. title. mayor que. intro}}  
{1: &nbsp;&nbsp;&nbsp;&nbsp;</head>{menor que. barra. head. mayor que. intro}}  
{1: &nbsp;&nbsp;&nbsp;&nbsp;<body>{menor que. body. mayor que. intro. intro}}  

{1: &nbsp;&nbsp;&nbsp;&nbsp;</body>{menor que. barra. body. mayor que. intro}}  
{1: &nbsp;&nbsp;</html>{menor que. barra. html. mayor que}}  

Guarda el archivo.
[pause]

Ahora, abre ese archivo con tu navegador web: *Chrome*, *Firefox*, *Edge*...
[pause]

Verás una página web en blanco. ¡Felicidades!, has creado tu primera página web.
[long pause]

Quizás te preguntes: ¿Qué significa todo eso? Te lo explico con el símil de una carta.
[pause]

{4: ***<!DOCTYPE html>***: {doc type h t m l}}
Le dice al navegador que este documento es una página web de tipo HTML. Es como el *Para* en la carta, indicando el formato.

{4: ***<html>***: {h t m l}}
Es el contenedor principal, como el sobre que envuelve toda la carta.

{4: ***<head>***:{head}}  
Aquí es donde guardamos información importante sobre la página, como el título, que no se ve en el contenido principal. Es como el *Asunto* de un correo.

{4: ***<title>***:{title}}  
El título que aparece en la pestaña del navegador.  
¡Intenta cambiarlo y verás la diferencia!
[pause]

{4: ***<body>***:{body}}  
Este es el cuerpo de la página, el lienzo donde pintaremos nuestra web. Todo lo que escribas aquí será visible para los visitantes. Es como el contenido principal de la carta.
[pause]

Ahora, fíjate bien en la estructura del código.
[pause]

{4: La mayoría de las etiquetas, como *<html>*, *<body>* y *<title>*, tienen una etiqueta de cierre.{La mayoría de las etiquetas, como h t m l, body y title, tienen una etiqueta de cierre}}
[pause]

{4: Es la misma etiqueta, pero con una barra inclinada (/) antes del nombre.{Es la misma etiqueta, pero con una barra inclinada o slash antes del nombre}}
[pause]

{4: Esto le dice al navegador dónde termina el bloque de esa etiqueta. Por ejemplo, el contenido de nuestra página estará entre *<body>* y *</body>*.{Esto le dice al navegador dónde termina el bloque de esa etiqueta. Por ejemplo, el contenido de nuestra página estará entre menor que body mayor que, y menor que barra body mayor que}}
[long pause]

También notarás que hay unos espacios al inicio de cada línea. Esto se llama indentación.
[pause]

No es obligatoria para que el código funcione, pero es una excelente práctica.
[pause]

Imagina que es como si estuvieras organizando estanterías. Cada nivel de indentación nos muestra que una etiqueta está dentro de otra, lo que hace el código mucho más fácil de leer y entender para nosotros.
[long pause]

{4: Por último, hablemos de las mayúsculas y minúsculas en las etiquetas.{Por último, hablemos de las mayúsculas i minúsculas en las etiquetas.}}
[pause]

{4: Aunque HTML5, la versión que estamos aprendiendo, no distingue entre mayúsculas y minúsculas —es decir, *<H1>* y *<h1>* funcionan igual—, la convención y el estándar de la industria es usar siempre minúsculas para todas las etiquetas y atributos.{Aunque HTML5, la versión que estamos aprendiendo, no distingue entre mayúsculas i minúsculas —es decir, hache mayúscula 1 y hache minúscula 1 funcionan igual—, la convención y el estándar de la industria es usar siempre minúsculas para todas las etiquetas y atributos}}
[pause]

¿Por qué esta convención?  
Principalmente por consistencia y legibilidad.  
El código escrito todo en minúsculas es más fácil de leer rápidamente, ya que las letras tienen diferentes alturas que ayudan a nuestro cerebro a escanear el texto.  
Además, seguir esta norma hace que tu código sea compatible con herramientas y estándares más estrictos, como XHTML, y facilita la colaboración con otros desarrolladores.  
Las grandes empresas como *Google* y la propia *MDN Web Docs*, que es una referencia fundamental, recomiendan y usan minúsculas en todos sus ejemplos.  
[pause]

Entiendo que usar mayúsculas podría parecer una forma rápida de distinguir las etiquetas, pero para que aprendas las mejores prácticas desde el principio y tu código sea profesional y fácil de mantener, en este curso siempre usaremos minúsculas para las etiquetas.
[long pause]

{4: En el próximo capítulo, vamos a empezar a rellenar ese <body> con nuestro primer contenido. ¡No te lo pierdas!{En el próximo capítulo, vamos a empezar a rellenar ese body con nuestro primer contenido. ¡No te lo pierdas!}}  
[long pause]
