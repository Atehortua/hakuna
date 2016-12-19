'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$mdSidenav', '$mdBottomSheet', '$mdDialog','$mdToast','$timeout','$mdMedia','Links','$rootScope',
  function($scope, Authentication,  $mdSidenav, $mdBottomSheet, $mdDialog, $mdToast, $timeout, $mdMedia,Links,$rootScope) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    var ul = this

    $scope.getLinks = function(){
      $scope.links = Links.query();
    };

    $scope.getLinks();

    $rootScope.categoLinks = ['entretenimiento','redes','ocio','estudio','otros'];

    /*$scope.links = [
      {name:'Google',
        categoria:$scope.categoLinks[0],
        link:'https://www.google.com.co',
        visible:true,
        favorito:false
      },
      {name:'Google2',
        categoria:$scope.categoLinks[3],
        link:'https://www.google.com.co',
        visible:true,
        favorito:false
      },{name:'Google3',
        categoria:$scope.categoLinks[2],
        link:'https://www.google.com.co',
        visible:true,
        favorito:false
      },{name:'Soogle4',
        categoria:$scope.categoLinks[2],
        link:'https://www.google.com.co',
        visible:true,
        favorito:false
      }
    ]*/

    $scope.filtroLinks = "";
    $scope.filtrarLinks = function() {
      var matcher = new RegExp($scope.filtroLinks.toUpperCase());
      var match = false;
      if($scope.filtroCatego[$scope.oldCatego] === true){
       if($scope.oldCatego !== "favorito"){
         $scope.links.forEach(function(link,index){
           if(link.categoria === $scope.oldCatego){
             var cadena = link.name.toUpperCase();
             cadena = cadena.toString();
             if(cadena.match(matcher)){
               $scope.links[index].visible = true;
             }else{
               $scope.links[index].visible = false;
             }
           }else{
             $scope.links[index].visible = false;
           }
         });
       }else{
         $scope.links.forEach(function(link,index){
           if(link.favorito === true){
             var cadena = link.name.toUpperCase();
             cadena = cadena.toString();
             if(cadena.match(matcher)){
               $scope.links[index].visible = true;
             }else{
               $scope.links[index].visible = false;
             }
           }else{
             $scope.links[index].visible = false;
           }
         });
       }
      }else{
        $scope.links.forEach(function(link,index){
          var cadena = link.name.toUpperCase();
          cadena = cadena.toString();
          if(cadena.match(matcher)){
            $scope.links[index].visible = true;
          }else{
            $scope.links[index].visible = false;
          }
        });
      }
    };

    /*condigo de filtro
     var matcher = new RegExp($scope.filtroLinks.toUpperCase());
     var match = false;
     $scope.links.forEach(function(link,index){
       var cadena = link.name.toUpperCase();
       cadena = cadena.toString();
       if(cadena.match(matcher)){
         $scope.links[index].visible = true;
       }else{
         $scope.links[index].visible = false;
       }
     });
    */

    $scope.filtroCatego = [];
    $scope.oldCatego = "";
    $scope.filtroCategortia = function(categoria){
      if($scope.oldCatego !== categoria){
        $scope.filtroCatego[$scope.oldCatego] = false;
        $scope.filtrarLinks();
      }
      if($scope.filtroCatego[categoria] === true){
        $scope.filtroCatego[categoria] = false;
        $scope.filtrarLinks();
      }else{
        $scope.oldCatego = angular.copy(categoria);
        if(categoria !== 'favorito'){
          $scope.links.forEach(function(link){
            if(link.visible === true){
              if(link.categoria != categoria){
                link.visible = false;
              }
            }
          })
        }else{
          $scope.links.forEach(function(link){
            if(link.visible === true){
              if(link.favorito === false){
                link.visible = false;
              }
            }
          })
        }
        $scope.filtroCatego[categoria] = true;
      }
    };

    $scope.getFavoriteLinks = function(){
      var c = 0;
      $scope.links.forEach(function(link){
        if(link.favorito){
          c += 1;
        }
      })
      return c;
    }

    $scope.getVisibleLinks = function(){
      var c = 0;
      $scope.links.forEach(function(link){
        if(link.visible){
          c += 1;
        }
      })
      return c;
    }

    $scope.getCategoriaLinks = function(){

      var a = [];
      var b = [];
      $scope.links.forEach(function(link){
        $scope.categoLinks.forEach(function(catego){
          if(link.categoria === catego){
            a.push(catego);
          }
        })
      })
      for(var i = 0;i < a.length;i++){
        if(b.indexOf(a[i])===-1){
          b.push(a[i]);
        }
      }
      return b.length
    }

    $rootScope.accionFormu = '';
    $scope.showFormu = function(ev,accionFormu,data) {
      $rootScope.accionFormu = angular.copy(accionFormu);
      $rootScope.newLink = angular.copy(data);
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller: DialogController,
        templateUrl: 'formulario-links.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: useFullScreen
      })
          .then(function(newLink) {
            /* aca va la funcion a la base de datos */
            if($rootScope.accionFormu === 'add'){
              Links.save({name:newLink.name,link:newLink.link,categoria:newLink.categoria,visible:newLink.visible,favorito:newLink.favorito},function(response){
                if(response.status){
                  $scope.getLinks();
                  console.log("agrego bien",response.link)
                }else{
                  console.log("fallo el agregar")
                }
              })
            }else if($rootScope.accionFormu === 'update'){
              Links.update({_id:newLink._id,name:newLink.name,link:newLink.link,categoria:newLink.categoria,visible:newLink.visible,favorito:newLink.favorito},function(response){
                if(response.status){
                  $scope.links.forEach(function(link){
                    if(link._id === newLink._id){
                      link.name = newLink.name;
                      link.link = newLink.link;
                      link.categoria = newLink.categoria;
                    }
                  });
                  console.log("actualizo bien")
                }else{
                  console.log("fallo el actualizar")
                }
              })
            }
          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };

    $scope.favoritoLink = function(newLink,favo){
      Links.update({_id:newLink._id,name:newLink.name,link:newLink.link,categoria:newLink.categoria,visible:newLink.visible,favorito:favo},function(response){
        if(response.status){
          console.log("Favortito true")
          $scope.links.forEach(function(link){
            if(link._id === newLink._id){
              link.favorito = favo;
            }
          })
        }else{
          console.log("Favortito false")
        }
      })
    }

    $scope.deleteLink = function(idLink){
      $scope.links.forEach(function(link,index){
        if(link._id === idLink){
          link.$remove(function(response){
            if(response.status){
              console.log("Se elimino",response.link)
              $scope.links.splice(index,1)
            }else{
              console.log("Fallo al eliminar")
            }
          })
        }
      })
    }

    $scope.books = [
      {
        asunto:'Prueba',
        img:false,
        rutaImg:'',
        contenido: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer molestie faucibus fermentum. Proin in sem quis ipsum convallis posuere. Etiam eu pellentesque nibh. Donec scelerisque ac odio maximus tincidunt. Morbi nec quam auctor, varius justo eget, consequat quam. Sed convallis ornare leo eu tincidunt. Curabitur lobortis lacus in ipsum ultricies, sed rhoncus nisl hendrerit. Morbi bibendum at orci a elementum. Mauris vestibulum id sapien ac malesuada. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras vitae tortor blandit, rhoncus nisl et, varius arcu. Aenean imperdiet ante suscipit dui pulvinar rhoncus. Vestibulum dapibus rhoncus lectus a mattis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce nec sem massa.',
        create:'12/08/2016',
        visible:true
      },
      {
        asunto:'Prueba2',
        img:false,
        rutaImg:'',
        contenido: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer molestie faucibus fermentum. Proin in sem quis ipsum convallis posuere. Etiam eu pellentesque nibh. Donec scelerisque ac odio maximus tincidunt. Morbi nec quam auctor, varius justo eget, consequat quam. Sed convallis ornare leo eu tincidunt. Curabitur lobortis lacus in ipsum ultricies, sed rhoncus nisl hendrerit. Morbi bibendum at orci a elementum. Mauris vestibulum id sapien ac malesuada. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras vitae tortor blandit, rhoncus nisl et, varius arcu. Aenean imperdiet ante suscipit dui pulvinar rhoncus. Vestibulum dapibus rhoncus lectus a mattis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce nec sem massa.',
        create:'16/08/2016',
        visible:true
      },
      {
        asunto:'Prueba3',
        img:false,
        rutaImg:'',
        contenido: 'Lorem ipsum dolor sit amet, Cras vitae tortor blandit, rhoncus nisl et, varius arcu. Aenean imperdiet ante suscipit dui pulvinar rhoncus. Vestibulum dapibus rhoncus lectus a mattis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce nec sem massa.',
        create:'02/08/2016',
        visible:true
      }
    ];

    $scope.showBook = function(ev,pageSelect,accion) {
      $rootScope.accionBook = angular.copy(accion);
      $rootScope.books = angular.copy($scope.books);
      $rootScope.pageSelect = angular.copy(pageSelect);
      var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
      $mdDialog.show({
        controller: BookController,
        templateUrl: 'book.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: useFullScreen
      })
          .then(function(newLink) {
            /* aca va la funcion a la base de datos */

          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };



  }

]);

