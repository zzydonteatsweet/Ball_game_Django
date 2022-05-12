from django.http import HttpResponse


# Create your views here.
def index(request):
    line1 = '<h1 style="text-align : center">"术士之战"</h1>'
    return HttpResponse("我的第一个网页" + line1)
