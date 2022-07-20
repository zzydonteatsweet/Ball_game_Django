from django.http import JsonResponse
from urllib.parse import quote
from random import randint
from django.core.cache import cache

def get_state():
    res = "" 
    for i in range(8):
        res = res + str(randint(0, 9))
    return res 

def acapp_apply_code(request):
    appid = "1841"
    redirect_uri = quote("https://app1841.acapp.acwing.com.cn/settings/acwing/acapp/receive_code/")
    scope = "userinfo"
    state = get_state()
    cache.set(state, True, 7200)

    # apply_code_url = "https://www.acwing.com/third_party/api/oauth2/acapp/authorize/"

    return JsonResponse({
        'result':"success",
        'appid':appid,
        'redirect_uri': redirect_uri,
        'scope': scope,
        'state': state,
    })

