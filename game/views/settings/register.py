from django.http import JsonResponse
from django.contrib.auth import login
from django.contrib.auth.models import User
from game.models.player.player import Player

def register(request):
    data = request.GET
    username = data.get('username').strip()
    password = data.get('password', "").strip() 
    password_confirm = data.get('password_confirm', "").strip() 

    print(username)
    print(password)
    print(password_confirm)
    if not username or not password:
        return JsonResponse({
            'result': "用户名密码不能为空",
        })
    elif password != password_confirm:
        return JsonResponse({
            'result': "两次密码不一样",
        })
    elif User.objects.filter(username=username).exists():
        return JsonResponse({
            'result':"用户已经存在",
        })

    user = User(username = username)
    user.set_password(password)
    user.save()

    Player.objects.create(user=user, photo="https://cdn.acwing.com/media/article/image/2021/11/18/1_ea3d5e7448-logo64x64_2.png")
    login(request, user)

    return JsonResponse({
        'result': "success",
    })

    
