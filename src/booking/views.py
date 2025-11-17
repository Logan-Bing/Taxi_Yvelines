from django.conf import settings
from django.shortcuts import render
from django.core.mail import send_mail
import logging
logger = logging.getLogger(__name__)

def index(request):
    if request.method == "POST":
        try:
            first_name = request.POST.get("first_name")
            surname = request.POST.get("surname")
            phone_number = request.POST.get("phone_number")
            start = request.POST.get("start") or request.POST.get("start address-search")
            end = request.POST.get("end") or request.POST.get("end address-search")
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

                📍 Adresse de départ : {start}
                📍 Adresse d’arrivée : {end}

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

            return render(request, "booking/contact_success.html", {
                 "first_name": first_name,
                 "surname": surname,
                 "phone_number": phone_number,
                 "start": start,
                 "end": end,
                 "date": date,
                 "hour": hour,
                 "email": email,
                 "messagge" : message
            })
        except Exception as e:
            logger.execpion("Erreur lors du traitement du formulaire")

    return render(request, "core/index.html", { "mapbox_api_key": settings.MAPBOX_API_KEY })

def get_success(request):
    return render(request, "booking/contact_success.html")
