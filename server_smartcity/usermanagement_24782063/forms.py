from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm

from .models import User


class LoginForm(AuthenticationForm):
    username = forms.CharField(
        label="Username",
        widget=forms.TextInput(
            attrs={
                "class": "form-control",
                "placeholder": "Masukkan username",
            }
        ),
    )
    password = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control",
                "placeholder": "Masukkan password",
            }
        ),
    )


class CitizenRegistrationForm(UserCreationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        placeholders = {
            "username": "Tentukan username akun",
            "email": "Masukkan email aktif",
            "password1": "Masukkan password",
            "password2": "Ulangi password",
        }

        for field_name, field in self.fields.items():
            field.widget.attrs.update(
                {
                    "class": "form-control",
                    "placeholder": placeholders.get(field_name, ""),
                }
            )

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "email")
        labels = {
            "username": "Username",
            "email": "Email",
        }

    def save(self, commit=True):
        user = super().save(commit=False)
        user.is_admin = False
        user.is_member = True

        if commit:
            user.save()

        return user
