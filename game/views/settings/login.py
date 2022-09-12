from django.http import JsonResponse
from django.contrib.auth import authenticate, login

def sigin(request):
    # print("GGGGGGGGoooooooTTTTTT")
    data = request.GET
    username = data.get('username')
    password = data.get('password')
    user = authenticate(username = username, password = password)
    if not user:
        return JsonResponse({
            'result': "用户名和密码不正确",
        })
    else:
        login(request, user)
        return JsonResponse({
        'result': "success",
        })