function DialogController($scope, $mdDialog,$rootScope) {

  $scope.categoLinks = $rootScope.categoLinks;
  $scope.accionFormu = $rootScope.accionFormu;
  $scope.newLink = $rootScope.newLink;



  /**
   * cerrar el dialogo
   */
  $scope.hide = function() {
    $mdDialog.hide();
  };

  /**
   * cerrar el dialogo
   */
  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.agregarLink = function(newLink){
    if($scope.accionFormu === 'add'){
      newLink.visible = true;
      newLink.favorito = false;
      $mdDialog.hide(newLink);
    }else if ($scope.accionFormu === 'update'){
      $mdDialog.hide(newLink);
    }
  }
}

function BookController($scope, $mdDialog,$rootScope) {

  $scope.accionBook = angular.copy($rootScope.accionBook);
  $scope.books = angular.copy($rootScope.books);
  $scope.contenido = angular.copy($rootScope.pageSelect);

  $scope.dateActual = new Date();

  $scope.myDate = new Date();
  $scope.minDate = new Date(
      $scope.myDate.getFullYear(),
      $scope.myDate.getMonth() - 3,
      $scope.myDate.getDate());
  $scope.maxDate = new Date(
      $scope.myDate.getFullYear(),
      $scope.myDate.getMonth(),
      $scope.myDate.getDate());

  console.log('Fecha minima',$scope.minDate,' Fecha maxima',$scope.maxDate)
  $scope.getContenido = function(page){
    $scope.contenido = angular.copy(page);
  };
  /**
   * cerrar el dialogo
   */
  $scope.hide = function() {
    $mdDialog.hide();
  };

  /**
   * cerrar el dialogo
   */
  $scope.cancel = function() {
    $mdDialog.cancel();
  };

}
