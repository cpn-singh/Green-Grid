from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "user": UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class ContactInquiryView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from .serializers import ContactInquirySerializer
        import random
        from django.core.mail import send_mail
        from django.conf import settings
        import logging

        logger = logging.getLogger(__name__)

        data = request.data.copy()
        if not data.get('ticket_id'):
            data['ticket_id'] = f"SYL-INQ-{random.randint(100000, 999999)}"

        serializer = ContactInquirySerializer(data=data)
        if serializer.is_valid():
            inquiry = serializer.save()

            # Format email notification for cpnsingh2001@gmail.com
            recipient = getattr(settings, 'CONTACT_INQUIRY_RECIPIENT', 'cpnsingh2001@gmail.com')
            subject = f"[SYLVRA Inquiry - {inquiry.ticket_id}] {inquiry.inquiry_type} from {inquiry.name}"
            body = (
                f"NEW CLIENT INQUIRY TRANSMITTED VIA SYLVRA PLATFORM\n"
                f"====================================================\n\n"
                f"Ticket Reference: {inquiry.ticket_id}\n"
                f"Client Name:      {inquiry.name}\n"
                f"Work Email:       {inquiry.email}\n"
                f"Phone / WhatsApp: {inquiry.phone or 'Not provided'}\n"
                f"Organization:     {inquiry.organization or 'Not provided'}\n"
                f"Inquiry Category: {inquiry.inquiry_type}\n\n"
                f"Client Message:\n"
                f"----------------------------------------------------\n"
                f"{inquiry.message}\n"
                f"----------------------------------------------------\n\n"
                f"Quick Actions:\n"
                f"• Reply to Client:  mailto:{inquiry.email}\n"
                f"• Open in Admin:    /admin/accounts/contactinquiry/{inquiry.id}/change/\n"
            )

            try:
                send_mail(
                    subject=subject,
                    message=body,
                    from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'notifications@sylvra.energy'),
                    recipient_list=[recipient],
                    fail_silently=True,
                )
            except Exception as e:
                logger.error(f"Inquiry email dispatch warning: {e}")

            # Also dispatch to FormSubmit for guaranteed inbox delivery to cpnsingh2001@gmail.com
            try:
                import urllib.request, json
                fs_data = {
                    'name': inquiry.name,
                    'email': inquiry.email,
                    '_replyto': inquiry.email,
                    'phone': inquiry.phone or 'Not provided',
                    'organization': inquiry.organization or 'Not provided',
                    'inquiry_type': inquiry.inquiry_type,
                    'message': inquiry.message,
                    'ticket_id': inquiry.ticket_id,
                    '_subject': f"[SYLVRA Inquiry - {inquiry.ticket_id}] {inquiry.inquiry_type} from {inquiry.name}",
                    '_template': 'table',
                    '_captcha': 'false'
                }
                fs_req = urllib.request.Request(
                    f"https://formsubmit.co/ajax/{recipient}",
                    data=json.dumps(fs_data).encode('utf-8'),
                    headers={
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                        'Origin': 'https://frontend-mu-seven-63.vercel.app',
                        'Referer': 'https://frontend-mu-seven-63.vercel.app/'
                    }
                )
                urllib.request.urlopen(fs_req, timeout=4)
            except Exception as fs_err:
                logger.warning(f"FormSubmit HTTPS forward error: {fs_err}")

            return Response({
                "success": True,
                "ticket_id": inquiry.ticket_id,
                "message": "Inquiry recorded successfully and transmitted to energy dispatch team."
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

