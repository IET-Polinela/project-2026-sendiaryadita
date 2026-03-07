from django.http import HttpResponse

def welcome(request):
    html = """
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome</title>
      </head>
      <body style="font-family: Arial, sans-serif;">
        <h1 style="font-size: 64px; margin: 40px;">Selamat Datang</h1>
      </body>
    </html>
    """
    return HttpResponse(html)
