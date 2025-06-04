from django.urls import path
from . import views

urlpatterns = [
    path("contact/", views.get_booking, name="contact"),
    path("contact_success/", views.get_success, name="success")
]
