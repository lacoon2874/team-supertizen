from django.urls import path
from . import views


urlpatterns = [
    path('test/<str:rate>/<str:formattedDate>/<str:locateInfo>/<str:schedule>/<int:count>/', views.mlp),
    path('test2', views.test),
    path('update', views.update)
]