from django.urls import path
from . import views

urlpatterns = [
    path("contact_success/", views.get_success, name="success"),
    path("home/", views.index, name="home"),
]
