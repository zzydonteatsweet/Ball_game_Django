from django.urls import path
from game.views.settings.acwing.web.apply_code import apply_code
from game.views.settings.acwing.web.receive_code import receive_code
from game.views.settings.acwing.acapp.apply_code import acapp_apply_code
from game.views.settings.acwing.acapp.receive_code import receive_code as acapp_receive_code
urlpatterns = [
    path('web/apply_code', apply_code, name = 'web_apply_code'),
    path('web/receive_code/', receive_code, name = 'web_receive_code'),
    path('acapp/apply_code/', acapp_apply_code, name = 'acapp_apply_code'), 
    path('acapp/receive_code/', acapp_receive_code, name = 'acapp_receive_code'),
]