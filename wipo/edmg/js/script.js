EDMG=function($){
  var activeNav='0'
  var autoscrolling=false;
  var methods={};
  var sectionMaxTop=Infinity;
  var sectionTops={};
  var stickyParams={};
  var $window=$(window);
  methods.checkScroll=function(){
    var wst=$window.scrollTop();
    if(wst > 0){
      $window.scrollTop(wst-1);
      $window.scrollTop(wst);
    }
  };
  methods.scrollToSection=function(a){
    autoscrolling=true;
    var t=((a.split('-').length > 1) ? (sectionTops[a]-stickyParams.maxScrollTopnav) : 0);
    $('html, body').animate({scrollTop: t}, 800, 'swing', function(){
      setTimeout(function(){autoscrolling=false;}, 50);
      EDMG.setActiveNav(a);
    });
  };
  methods.setActiveNav=function(a){
    a=((!a) ? '0' : a.toString().replace('#', ''));
    var b=a.split('-');
    $('#content nav li, #topnav li').removeClass('active');
    $('#topnav a[href="#'+a+'"]').closest('li').addClass('active');
    $('#content nav a[href="#'+a+'"]').closest('li').addClass('active');
    $('#topnav a[href="#'+b[0]+'"]').closest('li').addClass('active');
    activeNav=a;
  };
  methods.setSticky=function(){
    EDMG.setStickyParams();
    var currentNav='0';
    var footerTop=$('#footer').offset().top;
    var lastkey='';
    var lastval=0;
    var pageTopMargin=parseInt($('html').css('margin-top'))+parseInt($('html').css('padding-top'))+parseInt($('body').css('margin-top'))+parseInt($('body').css('padding-top'));
    var scrollY=0;
    var scrollY2=0;
    $window.on('scroll', function(){
      scrollY=$window.scrollTop();
      scrollY2=(scrollY+stickyParams.maxScrollTopnav+pageTopMargin);
      if(scrollY > stickyParams.maxScrollHeader+pageTopMargin){
        if(stickyParams.mobile){
          EDMG.unstickTopnav();
          stickyParams.sidenav.addClass('stuck');
        }else{
          stickyParams.topnav.addClass('stuck');
          if(scrollY > stickyParams.maxScrollTopnav){
            stickyParams.sidenav.addClass('stuck');
            stickyParams.sidenav.css({left: (stickyParams.section.offset().left+'px'), top: (stickyParams.maxScrollTopnav+5+'px')});
            stickyParams.contentholder.css({marginLeft: (stickyParams.cwest+'px'), width: stickyParams.cwidth});
            if((scrollY2+stickyParams.sidenav.height()) >= footerTop) stickyParams.sidenav.css({top: (stickyParams.maxScrollTopnav-(scrollY2+stickyParams.sidenav.height()-footerTop))});
          }else{
            EDMG.unstickSidenav();
          }
        }
      }else{
        if(stickyParams.mobile){
          stickyParams.sidenav.removeClass('stuck');
        }else{
          EDMG.unstickSidenav();
          EDMG.unstickTopnav();
        }
      }
      if(!autoscrolling){
        currentNav='0';
        $.each(sectionTops, function(k,v){
          if((lastval == 0 && scrollY2 >= v) || (lastval > 0 && scrollY2 >= lastval && scrollY2 <= v)) currentNav=lastkey;
          lastkey=k;
          lastval=v;
        });
        if(scrollY2 >= sectionMaxTop) currentNav=lastkey;
        if(currentNav != activeNav) EDMG.setActiveNav('#'+currentNav);
      }
    });
  };
  methods.setStickyParams=function(){
    var $section=$('#content');
    var $sidenav=$section.find('nav');
    var $contentholder=$section.find('.content-holder');
    var $topnav=$('#topnav');
    stickyParams={
      contentholder: $contentholder,
      cwest: ($sidenav.outerWidth(true)),
      cwidth: $contentholder.outerWidth(),
      maxScrollHeader: $('#banner').outerHeight(true),
      maxScrollSidenav: ($sidenav.offset().top-$topnav.outerHeight(true)),
      maxScrollTopnav: (($topnav.is(':visible')) ? $topnav.outerHeight(true) : 0),
      mobile: !$topnav.is(':visible'),
      nwest: (($sidenav.length) ? $sidenav.closest('.content-container').offset().left : 0),
      sidenav: $sidenav,
      topnav: $topnav,
      section: $section
    }
  };
  methods.slideSideNav=function(){
    var hidden=(stickyParams.sidenav.offset().left < 0);
    stickyParams.sidenav.animate({left: ((hidden) ? 0: (5-stickyParams.sidenav.width()))+'px'}, 600);
    stickyParams.sidenav.find('> div:first-of-type i.fa').removeClass('fa-angle-double-'+((hidden) ? 'right' : 'left')).addClass('fa-angle-double-'+((hidden) ? 'left' : 'right'));
  };
  methods.toggleSideNav=function(){
    stickyParams.sidenav.css({left: ((stickyParams.mobile) ? ((5-stickyParams.sidenav.outerWidth())+'px') : 0)});
    if(stickyParams.mobile){
      stickyParams.sidenav.css('top', '');
      stickyParams.contentholder.css({marginLeft: 0});
    }
    var id='';
    var top=0;
    $('#content').find('h2, h3, h4').each(function(){
      var $el=$(this);
      id=$el.attr('id');
      if(!id) return true;
      sectionMaxTop=($el.offset().top-parseInt($el.css('margin-top')));
      if(!stickyParams.mobile) sectionMaxTop=(sectionMaxTop-stickyParams.maxScrollTopnav+stickyParams.maxScrollHeader);
      sectionTops[id]=sectionMaxTop;
    });
    if(sectionMaxTop==0) sectionMaxTop=Infinity;
  };
  methods.unstickSidenav=function(){
    stickyParams.sidenav.removeClass('stuck');
    stickyParams.sidenav.css({left: '', top: ''});
    stickyParams.contentholder.css({marginLeft: '', width: ''});
  };
  methods.unstickTopnav=function(){
    stickyParams.topnav.removeClass('stuck');
  };
  return methods;
}(jQuery);
$(document).on('click', 'nav a', function(e){
  var $link=$(this);
  var href=$link.attr('href').toString();
  if($link.closest('#topnav').length && href.substr(0,1) !== '#') return true;
  e.preventDefault();
  var a=href.replace('#', '');
  EDMG.scrollToSection(a);
  if($link.closest('#content').length && !$('#topnav').is(':visible')) EDMG.slideSideNav();
});
$(document).on('click', '#content nav > div:first-of-type', function(e){
  e.preventDefault();
  EDMG.slideSideNav();
});
$(document).ready(function(){
  $('body').iconomatic({ajax: true, dataMode: true});
  if(!$('#topnav').length) return true;
  EDMG.setSticky();
  EDMG.setActiveNav(window.location.hash);
  EDMG.toggleSideNav();
  EDMG.scrollToSection(window.location.hash.toString().replace('#', ''));
  $(window).bind('resize', function(e){
    window.resizeEvt;
    $(window).resize(function(){
      clearTimeout(window.resizeEvt);
      window.resizeEvt=setTimeout(function(){
        EDMG.setStickyParams();
        EDMG.toggleSideNav();
        EDMG.checkScroll();
      }, 250);
    });
  });
});
