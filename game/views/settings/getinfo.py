from django.http import JsonResponse
from game.models.player.player import Player

def getinfo_acapp(request):
    user = request.user
    return JsonResponse({
        'result': "success",
        'username': player.user.username,
        'photo': player.phtot,
    })

def getinfo_web(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            'result': "未登录"
        })
    else:
        player = Player.objects.get(user=user)
        return JsonResponse({
            'result': "success",
            'username': player.user.username,
            'photo': player.photo,
        })

def getinfo(request):
    # return JsonResponse({
    #     'result': "Yes",
    # })
    platform = request.GET.get('platform')
    if platform == 'ACAPP':
        return getinfo_acapp(request)
    else:
        return getinfo_web(request)

