from django.shortcuts import render, reverse
from django.conf import settings
from django.core.mail import send_mail
from django.views.generic import TemplateView, FormView
from django.urls import reverse_lazy

from .forms import ContactForm


class ContactSuccessView(TemplateView):
    template_name = "booking/contact_success.html"

class ContactView(FormView):
    form_class = ContactForm
    template_name = "booking/contact.html"
    success_url = reverse_lazy("contact_success")

    def form_valid(self, form):
        first_name = form.cleaned_data.get("first_name")
        surname = form.cleaned_data.get("surname")
        phone_number = form.cleaned_data.get("phone_number")
        starting_address = form.cleaned_data.get("starting_address")
        arrival_address = form.cleaned_data.get("arrival_address")
        date = form.cleaned_data.get("date")
        hour = form.cleaned_data.get("hour")
        subject = "Vous avez reçu une nouvelle demande de course via le formulaire du site. Voici les détails du client :"
        email = form.cleaned_data.get("email")
        message = form.cleaned_data.get("message")

        full_meesage = f"""
            {subject}
            
            👤 Nom : {first_name} {surname}
            📞 Téléphone : {phone_number}
            📧 Email : {email}

            📍 Adresse de départ : {starting_address}
            📍 Adresse d’arrivée : {arrival_address}

            📅 Date : {date}
            🕒 Heure : {hour}

            💬 Message du client :
            {message}

            Merci de prendre contact avec le client dès que possible pour confirmer la course.

            —
            Ceci est un message automatique envoyé depuis votre site internet.
            """

        send_mail(
            subject="Nouvelle Réservation",
            message=full_meesage,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.NOTIFY_EMAIL]
        )
        return super(ContactView, self).form_valid(form)
