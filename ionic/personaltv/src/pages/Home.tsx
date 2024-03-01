import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lista de Canales de TV</title>
  <link href="https://xadavm.github.io/wefvhiwsevhddsj/bootstrap.min.css" rel="stylesheet">
  <link href="https://xadavm.github.io/wefvhiwsevhddsj/css.css" rel="stylesheet">
  <script src="https://xadavm.github.io/wefvhiwsevhddsj/jquery-3.6.0.min.js"></script>
  <script src="https://xadavm.github.io/wefvhiwsevhddsj/jquery.min.js"></script>
  <script src="https://xadavm.github.io/wefvhiwsevhddsj/bootstrap.min.js"></script>
  <script src="https://xadavm.github.io/wefvhiwsevhddsj/clappr.min.js"></script>
  <script src="https://xadavm.github.io/wefvhiwsevhddsj/dash-shaka-playback.js"></script>
  <script type="text/javascript" src="https://xadavm.github.io/wefvhiwsevhddsj/clappr-pip-plugin.js"></script>
  <script src="https://xadavm.github.io/wefvhiwsevhddsj/level-selector.min.js"></script>
</head>

<body>

  </div>
  <div class="container">
    <div id="channelList" class="row"></div> 
  </div>
  <div id="clapprContainer" style="display: auto;"> <!-- Contenedor del reproductor Clappr, inicialmente oculto -->
  </div>

  <!-- Modal movil -->
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
  <!-- Modal extension -->
  <div class="modal fade" id="modalextension" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Necesitas tener habilitado la extension Reproductor M3U8 - HLS + DASH Player</h5>
        
        </div>
        <div class="modal-body">
         Se reproducira automatimente en 8 segundos cuando la instale ,  añadela a tu navegador desde aquí <a href="https://chrome.google.com/webstore/detail/reproductor-m3u8-hls-+-da/lcipembjfkmeggpihdpdgnjildgniffl?hl=es-419" target="_blank" id="addExtension">Añadir</a>
      </div>
      
      
    
      </div>
    </div>
  </div>

  <script>
    // Código JavaScript
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

      var lastCategory = localStorage.getItem('lastCategory');
      if (lastCategory) {
        $('.col-md-4').hide();
        $('.col-md-4[data-category="' + lastCategory + '"]').show();
      }

      $.getJSON('https://xadavm.github.io/wefvhiwsevhddsj/1.json', function (data) {
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
              <div class="card" role="button" aria-label="${channel.name}" data-index="${key}" onclick="playVideo(this, '${channel.url}', '${channel.key}', '${channel.kid}', '${channel.embed}', '${channel.urlpc}', '${channel.iframe}')" tabindex="0">
                  <img src="${channel.image}" class="card-img mt-3" alt="${channel.name}">
                  <div class="card-body">
                      <h5 class="card-title text-center">${channel.name}</h5>
                  </div>
              </div>
          </div>
          `;
          $('#channelList').append(channelItem);
        });

        var selectedIndex = getSavedSelectedChannelIndex();
        if (selectedIndex !== null) {
          $('#channelList .card').eq(selectedIndex).focus();
        }
      });
    });

    var player = null; // Mantener referencia al reproductor

    function playVideo(element, url, key, kid, embed, urlpc, iframe, urliframe) {
      var userAgent = navigator.userAgent;

      if (embed === 'true') {
        if (!userAgent.includes('Mobile') && (!urlpc || urlpc.trim() === '')) {
          $('#myModal').modal('show');
        } else {
          if (userAgent.includes('Mobile')) {
            if (url && url.trim() !== '') {
              window.location.href = url;
            } else {
              console.log('El canal solo está disponible para dispositivos móviles.');
            }
          } else {
            if (iframe === "yes") {
              var plugins = [DashShakaPlayback, ClapprPIPPlugin, LevelSelector];

              player = new Clappr.Player({
                source: urlpc,
                parentId: '#clapprContainer',
                preload: 'auto',
                autoPlay: true,
                width: '100%',
                height: '100%',
                fullscreenEnabled: true,
                hideMediaControl: false,
              });

              setTimeout(function () {
                var container = document.getElementById('clapprContainer');
                if (container.requestFullscreen) {
                  container.requestFullscreen();
                } else if (container.mozRequestFullScreen) { 
                  container.mozRequestFullScreen();
                } else if (container.webkitRequestFullscreen) { 
                  container.webkitRequestFullscreen();
                } else if (container.msRequestFullscreen) { 
                  container.msRequestFullscreen();
                }
              }, 500);

              document.addEventListener("fullscreenchange", exitHandler);
              document.addEventListener("webkitfullscreenchange", exitHandler);
              document.addEventListener("mozfullscreenchange", exitHandler);
              document.addEventListener("MSFullscreenChange", exitHandler);
            } else {
              var lastModalDate = localStorage.getItem('lastModalDate');
              var oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
              var currentDate = new Date().getTime();

              if (!lastModalDate || (currentDate - lastModalDate > oneWeekInMilliseconds)) {
                $('#modalextension').modal('show');
                localStorage.setItem('lastModalDate', currentDate);

                setTimeout(function () {
                  window.location.href = urlpc;
                }, 3000);
              } else {
                window.location.href = urlpc;
              }
            }
          }
        }
      } else {
        var modifiedUrl = 'https://xadavm.github.io/wefvhiwsevhddsj/jw.html?s=' + encodeURI(url) + '&key=' + key + '&kid=' + kid;
        window.location.href = modifiedUrl;
      }

      // Guardar el índice del canal seleccionado
      var index = $(element).data('index');
      saveSelectedChannelIndex(index);
    }

    function exitHandler() {
      if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        if (player) {
          player.stop();
          player.destroy();
        }
        $('#loading').hide();
        $('#iframeContainer').hide();
        $('#iframeContainer iframe').attr('src', '');
        $('body').removeClass('iframe-open');
      }
    }

    $(document).on('click', '.category-btn', function () {
      $('.category-btn').removeClass('active');
      $(this).addClass('active');

      var category = $(this).data('category');

      localStorage.setItem('lastCategory', category);

      $('.col-md-4').hide();
      $('.col-md-4[data-category="' + category + '"]').show();
    });

    // Función para guardar y recuperar el índice del canal seleccionado
    function saveSelectedChannelIndex(index) {
      localStorage.setItem('selectedChannelIndex', index);
    }

    function getSavedSelectedChannelIndex() {
      return localStorage.getItem('selectedChannelIndex');
    }

  </script>
  
</body>

</html>

      </IonContent>
    </IonPage>
  );
};

export default Home;
