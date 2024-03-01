<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lista de Canales de TV</title>
  <link href="https://xadavm.github.io/xx/bootstrap.min.css" rel="stylesheet">
  <link href="https://xadavm.github.io/xx/css.css" rel="stylesheet">
  <script src="https://xadavm.github.io/xx/jquery-3.6.0.min.js"></script>
  <script src="https://xadavm.github.io/xx/jquery.min.js"></script>
<script src="https://xadavm.github.io/xx/bootstrap.min.js"></script>
<script src="https://xadavm.github.io/xx/clappr.min.js"></script>
<script src="https://xadavm.github.io/xx/dash-shaka-playback.js"></script>
<script type="text/javascript" src="https://xadavm.github.io/xx/clappr-pip-plugin.js"></script>
<script type="text/javascript" src="https://xadavm.github.io/xx/level-selector.min.js"></script>
<script src="https://xadavm.github.io/xx/console-ban.min.js"></script>

</head>
<script>
  // default options
  ConsoleBan.init()
  // custom options
  ConsoleBan.init({
    redirect: '/'
  })
</script>
<body>
  <div id="menu">
    <!-- El menú de categorías se generará aquí -->
  </div>

  <div id="loading">
    <img src="https://xadavm.github.io/xx/img/loading.gif">
  </div>
  <div class="container">
  
    <div id="channelList" class="row"></div> 
  </div>
  
  <div id="clapprContainer" style="display: auto;"> <!-- Contenedor del reproductor Clappr, inicialmente oculto -->
  </div>

  <!-- Modal -->
  <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Canal Disponible Solo en Dispositivos Móviles</h5>
        
        </div>
        <div class="modal-body">
          Este canal solo está disponible para dispositivos móviles.
        </div>
    
      </div>
    </div>
  </div>

  <script>
    function generateMenu(categories) {
      var menu = '<ul>';
      categories.forEach(function (category) {
        if (category === 'Deportes') {
          menu += '<li><button class="category-btn active" data-category="' + category + '">' + category + '</button></li>';
        } else {
          menu += '<li><button class="category-btn" data-category="' + category + '">' + category + '</button></li>';
        }
      });
      menu += '</ul>';
      $('#menu').html(menu);
    }

    $(document).ready(function () {
      $('#loading').hide();

      // Obtener la última categoría seleccionada del almacenamiento local
      var lastCategory = localStorage.getItem('lastCategory');
      if (lastCategory) {
        // Si hay una última categoría seleccionada, mostrar solo los canales de esa categoría
        $('.col-md-4').hide();
        $('.col-md-4[data-category="' + lastCategory + '"]').show();
      }

      $.getJSON('1.json', function (data) {
        var categories = [];
        data.forEach(function (channel) {
          if (!categories.includes(channel.categ)) {
            categories.push(channel.categ);
          }
        });
        generateMenu(categories);

        $.each(data, function (key, channel) {
          var channelItem = `
          <div class="col-md-4 mb-4 ${key === 0 ? 'first-channel' : ''}" data-category="${channel.categ}">
            <div class="card" role="button" aria-label="${channel.name}" data-index="${key}" onclick="playVideo('${channel.url}', '${channel.key}', '${channel.kid}', '${channel.embed}', '${channel.urlpc}')" tabindex="0">
              <img src="${channel.image}" class="card-img" alt="${channel.name}">
              <div class="card-body">
                <h5 class="card-title">${channel.name}</h5>
              </div>
            </div>
          </div>
  `;
          $('#channelList').append(channelItem);
        });


        // Enfocar el primer canal al cargar la página
        $('#channelList .card').first().focus();
      });
    });
    var player = null; // Mantener referencia al reproductor

    function playVideo(url, key, kid, embed, urlpc) {
      var userAgent = navigator.userAgent;

      if (embed === 'true') {
        // Si es un dispositivo PC y urlpc no está definido, mostrar el modal
        if (!userAgent.includes('Mobile') && (!urlpc || urlpc.trim() === '')) {
            $('#myModal').modal('show');
        } else {
            // Si es un dispositivo móvil, redirigir a la URL del canal si está definida
            if (userAgent.includes('Mobile')) {
                if (url && url.trim() !== '') {
                    window.location.href = url;
                } else {
                    console.log('El canal solo está disponible para dispositivos móviles.');
                }
            } else  {
                // Si es una PC y hay una URL específica para PC, redirigir a esa URL
                console.log("pc")
                 // Configurar los plugins correspondientes
      var plugins = [DashShakaPlayback, ClapprPIPPlugin, LevelSelector];

      // Crear el reproductor Clappr con la configuración apropiada
      player = new Clappr.Player({
        source: urlpc,
        parentId: '#clapprContainer',
        preload: 'auto',
        autoPlay: true,
        width: '100%',
        height: '100%', // Ajustar al 100% de la pantalla
        fullscreenEnabled: true,
        hideMediaControl: false,
      });

      // Solicitar pantalla completa al cargar el video
      setTimeout(function() {
        var container = document.getElementById('clapprContainer');
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.mozRequestFullScreen) { /* Firefox */
          container.mozRequestFullScreen();
        } else if (container.webkitRequestFullscreen) { /* Chrome, Safari y Opera */
          container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) { /* IE/Edge */
          container.msRequestFullscreen();
        }
      }, 500); // Tiempo de espera ajustado

      // Detectar la salida de pantalla completa
      document.addEventListener("fullscreenchange", exitHandler);
      document.addEventListener("webkitfullscreenchange", exitHandler);
      document.addEventListener("mozfullscreenchange", exitHandler);
      document.addEventListener("MSFullscreenChange", exitHandler);
    } 
  }
// Función para manejar la salida del modo de pantalla completa o el cierre del iframe
function exitHandler() {
  if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
    if (player) {
      player.stop();
      player.destroy();
    }
    $('#loading').hide();
    $('#iframeContainer').hide(); // Oculta el contenedor del iframe si está visible
    $('#iframeContainer iframe').attr('src', ''); // Detener el iframe
    $('body').removeClass('iframe-open'); // Remover clase para mostrar barras de desplazamiento
  }
}            
        
    } else {
        // Si embed no es true, modificar la URL y cargarla
        var modifiedUrl = 'https://xadavm.github.io/xx/jw.html?s=' + encodeURI(url) + '&key=' + key + '&kid=' + kid;
        window.location.href = modifiedUrl;
    }
    
  }


    $(document).on('click', '.category-btn', function () {
      $('.category-btn').removeClass('active');
      $(this).addClass('active');

      var category = $(this).data('category');

      // Guardar la categoría seleccionada en el almacenamiento local
      localStorage.setItem('lastCategory', category);

      $('.col-md-4').hide();
      $('.col-md-4[data-category="' + category + '"]').show();
    });
  </script>
</body>

</html>
