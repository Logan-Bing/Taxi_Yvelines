from django.urls import path
from .views import ContactSuccessView, ContactView

urlpatterns = [
    path("contact/", ContactView.as_view(), name="contact"),
    path("contact_success/", ContactSuccessView.as_view(), name="contact_success"),
]
