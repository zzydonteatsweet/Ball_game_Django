from django.urls import path
from game.views.index import index

urlpatterns = [
    path("", index, name = 'index'),
]
