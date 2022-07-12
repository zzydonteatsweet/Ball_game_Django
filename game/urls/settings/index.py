from django.urls import path, include
from game.views.settings.getinfo import getinfo
from game.views.settings.login import sigin
from game.views.settings.register import register
from game.views.settings.logout import signout
urlpatterns = [
    path('getinfo/', getinfo, name="getinfo"), 
    path('login/', sigin, name = "settings_login"),
    path('register/', register, name = "settings_register") ,
    path('logout/', signout, name = "settings_signout"),
    path('acwing/', include("game.urls.settings.acwing.index"))
]