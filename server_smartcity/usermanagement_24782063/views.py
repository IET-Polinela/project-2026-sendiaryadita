from django.contrib import messages
from django.contrib.auth.views import LoginView, LogoutView
from django.views.generic import CreateView
from django.urls import reverse_lazy

from .forms import CitizenRegistrationForm, LoginForm


class CitizenLoginView(LoginView):
    template_name = "usermanagement_24782063/login.html"
    authentication_form = LoginForm
    redirect_authenticated_user = True

    def form_valid(self, form):
        messages.success(self.request, "Masuk berhasil. Selamat datang kembali.")
        return super().form_valid(form)

    def get_success_url(self):
        return self.get_redirect_url() or str(reverse_lazy("home"))


class CitizenLogoutView(LogoutView):
    next_page = reverse_lazy("login")

    def post(self, request, *args, **kwargs):
        messages.success(request, "Keluar berhasil.")
        return super().post(request, *args, **kwargs)


class CitizenRegisterView(CreateView):
    form_class = CitizenRegistrationForm
    template_name = "usermanagement_24782063/register.html"
    success_url = reverse_lazy("login")

    def form_valid(self, form):
        response = super().form_valid(form)
        messages.success(self.request, "Registrasi berhasil. Silakan masuk dengan akun baru kamu.")
        return response
