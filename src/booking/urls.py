from django.urls import path
from . import views

urlpatterns = [
    path("contact/", views.get_booking, name="contact"),
    path("contact_success/", views.get_success, name="success"),
    path("test_hero/", views.test_hero, name="test_hero"),
]
