from django import forms


class ContactForm(forms.Form):
    first_name = forms.CharField(label="Prénom",
                           max_length=100,
                           widget=forms.TextInput(attrs={"placeholder": "Jhon"}))
    surname = forms.CharField(label="Nom",
                              max_length=100,
                              widget=forms.TextInput(attrs={"placeholder": "Doe"}))
    phone_number = forms.CharField(
                        max_length=10,
                        label="Numéro de téléphone",
                        widget=forms.TextInput(attrs={"placeholder": "0101010101",}))
    email = forms.EmailField(
        widget=forms.TextInput(attrs={"placeholder": "Your e-mail"})
    )
    starting_address = forms.CharField(
        max_length=255,
        label="Adresse de départ",
        widget=forms.TextInput(attrs={
            "id":"start",
            "placeholder": "699 avenue aristide briand",
            "autocomplete": "street-address"
            })
    )
    arrival_address = forms.CharField(
        max_length=255,
        label="Adresse d'arrivé",
        widget=forms.TextInput(attrs={
            'id': 'end',
            "placeholder": "5 place de la liberté",
            "autocomplete": "street-address"
        })
    )
    date = forms.DateField(
        label="Date de la course",
        widget=forms.DateInput(
            attrs={'placeholder': 'jj-mm-aaaa', 'type': 'date'},
        )
    )
    hour = forms.TimeField(
        label="Heure de la course",
        input_formats=['%H:%M'],
        widget=forms.TimeInput(
            attrs={
                'type': 'time',
                'placeholder': 'hh:mm',
            },
            format='%H:%M'
        )
    )
    message = forms.CharField(
        widget=forms.Textarea(attrs={"placeholder": "Your message"})
        )
