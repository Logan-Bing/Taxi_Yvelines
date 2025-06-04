from django.http import HttpResponseRedirect
from django.conf import settings
from django.shortcuts import render
from django.core.mail import send_mail

from .forms import ContactForm

def get_success(request):
    return render(request, "booking/contact_success.html")

def get_booking(request):

    if request.method == "POST":

            first_name = request.POST.get("first_name")
            surname = request.POST.get("surname")
            phone_number = request.POST.get("phone_number")
            starting_address = request.POST.get("starting_address")
            arrival_address = request.POST.get("arrival_address")
            date = request.POST.get("date")
            hour = request.POST.get("hour")
            subject = "Vous avez reçu une nouvelle demande de course via le formulaire du site. Voici les détails du client :"
            email = request.POST.get("email")
            message = request.POST.get("message")

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

            return HttpResponseRedirect("/contact_success/")

    return render(request, "booking/contact.html")
