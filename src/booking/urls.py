from django.urls import path
from . import views

urlpatterns = [
    path("contact_success/", views.get_success, name="success"),
    path("", views.index, name="home"),
]
