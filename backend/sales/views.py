# views.py
from django.forms import ValidationError
from rest_framework import generics, status, permissions,viewsets
from rest_framework.response import Response
from .models import AddAccountData,Opportunity,AddTargetData,AddTaskData,User,FormSettingsStore
from rest_framework import  permissions
from .serializers import AddTaskDataUpdateSerializer, RegisterSerializer, LoginSerializer, LogoutSerializer,AddAccountDataSerializer,OpportunitySerializer,AddTargetDataSerializer,AddTaskDataSerializer,UserSerializer,ManagerLoginSerializer
from django.contrib import messages
from rest_framework.exceptions import ValidationError,NotFound
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import random
from django.core.mail import send_mail
from django.conf import settings
import numpy as np
from PIL import Image as PILImage, ImageEnhance, ImageFilter
from io import BytesIO
import logging

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import AddAccountData, Contact, VisitingCard
from .serializers import AddAccountDataSerializer, VisitingCardSerializer
from .visiting_card_utils import parse_card_with_groq

logger = logging.getLogger(__name__)

# Lazy OCR reader to avoid blocking app startup on model download.
_easyocr_reader = None

RANK_LABELS = {'Rank A', 'Rank B', 'Rank C', 'Rank D', 'Rank E'}
MONTH_NAME_TO_NUM = {
    'January': 1,
    'February': 2,
    'March': 3,
    'April': 4,
    'May': 5,
    'June': 6,
    'July': 7,
    'August': 8,
    'September': 9,
    'October': 10,
    'November': 11,
    'December': 12,
}


def get_easyocr_reader():
    global _easyocr_reader
    if _easyocr_reader is not None:
        return _easyocr_reader
    try:
        import easyocr
        _easyocr_reader = easyocr.Reader(['en'], gpu=False)
        return _easyocr_reader
    except Exception as e:
        logger.warning(f"EasyOCR not available: {e}")
        return None


def resolve_fiscal_month_year(selected_year: int, selected_month_name: str):
    month_num = MONTH_NAME_TO_NUM.get(selected_month_name)
    if not month_num:
        raise ValueError(f"Unknown month: {selected_month_name}")
    month_year = selected_year + 1 if month_num in [1, 2, 3] else selected_year
    return month_num, month_year


def get_month_end_rank_snapshot(*, user_ids, selected_year: int, selected_month_name: str):
    import calendar
    from datetime import date

    month_num, month_year = resolve_fiscal_month_year(selected_year, selected_month_name)
    month_end = date(month_year, month_num, calendar.monthrange(month_year, month_num)[1])

    stages = (
        Opportunity_Stage.objects
        .filter(
            add_opportunity__user_id__in=user_ids,
            last_update__lte=month_end,
        )
        .order_by('add_opportunity_id', '-last_update', '-id')
    )

    rank_to_ids = {rank: set() for rank in RANK_LABELS}
    seen_opp_ids = set()

    for stage in stages:
        opp_id = stage.add_opportunity_id
        if opp_id in seen_opp_ids:
            continue

        seen_opp_ids.add(opp_id)
        rank_label = stage.ranks if stage.ranks in RANK_LABELS else stage.stages if stage.stages in RANK_LABELS else None
        if rank_label:
            rank_to_ids[rank_label].add(opp_id)

    return rank_to_ids


def get_month_end_stage_details(*, user_ids, selected_year: int, selected_month_name: str):
    import calendar
    from datetime import date

    month_num, month_year = resolve_fiscal_month_year(selected_year, selected_month_name)
    month_end = date(month_year, month_num, calendar.monthrange(month_year, month_num)[1])

    stages = (
        Opportunity_Stage.objects
        .filter(
            add_opportunity__user_id__in=user_ids,
            last_update__lte=month_end,
        )
        .order_by('add_opportunity_id', '-last_update', '-id')
    )

    latest_stage_by_opp = {}
    for stage in stages:
        opp_id = stage.add_opportunity_id
        if opp_id in latest_stage_by_opp:
            continue
        latest_stage_by_opp[opp_id] = stage

    return latest_stage_by_opp
 
# Create your views here.


from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import LoginSerializer

class ManagerLoginAPIView(APIView):
    serializer_class = LoginSerializer

    def post(self, request):
        # Get the data from the request
        serializer = self.serializer_class(data=request.data)

        # Validate and check credentials
        if serializer.is_valid():
            # Return the tokens along with a success message
            return Response({
                'message': 'Login successful',
                'access_token': serializer.validated_data['access_token'],
                'refresh_token': serializer.validated_data['refresh_token']
            }, status=status.HTTP_200_OK)
        
        # Return error message if validation fails
        return Response({
            'message': 'Login failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)




class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({'message': 'Success'}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({'message': 'Registration failed', 'errors': e.detail}, status=status.HTTP_400_BAD_REQUEST)
            
# class LoginAPIView(generics.GenericAPIView):
#     serializer_class = LoginSerializer

#     def post(self, request):
#         serializer = self.serializer_class(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
# views.py
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer
from rest_framework.permissions import IsAuthenticated
class LoginAPIView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']

            # Generate JWT tokens for the user
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return Response({
                'message': 'Login successful',
                'username': user.username,
                'email':user.email, 
                'role': user.role,  # Include the user's role in the response
                'tokens': {
                    'access': access_token,
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_200_OK)

        except ValidationError as e:
            errors = e.detail
            first_error = 'Login failed'

            if isinstance(errors, dict):
                for value in errors.values():
                    if isinstance(value, list) and value:
                        first_error = str(value[0])
                        break
                    if isinstance(value, str):
                        first_error = value
                        break
            elif isinstance(errors, list) and errors:
                first_error = str(errors[0])
            elif isinstance(errors, str):
                first_error = errors

            return Response({
                'message': first_error,
                'errors': errors
            }, status=status.HTTP_400_BAD_REQUEST)

        

class LogoutAPIView(generics.GenericAPIView):
    serializer_class = LogoutSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)




class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

from rest_framework import generics, status
from rest_framework.response import Response

# class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
# views.py
# from django.contrib.auth import get_user_model
# from rest_framework import generics, status
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated

# User = get_user_model()

# class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [IsAuthenticated]

#     def update(self, request, *args, **kwargs):
#         partial = kwargs.pop('partial', True)  # ← allow partial updates
#         instance = self.get_object()
#         serializer = self.get_serializer(instance, data=request.data, partial=partial)

#         if serializer.is_valid():
#             serializer.save()
#             return Response({'message': 'User updated successfully.', 'user': serializer.data}, status=status.HTTP_200_OK)

#         print("Update errors:", serializer.errors)  # ← check terminal for exact error
#         return Response({'message': 'Failed to update.', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

#     def destroy(self, request, *args, **kwargs):
#         instance = self.get_object()
#         instance.delete()
#         return Response({'message': 'User deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    
# views.py
# from django.contrib.auth import get_user_model
# from rest_framework.permissions import IsAuthenticated
# User = get_user_model()  # ← make sure this is at the top of views.py

# class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = User.objects.all()  # ← must use get_user_model(), not default User
#     serializer_class = UserSerializer
#     permission_classes = [IsAuthenticated]

#     def update(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = self.get_serializer(instance, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(
#                 {'message': 'User updated successfully.', 'user': serializer.data},
#                 status=status.HTTP_200_OK
#             )
#         print("Update errors:", serializer.errors)
#         return Response(
#             {'message': 'Failed to update.', 'errors': serializer.errors},
#             status=status.HTTP_400_BAD_REQUEST
#         )

#     def destroy(self, request, *args, **kwargs):
#         instance = self.get_object()
#         instance.delete()
#         return Response(
#             {'message': 'User deleted successfully.'},
#             status=status.HTTP_200_OK
#         )

# views.py

from django.contrib.auth import get_user_model  # ← add this
from rest_framework.permissions import IsAuthenticated
User = get_user_model()  # ← add this at top of file

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()  # ← must use get_user_model(), not imported User
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'User updated successfully.', 'user': serializer.data},
                status=status.HTTP_200_OK
            )
        print("Update errors:", serializer.errors)
        return Response(
            {'message': 'Failed to update.', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(
            {'message': 'User deleted successfully.'},
            status=status.HTTP_200_OK
        )


class AccountFormSettingsAPIView(APIView):
    """
    Stores and returns the shared account/opportunity form configuration.
    """

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get(self, request):
        store = FormSettingsStore.objects.filter(key='default').first()
        return Response({"account": store.account if store else {}}, status=status.HTTP_200_OK)

    def post(self, request):
        return self._save_settings(request)

    def put(self, request):
        return self._save_settings(request)

    def patch(self, request):
        return self._save_settings(request)

    def _save_settings(self, request):
        payload = request.data
        if isinstance(payload, dict) and 'account' in payload:
            payload = payload.get('account')

        if payload is None:
            payload = {}

        if not isinstance(payload, dict):
            return Response(
                {
                    "message": "Invalid payload",
                    "errors": {"account": ["Expected an object."]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        store, _created = FormSettingsStore.objects.get_or_create(key='default')
        store.account = payload
        store.save()
        return Response({"account": store.account, "message": "Success"}, status=status.HTTP_200_OK)


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()  # ← same fix here
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]        

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import AddAccountData
from .serializers import AddAccountDataSerializer

class AccountViewSet(viewsets.ModelViewSet):
    queryset = AddAccountData.objects.all()
    serializer_class = AddAccountDataSerializer

    def list(self, request, *args, **kwargs):
        print("Incoming request received:", request)
        response = super().list(request, *args, **kwargs)
        print("Response data being sent:", response.data)
        return response

    def retrieve(self, request, pk=None):
        print(f"Retrieve request for ID: {pk}")
        account = get_object_or_404(AddAccountData, pk=pk)
        serializer = self.get_serializer(account)
        print("Retrieved data:", serializer.data)
        return Response(serializer.data)

    def update(self, request, pk=None):
        print(f"Update request for ID: {pk} with data: {request.data}")
        account = get_object_or_404(AddAccountData, pk=pk)
        serializer = self.get_serializer(account, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            print("Updated data:", serializer.data)
            return Response({"message": "success"}, status=status.HTTP_200_OK)
        print("Update failed. Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        print(f"Delete request for ID: {pk}")
        account = get_object_or_404(AddAccountData, pk=pk)
        account.delete()
        print("Deleted successfully")
        return Response({"message": "Deleted successfully"}, status=status.HTTP_200_OK)




from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import generics

class AddAccountDataListCreateView(generics.ListCreateAPIView):
    queryset = AddAccountData.objects.all()
    serializer_class = AddAccountDataSerializer
    
    def get_queryset(self):
        return AddAccountData.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            # Print the input data (request.data contains the request body data)
            print("Input Data:", request.data)  # This will print the incoming request data
            
            response = super().create(request, *args, **kwargs)
            
            return Response({'message': 'Success'}, status=status.HTTP_201_CREATED)
        
        except ValidationError as e:
            return Response(
                {'message': 'Validation Error', 'details': e.detail},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        except Exception as e:
            return Response({'message': 'ffd'}, status=status.HTTP_400_BAD_REQUEST)




from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import AddAccountData
from .serializers import AddAccountDataSerializer

class AddAccountDataDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddAccountDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AddAccountData.objects.filter(user=self.request.user)

    def get(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except AddAccountData.DoesNotExist:
            return Response({'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
            # print("Updated Data:", serializer.data)
            return Response({"message": "success"}, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({'message': 'Failed', 'errors': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except AddAccountData.DoesNotExist:
            return Response({'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response({'message': 'Success'}, status=status.HTTP_204_NO_CONTENT)
        except AddAccountData.DoesNotExist:
            return Response({'message': 'Success'}, status=status.HTTP_404_NOT_FOUND)


# card scanning views
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
# =============================================================================
# STEP 1 — Scan: OCR + Groq parse, return structured data (nothing saved yet)
# POST /api/visiting-cards/scan/
# =============================================================================
@method_decorator(csrf_exempt, name='dispatch')
class VisitingCardScanView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'error': 'No image provided'}, status=400)

        reader = get_easyocr_reader()
        if reader is None:
            return Response({'error': 'OCR service unavailable'}, status=503)

        try:
            image = PILImage.open(image_file).convert('RGB')

            # Upscale small images so tiny punctuation (dots, hyphens) is more visible to OCR
            w, h = image.size
            if w < 1800:
                scale = 1800 / w
                image = image.resize((int(w * scale), int(h * scale)), PILImage.LANCZOS)

            # Sharpen and boost contrast — keep color so small dots stay visible to OCR
            image = image.filter(ImageFilter.SHARPEN)
            image = image.filter(ImageFilter.SHARPEN)
            image = ImageEnhance.Contrast(image).enhance(1.5)

            img_np = np.array(image)

            results = reader.readtext(img_np, detail=0)
            raw_text = '\n'.join(results)

            parsed = parse_card_with_groq(raw_text)
            parsed['raw_text'] = raw_text

            return Response({'success': True, 'raw_text': raw_text, 'parsed': parsed})

        except Exception as e:
            logger.error(f"Card scan error: {e}")
            return Response({'error': str(e)}, status=500)


# =============================================================================
# STEP 2 — Save: persist the VisitingCard record (intermediate store)
# POST /api/visiting-cards/save/
# =============================================================================
@method_decorator(csrf_exempt, name='dispatch')
class VisitingCardSaveView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        image_file = request.FILES.get('image')

        card = VisitingCard(
            person_name  = data.get('person_name', ''),
            company_name = data.get('company_name', ''),
            email        = data.get('email', '') or None,
            phone        = data.get('phone', ''),
            designation  = data.get('designation', ''),
            address      = data.get('address', ''),
            region       = data.get('region', ''),
            location     = data.get('location', ''),
            vertical     = data.get('vertical', ''),
            raw_text     = data.get('raw_text', ''),
            status       = 'processed',
            created_by   = request.user,
        )
        if image_file:
            card.image = image_file
        card.save()

        return Response({'success': True, 'id': card.id, 'message': 'Visiting card saved'}, status=201)


# =============================================================================
# STEP 3 — Convert: VisitingCard → AddAccountData + Contact
# POST /api/visiting-cards/<id>/to-contact/
# =============================================================================
@method_decorator(csrf_exempt, name='dispatch')
class VisitingCardToContactView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            card = VisitingCard.objects.get(pk=pk)
        except VisitingCard.DoesNotExist:
            return Response({'error': 'Visiting card not found'}, status=404)

        data = request.data  # frontend can override any card field here

        # Pull values — request data takes priority over card data
        person_name  = data.get('person_name',  card.person_name  or '')
        company_name = data.get('company_name', card.company_name or '')
        email        = data.get('email',        card.email        or '')
        phone        = data.get('phone',        card.phone        or '')
        designation  = data.get('designation',  card.designation  or '')
        address      = data.get('address',      card.address      or '')
        region       = data.get('region',       card.region       or '')
        location     = data.get('location',     card.location     or '')
        vertical     = data.get('vertical',     card.vertical     or '')

        # ── Create AddAccountData (the "account") ────────────────────────
        account = AddAccountData.objects.create(
            account_name  = company_name,
            designation   = designation,
            mobile_number = phone,
            email_id      = email,
            address       = address,
            region        = region,
            location      = location,
            vertical      = vertical,
            user          = request.user,
        )

        # ── Create Contact child under that account ───────────────────────
        contact = Contact.objects.create(
            add_account_data = account,
            name             = person_name,
            designation      = designation,
            mobile_no        = phone,
            email_id         = email,
            category         = 'plant_head',   # default; user can change later
        )

        # ── Mark visiting card as saved ───────────────────────────────────
        card.status  = 'saved'
        card.account = account
        card.save()

        return Response({
            'success':    True,
            'account_id': account.id,
            'contact_id': contact.id,
            'message':    f"Account & contact for '{person_name}' created successfully!",
        }, status=201)





from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Opportunity, AddAccountData
from .serializers import OpportunitySerializer

class FetchMatchingOpportunitiesAPIView(APIView):
    def get(self, request, *args, **kwargs):
        account_name = request.query_params.get('account_name')  # Extract account_name from query parameters
        if not account_name:
            return Response(
                {"error": "account_name parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the account_name exists in AddAccountData
        if not AddAccountData.objects.filter(account_name=account_name).exists():
            return Response(
                {"error": f"No record found in AddAccountData for account_name: {account_name}"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Fetch matching opportunities
        matching_opportunities = Opportunity.objects.filter(account_name=account_name)

        # Serialize the opportunities
        serializer = OpportunitySerializer(matching_opportunities, many=True)

        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)





# from rest_framework import viewsets
# from rest_framework.response import Response
# from rest_framework.decorators import action
# from .models import AddAccountData
# from .serializers import AddAccountDataSerializer

# class AutofillAccountDataViewSet(viewsets.ViewSet):
#     def list(self, request):
#         # List all account names for the dropdown
#         accounts = AddAccountData.objects.all().values('id', 'account_name')
#         return Response(accounts)

#     @action(detail=True, methods=['get'])
#     def details(self, request, pk=None):
#         # Get details for the selected account_name
#         try:
#             account = AddAccountData.objects.get(id=pk)
#             serializer = AddAccountDataSerializer(account)
#             return Response(serializer.data)
#         except AddAccountData.DoesNotExist:
#             return Response({'error': 'Account not found'}, status=404)

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import AddAccountData
from .serializers import AddAccountDataSerializer

class AutofillAccountDataViewSet(viewsets.ViewSet):

    def list(self, request):
        # List all account names for the dropdown
        accounts = AddAccountData.objects.all().values('id', 'account_name')
        return Response(list(accounts))

    @action(detail=True, methods=['get'])
    def details(self, request, pk=None):
        # ── FIX: look up by account_name instead of id ──
        try:
            # First try by account_name (new behaviour)
            account = AddAccountData.objects.get(account_name=pk)
        except AddAccountData.DoesNotExist:
            # Fallback: try by numeric id (old behaviour)
            try:
                account = AddAccountData.objects.get(id=int(pk))
            except (AddAccountData.DoesNotExist, ValueError):
                return Response(
                    {"error": f"Account '{pk}' not found"},
                    status=404
                )
        except AddAccountData.MultipleObjectsReturned:
            # If multiple accounts share the same name, return the first
            account = AddAccountData.objects.filter(account_name=pk).first()

        serializer = AddAccountDataSerializer(account)
        return Response(serializer.data)






# from rest_framework import viewsets, status
# from rest_framework.response import Response
# from rest_framework.decorators import action
# from django.shortcuts import get_object_or_404
# from .models import Opportunity
# from .serializers import OpportunitySerializer

# class OpportunityViewSet(viewsets.ModelViewSet):
#     queryset = Opportunity.objects.all()
#     serializer_class = OpportunitySerializer

#     def list(self, request, *args, **kwargs):
#         print("Incoming GET request received:", request)
#         response = super().list(request, *args, **kwargs)
#         print("Response data being sent:", response.data)
#         return response

#     def retrieve(self, request, pk=None):
#         print(f"Retrieve request for ID: {pk}")
#         opportunity = get_object_or_404(Opportunity, pk=pk)
#         serializer = self.get_serializer(opportunity)
#         print("Retrieved data:", serializer.data)
#         return Response(serializer.data)

#     def update(self, request, pk=None):
#         print(f"Update request for ID: {pk} with data: {request.data}")
#         opportunity = get_object_or_404(Opportunity, pk=pk)
#         serializer = self.get_serializer(opportunity, data=request.data, partial=False)
#         if serializer.is_valid():
#             serializer.save()
#             print("Updated data:", serializer.data)
#             return Response({"message": "success"}, status=status.HTTP_200_OK)
#         print("Update failed. Errors:", serializer.errors)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def destroy(self, request, pk=None):
#         print(f"Delete request for ID: {pk}")
#         opportunity = get_object_or_404(Opportunity, pk=pk)
#         opportunity.delete()
#         print("Deleted successfully")
#         return Response({"message": "Deleted successfully"}, status=status.HTTP_200_OK)
from django.db.models import Sum
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Opportunity, AddAccountData
from .serializers import OpportunitySerializer

class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.all()
    serializer_class = OpportunitySerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        # Build id -> account_name map from AddAccountData
        account_map = {
            str(a['id']): a['account_name']
            for a in AddAccountData.objects.values('id', 'account_name')
        }

        # Replace numeric account_name with real name
        for item in data:
            acct = str(item.get('account_name', '') or '')
            if acct.strip().lstrip('-').isdigit():
                item['account_name'] = account_map.get(acct.strip(), f'Account #{acct.strip()}')

        return Response(data)

    def retrieve(self, request, pk=None, *args, **kwargs):
        response = super().retrieve(request, pk=pk, *args, **kwargs)
        account_map = {
            str(a['id']): a['account_name']
            for a in AddAccountData.objects.values('id', 'account_name')
        }
        acct = str(response.data.get('account_name', '') or '')
        if acct.strip().lstrip('-').isdigit():
            response.data['account_name'] = account_map.get(acct.strip(), f'Account #{acct.strip()}')
        return response

    def update(self, request, pk=None):
        account = get_object_or_404(Opportunity, pk=pk)
        serializer = self.get_serializer(account, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "success"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        account = get_object_or_404(Opportunity, pk=pk)
        account.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_200_OK)






from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import generics

class OpportunityDataListCreateView(generics.ListCreateAPIView):
    queryset = Opportunity.objects.all()
    serializer_class = OpportunitySerializer
    
    def get_queryset(self):
        return Opportunity.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
     try:
        # Print the input data (request.data contains the request body data)
        print("Input Data:", request.data)  # This will print the incoming request data

        response = super().create(request, *args, **kwargs)
        
        return Response({'message': 'Success'}, status=status.HTTP_201_CREATED)
    
     except ValidationError as e:
        print("Validation Error:", e.detail)  # Print the validation error details
        return Response(
            {'message': 'Validation Error', 'details': e.detail},
            status=status.HTTP_400_BAD_REQUEST
        )
    
     except Exception as e:
        # Print the exception message to debug the issue
        print("Unhandled Exception:", str(e))
        return Response(
            {'message': 'An unexpected error occurred.', 'details': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data

        account_map = {
            str(a['id']): a['account_name']
            for a in AddAccountData.objects.values('id', 'account_name')
        }

        for item in data:
            acct = str(item.get('account_name', '') or '')
            if acct.strip().lstrip('-').isdigit():
                item['account_name'] = account_map.get(acct.strip(), f'Account #{acct.strip()}')

        return Response(data)



class OpportunityDataDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OpportunitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        
        return Opportunity.objects.filter(user=self.request.user)
    
    def get(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except NotFound:
            return Response({'messsage': 'Failed'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
     try:
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Print the updated data in the console
        print("Updated Data:", serializer.data)
        
        # Serialize the updated instance and include it in the response
        return Response({"message": "success"}, status=status.HTTP_200_OK)
     except ValidationError as e:
        return Response({'message': 'Failed', 'errors': e.detail}, status=status.HTTP_400_BAD_REQUEST)
     except NotFound:
        return Response({'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)



    def delete(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response({'message': 'Success'}, status=status.HTTP_204_NO_CONTENT)
        except NotFound:
            return Response({'message': 'Success'}, status=status.HTTP_404_NOT_FOUND)







from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import AddTargetData
from .serializers import AddTargetDataSerializer

class AddTargetDataViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing AddTargetData.
    Supports Create, List, Retrieve, Update, and Delete operations.
    """
    queryset = AddTargetData.objects.all()
    serializer_class = AddTargetDataSerializer

    def create(self, request, *args, **kwargs):
        """
        Create a new AddTargetData record along with related TargetContacts.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        """
        List all AddTargetData records.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        """
        Retrieve a specific AddTargetData record by ID.
        """
        try:
            instance = self.get_queryset().get(pk=pk)
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except AddTargetData.DoesNotExist:
            return Response({"error": "Record not found"}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None, *args, **kwargs):
        """
        Update an existing AddTargetData record along with its TargetContacts.
        """
        try:
            instance = self.get_queryset().get(pk=pk)
        except AddTargetData.DoesNotExist:
            return Response({"error": "Record not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "success"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None, *args, **kwargs):
        """
        Delete an AddTargetData record along with related TargetContacts.
        """
        try:
            instance = self.get_queryset().get(pk=pk)
            instance.delete()
            return Response({"message": "Deleted successfully"}, status=status.HTTP_200_OK)
        except AddTargetData.DoesNotExist:
            return Response({"error": "Record not found"}, status=status.HTTP_404_NOT_FOUND)
        











class AddTargetDataListCreateView(generics.ListCreateAPIView):
    serializer_class = AddTargetDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        
        return AddTargetData.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        
        serializer.save(user=self.request.user)


    def create(self, request, *args, **kwargs):
        try:
            
            response = super().create(request, *args, **kwargs)
            
            return Response({'message': 'Success'}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            
            return Response({'message': 'Failed', 'errors': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'message': 'Failed', 'errors': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class AddTargetDataDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddTargetDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        
        return AddTargetData.objects.filter(user=self.request.user)
    

    def get(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response( serializer.data, status=status.HTTP_200_OK)
        except NotFound:
            return Response({'messsage': 'Failed'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response({'message': 'Success'}, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({'message': 'Failed', 'errors': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except NotFound:
            return Response({'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response({'message': 'Success'}, status=status.HTTP_204_NO_CONTENT)
        except NotFound:
            return Response({'message': 'Success'}, status=status.HTTP_404_NOT_FOUND)













from rest_framework import viewsets
from rest_framework.response import Response
from .models import AddTaskData
from .serializers import AddTaskDataSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = AddTaskData.objects.all().select_related("assignedto")  # Optimized Queryset
    serializer_class = AddTaskDataSerializer

    def list(self, request, *args, **kwargs):
        # Use values() for lighter queries if needed
        tasks = self.get_queryset()
        serialized_tasks = self.serializer_class(tasks, many=True)

        # Return response without printing large data (improves speed)
        return Response(serialized_tasks.data)

    def destroy(self, request, pk=None):
        print(f"Delete request for ID: {pk}")
        account = get_object_or_404(AddTaskData, pk=pk)
        account.delete()
        print("Deleted successfully")
        return Response({"message": "Deleted successfully"}, status=status.HTTP_200_OK)




from rest_framework.exceptions import ValidationError
from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import AddTaskData
from .serializers import AddTaskDataSerializer

class AddTaskDataListCreateView(generics.ListCreateAPIView):
    queryset = AddTaskData.objects.all()
    serializer_class = AddTaskDataSerializer
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access this view

    def get_queryset(self):
        # Return only tasks that are assigned to the logged-in user
        return AddTaskData.objects.filter(assignedto=self.request.user)

    def perform_create(self, serializer):
        # Get the assigned user ID from the request data
        assigned_user_id = self.request.data.get('assignedto')

        if assigned_user_id:
            try:
                assigned_user = User.objects.get(id=assigned_user_id)
                # Save with assigned user and the logged-in user's username as 'assigned_by'
                serializer.save(
                    assignedto=assigned_user,
                    assigned_by=self.request.user.username  # Automatically set 'assigned_by'
                )
            except User.DoesNotExist:
                raise ValidationError({"assignedto": "User does not exist."})
        else:
            # Handle the case where no assigned user is provided
            raise ValidationError({"assignedto": "This field is required."})

    def create(self, request, *args, **kwargs):
        try:
            # Print the incoming data for debugging purposes
            print("Input Data:", request.data)
            
            # Call the parent class's create method
            response = super().create(request, *args, **kwargs)
            
            return Response({'message': 'Task successfully created'}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({'message': 'Error creating task', 'details': str(e)}, status=status.HTTP_400_BAD_REQUEST)






from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound, ValidationError

class EditTaskStatusOutcomeView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            task = AddTaskData.objects.get(pk=pk)
        except AddTaskData.DoesNotExist:
            raise NotFound("Task not found")

        # Get the data from the request
        data = request.data

        # Print the patch data to the terminal
        print("Received patch data:", data)

        # Restrict update to only 'status' and 'outcome'
        allowed_fields = ['status', 'outcome']
        update_data = {field: data[field] for field in allowed_fields if field in data}

        if not update_data:
            raise ValidationError("No valid fields provided to update. Allowed fields are: 'status' and 'outcome'.")

        for field, value in update_data.items():
            setattr(task, field, value)

        task.save()
        return Response({
            'message': 'Task updated successfully',
            'updated_fields': update_data
        }, status=status.HTTP_200_OK)






from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import AddTaskData
from .serializers import TaskAcceptStatusSerializer

class TaskAcceptStatusUpdateView(generics.UpdateAPIView):
    queryset = AddTaskData.objects.all()
    serializer_class = TaskAcceptStatusSerializer
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access this view

    def get_object(self):
        # Get the task object to update
        task_id = self.kwargs['pk']
        return AddTaskData.objects.get(id=task_id)

    def patch(self, request, *args, **kwargs):
        task = self.get_object()  # Get the task object

        # Check if the logged-in user is the one assigned to the task
        if task.assignedto != request.user:
            return Response(
                {"message": "You are not assigned to this task."},
                status=status.HTTP_403_FORBIDDEN
            )

        return super().patch(request, *args, **kwargs)  # Proceed with the patch update



from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import AddTaskData
from .serializers import AddTaskDataSerializer

class TaskAssignedByMeListView(generics.ListAPIView):
    queryset = AddTaskData.objects.all()  # Default queryset
    serializer_class = AddTaskDataSerializer
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access this view

    def get_queryset(self):
        print('requested user :' , self.request.user.username)
        # Filter tasks where 'assigned_by' matches the logged-in user
        return AddTaskData.objects.filter(assigned_by=self.request.user.username)








from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import AddTaskData
from .serializers import AddTaskDataSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_user_submitted_tasks(request):
    """
    Lists tasks submitted by the logged-in user.
    """
    try:
        # Filter tasks submitted by the logged-in user
        user_submitted_tasks = AddTaskData.objects.filter(assignedto=request.user)
        serializer = AddTaskDataSerializer(user_submitted_tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"message": "Error retrieving tasks", "details": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )







from datetime import datetime
from django.utils.dateparse import parse_date
from rest_framework import generics
from .models import AddTaskData
from .serializers import AddTaskDataSerializer

class TodaysTaskListView(generics.ListAPIView):
    serializer_class = AddTaskDataSerializer

    def get_queryset(self):
        today = datetime.now().date()

        # Filter tasks where status is "Pending" and end_date matches today
        tasks = AddTaskData.objects.filter(status='Pending', end_date=today)
        return tasks







from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Opportunity

# class OpportunityCategoryTotal(APIView):

#     def get(self, request):
#         # Get all possible choices from the model
#         all_choices = dict(Opportunity.OPPORTUNITY_CHOICES)

#         # Aggregate existing data for all users (no filtering by user)
#         data = (
#             Opportunity.objects
#             .values('opportunity')
#             .annotate(total_amount=Sum('total_amount'))
#         )

#         # Convert queryset to dictionary
#         data_dict = {item['opportunity']: item['total_amount'] for item in data}

#         # Ensure all categories are present in the response, defaulting to 0 if not in data
#         chart_data = {
#             "labels": list(all_choices.values()),  # Labels from choices
#             "totals": [data_dict.get(choice, 0) for choice in all_choices.keys()]  # Get total or default to 0
#         }

#         return Response(chart_data)

# class OpportunityCategoryTotal(APIView):
#     def get(self, request):
#         from datetime import date as dt
#         today         = dt.today()
#         current_month = today.month

#         selected_year = int(request.query_params.get(
#             'year',
#             today.year if current_month >= 4 else today.year - 1
#         ))
#         fy_start = dt(selected_year,     4, 1)
#         fy_end   = dt(selected_year + 1, 3, 31)

#         all_choices = dict(Opportunity.OPPORTUNITY_CHOICES)

#         data = (
#             Opportunity.objects
#             .filter(
#                 acct_created_date__gte=fy_start,
#                 acct_created_date__lte=fy_end,
#             )
#             .values('opportunity')
#             .annotate(total_amount=Sum('total_amount'))
#         )

#         data_dict = {
#             item['opportunity']: item['total_amount']
#             for item in data
#         }

#         chart_data = {
#             "labels": list(all_choices.values()),
#             "totals": [
#                 data_dict.get(choice, 0)
#                 for choice in all_choices.keys()
#             ]
#         }
#         return Response(chart_data)

# class OpportunityCategoryTotal(APIView):
#     def get(self, request):
#         today         = date.today()
#         current_month = today.month

#         MONTH_NAME_TO_NUM = {
#             'January':1,'February':2,'March':3,'April':4,
#             'May':5,'June':6,'July':7,'August':8,
#             'September':9,'October':10,'November':11,'December':12,
#         }

#         selected_year = int(request.query_params.get(
#             'year',
#             today.year if current_month >= 4 else today.year - 1
#         ))
#         selected_month_name = request.query_params.get('month', None)

#         fy_start = date(selected_year,     4, 1)
#         fy_end   = date(selected_year + 1, 3, 31)

#         base_filter = {
#             'acct_created_date__gte': fy_start,
#             'acct_created_date__lte': fy_end,
#         }

#         if selected_month_name and selected_month_name in MONTH_NAME_TO_NUM:
#             selected_month_num = MONTH_NAME_TO_NUM[selected_month_name]
#             month_year = selected_year + 1 if selected_month_num in [1,2,3] else selected_year
#             base_filter = {
#                 'acct_created_date__year':  month_year,
#                 'acct_created_date__month': selected_month_num,
#             }

#         all_choices = dict(Opportunity.OPPORTUNITY_CHOICES)

#         data = (
#             Opportunity.objects
#             .filter(**base_filter)
#             .values('opportunity')
#             .annotate(total_amount=Sum('total_amount'))
#         )

#         data_dict = {
#             item['opportunity']: item['total_amount']
#             for item in data
#         }

#         chart_data = {
#             "labels": list(all_choices.values()),
#             "totals": [
#                 data_dict.get(choice, 0)
#                 for choice in all_choices.keys()
#             ]
#         }
#         return Response(chart_data)

# class OpportunityCategoryTotal(APIView):
#     def get(self, request):
#         today         = date.today()
#         current_month = today.month
#         pic_user_id   = get_optional_pic_user_id(request)

#         selected_year = int(request.query_params.get(
#             'year',
#             today.year if current_month >= 4 else today.year - 1
#         ))
#         selected_month_name = request.query_params.get('month', None)

#         fy_start = date(selected_year, 4, 1)
#         fy_end   = date(selected_year + 1, 3, 31)

#         # Filter directly from opportunities (no Rank A-only restriction)
#         opp_filter = {
#             'acct_created_date__gte': fy_start,
#             'acct_created_date__lte': fy_end,
#         }

#         if selected_month_name and selected_month_name in MONTH_NAME_TO_NUM:
#             selected_month_num = MONTH_NAME_TO_NUM[selected_month_name]
#             month_year = selected_year + 1 if selected_month_num in [1, 2, 3] else selected_year
#             opp_filter = {
#                 'acct_created_date__year': month_year,
#                 'acct_created_date__month': selected_month_num,
#             }

#         if pic_user_id is not None:
#             opp_filter['user_id'] = pic_user_id

#         data = (
#             Opportunity.objects
#             .filter(**opp_filter)
#             .exclude(opportunity__isnull=True)
#             .exclude(opportunity__exact='')
#             .values('opportunity')
#             .annotate(total_amount=Sum('total_amount'))
#             .order_by('-total_amount')
#         )

#         chart_data = {
#             "labels": [item['opportunity'] for item in data],
#             "totals": [item['total_amount'] or 0 for item in data],
#         }
#         return Response(chart_data)

class OpportunityCategoryTotal(APIView):
    def get(self, request):
        today         = date.today()
        current_month = today.month
        pic_user_id   = get_optional_pic_user_id(request)

        selected_year = int(request.query_params.get(
            'year',
            today.year if current_month >= 4 else today.year - 1
        ))
        selected_month_name = request.query_params.get('month', None)

        fy_start = date(selected_year, 4, 1)
        fy_end   = date(selected_year + 1, 3, 31)

        opp_filter = {
            'acct_created_date__gte': fy_start,
            'acct_created_date__lte': fy_end,
        }

        if selected_month_name and selected_month_name in MONTH_NAME_TO_NUM:
            selected_month_num = MONTH_NAME_TO_NUM[selected_month_name]
            month_year = selected_year + 1 if selected_month_num in [1, 2, 3] else selected_year
            opp_filter = {
                'acct_created_date__year': month_year,
                'acct_created_date__month': selected_month_num,
            }

        if pic_user_id is not None:
            opp_filter['user_id'] = pic_user_id

        # ── Opportunity + Make grouped data ──────────────────────
        raw = (
            Opportunity.objects
            .filter(**opp_filter)
            .exclude(opportunity__isnull=True)
            .exclude(opportunity__exact='')
            .values('opportunity', 'make')
            .annotate(total_amount=Sum('total_amount'))
            .order_by('opportunity', '-total_amount')
        )

        # ── Build hierarchical structure ─────────────────────────
        from collections import defaultdict
        opp_map = defaultdict(lambda: {'total': 0, 'makes': defaultdict(int)})

        for row in raw:
            opp  = (row['opportunity'] or '').strip()
            make = (row['make'] or '').strip()
            amt  = row['total_amount'] or 0

            opp_map[opp]['total'] += amt
            if make:
                opp_map[opp]['makes'][make] += amt

        # ── Format response ──────────────────────────────────────
        hierarchical = []
        for opp, opp_data in sorted(
            opp_map.items(),
            key=lambda x: x[1]['total'],
            reverse=True
        ):
            makes = [
                {'make': make, 'total_amount': amt}
                for make, amt in sorted(
                    opp_data['makes'].items(),
                    key=lambda x: x[1],
                    reverse=True
                )
            ]
            hierarchical.append({
                'opportunity':   opp,
                'total_amount':  opp_data['total'],
                'makes':         makes,
            })

        return Response({
            # backward compat flat shape
            'labels': [item['opportunity'] for item in hierarchical],
            'totals': [item['total_amount'] for item in hierarchical],
            # new hierarchical shape
            'hierarchical': hierarchical,
        })

from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Opportunity

# class UserOpportunityCategoryTotal(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         # Get all possible choices from the model
#         all_choices = dict(Opportunity.OPPORTUNITY_CHOICES)

#         # Aggregate existing data
#         data = (
#             Opportunity.objects.filter(user=request.user)
#             .values('opportunity')
#             .annotate(total_amount=Sum('total_amount'))
#         )

#         # Convert queryset to dictionary
#         data_dict = {item['opportunity']: item['total_amount'] for item in data}

#         # Ensure all categories are present in the response, defaulting to 0 if not in data
#         chart_data = {
#             "labels": list(all_choices.values()),  # Labels from choices
#             "totals": [data_dict.get(choice, 0) for choice in all_choices.keys()]  # Get total or default to 0
#         }

#         return Response(chart_data)

# class UserOpportunityCategoryTotal(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         today         = date.today()
#         current_month = today.month

#         selected_year = int(request.query_params.get(
#             'year',
#             today.year if current_month >= 4 else today.year - 1
#         ))
#         selected_month_name = request.query_params.get('month', None)

#         fy_start, fy_end = get_fy_range(selected_year)
#         user             = request.user

#         if selected_month_name and selected_month_name in MONTH_NAME_TO_NUM:
#             month_num, month_year = get_month_filter_nums(
#                 selected_year, selected_month_name
#             )
#             base_filter = {
#                 'acct_created_date__year':  month_year,
#                 'acct_created_date__month': month_num,
#             }
#         else:
#             base_filter = {
#                 'acct_created_date__gte': fy_start,
#                 'acct_created_date__lte': fy_end,
#             }

#         all_choices = dict(Opportunity.OPPORTUNITY_CHOICES)

#         data = (
#             Opportunity.objects
#             .filter(user=user, **base_filter)
#             .values('opportunity')
#             .annotate(total_amount=Sum('total_amount'))
#         )

#         data_dict = {
#             item['opportunity']: item['total_amount']
#             for item in data
#         }

#         chart_data = {
#             "labels": list(all_choices.values()),
#             "totals": [
#                 data_dict.get(choice, 0)
#                 for choice in all_choices.keys()
#             ]
#         }
#         return Response(chart_data)

# class UserOpportunityCategoryTotal(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         today         = date.today()
#         current_month = today.month

#         selected_year = int(request.query_params.get(
#             'year',
#             today.year if current_month >= 4 else today.year - 1
#         ))
#         selected_month_name = request.query_params.get('month', None)

#         fy_start, fy_end = get_fy_range(selected_year)
#         user             = request.user

#         opp_filter = {
#             'user': user,
#             'acct_created_date__gte': fy_start,
#             'acct_created_date__lte': fy_end,
#         }

#         if selected_month_name and selected_month_name in MONTH_NAME_TO_NUM:
#             month_num, month_year = get_month_filter_nums(selected_year, selected_month_name)
#             opp_filter = {
#                 'user': user,
#                 'acct_created_date__year': month_year,
#                 'acct_created_date__month': month_num,
#             }

#         data = (
#             Opportunity.objects
#             .filter(**opp_filter)
#             .exclude(opportunity__isnull=True)
#             .exclude(opportunity__exact='')
#             .values('opportunity')
#             .annotate(total_amount=Sum('total_amount'))
#             .order_by('-total_amount')
#         )

#         chart_data = {
#             "labels": [item['opportunity'] for item in data],
#             "totals": [item['total_amount'] or 0 for item in data],
#         }
#         return Response(chart_data)

class UserOpportunityCategoryTotal(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today         = date.today()
        current_month = today.month

        selected_year = int(request.query_params.get(
            'year',
            today.year if current_month >= 4 else today.year - 1
        ))
        selected_month_name = request.query_params.get('month', None)

        fy_start, fy_end = get_fy_range(selected_year)
        user             = request.user

        opp_filter = {
            'user': user,
            'acct_created_date__gte': fy_start,
            'acct_created_date__lte': fy_end,
        }

        if selected_month_name and selected_month_name in MONTH_NAME_TO_NUM:
            month_num, month_year = get_month_filter_nums(selected_year, selected_month_name)
            opp_filter = {
                'user': user,
                'acct_created_date__year': month_year,
                'acct_created_date__month': month_num,
            }

        # ── Opportunity + Make grouped ───────────────────────────
        raw = (
            Opportunity.objects
            .filter(**opp_filter)
            .exclude(opportunity__isnull=True)
            .exclude(opportunity__exact='')
            .values('opportunity', 'make')
            .annotate(total_amount=Sum('total_amount'))
            .order_by('opportunity', '-total_amount')
        )

        # ── Build hierarchical structure ─────────────────────────
        from collections import defaultdict
        opp_map = defaultdict(lambda: {'total': 0, 'makes': defaultdict(int)})

        for row in raw:
            opp  = (row['opportunity'] or '').strip()
            make = (row['make'] or '').strip()
            amt  = row['total_amount'] or 0

            opp_map[opp]['total'] += amt
            if make:
                opp_map[opp]['makes'][make] += amt

        # ── Format response ──────────────────────────────────────
        hierarchical = []
        for opp, opp_data in sorted(
            opp_map.items(),
            key=lambda x: x[1]['total'],
            reverse=True
        ):
            makes = [
                {'make': make, 'total_amount': amt}
                for make, amt in sorted(
                    opp_data['makes'].items(),
                    key=lambda x: x[1],
                    reverse=True
                )
            ]
            hierarchical.append({
                'opportunity':  opp,
                'total_amount': opp_data['total'],
                'makes':        makes,
            })

        return Response({
            # backward compat
            'labels': [item['opportunity'] for item in hierarchical],
            'totals': [item['total_amount'] for item in hierarchical],
            # new hierarchical shape
            'hierarchical': hierarchical,
        })







    

from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Opportunity
from rest_framework import status
from django.db.models import Sum

class RankASumView(APIView):

    def get(self, request):
        # Filter opportunities that have at least one related Opportunity_Stage with rank 'A'
        opportunities = Opportunity.objects.filter(opportunity_stages__ranks='Rank A')
        
        # Aggregate the total amount for these opportunities
        total_sum = opportunities.aggregate(total_amount_sum=Sum('total_amount'))['total_amount_sum'] or 0

        return Response({"total_sum": total_sum}, status=status.HTTP_200_OK)




# from django.db.models import Sum
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.permissions import IsAuthenticated
# from .models import Opportunity

# class UserRankASumView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         # Filter opportunities where stage is 'Rank A' and belongs to the logged-in user
#         opportunities = Opportunity.objects.filter(opportunity_stages__ranks='Rank A',user=request.user) 
        
#         # Calculate the sum of total_amount
#         total_sum = opportunities.aggregate(total_amount_sum=Sum('total_amount'))['total_amount_sum'] or 0

#         # Return the result as a response
#         return Response({"total_sum": total_sum}, status=status.HTTP_200_OK)


from django.db.models import Count, Sum, Q
from django.db.models.functions import Coalesce
from django.db.models.functions import ExtractMonth
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from datetime import date
from .models import Opportunity, Opportunity_Stage

MONTH_NAMES = {
    1:'January',2:'February',3:'March',4:'April',
    5:'May',6:'June',7:'July',8:'August',
    9:'September',10:'October',11:'November',12:'December',
}

MONTH_NAME_TO_NUM = {
    'January':1,'February':2,'March':3,'April':4,
    'May':5,'June':6,'July':7,'August':8,
    'September':9,'October':10,'November':11,'December':12,
}


def get_fy_range(selected_year: int):
    return date(selected_year, 4, 1), date(selected_year + 1, 3, 31)


def get_month_filter_nums(selected_year: int, selected_month_name: str):
    month_num  = MONTH_NAME_TO_NUM.get(selected_month_name)
    if not month_num:
        return None, None
    month_year = selected_year + 1 if month_num in [1, 2, 3] else selected_year
    return month_num, month_year


def get_optional_pic_user_id(request):
    raw_pic = (request.query_params.get('pic') or '').strip()
    if not raw_pic or raw_pic.lower() == 'all':
        return None

    if raw_pic.isdigit():
        return int(raw_pic)

    user = User.objects.filter(username__iexact=raw_pic, role='user').first()
    return user.id if user else None


def get_optional_pic_user_id(request):
    raw_pic = (request.query_params.get('pic') or '').strip()
    if not raw_pic or raw_pic.lower() == 'all':
        return None

    if raw_pic.isdigit():
        return int(raw_pic)

    user = User.objects.filter(username__iexact=raw_pic, role='user').first()
    return user.id if user else None


# ── 1. UserRankASumView ───────────────────────────────────────
class UserRankASumView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today         = date.today()
        current_month = today.month

        selected_year = int(request.query_params.get(
            'year',
            today.year if current_month >= 4 else today.year - 1
        ))
        selected_month_name = request.query_params.get('month', None)

        fy_start, fy_end = get_fy_range(selected_year)
        user             = request.user
        stage_qs         = Opportunity_Stage.objects.filter(
            add_opportunity__user=user
        )

        if selected_month_name and selected_month_name in MONTH_NAME_TO_NUM:
            month_num, month_year = get_month_filter_nums(
                selected_year, selected_month_name
            )
            rank_a_stages = stage_qs.filter(
                ranks='Rank A',
                last_update__year=month_year,
                last_update__month=month_num,
            )
        else:
            rank_a_stages = stage_qs.filter(
                ranks='Rank A',
                last_update__gte=fy_start,
                last_update__lte=fy_end,
            )

        # Deduplicate
        seen, rank_a_ids = set(), []
        for stage in rank_a_stages.order_by('add_opportunity_id', '-last_update'):
            if stage.add_opportunity_id not in seen:
                seen.add(stage.add_opportunity_id)
                rank_a_ids.append(stage.add_opportunity_id)

        total_sum = (
            Opportunity.objects
            .filter(user=user, id__in=rank_a_ids)
            .aggregate(s=Sum('total_amount'))['s'] or 0
        )

        return Response({"total_sum": total_sum})













from django.db.models import Count, Sum
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Opportunity, Opportunity_Stage

# @api_view(['GET'])
# def stage_summary_view(request):
#     # Aggregate data for ranking by stage and total_amount
#     stage_summary = (
#         Opportunity_Stage.objects
#         .values('ranks')  # Use 'stages' from Opportunity_Stage
#         .annotate(
#             stage_count=Count('id'),
#             total_stage_amount=Sum('add_opportunity__total_amount')  # Sum related Opportunity total_amount
#         )
#         .order_by('-total_stage_amount')
#     )

#     # Prepare data for response
#     data = [
#         {
#             "ranks": item["ranks"],
#             "stage_count": item["stage_count"],
#             "total_stage_amount": item["total_stage_amount"]
#         }
#         for item in stage_summary
#     ]

#     return Response(data)

# @api_view(['GET'])
# def stage_summary_view(request):
#     from datetime import date as dt
#     today         = dt.today()
#     current_month = today.month

#     selected_year = int(request.query_params.get(
#         'year',
#         today.year if current_month >= 4 else today.year - 1
#     ))
#     fy_start = dt(selected_year,     4, 1)
#     fy_end   = dt(selected_year + 1, 3, 31)

#     stage_summary = (
#         Opportunity_Stage.objects
#         .filter(
#             last_update__gte=fy_start,
#             last_update__lte=fy_end,
#         )
#         .values('ranks')
#         .annotate(
#             stage_count=Count('id'),
#             total_stage_amount=Sum('add_opportunity__total_amount')
#         )
#         .order_by('-total_stage_amount')
#     )

#     data = [
#         {
#             "ranks":              item["ranks"],
#             "stage_count":        item["stage_count"],
#             "total_stage_amount": item["total_stage_amount"]
#         }
#         for item in stage_summary
#     ]
#     return Response(data)

@api_view(['GET'])
def stage_summary_view(request):
    today         = date.today()
    current_month = today.month
    pic_user_id   = get_optional_pic_user_id(request)

    MONTH_NAME_TO_NUM = {
        'January':1,'February':2,'March':3,'April':4,
        'May':5,'June':6,'July':7,'August':8,
        'September':9,'October':10,'November':11,'December':12,
    }

    selected_year = int(request.query_params.get(
        'year',
        today.year if current_month >= 4 else today.year - 1
    ))
    selected_month_name = request.query_params.get('month', None)

    fy_start = date(selected_year,     4, 1)
    fy_end   = date(selected_year + 1, 3, 31)

    # Default: full FY filter
    base_filter = {
        'last_update__gte': fy_start,
        'last_update__lte': fy_end,
    }
    if pic_user_id is not None:
        base_filter['add_opportunity__user_id'] = pic_user_id

    # Monthly override
    if selected_month_name and selected_month_name in MONTH_NAME_TO_NUM:
        selected_month_num = MONTH_NAME_TO_NUM[selected_month_name]
        month_year = selected_year + 1 if selected_month_num in [1,2,3] else selected_year
        base_filter = {
            'last_update__year':  month_year,
            'last_update__month': selected_month_num,
        }
        if pic_user_id is not None:
            base_filter['add_opportunity__user_id'] = pic_user_id

    stage_summary = (
        Opportunity_Stage.objects
        .filter(**base_filter)
        .annotate(rank_label=Coalesce('ranks', 'stages'))
        .values('rank_label')
        .annotate(
            stage_count=Count('id'),
            total_stage_amount=Sum('add_opportunity__total_amount')
        )
        .order_by('-total_stage_amount')
    )

    data = [
        {
            "ranks":              item["rank_label"],
            "stage_count":        item["stage_count"],
            "total_stage_amount": item["total_stage_amount"] or 0,
        }
        for item in stage_summary
    ]
    return Response(data)





from django.db.models import Count, Sum
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Opportunity, Opportunity_Stage

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])  # Correct way to enforce authentication
# def user_stage_summary_view(request):
#     # Aggregate data for ranking by stage and total_amount
#     stage_summary = (
#         Opportunity_Stage.objects
#         .filter(add_opportunity__user=request.user)  # Filter by authenticated user
#         .values('ranks')  # Use 'ranks' from Opportunity_Stage
#         .annotate(
#             stage_count=Count('id'),
#             total_stage_amount=Sum('add_opportunity__total_amount')  # Sum related Opportunity total_amount
#         )
#         .order_by('-total_stage_amount')
#     )

#     # Prepare data for response
#     data = [
#         {
#             "ranks": item["ranks"],
#             "stage_count": item["stage_count"],
#             "total_stage_amount": item["total_stage_amount"] or 0  # Handle None values
#         }
#         for item in stage_summary
#     ]

#     return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stage_summary_view(request):
    today         = date.today()
    current_month = today.month

    selected_year = int(request.query_params.get(
        'year',
        today.year if current_month >= 4 else today.year - 1
    ))
    selected_month_name = request.query_params.get('month', None)

    fy_start, fy_end = get_fy_range(selected_year)
    user             = request.user

    stage_qs = Opportunity_Stage.objects.filter(
        add_opportunity__user=user
    )

    if selected_month_name and selected_month_name in MONTH_NAME_TO_NUM:
        month_num, month_year = get_month_filter_nums(
            selected_year, selected_month_name
        )
        base_filter = {
            'last_update__year':  month_year,
            'last_update__month': month_num,
        }
    else:
        base_filter = {
            'last_update__gte': fy_start,
            'last_update__lte': fy_end,
        }

    stage_summary = (
        stage_qs
        .filter(**base_filter)
        .annotate(rank_label=Coalesce('ranks', 'stages'))
        .values('rank_label')
        .annotate(
            stage_count=Count('id'),
            total_stage_amount=Sum('add_opportunity__total_amount')
        )
        .order_by('-total_stage_amount')
    )

    data = [
        {
            "ranks":              item["rank_label"],
            "stage_count":        item["stage_count"],
            "total_stage_amount": item["total_stage_amount"] or 0,
        }
        for item in stage_summary
    ]
    return Response(data)









from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
from .models import Opportunity

# @api_view(['GET'])
# def vertical_summary_view(request):
#     # Aggregate data to get the total_amount by vertical
#     vertical_summary = (
#         Opportunity.objects
#         .values('vertical')  # Group by 'vertical'
#         .annotate(total_vertical_amount=Sum('total_amount'))  
#         .order_by('-total_vertical_amount')  
#     )

#     # Prepare data for response
#     data = [
#         {
#             "vertical": item["vertical"],
#             "total_vertical_amount": item["total_vertical_amount"]
#         }
#         for item in vertical_summary
#     ]

#     return Response(data)

# @api_view(['GET'])
# def vertical_summary_view(request):
#     from datetime import date as dt
#     today         = dt.today()
#     current_month = today.month

#     selected_year = int(request.query_params.get(
#         'year',
#         today.year if current_month >= 4 else today.year - 1
#     ))
#     fy_start = dt(selected_year,     4, 1)
#     fy_end   = dt(selected_year + 1, 3, 31)

#     vertical_summary = (
#         Opportunity.objects
#         .filter(
#             acct_created_date__gte=fy_start,
#             acct_created_date__lte=fy_end,
#         )
#         .values('vertical')
#         .annotate(total_vertical_amount=Sum('total_amount'))
#         .order_by('-total_vertical_amount')
#     )

#     data = [
#         {
#             "vertical":              item["vertical"],
#             "total_vertical_amount": item["total_vertical_amount"]
#         }
#         for item in vertical_summary
#     ]
#     return Response(data)

# @api_view(['GET'])
# def vertical_summary_view(request):
#     today         = date.today()
#     current_month = today.month

#     MONTH_NAME_TO_NUM = {
#         'January':1,'February':2,'March':3,'April':4,
#         'May':5,'June':6,'July':7,'August':8,
#         'September':9,'October':10,'November':11,'December':12,
#     }

#     selected_year = int(request.query_params.get(
#         'year',
#         today.year if current_month >= 4 else today.year - 1
#     ))
#     selected_month_name = request.query_params.get('month', None)

#     fy_start = date(selected_year,     4, 1)
#     fy_end   = date(selected_year + 1, 3, 31)

#     base_filter = {
#         'acct_created_date__gte': fy_start,
#         'acct_created_date__lte': fy_end,
#     }

#     if selected_month_name and selected_month_name in MONTH_NAME_TO_NUM:
#         selected_month_num = MONTH_NAME_TO_NUM[selected_month_name]
#         month_year = selected_year + 1 if selected_month_num in [1,2,3] else selected_year
#         base_filter = {
#             'acct_created_date__year':  month_year,
#             'acct_created_date__month': selected_month_num,
#         }

#     vertical_summary = (
#         Opportunity.objects
#         .filter(**base_filter)
#         .values('vertical')
#         .annotate(total_vertical_amount=Sum('total_amount'))
#         .order_by('-total_vertical_amount')
#     )

#     data = [
#         {
#             "vertical":              item["vertical"],
#             "total_vertical_amount": item["total_vertical_amount"] or 0,
#         }
#         for item in vertical_summary
#     ]
#     return Response(data)

@api_view(['GET'])
def vertical_summary_view(request):
    today         = date.today()
    current_month = today.month
    pic_user_id   = get_optional_pic_user_id(request)

    selected_year = int(request.query_params.get(
        'year',
        today.year if current_month >= 4 else today.year - 1
    ))
    selected_month_name = request.query_params.get('month', None)

    fy_start = date(selected_year,     4, 1)
    fy_end   = date(selected_year + 1, 3, 31)

    # âœ… Get opportunity IDs where Rank A stage's last_update is in FY
    stage_filter = {'ranks': 'Rank A'}
    if pic_user_id is not None:
        stage_filter['add_opportunity__user_id'] = pic_user_id

    if selected_month_name and selected_month_name in MONTH_NAME_TO_NUM:
        selected_month_num = MONTH_NAME_TO_NUM[selected_month_name]
        month_year = (
            selected_year + 1
            if selected_month_num in [1, 2, 3]
            else selected_year
        )
        rank_a_opp_ids = list(set(
            Opportunity_Stage.objects.filter(
                **stage_filter,
                last_update__year=month_year,
                last_update__month=selected_month_num,
            ).values_list('add_opportunity_id', flat=True)
        ))
    else:
        rank_a_opp_ids = list(set(
            Opportunity_Stage.objects.filter(
                **stage_filter,
                last_update__gte=fy_start,
                last_update__lte=fy_end,
            ).values_list('add_opportunity_id', flat=True)
        ))

    # âœ… Filter opportunities by Rank A IDs
    opp_filter = {'id__in': rank_a_opp_ids}
    if pic_user_id is not None:
        opp_filter['user_id'] = pic_user_id

    vertical_summary = (
        Opportunity.objects
        .filter(**opp_filter)
        .values('vertical')
        .annotate(total_vertical_amount=Sum('total_amount'))
        .order_by('-total_vertical_amount')
    )

    data = [
        {
            "vertical":              item["vertical"],
            "total_vertical_amount": item["total_vertical_amount"] or 0,
        }
        for item in vertical_summary
    ]
    return Response(data)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from .models import Opportunity

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])  # Enforce authentication
# def user_vertical_summary_view(request):
#     # Aggregate data to get the total_amount by vertical for the logged-in user
#     vertical_summary = (
#         Opportunity.objects
#         .filter(user=request.user)  # Filter by authenticated user
#         .values('vertical')  # Group by 'vertical'
#         .annotate(total_vertical_amount=Sum('total_amount'))  
#         .order_by('-total_vertical_amount')  
#     )

#     # Prepare data for response
#     data = [
#         {
#             "vertical": item["vertical"],
#             "total_vertical_amount": item["total_vertical_amount"] or 0  # Handle None values
#         }
#         for item in vertical_summary
#     ]

#     return Response(data)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def user_vertical_summary_view(request):
#     today         = date.today()
#     current_month = today.month

#     selected_year = int(request.query_params.get(
#         'year',
#         today.year if current_month >= 4 else today.year - 1
#     ))
#     selected_month_name = request.query_params.get('month', None)

#     fy_start, fy_end = get_fy_range(selected_year)
#     user             = request.user

#     if selected_month_name and selected_month_name in MONTH_NAME_TO_NUM:
#         month_num, month_year = get_month_filter_nums(
#             selected_year, selected_month_name
#         )
#         base_filter = {
#             'acct_created_date__year':  month_year,
#             'acct_created_date__month': month_num,
#         }
#     else:
#         base_filter = {
#             'acct_created_date__gte': fy_start,
#             'acct_created_date__lte': fy_end,
#         }

#     vertical_summary = (
#         Opportunity.objects
#         .filter(user=user, **base_filter)
#         .values('vertical')
#         .annotate(total_vertical_amount=Sum('total_amount'))
#         .order_by('-total_vertical_amount')
#     )

#     data = [
#         {
#             "vertical":              item["vertical"],
#             "total_vertical_amount": item["total_vertical_amount"] or 0,
#         }
#         for item in vertical_summary
#     ]
#     return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_vertical_summary_view(request):
    today         = date.today()
    current_month = today.month

    selected_year = int(request.query_params.get(
        'year',
        today.year if current_month >= 4 else today.year - 1
    ))
    selected_month_name = request.query_params.get('month', None)

    fy_start, fy_end = get_fy_range(selected_year)
    user             = request.user

    # ✅ Get opportunity IDs where Rank A stage's last_update is in FY
    if selected_month_name and selected_month_name in MONTH_NAME_TO_NUM:
        month_num, month_year = get_month_filter_nums(
            selected_year, selected_month_name
        )
        rank_a_opp_ids = list(set(
            Opportunity_Stage.objects.filter(
                Q(ranks='Rank A') | Q(stages='Rank A'),
                add_opportunity__user=user,
                last_update__year=month_year,
                last_update__month=month_num,
            ).values_list('add_opportunity_id', flat=True)
        ))
    else:
        rank_a_opp_ids = list(set(
            Opportunity_Stage.objects.filter(
                Q(ranks='Rank A') | Q(stages='Rank A'),
                add_opportunity__user=user,
                last_update__gte=fy_start,
                last_update__lte=fy_end,
            ).values_list('add_opportunity_id', flat=True)
        ))

    # ✅ Filter opportunities by Rank A IDs
    vertical_summary = (
        Opportunity.objects
        .filter(
            user=user,
            id__in=rank_a_opp_ids,
        )
        .values('vertical')
        .annotate(total_vertical_amount=Sum('total_amount'))
        .order_by('-total_vertical_amount')
    )

    data = [
        {
            "vertical":              item["vertical"],
            "total_vertical_amount": item["total_vertical_amount"] or 0,
        }
        for item in vertical_summary
    ]
    return Response(data)





from django.db.models import Sum
from django.db.models.functions import ExtractMonth
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Opportunity_Stage

# Month mapping (1 = January, 2 = February, etc.)
MONTH_NAMES = {
    1: "January", 2: "February", 3: "March", 4: "April",
    5: "May", 6: "June", 7: "July", 8: "August",
    9: "September", 10: "October", 11: "November", 12: "December"
}

@api_view(['GET'])
def admin_monthwise_rank_a_summary(request):
    today         = date.today()
    current_month = today.month
    pic_user_id   = get_optional_pic_user_id(request)

    selected_year = int(request.query_params.get(
        'year',
        today.year if current_month >= 4 else today.year - 1
    ))
    selected_month_name = request.query_params.get('month', None)

    fy_start, fy_end = get_fy_range(selected_year)
    base_filter = {
        'ranks': 'Rank A',
        'last_update__gte': fy_start,
        'last_update__lte': fy_end,
    }
    if pic_user_id is not None:
        base_filter['add_opportunity__user_id'] = pic_user_id

    if selected_month_name and selected_month_name in MONTH_NAME_TO_NUM:
        month_num, month_year = get_month_filter_nums(
            selected_year, selected_month_name
        )
        base_filter.pop('last_update__gte', None)
        base_filter.pop('last_update__lte', None)
        base_filter['last_update__year'] = month_year
        base_filter['last_update__month'] = month_num

    # Query for Rank A total_amount grouped by month
    monthwise_summary = (
        Opportunity_Stage.objects
        .filter(**base_filter)
        .annotate(month=ExtractMonth('last_update'))  # Extract month from last_update
        .values('month')  # Group by month
        .annotate(total_amount=Sum('add_opportunity__total_amount'))  # Sum related total_amount
    )

    # Convert queryset to dictionary for easy lookup
    month_data = {item["month"]: item["total_amount"] or 0 for item in monthwise_summary}

    # Create a full 12-month response, filling in missing months with 0
    data = [
        {
            "month_number": month,  # Numeric month (1-12)
            "month_name": MONTH_NAMES[month],  # Full month name
            "total_amount": month_data.get(month, 0)  # Get from DB, or 0 if missing
        }
        for month in range(1, 13)  # Iterate over all months (1 to 12)
    ]

    return Response(data)











from django.db.models import Sum
from django.db.models.functions import ExtractMonth
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Opportunity_Stage

# Month mapping (1 = January, 2 = February, etc.)
MONTH_NAMES = {
    1: "January", 2: "February", 3: "March", 4: "April",
    5: "May", 6: "June", 7: "July", 8: "August",
    9: "September", 10: "October", 11: "November", 12: "December"
}

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])  # Enforce authentication
# def monthwise_rank_a_summary(request):
#     user = request.user  # Get the authenticated user

#     # Query for Rank A total_amount grouped by month for the logged-in user
#     monthwise_summary = (
#         Opportunity_Stage.objects
#         .filter(ranks="Rank A", add_opportunity__user=user)  # Filter by Rank A and user
#         .annotate(month=ExtractMonth('last_update'))  # Extract month from last_update
#         .values('month')  # Group by month
#         .annotate(total_amount=Sum('add_opportunity__total_amount'))  # Sum related total_amount
#     )

#     # Convert queryset to dictionary for easy lookup
#     month_data = {item["month"]: item["total_amount"] or 0 for item in monthwise_summary}

#     # Create a full 12-month response, filling in missing months with 0
#     data = [
#         {
#             "month_number": month,  # Numeric month (1-12)
#             "month_name": MONTH_NAMES[month],  # Full month name
#             "total_amount": month_data.get(month, 0)  # Get from DB, or 0 if missing
#         }
#         for month in range(1, 13)  # Iterate over all months (1 to 12)
#     ]

#     return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def monthwise_rank_a_summary(request):
    today         = date.today()
    current_month = today.month

    selected_year = int(request.query_params.get(
        'year',
        today.year if current_month >= 4 else today.year - 1
    ))

    fy_start, fy_end = get_fy_range(selected_year)
    user             = request.user

    monthwise_summary = (
        Opportunity_Stage.objects
        .filter(
            Q(ranks="Rank A") | Q(stages="Rank A"),
            add_opportunity__user=user,
            last_update__gte=fy_start,
            last_update__lte=fy_end,
        )
        .annotate(month=ExtractMonth('last_update'))
        .values('month')
        .annotate(total_amount=Sum('add_opportunity__total_amount'))
    )

    month_data = {
        item["month"]: item["total_amount"] or 0
        for item in monthwise_summary
    }

    data = [
        {
            "month_number": month,
            "month_name":   MONTH_NAMES[month],
            "total_amount": month_data.get(month, 0)
        }
        for month in range(1, 13)
    ]

    return Response(data)


















import logging
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Opportunity, Opportunity_Stage

# Configure logger
logger = logging.getLogger(__name__)

class MonthlyTotalAmountView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            # Debug: Check total count of Opportunity_Stage with "Rank A"
            stage_count = Opportunity_Stage.objects.filter(stages="Rank A").count()
            logger.info(f"Matching Opportunity Stages Count: {stage_count}")

            if stage_count == 0:
                logger.warning("No records found for 'Rank A' stage.")

            # Debug: Check if any Opportunities exist with 'Rank A' stage
            opp_count = Opportunity.objects.filter(opportunity_stages__stages="Rank A").count()
            logger.info(f"Matching Opportunities Count: {opp_count}")

            if opp_count == 0:
                logger.warning("No opportunities found for 'Rank A' stage.")

            # Query: Aggregate `total_amount` grouped by month
            data = (
                Opportunity_Stage.objects
                .filter(stages="Rank A")
                .select_related("add_opportunity")  # Ensure Foreign Key relationship is accessed efficiently
                .annotate(month=TruncMonth('add_opportunity__last_update'))  # Group by Opportunity's last_update
                .values('month')
                .annotate(
                    total_amount=Sum('add_opportunity__total_amount'),  # Sum total_amount from Opportunity
                    count=Count('add_opportunity')  # Count opportunities per month
                )
                .order_by('month')
            )

            # Debugging: Print retrieved data
            query_data = list(data)
            logger.info(f"Query Data: {query_data}")

            if not query_data:
                logger.warning("Query returned no results.")

            # Format data for response
            monthly_data = [
                {"month": item["month"], "total_amount": item["total_amount"], "count": item["count"]}
                for item in query_data
            ]

            return Response(monthly_data)

        except Exception as e:
            logger.error(f"Error in MonthlyTotalAmountView: {str(e)}", exc_info=True)
            return Response({"error": "An unexpected error occurred"}, status=500)


    




    
#Lead
from . models import Lead
from . serializers import LeadSerializer


from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Lead
from .serializers import LeadSerializer

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer

    def list(self, request, *args, **kwargs):
        print("Incoming GET request received:", request)
        leads = self.queryset
        serialized_leads = self.serializer_class(leads, many=True)
        print("All lead data:", serialized_leads.data)
        return Response(serialized_leads.data)

    def retrieve(self, request, pk=None):
        print(f"Retrieve request for ID: {pk}")
        lead = get_object_or_404(Lead, pk=pk)
        serializer = self.get_serializer(lead)
        print("Retrieved data:", serializer.data)
        return Response(serializer.data)

    def update(self, request, pk=None):
        print(f"Update request for ID: {pk} with data: {request.data}")
        lead = get_object_or_404(Lead, pk=pk)
        serializer = self.get_serializer(lead, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            print("Updated data:", serializer.data)
            return Response({"message": "success"}, status=status.HTTP_200_OK)
        print("Update failed. Errors:", serializer.errors)
        return Response({'message': 'Failed'}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        print(f"Delete request for ID: {pk}")
        lead = get_object_or_404(Lead, pk=pk)
        lead.delete()
        print("Deleted successfully")
        return Response({"message": "Deleted successfully"}, status=status.HTTP_200_OK)


from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Lead
from .serializers import LeadSerializer

class LeadsViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer

from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import generics

class LeadListCreateView(generics.ListCreateAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    
    def get_queryset(self):
         
         return Lead.objects.filter(assign_to=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
      try:
        print("Input Data:", request.data)
        print("User:", request.user)
        
        response = super().create(request, *args, **kwargs)
        
        print("Response Data:", response.data)
        return Response({'message': 'Success'}, status=status.HTTP_201_CREATED)

      except ValidationError as e:
        print("Validation Error:", e.detail)
        return Response({'message': 'Validation Error', 'details': e.detail}, status=status.HTTP_400_BAD_REQUEST)

      except Exception as e:
        print("Unexpected Error:", str(e))
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)








from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Lead
from .serializers import LeadSerializer

class LeadDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LeadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Lead.objects.filter(assign_to=self.request.user)

    def get(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Lead.DoesNotExist:
            return Response({'message': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
            # print("Updated Data:", serializer.data)
            return Response({"message": "success"}, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({'message': 'Failed', 'errors': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        except Lead.DoesNotExist:
            return Response({'message': 'Not found', 'errors': e.detail}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response({'message': 'Success'}, status=status.HTTP_204_NO_CONTENT)
        except Lead.DoesNotExist:
            return Response({'message': 'Success'}, status=status.HTTP_404_NOT_FOUND)




from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Lead,  Opportunity
from .serializers import LeadSerializer,OpportunitySerializer


@api_view(['POST'])
def move_lead_to_destination(request, lead_id):
    try:
        lead = Lead.objects.get(id=lead_id)

        # Copy Lead to Opportunity
        destination_lead = Opportunity.objects.create(
            user=lead.assign_to,
            # account_holder=lead.assign_to,
            account_name=lead.account_name,
            opportunity=lead.lead,
            make=lead.make,
            sub_make=lead.sub_make,
            sub_make_brand=lead.sub_make_brand,
            pic=lead.pic,
            vertical=lead.vertical,
            designation=lead.designation,
            department=lead.department,
            mobile_number=lead.mobile_number,
            location=lead.location,
            city=lead.city,
            address=lead.address,
            qty=lead.qty,
            values=lead.values,
            remarks=lead.remarks,
            hardware_amount=lead.hardware_amount,
            software_amount=lead.software_amount,
            consumables_amount=lead.consumables_amount,
            automation_amount=lead.automation_amount,
            solution_amount=lead.solution_amount,
            maintenance_amount=lead.maintenance_amount,
            others_amount=lead.others_amount,
            total_amount=lead.total_amount,
            
        )

        # Update lead status to 'opportunity'
        lead.status = 'oppurtunity'
        lead.save()

        return Response({"message": "Lead moved successfully and status updated!"})

    except Lead.DoesNotExist:
        return Response({"error": "Lead not found!"}, status=404)

from django.db.models import Count, Sum, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import date
from .models import Opportunity, Opportunity_Stage



from django.db.models import Count, Sum, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import date
from .models import Opportunity, Opportunity_Stage
   

from django.db.models import Count, Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import date
from .models import Opportunity, Opportunity_Stage



from django.db.models import Count, Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import date
from .models import Opportunity, Opportunity_Stage




class HeaderStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()
        current_month = today.month
        current_year = today.year
        pic_user_id = get_optional_pic_user_id(request)

        selected_year = int(request.query_params.get(
            'year',
            current_year if current_month >= 4 else current_year - 1
        ))
        selected_month_name = request.query_params.get('month', None)
        is_monthly_filter = selected_month_name is not None

        fy_start = date(selected_year, 4, 1)
        fy_end = date(selected_year + 1, 3, 31)

        if is_monthly_filter:
            selected_month_num, selected_month_year = resolve_fiscal_month_year(
                selected_year,
                selected_month_name,
            )
            date_filter = {
                'last_update__year': selected_month_year,
                'last_update__month': selected_month_num,
            }
        else:
            date_filter = {
                'last_update__gte': fy_start,
                'last_update__lte': fy_end,
            }

        user = request.user
        is_admin = getattr(user, 'role', None) == 'admin'

        if is_admin:
            opp_qs = Opportunity.objects.all()
            stage_qs = Opportunity_Stage.objects.all()
            if pic_user_id is not None:
                opp_qs = opp_qs.filter(user_id=pic_user_id)
                stage_qs = stage_qs.filter(add_opportunity__user_id=pic_user_id)
        else:
            opp_qs = Opportunity.objects.filter(user=user)
            stage_qs = Opportunity_Stage.objects.filter(add_opportunity__user=user)

        def distinct_opp_ids_from(qs):
            return set(qs.values_list('add_opportunity_id', flat=True))

        def deduplicate_stages(qs):
            ordered = qs.order_by('add_opportunity_id', '-last_update')
            seen, result = set(), []
            for stage in ordered:
                if stage.add_opportunity_id not in seen:
                    seen.add(stage.add_opportunity_id)
                    result.append(stage)
            return result

        if is_monthly_filter:
            snapshot = get_month_end_rank_snapshot(
                user_ids=list(stage_qs.values_list('add_opportunity__user_id', flat=True).distinct()),
                selected_year=selected_year,
                selected_month_name=selected_month_name,
            )
            rank_a_snapshot = snapshot['Rank A']
            rank_b_snapshot = snapshot['Rank B']
            rank_c_snapshot = snapshot['Rank C']
            rank_d_snapshot = snapshot['Rank D']
            rank_e_snapshot = snapshot['Rank E']

            new_orders = len(distinct_opp_ids_from(
                stage_qs.filter(ranks='Rank A', **date_filter)
            ))
            new_funnel = len(rank_c_snapshot | rank_d_snapshot)
            new_customers = len(rank_e_snapshot)
            total_active_funnel = len(rank_b_snapshot | rank_c_snapshot | rank_d_snapshot | rank_e_snapshot)
            total_a_funnel = new_orders
            repeat_funnel = (
                opp_qs
                .filter(id__in=(rank_b_snapshot | rank_c_snapshot | rank_d_snapshot | rank_e_snapshot))
                .values('account_name')
                .annotate(distinct_opp_count=Count('id', distinct=True))
                .filter(distinct_opp_count__gt=1)
                .count()
            )
            rank_a_count = new_orders
            rank_b_count = len(rank_b_snapshot)
            rank_c_count = len(rank_c_snapshot)
            rank_d_count = len(rank_d_snapshot)
            rank_e_count = len(rank_e_snapshot)
            rank_abcd_total = len(rank_a_snapshot | rank_b_snapshot | rank_c_snapshot | rank_d_snapshot)
        else:
            new_orders = len(distinct_opp_ids_from(
                stage_qs.filter(ranks='Rank A', **date_filter)
            ))
            new_funnel = len(distinct_opp_ids_from(
                stage_qs.filter(ranks__in=['Rank C', 'Rank D'], **date_filter)
            ))
            new_customers = len(distinct_opp_ids_from(
                stage_qs.filter(ranks='Rank E', **date_filter)
            ))
            total_active_funnel = len(distinct_opp_ids_from(
                stage_qs.filter(ranks__in=['Rank B', 'Rank C', 'Rank D', 'Rank E'], **date_filter)
            ))
            total_a_funnel = new_orders
            repeat_funnel = (
                stage_qs
                .filter(ranks__in=['Rank B', 'Rank C', 'Rank D', 'Rank E'], **date_filter)
                .values('add_opportunity__account_name')
                .annotate(distinct_opp_count=Count('add_opportunity_id', distinct=True))
                .filter(distinct_opp_count__gt=1)
                .count()
            )
            rank_a_count = new_orders
            rank_b_count = len(distinct_opp_ids_from(stage_qs.filter(ranks='Rank B', **date_filter)))
            rank_c_count = len(distinct_opp_ids_from(stage_qs.filter(ranks='Rank C', **date_filter)))
            rank_d_count = len(distinct_opp_ids_from(stage_qs.filter(ranks='Rank D', **date_filter)))
            rank_e_count = len(distinct_opp_ids_from(stage_qs.filter(ranks='Rank E', **date_filter)))
            rank_abcd_total = len(distinct_opp_ids_from(
                stage_qs.filter(ranks__in=['Rank A', 'Rank B', 'Rank C', 'Rank D'], **date_filter)
            ))

        fy_rank_a_deduped = deduplicate_stages(
            stage_qs.filter(ranks='Rank A', last_update__range=(fy_start, fy_end))
        )
        fy_won_count = len(fy_rank_a_deduped)
        fy_total_count = len(distinct_opp_ids_from(stage_qs.filter(last_update__range=(fy_start, fy_end))))
        projection_pct = round((fy_won_count / fy_total_count) * 100) if fy_total_count > 0 else 0

        all_time_won = len(distinct_opp_ids_from(stage_qs.filter(ranks='Rank A')))
        all_time_total = len(distinct_opp_ids_from(stage_qs))
        conversion_ratio = round((all_time_won / all_time_total) * 100) if all_time_total > 0 else 0

        repeat_orders_this_fy = (
            stage_qs
            .filter(ranks='Rank A', last_update__range=(fy_start, fy_end))
            .values('add_opportunity__account_name')
            .annotate(distinct_opp_count=Count('add_opportunity_id', distinct=True))
            .filter(distinct_opp_count__gt=1)
            .count()
        )

        rank_a_ids_fy = {s.add_opportunity_id for s in fy_rank_a_deduped}
        sales_this_fy = opp_qs.filter(id__in=rank_a_ids_fy).aggregate(s=Sum('total_amount'))['s'] or 0

        won_ids_all_time = distinct_opp_ids_from(stage_qs.filter(ranks='Rank A'))
        active_stage_ids = distinct_opp_ids_from(stage_qs.filter(ranks__in=['Rank B', 'Rank C', 'Rank D', 'Rank E']))
        open_pipeline_ids = active_stage_ids - won_ids_all_time
        to_be_build_amount = opp_qs.filter(id__in=open_pipeline_ids).aggregate(s=Sum('total_amount'))['s'] or 0

        return Response({
            "order": {
                "new_orders": new_orders,
                "new_funnel": new_funnel,
                "new_customers": new_customers,
            },
            "funnel": {
                "total_funnel": total_active_funnel,
                "total_a_funnel": total_a_funnel,
                "repeat_funnel": repeat_funnel,
                "rank_a": rank_a_count,
                "rank_b": rank_b_count,
                "rank_c": rank_c_count,
                "rank_d": rank_d_count,
                "rank_e": rank_e_count,
                "rank_abcd_total": rank_abcd_total,
            },
            "projection": {
                "projection_pct": projection_pct,
                "conversion_ratio": conversion_ratio,
                "repeat_order": repeat_orders_this_fy,
            },
            "sales": {
                "rank_a_total": sales_this_fy,
                "to_be_build": to_be_build_amount,
                "repeat_sales": repeat_orders_this_fy,
            },
        })
        today         = date.today()
        current_month = today.month
        current_year  = today.year
        pic_user_id   = get_optional_pic_user_id(request)

        selected_year = int(request.query_params.get(
            'year',
            current_year if current_month >= 4 else current_year - 1
        ))

        # ── KEY FIX: Check if month param was actually sent ───
        selected_month_name = request.query_params.get('month', None)
        is_monthly_filter   = selected_month_name is not None

        # ── FY range ──────────────────────────────────────────
        fy_start = date(selected_year,     4, 1)
        fy_end   = date(selected_year + 1, 3, 31)

        # ── Monthly filter variables ──────────────────────────
        if is_monthly_filter:
            selected_month_num, selected_month_year = resolve_fiscal_month_year(
                selected_year,
                selected_month_name,
            )
        else:
            selected_month_num  = None
            selected_month_year = None

        user = request.user

        # ── Admin sees ALL, User sees OWN ─────────────────────
        is_admin = getattr(user, 'role', None) == 'admin'

        if is_admin:
            opp_qs   = Opportunity.objects.all()
            stage_qs = Opportunity_Stage.objects.all()
            if pic_user_id is not None:
                opp_qs = opp_qs.filter(user_id=pic_user_id)
                stage_qs = stage_qs.filter(
                    add_opportunity__user_id=pic_user_id
                )
        else:
            opp_qs   = Opportunity.objects.filter(user=user)
            stage_qs = Opportunity_Stage.objects.filter(
                add_opportunity__user=user
            )

        # ── Helpers ───────────────────────────────────────────
        def distinct_opp_ids_from(qs):
            return set(qs.values_list('add_opportunity_id', flat=True))

        def deduplicate_stages(qs):
            ordered      = qs.order_by('add_opportunity_id', '-last_update')
            seen, result = set(), []
            for stage in ordered:
                if stage.add_opportunity_id not in seen:
                    seen.add(stage.add_opportunity_id)
                    result.append(stage)
            return result

        # ══════════════════════════════════════════════════════
        # BUILD DATE FILTER
        # Monthly mode → specific month
        # Yearly mode  → full FY range (April to March)
        # ══════════════════════════════════════════════════════
        if is_monthly_filter:
            # Filter by specific month
            date_filter = {
                'last_update__year':  selected_month_year,
                'last_update__month': selected_month_num,
            }
        else:
            # Filter by full FY range
            date_filter = {
                'last_update__gte': fy_start,
                'last_update__lte': fy_end,
            }

        # ══════════════════════════════════════════════════════
        # ORDER CARD
        # ══════════════════════════════════════════════════════
        new_orders = len(distinct_opp_ids_from(
            stage_qs.filter(ranks='Rank A', **date_filter)
        ))

        new_funnel = len(distinct_opp_ids_from(
            stage_qs.filter(ranks__in=['Rank C', 'Rank D'], **date_filter)
        ))

        new_customers = len(distinct_opp_ids_from(
            stage_qs.filter(ranks='Rank E', **date_filter)
        ))

        # ══════════════════════════════════════════════════════
        # FUNNEL CARD
        # ══════════════════════════════════════════════════════
        total_active_funnel = len(distinct_opp_ids_from(
            stage_qs.filter(
                ranks__in=['Rank B', 'Rank C', 'Rank D', 'Rank E'],
                **date_filter,
            )
        ))

        total_a_funnel = new_orders

        repeat_funnel = (
            stage_qs
            .filter(
                ranks__in=['Rank B', 'Rank C', 'Rank D', 'Rank E'],
                **date_filter,
            )
            .values('add_opportunity__account_name')
            .annotate(
                distinct_opp_count=Count(
                    'add_opportunity_id', distinct=True
                )
            )
            .filter(distinct_opp_count__gt=1)
            .count()
        )

        # Rank-wise distribution for header second card
        rank_a_count = new_orders
        rank_b_count = len(distinct_opp_ids_from(
            stage_qs.filter(ranks='Rank B', **date_filter)
        ))
        rank_c_count = len(distinct_opp_ids_from(
            stage_qs.filter(ranks='Rank C', **date_filter)
        ))
        rank_d_count = len(distinct_opp_ids_from(
            stage_qs.filter(ranks='Rank D', **date_filter)
        ))
        rank_abcd_total = len(distinct_opp_ids_from(
            stage_qs.filter(ranks__in=['Rank A', 'Rank B', 'Rank C', 'Rank D'], **date_filter)
        ))

        # Rank-wise distribution for header second card
        rank_a_count = new_orders
        rank_b_count = len(distinct_opp_ids_from(
            stage_qs.filter(ranks='Rank B', **date_filter)
        ))
        rank_c_count = len(distinct_opp_ids_from(
            stage_qs.filter(ranks='Rank C', **date_filter)
        ))
        rank_d_count = len(distinct_opp_ids_from(
            stage_qs.filter(ranks='Rank D', **date_filter)
        ))
        rank_abcd_total = len(distinct_opp_ids_from(
            stage_qs.filter(ranks__in=['Rank A', 'Rank B', 'Rank C', 'Rank D'], **date_filter)
        ))

        # ══════════════════════════════════════════════════════
        # PROJECTION CARD — always FY scope
        # ══════════════════════════════════════════════════════
        fy_rank_a_deduped = deduplicate_stages(
            stage_qs.filter(
                ranks='Rank A',
                last_update__range=(fy_start, fy_end),
            )
        )
        fy_won_count = len(fy_rank_a_deduped)

        fy_total_count = len(distinct_opp_ids_from(
            stage_qs.filter(
                last_update__range=(fy_start, fy_end),
            )
        ))

        projection_pct = (
            round((fy_won_count / fy_total_count) * 100)
            if fy_total_count > 0 else 0
        )

        all_time_won   = len(distinct_opp_ids_from(
            stage_qs.filter(ranks='Rank A')
        ))
        all_time_total = len(distinct_opp_ids_from(stage_qs))

        conversion_ratio = (
            round((all_time_won / all_time_total) * 100)
            if all_time_total > 0 else 0
        )

        repeat_orders_this_fy = (
            stage_qs
            .filter(
                ranks='Rank A',
                last_update__range=(fy_start, fy_end),
            )
            .values('add_opportunity__account_name')
            .annotate(
                distinct_opp_count=Count(
                    'add_opportunity_id', distinct=True
                )
            )
            .filter(distinct_opp_count__gt=1)
            .count()
        )

        # ══════════════════════════════════════════════════════
        # SALES CARD — always FY scope
        # ══════════════════════════════════════════════════════
        rank_a_ids_fy = {
            s.add_opportunity_id for s in fy_rank_a_deduped
        }

        sales_this_fy = (
            opp_qs.filter(id__in=rank_a_ids_fy)
            .aggregate(s=Sum('total_amount'))['s'] or 0
        )

        won_ids_all_time = distinct_opp_ids_from(
            stage_qs.filter(ranks='Rank A')
        )
        active_stage_ids = distinct_opp_ids_from(
            stage_qs.filter(
                ranks__in=['Rank B', 'Rank C', 'Rank D', 'Rank E'],
            )
        )
        open_pipeline_ids  = active_stage_ids - won_ids_all_time
        to_be_build_amount = (
            opp_qs.filter(id__in=open_pipeline_ids)
            .aggregate(s=Sum('total_amount'))['s'] or 0
        )

        return Response({
            "order": {
                "new_orders":    new_orders,
                "new_funnel":    new_funnel,
                "new_customers": new_customers,
            },
            "funnel": {
                "total_funnel":   total_active_funnel,
                "total_a_funnel": total_a_funnel,
                "repeat_funnel":  repeat_funnel,
                "rank_a": rank_a_count,
                "rank_b": rank_b_count,
                "rank_c": rank_c_count,
                "rank_d": rank_d_count,
                "rank_abcd_total": rank_abcd_total,
            },
            "projection": {
                "projection_pct":   projection_pct,
                "conversion_ratio": conversion_ratio,
                "repeat_order":     repeat_orders_this_fy,
            },
            "sales": {
                "rank_a_total": sales_this_fy,
                "to_be_build":  to_be_build_amount,
                "repeat_sales": repeat_orders_this_fy,
            },
        })

    

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.response import Response
from datetime import date
from django.db.models import Sum
from .models import (
    Budget, BudgetCategory, BudgetSubCategory,
    BudgetPeriodEntry, BudgetSnapshot,
    GlobalCategory, GlobalSubCategory,
)
from .serializers import (
    BudgetListSerializer, BudgetWriteSerializer, BudgetDashboardSerializer,
    BudgetPeriodEntrySerializer, SalesPersonSerializer, TeamBudgetSummarySerializer,
    GlobalCategorySerializer,
)


# ── Helpers ───────────────────────────────────────────────────────────────────

def get_current_quarter_months():
    month = date.today().month
    if month in [4, 5, 6]:    return ['April', 'May', 'June']
    elif month in [7, 8, 9]:  return ['July', 'August', 'September']
    elif month in [10,11,12]: return ['October', 'November', 'December']
    else:                     return ['January', 'February', 'March']


def get_current_month_name():
    return date.today().strftime('%B')


def is_admin_user(user) -> bool:
    """
    Only check the custom role field.
    role='admin' → True
    role='user'  → False
    Never use is_staff or is_superuser.
    """
    return getattr(user, 'role', None) == 'admin'



class IsRoleAdmin(BasePermission):
    """Allow access only to users with role='admin'."""
    def has_permission(self, request, view):
        return (
            request.user is not None and
            request.user.is_authenticated and
            getattr(request.user, 'role', None) == 'admin'
        )


# ── BudgetViewSet ─────────────────────────────────────────────────────────────

class BudgetViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Budget.objects.none()

    def get_permissions(self):
        write_actions = ['create', 'update', 'partial_update', 'destroy']
        if self.action in write_actions:
            return [IsRoleAdmin()]
        return [IsAuthenticated()]

    # def get_queryset(self):
    #     """
    #     Admin → all budgets
    #     User  → only budgets assigned to them (filtered by user_id)
    #     """
    #     user = self.request.user
    #     qs = Budget.objects.select_related('user').prefetch_related(
    #         'categories',
    #         'categories__subcategories',
    #         'period_entries',
    #         'snapshots',
    #     )
    #     if is_admin_user(user):
    #         return qs.all()
    #     return qs.filter(user_id=user.id)
    def get_queryset(self):
        """
        Admin → all budgets
        User  → budgets where they have BudgetPeriodEntry assignments
        """
        user = self.request.user
        qs = Budget.objects.select_related('user').prefetch_related(
            'categories',
            'categories__subcategories',
            'period_entries',
            'snapshots',
        )
        if is_admin_user(user):
            pic_user_id = get_optional_pic_user_id(self.request)
            if pic_user_id is not None:
                return qs.filter(period_entries__user_id=pic_user_id).distinct()
            return qs.all()

        # ── Regular user sees budgets they are assigned to ──
        assigned_budget_ids = BudgetPeriodEntry.objects.filter(
            user=user
        ).values_list('budget_id', flat=True).distinct()

        return qs.filter(id__in=assigned_budget_ids)

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return BudgetWriteSerializer
        return BudgetListSerializer

    def perform_create(self, serializer):
        target_user_id = self.request.data.get('user_id')
        if is_admin_user(self.request.user) and target_user_id:
            serializer.save(user_id=int(target_user_id))
        else:
            serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        import traceback
        raw_user_id = self.request.data.get('user_id')

        if not raw_user_id:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'user_id': 'This field is required.'})

        try:
            target_user_id = int(raw_user_id)
        except (ValueError, TypeError):
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'user_id': f'Invalid value: {raw_user_id}'})

        try:
            serializer.save(user_id=target_user_id)
        except Exception:
            print("=== perform_update EXCEPTION ===")
            traceback.print_exc()
            print("================================")
            raise

    # ── Sales Persons ─────────────────────────────────────────────────────────

    @action(detail=False, methods=['get'], url_path='sales-persons')
    def sales_persons(self, request):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        users = User.objects.filter(role='user')
        return Response(SalesPersonSerializer(users, many=True).data)

    # ── Team Summary ──────────────────────────────────────────────────────────
    @action(detail=False, methods=['get'], url_path='team-summary')
    def team_summary(self, request):
        from django.db.models import Sum, Q
        from .models import BudgetPeriodEntry
        from datetime import date

        user = request.user
        is_admin = getattr(user, 'role', None) == 'admin'

        today = date.today()
        current_month_name = today.strftime('%B')
        cm = today.month

        # Current quarter months
        if cm in [4,5,6]:    q_months = ['April','May','June']
        elif cm in [7,8,9]:  q_months = ['July','August','September']
        elif cm in [10,11,12]: q_months = ['October','November','December']
        else:                q_months = ['January','February','March']

        # Get budgets
        if is_admin:
            budgets = Budget.objects.all().prefetch_related('period_entries')
        else:
            # User sees budgets where they have assigned entries
            user_budget_ids = BudgetPeriodEntry.objects.filter(
                user=user
            ).values_list('budget_id', flat=True).distinct()
            budgets = Budget.objects.filter(id__in=user_budget_ids).prefetch_related('period_entries')

        result = []
        for budget in budgets:
            if is_admin:
                entries = budget.period_entries.all()
            else:
                entries = budget.period_entries.filter(user=user)

            fy_total = float(entries.aggregate(t=Sum('allocated'))['t'] or 0)
            quarter_total = float(entries.filter(month__in=q_months).aggregate(t=Sum('allocated'))['t'] or 0)
            month_total = float(entries.filter(month=current_month_name).aggregate(t=Sum('allocated'))['t'] or 0)

            # Get unique PICs in this budget
            pic_ids = entries.values_list('user_id', flat=True).distinct()
            from django.contrib.auth import get_user_model
            User = get_user_model()
            pics = list(User.objects.filter(id__in=pic_ids).values_list('username', flat=True))

            result.append({
                'id': budget.id,
                'title': budget.title,
                'sales_persons': pics,
                'sales_person_count': len(pics),
                'budget_this_fy': fy_total,
                'this_quarter': quarter_total,
                'this_month': month_total,
            })

        return Response(result)
    # ── Dashboard ─────────────────────────────────────────────────────────────
    
    # views.py — Add this to BudgetViewSet

    @action(detail=True, methods=['get'], url_path='employee-summary')
    def employee_summary(self, request, pk=None):
        """
        Returns per-employee target vs Rank A achievement
        for a specific master budget.
        """
        from datetime import date
        from django.db.models import Sum, Q
        from django.contrib.auth import get_user_model
        from .models import BudgetPeriodEntry, Opportunity, Opportunity_Stage

        User = get_user_model()
        budget = self.get_object()

        # FY range
        today = date.today()
        cm = today.month
        if cm >= 4:
            fy_start = date(today.year, 4, 1)
            fy_end   = date(today.year + 1, 3, 31)
        else:
            fy_start = date(today.year - 1, 4, 1)
            fy_end   = date(today.year, 3, 31)

        # Current month and quarter
        current_month = today.strftime('%B')
        if cm in [4,5,6]:    q_months = ['April','May','June']
        elif cm in [7,8,9]:  q_months = ['July','August','September']
        elif cm in [10,11,12]: q_months = ['October','November','December']
        else:                q_months = ['January','February','March']

        # Get all unique PICs in this budget
        pic_ids = (
            BudgetPeriodEntry.objects
            .filter(budget=budget)
            .values_list('user_id', flat=True)
            .distinct()
        )

        employees = []

        for uid in pic_ids:
            try:
                user = User.objects.get(id=uid)
            except User.DoesNotExist:
                continue

            user_entries = BudgetPeriodEntry.objects.filter(budget=budget, user=user)

            # Targets
            fy_target = float(
                user_entries.aggregate(t=Sum('allocated'))['t'] or 0
            )
            month_target = float(
                user_entries.filter(month=current_month)
                .aggregate(t=Sum('allocated'))['t'] or 0
            )
            quarter_target = float(
                user_entries.filter(month__in=q_months)
                .aggregate(t=Sum('allocated'))['t'] or 0
            )

            # Achievement (Rank A, deduplicated)
            rank_a_stages = (
                Opportunity_Stage.objects
                .filter(
                    ranks='Rank A',
                    add_opportunity__user=user,
                    last_update__gte=fy_start,
                    last_update__lte=fy_end,
                )
                .order_by('add_opportunity_id', '-last_update')
            )

            seen, deduped_ids = set(), []
            for s in rank_a_stages:
                if s.add_opportunity_id not in seen:
                    seen.add(s.add_opportunity_id)
                    deduped_ids.append(s.add_opportunity_id)

            fy_achieved = float(
                Opportunity.objects.filter(id__in=deduped_ids)
                .aggregate(s=Sum('total_amount'))['s'] or 0
            )
            fy_deals = len(deduped_ids)

            # Monthly achievement
            MONTH_NAME_TO_NUM = {
                'January':1,'February':2,'March':3,'April':4,
                'May':5,'June':6,'July':7,'August':8,
                'September':9,'October':10,'November':11,'December':12,
            }

            # Per-month breakdown
            monthly_data = []
            for month_name in ['April','May','June','July','August','September',
                            'October','November','December','January','February','March']:
                m_num = MONTH_NAME_TO_NUM[month_name]
                m_year = fy_start.year + 1 if m_num in [1,2,3] else fy_start.year

                m_target = float(
                    user_entries.filter(month=month_name)
                    .aggregate(t=Sum('allocated'))['t'] or 0
                )

                m_rank_a_ids = set(
                    Opportunity_Stage.objects
                    .filter(
                        ranks='Rank A',
                        add_opportunity__user=user,
                        last_update__year=m_year,
                        last_update__month=m_num,
                    )
                    .values_list('add_opportunity_id', flat=True)
                )

                m_achieved = float(
                    Opportunity.objects.filter(id__in=list(m_rank_a_ids))
                    .aggregate(s=Sum('total_amount'))['s'] or 0
                )

                if m_target > 0 or m_achieved > 0:
                    monthly_data.append({
                        'month': month_name,
                        'target': m_target,
                        'achieved': m_achieved,
                        'pct': round((m_achieved / m_target) * 100, 1) if m_target > 0 else 0,
                    })

            # Category breakdown for this user
            category_data = []
            for cat in budget.categories.all():
                cat_target = float(
                    user_entries.filter(category=cat)
                    .aggregate(t=Sum('allocated'))['t'] or 0
                )
                if cat_target > 0:
                    category_data.append({
                        'name': cat.name,
                        'target': cat_target,
                    })

            fy_pct = round((fy_achieved / fy_target) * 100, 1) if fy_target > 0 else 0

            employees.append({
                'user_id':        user.id,
                'username':       user.username,
                'full_name':      f"{user.first_name} {user.last_name}".strip() or user.username,
                'fy_target':      fy_target,
                'fy_achieved':    fy_achieved,
                'fy_pct':         fy_pct,
                'fy_remaining':   max(0, fy_target - fy_achieved),
                'fy_deals':       fy_deals,
                'month_target':   month_target,
                'quarter_target': quarter_target,
                'monthly_data':   monthly_data,
                'categories':     category_data,
            })

        # Sort by FY target descending
        employees.sort(key=lambda x: x['fy_target'], reverse=True)

        # Totals
        total_target   = sum(e['fy_target']   for e in employees)
        total_achieved = sum(e['fy_achieved'] for e in employees)
        total_deals    = sum(e['fy_deals']    for e in employees)

        return Response({
            'budget_id':      budget.id,
            'budget_title':   budget.title,
            'currency':       budget.currency,
            'revenue_target': float(budget.revenue_target),
            'total_target':   total_target,
            'total_achieved': total_achieved,
            'total_pct':      round((total_achieved / total_target) * 100, 1) if total_target > 0 else 0,
            'total_deals':    total_deals,
            'target_deals':   budget.target_deal_count,
            'employees':      employees,
        })

    @action(detail=True, methods=['get'])
    def dashboard(self, request, pk=None):
        budget = self.get_object()
        return Response(BudgetDashboardSerializer(budget).data)

    # ── Current Month ─────────────────────────────────────────────────────────

    @action(detail=False, methods=['get'], url_path='current-month')
    def current_month(self, request):
        import calendar
        from datetime import date
        from django.db.models import Sum, Q
        from .models import Budget, BudgetPeriodEntry, Opportunity, Opportunity_Stage

        today = date.today()
        user  = request.user

        # ── READ FILTER PARAMS ──────────────────────────────────
        current_cal_month = today.month
        selected_year = int(request.query_params.get(
            'year',
            today.year if current_cal_month >= 4 else today.year - 1
        ))
        selected_month_name = request.query_params.get('month', today.strftime('%B'))
        selected_month_num, selected_month_year = resolve_fiscal_month_year(
            selected_year,
            selected_month_name,
        )

        # FY date range
        fy_start = date(selected_year, 4, 1)
        fy_end   = date(selected_year + 1, 3, 31)
        fy_label = f"{selected_year}–{str(selected_year + 1)[2:]}"

        # ── FIND BUDGET ENTRIES FOR THIS USER ──────────────────
        # KEY FIX: Look for BudgetPeriodEntry assigned to this user
        # The budget may belong to admin, but entries are assigned to users
        user_entries_qs = BudgetPeriodEntry.objects.filter(
            user=user
        ).select_related('budget')

        if not user_entries_qs.exists():
            return Response({
                'has_data': False,
                'reason':   'no_budget_assigned',
                'message':  'No budget has been assigned to you yet.',
            })

        # Get the latest master budget this user has entries in
        # (pick the most recently created budget)
        budget = (
            user_entries_qs
            .order_by('-budget__created_at')
            .first()
            .budget
        )

        # All entries for THIS user in THIS budget
        all_user_fy_entries = BudgetPeriodEntry.objects.filter(
            user=user,
            budget=budget,
        )

        if not all_user_fy_entries.exists():
            return Response({
                'has_data': False,
                'reason':   'no_entries_found',
                'budget_id':    budget.id,
                'budget_title': budget.title,
            })

        # ── CALCULATION ─────────────────────────────────────────

        # Monthly Target (Allocated for selected month)
        month_entries  = all_user_fy_entries.filter(month__iexact=selected_month_name)
        monthly_budget = float(
            month_entries.aggregate(t=Sum('allocated'))['t'] or 0
        )

        # FY Total Target (all 12 months for this user)
        fy_total_target = float(
            all_user_fy_entries.aggregate(t=Sum('allocated'))['t'] or 0
        )

        # Days info for selected month
        days_in_month = calendar.monthrange(selected_month_year, selected_month_num)[1]
        selected_date_start = date(selected_month_year, selected_month_num, 1)

        if selected_month_num == today.month and selected_month_year == today.year:
            days_elapsed   = today.day
            days_remaining = days_in_month - days_elapsed
        elif selected_date_start < today:
            days_elapsed   = days_in_month
            days_remaining = 0
        else:
            days_elapsed   = 0
            days_remaining = days_in_month

        # Revenue / deal targets (pro-rated from master budget)
        period_divisor         = 12
        monthly_revenue_target = float(budget.revenue_target) / period_divisor
        monthly_target_deals   = round(budget.target_deal_count / period_divisor)

        # ── ACHIEVEMENT (Rank A Opportunities) ──────────────────

        # FY Achievement (deduplicated)
        fy_stages = (
            Opportunity_Stage.objects
            .filter(
                ranks='Rank A',
                add_opportunity__user=user,
                last_update__gte=fy_start,
                last_update__lte=fy_end,
            )
            .order_by('add_opportunity_id', '-last_update')
        )

        seen_ids, deduped_fy_ids = set(), []
        for s in fy_stages:
            if s.add_opportunity_id not in seen_ids:
                seen_ids.add(s.add_opportunity_id)
                deduped_fy_ids.append(s.add_opportunity_id)

        fy_achieved = float(
            Opportunity.objects.filter(id__in=deduped_fy_ids)
            .aggregate(s=Sum('total_amount'))['s'] or 0
        )
        fy_deals_closed = len(deduped_fy_ids)

        # Monthly Achievement
        month_rank_a_ids = set(
            Opportunity_Stage.objects.filter(
                ranks='Rank A',
                add_opportunity__user=user,
                last_update__year=selected_month_year,
                last_update__month=selected_month_num,
            ).values_list('add_opportunity_id', flat=True)
        )
        month_achieved          = float(
            Opportunity.objects.filter(id__in=list(month_rank_a_ids))
            .aggregate(s=Sum('total_amount'))['s'] or 0
        )
        deals_closed_this_month = len(month_rank_a_ids)

        # ── DERIVED METRICS ─────────────────────────────────────
        def safe_pct(ach, trg):
            if not trg or float(trg) == 0:
                return 0.0
            raw = round((float(ach) / float(trg)) * 100, 1)
            return raw  # return raw — let frontend cap/display as needed

        fy_achievement_pct    = safe_pct(fy_achieved,    fy_total_target)
        month_achievement_pct = safe_pct(month_achieved, monthly_budget)

        fy_remaining    = max(0.0, fy_total_target - fy_achieved)
        month_remaining = max(0.0, monthly_budget  - month_achieved)

        # ── CATEGORY BREAKDOWN (allocation only) ────────────────
        categories_data = []
        for cat in budget.categories.all().order_by('order', 'id'):
            cat_month_alloc = float(
                month_entries.filter(category=cat)
                .aggregate(t=Sum('allocated'))['t'] or 0
            )
            cat_fy_alloc = float(
                all_user_fy_entries.filter(category=cat)
                .aggregate(t=Sum('allocated'))['t'] or 0
            )

            if cat_fy_alloc == 0 and cat_month_alloc == 0:
                continue

            monthly_share_pct = (
                round((cat_month_alloc / monthly_budget) * 100, 1)
                if monthly_budget > 0 else 0
            )

            # Subcategories
            subcategories_data = []
            for sub in cat.subcategories.all():
                sub_month = float(
                    month_entries.filter(category=cat, subcategory=sub)
                    .aggregate(t=Sum('allocated'))['t'] or 0
                )
                sub_fy = float(
                    all_user_fy_entries.filter(category=cat, subcategory=sub)
                    .aggregate(t=Sum('allocated'))['t'] or 0
                )
                if sub_fy > 0:
                    subcategories_data.append({
                        'id':           sub.id,
                        'name':         sub.name,
                        'allocated':    sub_month,
                        'fy_allocated': sub_fy,
                    })

            categories_data.append({
                'id':                cat.id,
                'name':              cat.name,
                'allocated':         cat_month_alloc,
                'fy_allocated':      cat_fy_alloc,
                'monthly_share_pct': monthly_share_pct,
                'subcategories':     subcategories_data,
            })
        rank_month_counts = {
            rank: len(opp_ids)
            for rank, opp_ids in get_month_end_rank_snapshot(
                user_ids=[user.id],
                selected_year=selected_year,
                selected_month_name=selected_month_name,
            ).items()
        }
        return Response({
            'has_data':     True,
            'current_month': selected_month_name,
            'budget_id':    budget.id,
            'budget_title': budget.title,
            'currency':     budget.currency,
            'fy_label':     fy_label,

            # Targets
            'fy_total_target':         fy_total_target,
            'monthly_budget':          monthly_budget,
            'monthly_revenue_target':  round(monthly_revenue_target, 2),
            'monthly_target_deals':    monthly_target_deals,
            'total_target_deals':      budget.target_deal_count,

            # Achievement
            'fy_achieved':             fy_achieved,
            'month_achieved':          month_achieved,
            'fy_deals_closed':         fy_deals_closed,
            'deals_closed_this_month': deals_closed_this_month,

            # Analysis
            'fy_achievement_pct':      fy_achievement_pct,
            'month_achievement_pct':   month_achievement_pct,
            'fy_remaining':            fy_remaining,
            'month_remaining':         month_remaining,

            # Timeline
            'days_elapsed':   days_elapsed,
            'days_remaining': days_remaining,

            # Breakdown
            'categories': categories_data,
                        # Rank counts for selected month
            'month_rank_b_count': rank_month_counts.get('Rank B', 0),
            'month_rank_c_count': rank_month_counts.get('Rank C', 0),
            'month_rank_d_count': rank_month_counts.get('Rank D', 0),
            'month_rank_e_count': rank_month_counts.get('Rank E', 0),
        })
    # ── Update Spend ──────────────────────────────────────────────────────────

    @action(detail=True, methods=['patch'], url_path='update-spend')
    def update_spend(self, request, pk=None):
        budget      = self.get_object()
        category_id = request.data.get('category_id')
        month       = request.data.get('month', date.today().strftime('%B'))
        spent       = request.data.get('spent', 0)

        try:
            category = budget.categories.get(id=category_id)
        except BudgetCategory.DoesNotExist:
            return Response(
                {'error': 'Category not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        entry, _ = BudgetPeriodEntry.objects.get_or_create(
            budget=budget, category=category, month=month,
            defaults={'allocated': 0}
        )
        entry.spent = spent
        entry.save()
        return Response(BudgetPeriodEntrySerializer(entry).data)

    # ── Cell Allocation ───────────────────────────────────────────────────────

    @action(detail=True, methods=['post'], url_path='cell-allocation')
    def cell_allocation(self, request, pk=None):
        budget         = self.get_object()
        category_id    = request.data.get('category_id')
        subcategory_id = request.data.get('subcategory_id')
        month          = request.data.get('month')
        allocated      = request.data.get('allocated', 0)
        spent          = request.data.get('spent', 0)

        if not month:
            return Response(
                {'error': 'month is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not category_id:
            return Response(
                {'error': 'category_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            category = budget.categories.get(id=category_id)
        except BudgetCategory.DoesNotExist:
            return Response(
                {'error': 'Category not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        subcategory = None
        if subcategory_id:
            try:
                subcategory = category.subcategories.get(id=subcategory_id)
            except BudgetSubCategory.DoesNotExist:
                return Response(
                    {'error': 'Subcategory not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

        entry, _ = BudgetPeriodEntry.objects.update_or_create(
            budget=budget,
            category=category,
            subcategory=subcategory,
            month=month,
            defaults={'allocated': allocated, 'spent': spent}
        )

        return Response({
            'entry':                 BudgetPeriodEntrySerializer(entry).data,
            'computed_total_budget': budget.computed_total_budget,
            'total_allocated':       budget.total_allocated,
        })

    # ── Month Allocations ─────────────────────────────────────────────────────

    @action(detail=True, methods=['post'], url_path='month-allocations')
    def month_allocations(self, request, pk=None):
        budget  = self.get_object()
        month   = request.data.get('month')
        entries = request.data.get('entries', [])

        if not month:
            return Response(
                {'error': 'month is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        for entry_data in entries:
            cat_id = entry_data.get('category_id')
            try:
                category = budget.categories.get(id=cat_id)
            except BudgetCategory.DoesNotExist:
                continue

            subcategory = None
            sub_id = entry_data.get('subcategory_id')
            if sub_id:
                try:
                    subcategory = category.subcategories.get(id=sub_id)
                except BudgetSubCategory.DoesNotExist:
                    pass

            BudgetPeriodEntry.objects.update_or_create(
                budget=budget,
                category=category,
                subcategory=subcategory,
                month=month,
                defaults={
                    'allocated': entry_data.get('allocated', 0),
                    'spent':     entry_data.get('spent',     0),
                }
            )

        return Response(BudgetDashboardSerializer(budget).data)

    # ── Save Snapshot ─────────────────────────────────────────────────────────

    @action(detail=True, methods=['post'], url_path='save-snapshot')
    def save_snapshot(self, request, pk=None):
        budget = self.get_object()
        BudgetSnapshot.objects.create(
            budget            = budget,
            period_label      = request.data.get(
                'period_label', f'Snapshot {date.today()}'
            ),
            total_spent       = budget.total_spent,
            revenue_generated = budget.revenue_target,
            deals_closed      = budget.deals_closed,
        )
        return Response({'status': 'snapshot saved'})

from django.db.models import Count, Sum, Q

def budget_fy_q(fy_start, fy_end):
    return (
        Q(start_date=fy_start, end_date=fy_end)
        | (
            Q(start_date__isnull=True)
            & Q(end_date__isnull=True)
            & Q(created_at__date__gte=fy_start)
            & Q(created_at__date__lte=fy_end)
        )
    )

class AdminOverallBudgetSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from datetime import date
        import calendar
        from django.db.models import Sum
        from django.contrib.auth import get_user_model
        from .models import Budget, BudgetPeriodEntry, Opportunity, Opportunity_Stage

        User = get_user_model()

        if getattr(request.user, 'role', None) != 'admin':
            return Response({'error': 'Admin access required'}, status=403)

        today         = date.today()
        current_month = today.month
        current_year  = today.year

        selected_year = int(request.query_params.get(
            'year',
            current_year if current_month >= 4 else current_year - 1
        ))
        selected_month = request.query_params.get('month', today.strftime('%B'))
        pic_user_id    = get_optional_pic_user_id(request)

        fy_start = date(selected_year, 4, 1)
        fy_end   = date(selected_year + 1, 3, 31)

        selected_month_num, selected_month_year = resolve_fiscal_month_year(
            selected_year,
            selected_month,
        )

        # Quarter
        if selected_month_num in [4, 5, 6]:
            quarter_months = ['April', 'May', 'June']
            quarter_label  = 'Q1'
        elif selected_month_num in [7, 8, 9]:
            quarter_months = ['July', 'August', 'September']
            quarter_label  = 'Q2'
        elif selected_month_num in [10, 11, 12]:
            quarter_months = ['October', 'November', 'December']
            quarter_label  = 'Q3'
        else:
            quarter_months = ['January', 'February', 'March']
            quarter_label  = 'Q4'

        # ✅ FIXED: No fallback to all budgets
        fy_budgets = Budget.objects.filter(budget_fy_q(fy_start, fy_end))
        if pic_user_id is not None:
            fy_budgets = fy_budgets.filter(
                period_entries__user_id=pic_user_id
            )
        fy_budgets = fy_budgets.prefetch_related(
            'period_entries', 'categories'
        ).distinct()

        if not fy_budgets.exists():
            return Response({
                'has_data':      False,
                'message':       f'No budgets found for FY {selected_year}',
                'fy_label':      f"{fy_start.year}–{str(fy_end.year)[2:]}",
                'current_month': selected_month,
                'currency':      'INR',
            })

        sales_users = User.objects.filter(role='user')
        if pic_user_id is not None:
            sales_users = sales_users.filter(id=pic_user_id)

        # Keep budget allocation scope tied to sales users, but let the
        # opportunity/rank snapshot match the actual admin dashboard totals.
        opportunity_scope = Opportunity.objects.all()
        stage_scope = Opportunity_Stage.objects.all()
        if pic_user_id is not None:
            opportunity_scope = opportunity_scope.filter(user_id=pic_user_id)
            stage_scope = stage_scope.filter(add_opportunity__user_id=pic_user_id)

        all_entries = BudgetPeriodEntry.objects.filter(budget__in=fy_budgets)
        if pic_user_id is not None:
            all_entries = all_entries.filter(user_id=pic_user_id)

        # Targets
        fy_total_target = all_entries.aggregate(t=Sum('allocated'))['t'] or 0
        month_target    = all_entries.filter(month=selected_month).aggregate(t=Sum('allocated'))['t'] or 0
        quarter_target  = all_entries.filter(month__in=quarter_months).aggregate(t=Sum('allocated'))['t'] or 0

        total_revenue_target = fy_budgets.aggregate(t=Sum('revenue_target'))['t'] or 0
        total_target_deals   = sum(b.target_deal_count for b in fy_budgets)
        monthly_target_deals = max(1, round(total_target_deals / 12))

        # ── Helpers ──────────────────────────────────────────────
        def get_unique_opp_ids(rank, **date_filter):
            return list(set(
                stage_scope.filter(
                    Q(ranks=rank) | Q(stages=rank),
                    **date_filter,
                ).values_list('add_opportunity_id', flat=True)
            ))

        def sum_total_amount(opp_ids):
            if not opp_ids:
                return 0.0
            return float(
                Opportunity.objects.filter(id__in=opp_ids)
                .aggregate(s=Sum('total_amount'))['s'] or 0
            )

        # ── FY Rank A ─────────────────────────────────────────────
        fy_rank_a_ids  = get_unique_opp_ids(
            'Rank A',
            last_update__gte=fy_start,
            last_update__lte=fy_end,
        )
        fy_achieved     = sum_total_amount(fy_rank_a_ids)
        fy_deals_closed = len(fy_rank_a_ids)

        # ── Month Rank A ──────────────────────────────────────────
        month_user_ids = list(
            opportunity_scope.values_list('user_id', flat=True).distinct()
        )
        month_rank_snapshot = get_month_end_rank_snapshot(
            user_ids=month_user_ids,
            selected_year=selected_year,
            selected_month_name=selected_month,
        )
        month_stage_details = get_month_end_stage_details(
            user_ids=month_user_ids,
            selected_year=selected_year,
            selected_month_name=selected_month,
        )
        month_rank_a_ids        = list(month_rank_snapshot['Rank A'])
        month_achieved          = sum_total_amount(month_rank_a_ids)
        deals_closed_this_month = len(month_rank_a_ids)

        # ── Quarter Rank A ────────────────────────────────────────
        quarter_rank_a_ids_set = set()
        for q_month_name in quarter_months:
            q_num  = MONTH_NAME_TO_NUM[q_month_name]
            q_year = selected_year + 1 if q_num in [1, 2, 3] else selected_year
            q_ids  = get_unique_opp_ids(
                'Rank A',
                last_update__year=q_year,
                last_update__month=q_num,
            )
            quarter_rank_a_ids_set.update(q_ids)

        quarter_achieved = sum_total_amount(list(quarter_rank_a_ids_set))

        # ── Rank B Pipeline ───────────────────────────────────────
        fy_rank_b_ids = get_unique_opp_ids(
            'Rank B',
            last_update__gte=fy_start,
            last_update__lte=fy_end,
        )
        fy_rank_b_count = len(fy_rank_b_ids)
        fy_rank_b_value = sum_total_amount(fy_rank_b_ids)

        month_rank_b_ids = list(month_rank_snapshot['Rank B'])
        month_rank_b_count = len(month_rank_b_ids)
        month_rank_b_value = sum_total_amount(month_rank_b_ids)
        month_rank_c_count = len(month_rank_snapshot['Rank C'])
        month_rank_d_count = len(month_rank_snapshot['Rank D'])
        month_rank_e_count = len(month_rank_snapshot['Rank E'])
        month_start = date(selected_month_year, selected_month_num, 1)

        def split_snapshot_counts(rank_label):
            current_count = 0
            carried_count = 0

            for opp_id in month_rank_snapshot.get(rank_label, set()):
                latest_stage = month_stage_details.get(opp_id)
                if latest_stage and latest_stage.last_update and latest_stage.last_update >= month_start:
                    current_count += 1
                else:
                    carried_count += 1

            return current_count, carried_count

        month_rank_b_current_count, month_rank_b_carried_count = split_snapshot_counts('Rank B')
        month_rank_c_current_count, month_rank_c_carried_count = split_snapshot_counts('Rank C')
        month_rank_d_current_count, month_rank_d_carried_count = split_snapshot_counts('Rank D')
        month_rank_e_current_count, month_rank_e_carried_count = split_snapshot_counts('Rank E')
        # ── Derived ───────────────────────────────────────────────
        def safe_pct(achieved, target):
            if not target or float(target) == 0:
                return 0.0
            return round((float(achieved) / float(target)) * 100, 1)

        fy_achievement_pct      = safe_pct(fy_achieved,      fy_total_target)
        month_achievement_pct   = safe_pct(month_achieved,   month_target)
        quarter_achievement_pct = safe_pct(quarter_achieved, quarter_target)

        fy_remaining    = max(0, float(fy_total_target) - float(fy_achieved))
        fy_surplus      = max(0, float(fy_achieved)     - float(fy_total_target))
        month_remaining = max(0, float(month_target)    - float(month_achieved))

        days_in_month = calendar.monthrange(selected_month_year, selected_month_num)[1]
        selected_date = date(selected_month_year, selected_month_num, 1)

        if selected_month_num == today.month and selected_month_year == today.year:
            days_elapsed         = today.day
            days_remaining_month = days_in_month - days_elapsed
        elif selected_date < today:
            days_elapsed         = days_in_month
            days_remaining_month = 0
        else:
            days_elapsed         = 0
            days_remaining_month = days_in_month

        # ── ✅ NEW: Category breakdown for selected month ─────────
        category_breakdown = []
        seen_categories    = {}   # track by name to merge across budgets

        for budget in fy_budgets:
            for cat in budget.categories.all().order_by('order', 'id'):
                cat_month_target = float(
                    BudgetPeriodEntry.objects.filter(
                        budget=budget,
                        category=cat,
                        month=selected_month,
                        **({'user_id': pic_user_id} if pic_user_id is not None else {}),
                    ).aggregate(t=Sum('allocated'))['t'] or 0
                )
                cat_fy_target = float(
                    BudgetPeriodEntry.objects.filter(
                        budget=budget,
                        category=cat,
                        **({'user_id': pic_user_id} if pic_user_id is not None else {}),
                    ).aggregate(t=Sum('allocated'))['t'] or 0
                )

                if cat_fy_target == 0 and cat_month_target == 0:
                    continue

                # Merge categories with same name across budgets
                if cat.name in seen_categories:
                    seen_categories[cat.name]['month_target'] += cat_month_target
                    seen_categories[cat.name]['fy_target']    += cat_fy_target
                else:
                    seen_categories[cat.name] = {
                        'category':     cat.name,
                        'month_target': cat_month_target,
                        'fy_target':    cat_fy_target,
                    }

        category_breakdown = list(seen_categories.values())

        # Product drill-down for selected month (Rank A closures)
        # Group by category -> product and include sold counts.
        category_product_buckets = {}
        # For product drill-down, include Rank A closures for the selected month
        # across all owners (including admin-created opportunities). If PIC is
        # selected, keep that strict user filter.
        month_rank_a_stage_qs = Opportunity_Stage.objects.filter(
            ranks='Rank A',
            last_update__year=selected_month_year,
            last_update__month=selected_month_num,
        )
        if pic_user_id is not None:
            month_rank_a_stage_qs = month_rank_a_stage_qs.filter(
                add_opportunity__user_id=pic_user_id
            )

        month_rank_a_ids_for_products = list(set(
            month_rank_a_stage_qs.values_list('add_opportunity_id', flat=True)
        ))
        month_rank_a_opportunities = Opportunity.objects.filter(
            id__in=month_rank_a_ids_for_products
        )

        for opp in month_rank_a_opportunities:
            category_name = (opp.opportunity or '').strip()
            if not category_name:
                continue

            product_name = (
                (opp.sub_make_brand or '').strip()
                or (opp.sub_make or '').strip()
                or (opp.make or '').strip()
                or (opp.description or '').strip()
                or (opp.opportunity_description or '').strip()
                or (opp.account_name or '').strip()
                or 'Unspecified Product'
            )

            qty_raw = str(opp.qty or '').replace(',', '').strip()
            qty_num = 0
            if qty_raw:
                try:
                    qty_num = int(float(qty_raw))
                except Exception:
                    qty_num = 0

            category_bucket = category_product_buckets.setdefault(category_name, {})
            product_bucket = category_bucket.setdefault(product_name, {
                'product': product_name,
                'sold_count': 0,
                'units_sold': 0,
                'total_value': 0.0,
            })

            product_bucket['sold_count'] += 1
            product_bucket['units_sold'] += max(0, qty_num)
            product_bucket['total_value'] += float(opp.total_amount or 0)

        category_product_breakdown = []
        for category_name, products_dict in category_product_buckets.items():
            products = list(products_dict.values())
            products.sort(
                key=lambda p: (
                    -int(p.get('sold_count') or 0),
                    -int(p.get('units_sold') or 0),
                    -float(p.get('total_value') or 0),
                    str(p.get('product') or '').lower(),
                )
            )

            category_product_breakdown.append({
                'category': category_name,
                'total_products': len(products),
                'total_sold_count': sum(int(p.get('sold_count') or 0) for p in products),
                'total_units_sold': sum(int(p.get('units_sold') or 0) for p in products),
                'total_value': float(sum(float(p.get('total_value') or 0) for p in products)),
                'products': products,
            })

        category_product_breakdown.sort(key=lambda c: str(c.get('category') or '').lower())

        return Response({
            'has_data':                fy_budgets.exists(),
            'fy_label':                f"{fy_start.year}–{str(fy_end.year)[2:]}",
            'current_month':           selected_month,
            'quarter_label':           quarter_label,
            'total_budgets':           fy_budgets.count(),
            'total_sales_persons':     sales_users.count(),
            'currency':                'INR',
            'days_elapsed':            days_elapsed,
            'days_remaining':          days_remaining_month,
            'selected_year':           selected_year,
            'selected_month':          selected_month,

            # Targets
            'fy_total_target':         float(fy_total_target),
            'month_target':            float(month_target),
            'quarter_target':          float(quarter_target),
            'total_revenue_target':    float(total_revenue_target),
            'monthly_target_deals':    monthly_target_deals,
            'total_target_deals':      total_target_deals,

            # Rank A (Achievement)
            'fy_achieved':             float(fy_achieved),
            'month_achieved':          float(month_achieved),
            'quarter_achieved':        float(quarter_achieved),
            'fy_deals_closed':         fy_deals_closed,
            'deals_closed_this_month': deals_closed_this_month,

            # Rank B (Pipeline)
            'fy_rank_b_count':         fy_rank_b_count,
            'fy_rank_b_value':         float(fy_rank_b_value),
            'month_rank_b_count':      month_rank_b_count,
            'month_rank_b_value':      float(month_rank_b_value),
            'month_rank_c_count':      month_rank_c_count,
            'month_rank_d_count':      month_rank_d_count,
            'month_rank_e_count':      month_rank_e_count,
            'month_rank_b_current_count': month_rank_b_current_count,
            'month_rank_b_carried_count': month_rank_b_carried_count,
            'month_rank_c_current_count': month_rank_c_current_count,
            'month_rank_c_carried_count': month_rank_c_carried_count,
            'month_rank_d_current_count': month_rank_d_current_count,
            'month_rank_d_carried_count': month_rank_d_carried_count,
            'month_rank_e_current_count': month_rank_e_current_count,
            'month_rank_e_carried_count': month_rank_e_carried_count,

            # Derived
            'fy_achievement_pct':      fy_achievement_pct,
            'month_achievement_pct':   month_achievement_pct,
            'quarter_achievement_pct': quarter_achievement_pct,
            'fy_remaining':            fy_remaining,
            'fy_surplus':              fy_surplus,
            'month_remaining':         month_remaining,

            # ✅ NEW: Category breakdown
            'category_breakdown':      category_breakdown,
            'category_product_breakdown': category_product_breakdown,
        })

# class AdminOverallBudgetSummaryView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         from datetime import date
#         import calendar
#         from django.db.models import Sum
#         from django.contrib.auth import get_user_model
#         from .models import Budget, BudgetPeriodEntry, Opportunity, Opportunity_Stage

#         User = get_user_model()

#         if getattr(request.user, 'role', None) != 'admin':
#             return Response({'error': 'Admin access required'}, status=403)

#         today         = date.today()
#         current_month = today.month
#         current_year  = today.year

#         selected_year = int(request.query_params.get(
#             'year',
#             current_year if current_month >= 4 else current_year - 1
#         ))
#         selected_month = request.query_params.get('month', today.strftime('%B'))

#         fy_start = date(selected_year, 4, 1)
#         fy_end   = date(selected_year + 1, 3, 31)

#         MONTH_NAME_TO_NUM = {
#             'January':1,'February':2,'March':3,'April':4,
#             'May':5,'June':6,'July':7,'August':8,
#             'September':9,'October':10,'November':11,'December':12,
#         }
#         selected_month_num = MONTH_NAME_TO_NUM.get(selected_month, current_month)

#         if selected_month_num in [1, 2, 3]:
#             selected_month_year = selected_year + 1
#         else:
#             selected_month_year = selected_year

#         # Quarter
#         if selected_month_num in [4, 5, 6]:
#             quarter_months = ['April', 'May', 'June'];      quarter_label = 'Q1'
#         elif selected_month_num in [7, 8, 9]:
#             quarter_months = ['July', 'August', 'September']; quarter_label = 'Q2'
#         elif selected_month_num in [10, 11, 12]:
#             quarter_months = ['October', 'November', 'December']; quarter_label = 'Q3'
#         else:
#             quarter_months = ['January', 'February', 'March']; quarter_label = 'Q4'
#             'has_data':                fy_budgets.exists(),
#             'fy_label':                f"{fy_start.year}–{str(fy_end.year)[2:]}",
#             'current_month':           selected_month,
#             'quarter_label':           quarter_label,
#             'total_budgets':           fy_budgets.count(),
#             'total_sales_persons':     sales_users.count(),
#             'currency':                'INR',
#             'days_elapsed':            days_elapsed,
#             'days_remaining':          days_remaining_month,
#             'selected_year':           selected_year,
#             'selected_month':          selected_month,

#             # Targets
#             'fy_total_target':         float(fy_total_target),
#             'month_target':            float(month_target),
#             'quarter_target':          float(quarter_target),
#             'total_revenue_target':    float(total_revenue_target),
#             'monthly_target_deals':    monthly_target_deals,
#             'total_target_deals':      total_target_deals,

#             # Rank A
#             'fy_achieved':             float(fy_achieved),
#             'month_achieved':          float(month_achieved),
#             'quarter_achieved':        float(quarter_achieved),
#             'fy_deals_closed':         fy_deals_closed,
#             'deals_closed_this_month': deals_closed_this_month,

#             # Rank B
#             'fy_rank_b_count':         fy_rank_b_count,
#             'fy_rank_b_value':         float(fy_rank_b_value),
#             'month_rank_b_count':      month_rank_b_count,
#             'month_rank_b_value':      float(month_rank_b_value),

#             # Derived
#             'fy_achievement_pct':      fy_achievement_pct,
#             'month_achievement_pct':   month_achievement_pct,
#             'quarter_achievement_pct': quarter_achievement_pct,
#             'fy_remaining':            fy_remaining,
#             'fy_surplus':              fy_surplus,
#             'month_remaining':         month_remaining,
#         })
# ── GlobalCategoryViewSet ─────────────────────────────────────────────────────

class GlobalCategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class   = GlobalCategorySerializer
    queryset           = GlobalCategory.objects.none()

    def get_queryset(self):
        # ALL authenticated users see ALL categories — no role filtering
        # Categories are shared across the entire organisation
        return GlobalCategory.objects.all().prefetch_related('subcategories')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class GlobalSubCategoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset           = GlobalSubCategory.objects.none()

    def get_queryset(self):
        # ALL authenticated users see ALL subcategories
        return GlobalSubCategory.objects.all().select_related('category')

    def get_serializer_class(self):
        from .serializers import GlobalSubCategorySerializer
        return GlobalSubCategorySerializer

    def perform_create(self, serializer):
        category_id = self.request.data.get('category')
        category    = GlobalCategory.objects.get(id=category_id)
        serializer.save(category=category)

    # Forgot password ===============================================================
class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
 
    def post(self, request):
        from .models import PasswordResetOTP
        from .serializers import ForgotPasswordSerializer
        User = get_user_model()
 
        serializer = ForgotPasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'message': 'Failed', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
 
        email = serializer.validated_data['email']
 
        try:
            user = User.objects.get(email=email)
 
            # Invalidate all previous unused OTPs for this user
            PasswordResetOTP.objects.filter(user=user, is_used=False).update(is_used=True)
 
            # Generate a 6-digit OTP
            otp_code = str(random.randint(100000, 999999))
 
            PasswordResetOTP.objects.create(user=user, otp=otp_code)
 
            # Send OTP via email
            send_mail(
                subject='Your Password Reset OTP',
                message=f'Your OTP for password reset is: {otp_code}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except User.DoesNotExist:
            pass  # Don't reveal whether email exists
 
        # Always return success to avoid email enumeration
        return Response(
            {'message': 'If this email is registered, an OTP has been sent.'},
            status=status.HTTP_200_OK
        )
 
 
class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]
 
    def post(self, request):
        from .serializers import VerifyOTPSerializer
 
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            return Response({'message': 'OTP verified successfully.'}, status=status.HTTP_200_OK)
 
        return Response(
            {'message': 'Failed', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
 
 
class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]
 
    def post(self, request):
        from .serializers import ResetPasswordSerializer
 
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            otp_obj = serializer.validated_data['otp_obj']
            new_password = serializer.validated_data['new_password']
 
            # Set new password
            user.set_password(new_password)
            user.save()
 
            # Mark OTP as used
            otp_obj.is_used = True
            otp_obj.save()
 
            return Response({'message': 'Password reset successful.'}, status=status.HTTP_200_OK)
 
        return Response(
            {'message': 'Failed', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
 

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
 
    def post(self, request):
        from .serializers import ChangePasswordSerializer
 
        serializer = ChangePasswordSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'message': 'Failed', 'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
 
        user = request.user
        old_password = serializer.validated_data['old_password']
        new_password = serializer.validated_data['new_password']
 
        if not user.check_password(old_password):
            return Response(
                {'message': 'Failed', 'errors': {'old_password': ['Current password is incorrect.']}},
                status=status.HTTP_400_BAD_REQUEST
            )
 
        user.set_password(new_password)
        user.save()
 
        return Response(
            {'message': 'Password changed successfully.'},
            status=status.HTTP_200_OK
        ) 
    


import io
import logging
 
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import HttpResponse
 
from .models import Resume
from .serializers import ResumeSerializer
from .resume_utils import extract_text_from_file, parse_resume_with_groq
 
logger = logging.getLogger(__name__)
 
 
class ResumeViewSet(viewsets.ModelViewSet):
    """
    Handles:
        GET    /api/resumes/          → list (own resumes only)
        GET    /api/resumes/<id>/     → retrieve
        PUT    /api/resumes/<id>/     → full update
        PATCH  /api/resumes/<id>/     → partial update
        DELETE /api/resumes/<id>/     → delete
    """
    serializer_class       = ResumeSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes     = [IsAuthenticated]
    http_method_names      = ['get', 'put', 'patch', 'delete', 'head', 'options']
 
    def get_queryset(self):
        user = self.request.user
        # If the user is an admin or manager, show ALL resumes
        if user.role in ['admin', 'manager'] or user.is_staff:
            return Resume.objects.all()
        return Resume.objects.filter(created_by=user)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
 
class ResumeScanView(APIView):
    """
    POST /api/resumes/scan/
 
    Upload a single PDF or DOCX file.
 
    Extraction pipeline:
        PDF  → pdfplumber → PyMuPDF → EasyOCR (scanned/image PDFs)
        DOCX → python-docx → EasyOCR on embedded images
 
    Parsing pipeline:
        Extracted text → Groq LLM → structured JSON
                       (fallback: regex parser if Groq fails)
 
    Returns structured parsed data + raw_text. Does NOT save to DB.
 
    This endpoint is called once per file by the frontend queue processor.
    The frontend handles the sequential one-by-one processing itself;
    the backend is stateless and simply processes whatever file is sent.
    """
    parser_classes         = [MultiPartParser, FormParser]
    authentication_classes = [JWTAuthentication]
    permission_classes     = [IsAuthenticated]
 
    def post(self, request):
        uploaded_file = request.FILES.get('file')
 
        if not uploaded_file:
            return Response(
                {'error': 'No file provided. Send a PDF or DOCX as multipart field "file".'},
                status=status.HTTP_400_BAD_REQUEST,
            )
 
        # Validate file type
        filename = uploaded_file.name.lower()
        if not (filename.endswith('.pdf') or filename.endswith('.docx')):
            return Response(
                {'error': 'Unsupported file type. Only PDF and DOCX are allowed.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
 
        try:
            # Step 1: Extract raw text  (pdfplumber → PyMuPDF → EasyOCR)
            raw_text = extract_text_from_file(uploaded_file)
 
            if not raw_text.strip():
                return Response(
                    {
                        'error': (
                            'Could not extract any text from the file. '
                            'Ensure it is a valid PDF/DOCX, not an empty or '
                            'corrupt file.'
                        )
                    },
                    status=status.HTTP_422_UNPROCESSABLE_ENTITY,
                )
 
            # Step 2: Parse with Groq AI  (regex fallback built-in)
            parsed          = parse_resume_with_groq(raw_text)
            parsed['raw_text'] = raw_text
 
            return Response({
                'success':  True,
                'raw_text': raw_text,
                'parsed':   parsed,
            }, status=status.HTTP_200_OK)
 
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Resume scan error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
 
class ResumeSaveView(APIView):
    """
    POST /api/resumes/save/
 
    Save a parsed resume to the database.
 
    Duplicate handling (email-based upsert):
      - If email is non-empty AND a Resume with that email already exists
        (owned by this user) → UPDATE the existing record in-place.
      - If email is empty/null OR no match found → CREATE a new record.
      - The file field is only replaced when a new file is explicitly uploaded.
 
    Response shape:
        { "id": <int>, "action": "created" | "updated", "message": "..." }
    """
    parser_classes         = [MultiPartParser, FormParser, JSONParser]
    authentication_classes = [JWTAuthentication]
    permission_classes     = [IsAuthenticated]
 
    def post(self, request):
        data          = request.data
        uploaded_file = request.FILES.get('file')
 
        # Normalise incoming fields
        email       = (data.get('email', '')       or '').strip().lower() or None
        name        = (data.get('name', '')         or '').strip() or None
        phone       = (data.get('phone', '')        or '').strip()
        designation = (data.get('designation', '')  or '').strip()
        address     = (data.get('address', '')      or '').strip()
        raw_text    = (data.get('raw_text', '')     or '').strip()
 
        try:
            # Attempt duplicate lookup (only when email is present)
            existing = None
            if email:
                existing = Resume.objects.filter(
                    email=email,
                    created_by=request.user,
                ).first()
 
            if existing:
                # UPDATE path
                existing.name        = name        or existing.name
                existing.phone       = phone       or existing.phone
                existing.designation = designation or existing.designation
                existing.address     = address     or existing.address
                existing.raw_text    = raw_text    or existing.raw_text
                existing.status      = 'processed'
                if uploaded_file:
                    existing.file = uploaded_file
                existing.save()
 
                logger.info(f"Resume UPDATED (id={existing.id}, email={email})")
                return Response({
                    'id':      existing.id,
                    'action':  'updated',
                    'message': f"Resume for '{email}' already existed — record updated.",
                }, status=status.HTTP_200_OK)
 
            else:
                # CREATE path
                resume = Resume(
                    name        = name,
                    email       = email,
                    phone       = phone,
                    designation = designation,
                    address     = address,
                    raw_text    = raw_text,
                    status      = 'processed',
                    created_by  = request.user,
                )
                if uploaded_file:
                    resume.file = uploaded_file
                resume.save()
 
                logger.info(f"Resume CREATED (id={resume.id}, email={email})")
                return Response({
                    'id':      resume.id,
                    'action':  'created',
                    'message': 'Resume saved successfully.',
                }, status=status.HTTP_201_CREATED)
 
        except Exception as e:
            logger.error(f"ResumeSaveView error: {e}")
            return Response(
                {'error': 'An unexpected error occurred while saving the resume.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
 
class ResumeExportView(APIView):
    """
    GET /api/resumes/export/
    Export all resumes belonging to the requesting user as an Excel file.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes     = [IsAuthenticated]
 
    def get(self, request):
        try:
            import openpyxl
            from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
            from openpyxl.utils import get_column_letter
        except ImportError:
            return Response(
                {'error': 'openpyxl is required. Run: pip install openpyxl'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
 
        resumes = Resume.objects.filter(created_by=request.user)
 
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Resumes"
 
        # Header styling
        header_font  = Font(bold=True, color="FFFFFF", size=11)
        header_fill  = PatternFill("solid", fgColor="2563EB")
        header_align = Alignment(horizontal="center", vertical="center")
        thin_border  = Border(
            left=Side(style='thin'), right=Side(style='thin'),
            top=Side(style='thin'), bottom=Side(style='thin'),
        )
 
        headers    = ['#', 'Name', 'Email', 'Phone', 'Designation', 'Address', 'Created At']
        col_widths = [5,   25,     30,      18,      30,            40,        22]
 
        for col_idx, (header, width) in enumerate(zip(headers, col_widths), start=1):
            cell           = ws.cell(row=1, column=col_idx, value=header)
            cell.font      = header_font
            cell.fill      = header_fill
            cell.alignment = header_align
            cell.border    = thin_border
            ws.column_dimensions[get_column_letter(col_idx)].width = width
 
        ws.row_dimensions[1].height = 20
 
        # Data rows
        alt_fill = PatternFill("solid", fgColor="EFF6FF")
 
        for row_idx, resume in enumerate(resumes, start=2):
            row_data = [
                row_idx - 1,
                resume.name        or '',
                resume.email       or '',
                resume.phone       or '',
                resume.designation or '',
                resume.address     or '',
                resume.created_at.strftime('%Y-%m-%d %H:%M') if resume.created_at else '',
            ]
            fill = alt_fill if row_idx % 2 == 0 else None
 
            for col_idx, value in enumerate(row_data, start=1):
                cell           = ws.cell(row=row_idx, column=col_idx, value=value)
                cell.border    = thin_border
                cell.alignment = Alignment(vertical="center", wrap_text=True)
                if fill:
                    cell.fill = fill
 
            ws.row_dimensions[row_idx].height = 18
 
        buffer = io.BytesIO()
        wb.save(buffer)
        buffer.seek(0)
 
        response = HttpResponse(
            buffer.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        )
        response['Content-Disposition'] = 'attachment; filename="resumes.xlsx"'
        return response


# Add this to views.py

from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Opportunity, Opportunity_Stage, User
from django.contrib.auth import get_user_model
from django.db.models.functions import ExtractMonth

User = get_user_model()

MONTH_NAMES = {
    1: "January", 2: "February", 3: "March", 4: "April",
    5: "May", 6: "June", 7: "July", 8: "August",
    9: "September", 10: "October", 11: "November", 12: "December"
}

FY_MONTH_LIST = [
    'April','May','June','July','August','September',
    'October','November','December','January','February','March'
]

class PerUserRankAAchievementView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from datetime import date
        from django.db.models import Sum

        today         = date.today()
        current_month = today.month

        if current_month >= 4:
            fy_start = date(today.year,     4, 1)
            fy_end   = date(today.year + 1, 3, 31)
        else:
            fy_start = date(today.year - 1, 4, 1)
            fy_end   = date(today.year,     3, 31)

        sales_users = User.objects.filter(role='user')
        result = []

        for user in sales_users:

            # All Rank A stages for this user in this FY — ordered latest first
            all_rank_a_stages = (
                Opportunity_Stage.objects
                .filter(
                    ranks='Rank A',
                    add_opportunity__user=user,
                    last_update__gte=fy_start,
                    last_update__lte=fy_end,
                )
                .order_by('add_opportunity_id', '-last_update')
            )

            # Deduplicate — one entry per opportunity (latest Rank A stage)
            seen     = set()
            deduped  = []
            for stage in all_rank_a_stages:
                if stage.add_opportunity_id not in seen:
                    seen.add(stage.add_opportunity_id)
                    deduped.append(stage)

            distinct_opp_ids = [s.add_opportunity_id for s in deduped]
            won_count        = len(distinct_opp_ids)

            # Batch fetch amounts — avoids N+1 queries
            opp_amounts = dict(
                Opportunity.objects
                .filter(id__in=distinct_opp_ids)
                .values_list('id', 'total_amount')
            )

            total_achieved = sum(opp_amounts.values())

            # Monthly breakdown
            monthly_achieved = {m: 0 for m in FY_MONTH_LIST}
            for stage in deduped:
                m_name = MONTH_NAMES.get(stage.last_update.month, '')
                if m_name in monthly_achieved:
                    monthly_achieved[m_name] += opp_amounts.get(
                        stage.add_opportunity_id, 0
                    ) or 0

            result.append({
                'user_id':          user.id,
                'username':         user.username,
                'full_name':        f"{user.first_name} {user.last_name}".strip() or user.username,
                'total_achieved':   total_achieved,
                'won_count':        won_count,
                'monthly_achieved': monthly_achieved,
            })

        return Response(result)

class AdminPerUserBudgetSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from datetime import date
        from django.db.models import Sum
        from django.contrib.auth import get_user_model
        from .models import Budget, BudgetPeriodEntry, Opportunity, Opportunity_Stage

        User = get_user_model()

        if getattr(request.user, 'role', None) != 'admin':
            return Response({'error': 'Admin access required'}, status=403)

        today         = date.today()
        current_month = today.month
        current_year  = today.year

        selected_year = int(request.query_params.get(
            'year',
            current_year if current_month >= 4 else current_year - 1
        ))
        selected_month = request.query_params.get('month', today.strftime('%B'))

        MONTH_NAME_TO_NUM = {
            'January':1,'February':2,'March':3,'April':4,
            'May':5,'June':6,'July':7,'August':8,
            'September':9,'October':10,'November':11,'December':12,
        }

        FY_MONTHS = [
            'April','May','June','July','August','September',
            'October','November','December','January','February','March',
        ]

        fy_start = date(selected_year, 4, 1)
        fy_end   = date(selected_year + 1, 3, 31)

        selected_month_num  = MONTH_NAME_TO_NUM.get(selected_month, current_month)
        selected_month_year = selected_year + 1 if selected_month_num in [1,2,3] else selected_year

        # Quarter months
        cm = selected_month_num
        if cm in [4,5,6]:      q_months = ['April','May','June']
        elif cm in [7,8,9]:    q_months = ['July','August','September']
        elif cm in [10,11,12]: q_months = ['October','November','December']
        else:                  q_months = ['January','February','March']

        # Budgets in this FY
        fy_budgets = Budget.objects.filter(
            created_at__date__gte=fy_start,
            created_at__date__lte=fy_end,
        )

        sales_users = User.objects.filter(role='user')
        result = []

        # ══════════════════════════════════════════════════════════
        # HELPERS
        # ══════════════════════════════════════════════════════════
        def get_unique_opp_ids(rank, user, **date_filter):
            return list(set(
                Opportunity_Stage.objects.filter(
                    Q(ranks__iexact=rank) | Q(stages__iexact=rank),
                    add_opportunity__user=user,
                    **date_filter,
                ).values_list('add_opportunity_id', flat=True)
            ))

        def sum_total_amount(opp_ids):
            if not opp_ids:
                return 0.0
            return float(
                Opportunity.objects.filter(id__in=opp_ids)
                .aggregate(s=Sum('total_amount'))['s'] or 0
            )

        for user in sales_users:
            user_entries = BudgetPeriodEntry.objects.filter(
                user=user,
                budget__in=fy_budgets,
            )

            if not user_entries.exists():
                continue

            # Targets
            fy_target = float(user_entries.aggregate(t=Sum('allocated'))['t'] or 0)
            if fy_target == 0:
                continue

            month_target = float(
                user_entries.filter(month=selected_month)
                .aggregate(t=Sum('allocated'))['t'] or 0
            )
            quarter_target = float(
                user_entries.filter(month__in=q_months)
                .aggregate(t=Sum('allocated'))['t'] or 0
            )

            # ══════════════════════════════════════════════════════
            # FY ACHIEVEMENT — Rank A stages in FY
            # ══════════════════════════════════════════════════════
            fy_rank_a_ids = get_unique_opp_ids(
                'Rank A', user,
                last_update__gte=fy_start,
                last_update__lte=fy_end,
            )
            fy_achieved = sum_total_amount(fy_rank_a_ids)
            fy_deals    = len(fy_rank_a_ids)

            # Month Achievement
            month_rank_a_ids = get_unique_opp_ids(
                'Rank A', user,
                last_update__year=selected_month_year,
                last_update__month=selected_month_num,
            )
            month_achieved = sum_total_amount(month_rank_a_ids)

            # Monthly breakdown — all 12 months
            monthly_data = []
            for month_name in FY_MONTHS:
                m_num  = MONTH_NAME_TO_NUM[month_name]
                m_year = selected_year + 1 if m_num in [1,2,3] else selected_year

                m_target = float(
                    user_entries.filter(month=month_name)
                    .aggregate(t=Sum('allocated'))['t'] or 0
                )

                m_opp_ids  = get_unique_opp_ids(
                    'Rank A', user,
                    last_update__year=m_year,
                    last_update__month=m_num,
                )
                m_achieved = sum_total_amount(m_opp_ids)

                monthly_data.append({
                    'month':    month_name,
                    'target':   m_target,
                    'achieved': m_achieved,
                    'pct': round((m_achieved / m_target) * 100, 1) if m_target > 0 else 0,
                })

            fy_pct = round((fy_achieved / fy_target) * 100, 1) if fy_target > 0 else 0

            result.append({
                'user_id':        user.id,
                'username':       user.username,
                'full_name':      f"{user.first_name} {user.last_name}".strip() or user.username,
                'fy_target':      fy_target,
                'fy_achieved':    fy_achieved,
                'fy_pct':         fy_pct,
                'fy_remaining':   max(0, fy_target - fy_achieved),
                'fy_deals':       fy_deals,
                'month_target':   month_target,
                'month_achieved': month_achieved,
                'quarter_target': quarter_target,
                'monthly_data':   monthly_data,
            })

        result.sort(key=lambda x: x['fy_target'], reverse=True)
        return Response(result)

# class AdminPerUserBudgetSummaryView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         from datetime import date
#         from django.db.models import Sum
#         from django.contrib.auth import get_user_model
#         from .models import Budget, BudgetPeriodEntry, Opportunity, Opportunity_Stage

#         User = get_user_model()

#         if getattr(request.user, 'role', None) != 'admin':
#             return Response({'error': 'Admin access required'}, status=403)

#         today         = date.today()
#         current_month = today.month
#         current_year  = today.year

#         selected_year = int(request.query_params.get(
#             'year',
#             current_year if current_month >= 4 else current_year - 1
#         ))
#         selected_month = request.query_params.get('month', today.strftime('%B'))

#         MONTH_NAME_TO_NUM = {
#             'January':1,'February':2,'March':3,'April':4,
#             'May':5,'June':6,'July':7,'August':8,
#             'September':9,'October':10,'November':11,'December':12,
#         }

#         MONTH_NAMES = {
#             1:'January',2:'February',3:'March',4:'April',
#             5:'May',6:'June',7:'July',8:'August',
#             9:'September',10:'October',11:'November',12:'December',
#         }

#         FY_MONTHS = [
#             'April','May','June','July','August','September',
#             'October','November','December','January','February','March'
#         ]

#         fy_start = date(selected_year, 4, 1)
#         fy_end   = date(selected_year + 1, 3, 31)

#         selected_month_num  = MONTH_NAME_TO_NUM.get(selected_month, current_month)
#         selected_month_year = selected_year + 1 if selected_month_num in [1,2,3] else selected_year

#         # Quarter months
#         cm = selected_month_num
#         if cm in [4,5,6]:      q_months = ['April','May','June']
#         elif cm in [7,8,9]:    q_months = ['July','August','September']
#         elif cm in [10,11,12]: q_months = ['October','November','December']
#         else:                  q_months = ['January','February','March']

#         sales_users = User.objects.filter(role='user')
#         result = []

#         fy_budgets = Budget.objects.filter(
#     created_at__date__gte=fy_start,
#     created_at__date__lte=fy_end,
# )

#         for user in sales_users:
#             # Only entries from budgets in this FY
#             user_entries = BudgetPeriodEntry.objects.filter(
#                 user=user,
#                 budget__in=fy_budgets,
#             )

#             if not user_entries.exists():
#                 continue

#             # FY Target
#             fy_target = float(
#                 user_entries.aggregate(t=Sum('allocated'))['t'] or 0
#             )
#             if fy_target == 0:
#                 continue

#             # Month Target
#             month_target = float(
#                 user_entries.filter(month=selected_month)
#                 .aggregate(t=Sum('allocated'))['t'] or 0
#             )

#             # Quarter Target
#             quarter_target = float(
#                 user_entries.filter(month__in=q_months)
#                 .aggregate(t=Sum('allocated'))['t'] or 0
#             )

#             # FY Achievement (Rank A, deduplicated)
#             fy_stages = (
#                 Opportunity_Stage.objects
#                 .filter(
#                     ranks='Rank A',
#                     add_opportunity__user=user,
#                     last_update__gte=fy_start,
#                     last_update__lte=fy_end,
#                 )
#                 .order_by('add_opportunity_id', '-last_update')
#             )

#             seen, deduped_ids = set(), []
#             for s in fy_stages:
#                 if s.add_opportunity_id not in seen:
#                     seen.add(s.add_opportunity_id)
#                     deduped_ids.append(s.add_opportunity_id)


#             fy_achieved = float(
#                 Opportunity.objects.filter(id__in=deduped_ids)
#                 .aggregate(s=Sum('total_amount'))['s'] or 0
#             )
#             fy_deals = len(deduped_ids)

#             # Month Achievement
#             month_rank_a_ids = set(
#                 Opportunity_Stage.objects.filter(
#                     ranks='Rank A',
#                     add_opportunity__user=user,
#                     last_update__year=selected_month_year,
#                     last_update__month=selected_month_num,
#                 ).values_list('add_opportunity_id', flat=True)
#             )
#             month_achieved = float(
#                 Opportunity.objects.filter(id__in=list(month_rank_a_ids))
#                 .aggregate(s=Sum('total_amount'))['s'] or 0
#             )

#             # Batch fetch opportunity amounts for monthly breakdown
#             opp_amounts = dict(
#                 Opportunity.objects.filter(id__in=deduped_ids)
#                 .values_list('id', 'total_amount')
#             )

#             # Monthly breakdown — ALL 12 months always included
#             monthly_data = []
#             for month_name in FY_MONTHS:
#                 m_num  = MONTH_NAME_TO_NUM[month_name]
#                 m_year = selected_year + 1 if m_num in [1,2,3] else selected_year

#                 # Target from BudgetPeriodEntry
#                 m_target = float(
#                     user_entries.filter(month=month_name)
#                     .aggregate(t=Sum('allocated'))['t'] or 0
#                 )

#                 # Achievement from Rank A opportunities
#                 m_stage_ids = set(
#                     Opportunity_Stage.objects.filter(
#                         ranks='Rank A',
#                         add_opportunity__user=user,
#                         last_update__year=m_year,
#                         last_update__month=m_num,
#                     ).values_list('add_opportunity_id', flat=True)
#                 )

#                 m_achieved = float(
#                     Opportunity.objects.filter(id__in=list(m_stage_ids))
#                     .aggregate(s=Sum('total_amount'))['s'] or 0
#                 )

#                 # Always append all 12 months (even if both are 0)
#                 monthly_data.append({
#                     'month':    month_name,
#                     'target':   m_target,
#                     'achieved': m_achieved,
#                     'pct': round((m_achieved / m_target) * 100, 1) if m_target > 0 else 0,
#                 })

#             fy_pct = round((fy_achieved / fy_target) * 100, 1) if fy_target > 0 else 0

#             result.append({
#                 'user_id':        user.id,
#                 'username':       user.username,
#                 'full_name':      f"{user.first_name} {user.last_name}".strip() or user.username,
#                 'fy_target':      fy_target,
#                 'fy_achieved':    fy_achieved,
#                 'fy_pct':         fy_pct,
#                 'fy_remaining':   max(0, fy_target - fy_achieved),
#                 'fy_deals':       fy_deals,
#                 'month_target':   month_target,
#                 'month_achieved': month_achieved,
#                 'quarter_target': quarter_target,
#                 'monthly_data':   monthly_data,
#             })

#         result.sort(key=lambda x: x['fy_target'], reverse=True)
#         return Response(result)    

# class AdminPerUserBudgetSummaryView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         from datetime import date
#         from django.db.models import Sum
#         from django.contrib.auth import get_user_model
#         from .models import Budget, BudgetPeriodEntry, Opportunity

#         User = get_user_model()

#         if getattr(request.user, 'role', None) != 'admin':
#             return Response({'error': 'Admin access required'}, status=403)

#         today         = date.today()
#         current_month = today.month
#         current_year  = today.year

#         selected_year = int(request.query_params.get(
#             'year',
#             current_year if current_month >= 4 else current_year - 1
#         ))
#         selected_month = request.query_params.get('month', today.strftime('%B'))

#         MONTH_NAME_TO_NUM = {
#             'January':1,'February':2,'March':3,'April':4,
#             'May':5,'June':6,'July':7,'August':8,
#             'September':9,'October':10,'November':11,'December':12,
#         }

#         FY_MONTHS = [
#             'April','May','June','July','August','September',
#             'October','November','December','January','February','March',
#         ]

#         fy_start = date(selected_year, 4, 1)
#         fy_end   = date(selected_year + 1, 3, 31)

#         selected_month_num  = MONTH_NAME_TO_NUM.get(selected_month, current_month)
#         selected_month_year = selected_year + 1 if selected_month_num in [1,2,3] else selected_year

#         # Quarter months
#         cm = selected_month_num
#         if cm in [4,5,6]:      q_months = ['April','May','June']
#         elif cm in [7,8,9]:    q_months = ['July','August','September']
#         elif cm in [10,11,12]: q_months = ['October','November','December']
#         else:                  q_months = ['January','February','March']

#         # Budgets in this FY
#         fy_budgets = Budget.objects.filter(
#             created_at__date__gte=fy_start,
#             created_at__date__lte=fy_end,
#         )

#         sales_users = User.objects.filter(role='user')
#         result = []

#         for user in sales_users:
#             user_entries = BudgetPeriodEntry.objects.filter(
#                 user=user,
#                 budget__in=fy_budgets,
#             )

#             if not user_entries.exists():
#                 continue

#             # Targets
#             fy_target = float(user_entries.aggregate(t=Sum('allocated'))['t'] or 0)
#             if fy_target == 0:
#                 continue

#             month_target = float(
#                 user_entries.filter(month=selected_month)
#                 .aggregate(t=Sum('allocated'))['t'] or 0
#             )
#             quarter_target = float(
#                 user_entries.filter(month__in=q_months)
#                 .aggregate(t=Sum('allocated'))['t'] or 0
#             )

#             # ══════════════════════════════════════════════════════
#             # FY ACHIEVEMENT — direct query with distinct
#             # ══════════════════════════════════════════════════════
#             fy_achieved = float(
#                 Opportunity.objects.filter(
#                     user=user,
#                     opportunity_stages__ranks='Rank A',
#                     acct_created_date__gte=fy_start,
#                     acct_created_date__lte=fy_end,
#                 ).distinct().aggregate(s=Sum('total_amount'))['s'] or 0
#             )

#             fy_deals = Opportunity.objects.filter(
#                 user=user,
#                 opportunity_stages__ranks='Rank A',
#                 acct_created_date__gte=fy_start,
#                 acct_created_date__lte=fy_end,
#             ).distinct().count()

#             # Month Achievement
#             month_achieved = float(
#                 Opportunity.objects.filter(
#                     user=user,
#                     opportunity_stages__ranks='Rank A',
#                     acct_created_date__year=selected_month_year,
#                     acct_created_date__month=selected_month_num,
#                 ).distinct().aggregate(s=Sum('total_amount'))['s'] or 0
#             )

#             # Monthly breakdown — all 12 months
#             monthly_data = []
#             for month_name in FY_MONTHS:
#                 m_num  = MONTH_NAME_TO_NUM[month_name]
#                 m_year = selected_year + 1 if m_num in [1,2,3] else selected_year

#                 m_target = float(
#                     user_entries.filter(month=month_name)
#                     .aggregate(t=Sum('allocated'))['t'] or 0
#                 )

#                 m_achieved = float(
#                     Opportunity.objects.filter(
#                         user=user,
#                         opportunity_stages__ranks='Rank A',
#                         acct_created_date__year=m_year,
#                         acct_created_date__month=m_num,
#                     ).distinct().aggregate(s=Sum('total_amount'))['s'] or 0
#                 )

#                 monthly_data.append({
#                     'month':    month_name,
#                     'target':   m_target,
#                     'achieved': m_achieved,
#                     'pct': round((m_achieved / m_target) * 100, 1) if m_target > 0 else 0,
#                 })

#             fy_pct = round((fy_achieved / fy_target) * 100, 1) if fy_target > 0 else 0

#             result.append({
#                 'user_id':        user.id,
#                 'username':       user.username,
#                 'full_name':      f"{user.first_name} {user.last_name}".strip() or user.username,
#                 'fy_target':      fy_target,
#                 'fy_achieved':    fy_achieved,
#                 'fy_pct':         fy_pct,
#                 'fy_remaining':   max(0, fy_target - fy_achieved),
#                 'fy_deals':       fy_deals,
#                 'month_target':   month_target,
#                 'month_achieved': month_achieved,
#                 'quarter_target': quarter_target,
#                 'monthly_data':   monthly_data,
#             })

#         result.sort(key=lambda x: x['fy_target'], reverse=True)
#         return Response(result)

class UserBudgetDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from datetime import date
        import calendar
        from django.db.models import Sum, Q
        from .models import Budget, BudgetPeriodEntry, Opportunity, Opportunity_Stage

        user  = request.user
        today = date.today()
        current_month = today.month
        current_year  = today.year

        MONTH_NAME_TO_NUM = {
            'January':1,'February':2,'March':3,'April':4,
            'May':5,'June':6,'July':7,'August':8,
            'September':9,'October':10,'November':11,'December':12,
        }

        FY_MONTHS = [
            'April','May','June','July','August','September',
            'October','November','December','January','February','March',
        ]

        selected_year = int(request.query_params.get(
            'year',
            current_year if current_month >= 4 else current_year - 1
        ))
        selected_month = request.query_params.get('month', today.strftime('%B'))

        fy_start = date(selected_year, 4, 1)
        fy_end   = date(selected_year + 1, 3, 31)

        selected_month_num  = MONTH_NAME_TO_NUM.get(selected_month, current_month)
        selected_month_year = selected_year + 1 if selected_month_num in [1,2,3] else selected_year

        # Quarter
        cm = selected_month_num
        if cm in [4,5,6]:      q_months = ['April','May','June'];      q_label = 'Q1'
        elif cm in [7,8,9]:    q_months = ['July','August','September'];q_label = 'Q2'
        elif cm in [10,11,12]: q_months = ['October','November','December']; q_label = 'Q3'
        else:                  q_months = ['January','February','March'];     q_label = 'Q4'

        # ── Filter budgets by FY ──────────────────────────────
        fy_budgets = Budget.objects.filter(
            created_at__date__gte=fy_start,
            created_at__date__lte=fy_end,
        )

        user_entries = BudgetPeriodEntry.objects.filter(
            user=user,
            budget__in=fy_budgets,
        )

        if not user_entries.exists():
            return Response({
                'has_data':      False,
                'fy_label':      f"{selected_year}–{str(selected_year + 1)[2:]}",
                'current_month': selected_month,
                'message':       f'No budget assigned to you for FY {selected_year}–{str(selected_year + 1)[2:]}.',
            })

        budget = user_entries.order_by('-budget__created_at').first().budget

        # ── Targets ──────────────────────────────────────────────
        fy_target = float(
            user_entries.aggregate(t=Sum('allocated'))['t'] or 0
        )
        month_target = float(
            user_entries.filter(month=selected_month)
            .aggregate(t=Sum('allocated'))['t'] or 0
        )
        quarter_target = float(
            user_entries.filter(month__in=q_months)
            .aggregate(t=Sum('allocated'))['t'] or 0
        )

        # ══════════════════════════════════════════════════════════
        # HELPER: Get unique opp IDs whose stage was set in given range
        # Uses Opportunity_Stage.last_update (when Rank A was achieved)
        # ══════════════════════════════════════════════════════════
        def get_unique_opp_ids(rank, user, **date_filter):
            return list(set(
                Opportunity_Stage.objects.filter(
                    Q(ranks__iexact=rank) | Q(stages__iexact=rank),
                    add_opportunity__user=user,
                    **date_filter,
                ).values_list('add_opportunity_id', flat=True)
            ))

        def sum_total_amount(opp_ids):
            if not opp_ids:
                return 0.0
            return float(
                Opportunity.objects.filter(id__in=opp_ids)
                .aggregate(s=Sum('total_amount'))['s'] or 0
            )

        # ══════════════════════════════════════════════════════════
        # FY ACHIEVEMENT — Rank A stages within FY
        # ══════════════════════════════════════════════════════════
        fy_rank_a_ids = get_unique_opp_ids(
            'Rank A', user,
            last_update__gte=fy_start,
            last_update__lte=fy_end,
        )
        fy_achieved = sum_total_amount(fy_rank_a_ids)
        fy_deals    = len(fy_rank_a_ids)

        # ── Month Achievement ────────────────────────────────────
        month_rank_a_ids = get_unique_opp_ids(
            'Rank A', user,
            last_update__year=selected_month_year,
            last_update__month=selected_month_num,
        )
        month_achieved = sum_total_amount(month_rank_a_ids)
        month_deals    = len(month_rank_a_ids)

        # ── Rank B Pipeline ──────────────────────────────────────
        fy_rank_b_ids = get_unique_opp_ids(
            'Rank B', user,
            last_update__gte=fy_start,
            last_update__lte=fy_end,
        )
        fy_rank_b_count = len(fy_rank_b_ids)
        fy_rank_b_value = sum_total_amount(fy_rank_b_ids)

        month_rank_b_ids = get_unique_opp_ids(
            'Rank B', user,
            last_update__year=selected_month_year,
            last_update__month=selected_month_num,
        )
        month_rank_b_count = len(month_rank_b_ids)

        # ── Monthly breakdown ────────────────────────────────────
        monthly_data = []
        for month_name in FY_MONTHS:
            m_num  = MONTH_NAME_TO_NUM[month_name]
            m_year = selected_year + 1 if m_num in [1,2,3] else selected_year

            m_target = float(
                user_entries.filter(month=month_name)
                .aggregate(t=Sum('allocated'))['t'] or 0
            )

            m_opp_ids  = get_unique_opp_ids(
                'Rank A', user,
                last_update__year=m_year,
                last_update__month=m_num,
            )
            m_achieved = sum_total_amount(m_opp_ids)

            monthly_data.append({
                'month':    month_name,
                'target':   m_target,
                'achieved': m_achieved,
                'pct':      round((m_achieved / m_target) * 100, 1) if m_target > 0 else 0,
            })

        # ── Category breakdown ───────────────────────────────────
        categories_data = []
        for cat in budget.categories.all().order_by('order', 'id'):
            cat_entries = user_entries.filter(category=cat)
            cat_fy_target = float(
                cat_entries.aggregate(t=Sum('allocated'))['t'] or 0
            )
            cat_month_target = float(
                cat_entries.filter(month=selected_month)
                .aggregate(t=Sum('allocated'))['t'] or 0
            )

            if cat_fy_target == 0 and cat_month_target == 0:
                continue

            subcategories = []
            for sub in cat.subcategories.all():
                sub_fy = float(
                    cat_entries.filter(subcategory=sub)
                    .aggregate(t=Sum('allocated'))['t'] or 0
                )
                sub_month = float(
                    cat_entries.filter(subcategory=sub, month=selected_month)
                    .aggregate(t=Sum('allocated'))['t'] or 0
                )
                if sub_fy > 0:
                    subcategories.append({
                        'id':              sub.id,
                        'name':            sub.name,
                        'fy_allocated':    sub_fy,
                        'month_allocated': sub_month,
                    })

            categories_data.append({
                'id':              cat.id,
                'name':            cat.name,
                'fy_allocated':    cat_fy_target,
                'month_allocated': cat_month_target,
                'subcategories':   subcategories,
            })

        # ── Derived ──────────────────────────────────────────────
        def safe_pct(ach, trg):
            if not trg or float(trg) == 0:
                return 0.0
            return round((float(ach) / float(trg)) * 100, 1)

        fy_pct    = safe_pct(fy_achieved,    fy_target)
        month_pct = safe_pct(month_achieved, month_target)

        fy_remaining    = max(0, fy_target    - fy_achieved)
        month_remaining = max(0, month_target - month_achieved)

        days_in_month = calendar.monthrange(selected_month_year, selected_month_num)[1]
        sel_date      = date(selected_month_year, selected_month_num, 1)
        if selected_month_num == today.month and selected_month_year == today.year:
            days_elapsed   = today.day
            days_remaining = days_in_month - days_elapsed
        elif sel_date < today:
            days_elapsed   = days_in_month
            days_remaining = 0
        else:
            days_elapsed   = 0
            days_remaining = days_in_month

        return Response({
            'has_data':       True,
            'budget_id':      budget.id,
            'budget_title':   budget.title,
            'currency':       budget.currency,
            'fy_label':       f"{selected_year}–{str(selected_year + 1)[2:]}",
            'current_month':  selected_month,
            'quarter_label':  q_label,

            # Targets
            'fy_target':       fy_target,
            'month_target':    month_target,
            'quarter_target':  quarter_target,

            # Achievement
            'fy_achieved':      fy_achieved,
            'month_achieved':   month_achieved,
            'fy_deals':         fy_deals,
            'month_deals':      month_deals,

            # Percentage
            'fy_pct':           fy_pct,
            'month_pct':        month_pct,

            # Gap
            'fy_remaining':     fy_remaining,
            'month_remaining':  month_remaining,

            # Rank B
            'fy_rank_b_count':    fy_rank_b_count,
            'fy_rank_b_value':    fy_rank_b_value,
            'month_rank_b_count': month_rank_b_count,

            # Monthly + Categories
            'monthly_data':  monthly_data,
            'categories':    categories_data,

            # Days
            'days_elapsed':   days_elapsed,
            'days_remaining': days_remaining,
        })

# class UserBudgetDashboardView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         from datetime import date
#         import calendar
#         from django.db.models import Sum
#         from .models import Budget, BudgetPeriodEntry, Opportunity, Opportunity_Stage

#         user  = request.user
#         today = date.today()
#         current_month = today.month
#         current_year  = today.year

#         MONTH_NAME_TO_NUM = {
#             'January':1,'February':2,'March':3,'April':4,
#             'May':5,'June':6,'July':7,'August':8,
#             'September':9,'October':10,'November':11,'December':12,
#         }

#         FY_MONTHS = [
#             'April','May','June','July','August','September',
#             'October','November','December','January','February','March',
#         ]

#         selected_year = int(request.query_params.get(
#             'year',
#             current_year if current_month >= 4 else current_year - 1
#         ))
#         selected_month = request.query_params.get('month', today.strftime('%B'))

#         fy_start = date(selected_year, 4, 1)
#         fy_end   = date(selected_year + 1, 3, 31)

#         selected_month_num  = MONTH_NAME_TO_NUM.get(selected_month, current_month)
#         selected_month_year = selected_year + 1 if selected_month_num in [1,2,3] else selected_year

#         # Quarter
#         cm = selected_month_num
#         if cm in [4,5,6]:      q_months = ['April','May','June'];      q_label = 'Q1'
#         elif cm in [7,8,9]:    q_months = ['July','August','September'];q_label = 'Q2'
#         elif cm in [10,11,12]: q_months = ['October','November','December']; q_label = 'Q3'
#         else:                  q_months = ['January','February','March'];     q_label = 'Q4'

#         # ══════════════════════════════════════════════════════════
#         # FILTER BUDGETS BY SELECTED FY
#         # ══════════════════════════════════════════════════════════
#         fy_budgets = Budget.objects.filter(
#             created_at__date__gte=fy_start,
#             created_at__date__lte=fy_end,
#         )

#         # Only entries from budgets in this FY AND assigned to this user
#         user_entries = BudgetPeriodEntry.objects.filter(
#             user=user,
#             budget__in=fy_budgets,
#         )

#         if not user_entries.exists():
#             return Response({
#                 'has_data':      False,
#                 'fy_label':      f"{selected_year}–{str(selected_year + 1)[2:]}",
#                 'current_month': selected_month,
#                 'message':       f'No budget assigned to you for FY {selected_year}–{str(selected_year + 1)[2:]}.',
#             })

#         # Get the latest budget in this FY for display info
#         budget = user_entries.order_by('-budget__created_at').first().budget

#         # ── Targets ──────────────────────────────────────────────
#         fy_target = float(
#             user_entries.aggregate(t=Sum('allocated'))['t'] or 0
#         )
#         month_target = float(
#             user_entries.filter(month=selected_month)
#             .aggregate(t=Sum('allocated'))['t'] or 0
#         )
#         quarter_target = float(
#             user_entries.filter(month__in=q_months)
#             .aggregate(t=Sum('allocated'))['t'] or 0
#         )

#         # ── FY Achievement (Rank A, deduplicated) ────────────────
#         fy_stages = (
#             Opportunity_Stage.objects
#             .filter(
#                 ranks='Rank A',
#                 add_opportunity__user=user,
#                 last_update__gte=fy_start,
#                 last_update__lte=fy_end,
#             )
#             .order_by('add_opportunity_id', '-last_update')
#         )

#         seen, deduped_ids = set(), []
#         for s in fy_stages:
#             if s.add_opportunity_id not in seen:
#                 seen.add(s.add_opportunity_id)
#                 deduped_ids.append(s.add_opportunity_id)

#         fy_achieved = float(
#             Opportunity.objects.filter(id__in=deduped_ids)
#             .aggregate(s=Sum('total_amount'))['s'] or 0
#         )
#         fy_deals = len(deduped_ids)

#         # ── Month Achievement ────────────────────────────────────
#         month_rank_a_ids = set(
#             Opportunity_Stage.objects.filter(
#                 ranks='Rank A',
#                 add_opportunity__user=user,
#                 last_update__year=selected_month_year,
#                 last_update__month=selected_month_num,
#             ).values_list('add_opportunity_id', flat=True)
#         )
#         month_achieved = float(
#             Opportunity.objects.filter(id__in=list(month_rank_a_ids))
#             .aggregate(s=Sum('total_amount'))['s'] or 0
#         )
#         month_deals = len(month_rank_a_ids)

#         # ── Rank B Pipeline ──────────────────────────────────────
#         fy_rank_b_ids = set(
#             Opportunity_Stage.objects.filter(
#                 ranks='Rank B',
#                 add_opportunity__user=user,
#                 last_update__gte=fy_start,
#                 last_update__lte=fy_end,
#             ).values_list('add_opportunity_id', flat=True).distinct()
#         )
#         fy_rank_b_count = len(fy_rank_b_ids)
#         fy_rank_b_value = float(
#             Opportunity.objects.filter(id__in=list(fy_rank_b_ids))
#             .aggregate(s=Sum('total_amount'))['s'] or 0
#         )

#         month_rank_b_ids = set(
#             Opportunity_Stage.objects.filter(
#                 ranks='Rank B',
#                 add_opportunity__user=user,
#                 last_update__year=selected_month_year,
#                 last_update__month=selected_month_num,
#             ).values_list('add_opportunity_id', flat=True).distinct()
#         )
#         month_rank_b_count = len(month_rank_b_ids)

#         # ── Monthly breakdown (all 12 months for this FY) ────────
#         monthly_data = []
#         for month_name in FY_MONTHS:
#             m_num  = MONTH_NAME_TO_NUM[month_name]
#             m_year = selected_year + 1 if m_num in [1,2,3] else selected_year

#             m_target = float(
#                 user_entries.filter(month=month_name)
#                 .aggregate(t=Sum('allocated'))['t'] or 0
#             )

#             m_stage_ids = set(
#                 Opportunity_Stage.objects.filter(
#                     ranks='Rank A',
#                     add_opportunity__user=user,
#                     last_update__year=m_year,
#                     last_update__month=m_num,
#                 ).values_list('add_opportunity_id', flat=True)
#             )
#             m_achieved = float(
#                 Opportunity.objects.filter(id__in=list(m_stage_ids))
#                 .aggregate(s=Sum('total_amount'))['s'] or 0
#             )

#             monthly_data.append({
#                 'month':    month_name,
#                 'target':   m_target,
#                 'achieved': m_achieved,
#                 'pct': round((m_achieved / m_target) * 100, 1) if m_target > 0 else 0,
#             })

#         # ── Category breakdown ───────────────────────────────────
#         categories_data = []
#         for cat in budget.categories.all().order_by('order', 'id'):
#             cat_entries = user_entries.filter(category=cat)
#             cat_fy_target = float(
#                 cat_entries.aggregate(t=Sum('allocated'))['t'] or 0
#             )
#             cat_month_target = float(
#                 cat_entries.filter(month=selected_month)
#                 .aggregate(t=Sum('allocated'))['t'] or 0
#             )

#             if cat_fy_target == 0 and cat_month_target == 0:
#                 continue

#             subcategories = []
#             for sub in cat.subcategories.all():
#                 sub_fy = float(
#                     cat_entries.filter(subcategory=sub)
#                     .aggregate(t=Sum('allocated'))['t'] or 0
#                 )
#                 sub_month = float(
#                     cat_entries.filter(subcategory=sub, month=selected_month)
#                     .aggregate(t=Sum('allocated'))['t'] or 0
#                 )
#                 if sub_fy > 0:
#                     subcategories.append({
#                         'id':              sub.id,
#                         'name':            sub.name,
#                         'fy_allocated':    sub_fy,
#                         'month_allocated': sub_month,
#                     })

#             categories_data.append({
#                 'id':              cat.id,
#                 'name':            cat.name,
#                 'fy_allocated':    cat_fy_target,
#                 'month_allocated': cat_month_target,
#                 'subcategories':   subcategories,
#             })

#         # ── Derived ──────────────────────────────────────────────
#         def safe_pct(ach, trg):
#             if not trg or float(trg) == 0: return 0.0
#             return round((float(ach) / float(trg)) * 100, 1)

#         fy_pct    = safe_pct(fy_achieved,    fy_target)
#         month_pct = safe_pct(month_achieved, month_target)

#         fy_remaining    = max(0, fy_target    - fy_achieved)
#         month_remaining = max(0, month_target - month_achieved)

#         # Days
#         days_in_month = calendar.monthrange(selected_month_year, selected_month_num)[1]
#         sel_date      = date(selected_month_year, selected_month_num, 1)
#         if selected_month_num == today.month and selected_month_year == today.year:
#             days_elapsed   = today.day
#             days_remaining = days_in_month - days_elapsed
#         elif sel_date < today:
#             days_elapsed   = days_in_month
#             days_remaining = 0
#         else:
#             days_elapsed   = 0
#             days_remaining = days_in_month

#         return Response({
#             'has_data':       True,
#             'budget_id':      budget.id,
#             'budget_title':   budget.title,
#             'currency':       budget.currency,
#             'fy_label':       f"{selected_year}–{str(selected_year + 1)[2:]}",
#             'current_month':  selected_month,
#             'quarter_label':  q_label,

#             # Targets
#             'fy_target':       fy_target,
#             'month_target':    month_target,
#             'quarter_target':  quarter_target,

#             # Achievement
#             'fy_achieved':      fy_achieved,
#             'month_achieved':   month_achieved,
#             'fy_deals':         fy_deals,
#             'month_deals':      month_deals,

#             # Percentage
#             'fy_pct':           fy_pct,
#             'month_pct':        month_pct,

#             # Gap
#             'fy_remaining':     fy_remaining,
#             'month_remaining':  month_remaining,

#             # Rank B
#             'fy_rank_b_count':    fy_rank_b_count,
#             'fy_rank_b_value':    fy_rank_b_value,
#             'month_rank_b_count': month_rank_b_count,

#             # Monthly breakdown
#             'monthly_data':  monthly_data,

#             # Categories
#             'categories':    categories_data,

#             # Days
#             'days_elapsed':   days_elapsed,
#             'days_remaining': days_remaining,
#         })

# class UserBudgetDashboardView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         from datetime import date
#         import calendar
#         from django.db.models import Sum
#         from .models import Budget, BudgetPeriodEntry, Opportunity

#         user  = request.user
#         today = date.today()
#         current_month = today.month
#         current_year  = today.year

#         MONTH_NAME_TO_NUM = {
#             'January':1,'February':2,'March':3,'April':4,
#             'May':5,'June':6,'July':7,'August':8,
#             'September':9,'October':10,'November':11,'December':12,
#         }

#         FY_MONTHS = [
#             'April','May','June','July','August','September',
#             'October','November','December','January','February','March',
#         ]

#         selected_year = int(request.query_params.get(
#             'year',
#             current_year if current_month >= 4 else current_year - 1
#         ))
#         selected_month = request.query_params.get('month', today.strftime('%B'))

#         fy_start = date(selected_year, 4, 1)
#         fy_end   = date(selected_year + 1, 3, 31)

#         selected_month_num  = MONTH_NAME_TO_NUM.get(selected_month, current_month)
#         selected_month_year = selected_year + 1 if selected_month_num in [1,2,3] else selected_year

#         # Quarter
#         cm = selected_month_num
#         if cm in [4,5,6]:      q_months = ['April','May','June'];      q_label = 'Q1'
#         elif cm in [7,8,9]:    q_months = ['July','August','September'];q_label = 'Q2'
#         elif cm in [10,11,12]: q_months = ['October','November','December']; q_label = 'Q3'
#         else:                  q_months = ['January','February','March'];     q_label = 'Q4'

#         # ── Filter budgets by FY ──────────────────────────────
#         fy_budgets = Budget.objects.filter(
#             created_at__date__gte=fy_start,
#             created_at__date__lte=fy_end,
#         )

#         user_entries = BudgetPeriodEntry.objects.filter(
#             user=user,
#             budget__in=fy_budgets,
#         )

#         if not user_entries.exists():
#             return Response({
#                 'has_data':      False,
#                 'fy_label':      f"{selected_year}–{str(selected_year + 1)[2:]}",
#                 'current_month': selected_month,
#                 'message':       f'No budget assigned to you for FY {selected_year}–{str(selected_year + 1)[2:]}.',
#             })

#         budget = user_entries.order_by('-budget__created_at').first().budget

#         # ── Targets ──────────────────────────────────────────────
#         fy_target = float(
#             user_entries.aggregate(t=Sum('allocated'))['t'] or 0
#         )
#         month_target = float(
#             user_entries.filter(month=selected_month)
#             .aggregate(t=Sum('allocated'))['t'] or 0
#         )
#         quarter_target = float(
#             user_entries.filter(month__in=q_months)
#             .aggregate(t=Sum('allocated'))['t'] or 0
#         )

#         # ══════════════════════════════════════════════════════════
#         # FY ACHIEVEMENT — using acct_created_date + distinct
#         # ══════════════════════════════════════════════════════════
#         fy_achieved = float(
#             Opportunity.objects.filter(
#                 user=user,
#                 opportunity_stages__ranks='Rank A',
#                 acct_created_date__gte=fy_start,
#                 acct_created_date__lte=fy_end,
#             ).distinct().aggregate(s=Sum('total_amount'))['s'] or 0
#         )

#         fy_deals = Opportunity.objects.filter(
#             user=user,
#             opportunity_stages__ranks='Rank A',
#             acct_created_date__gte=fy_start,
#             acct_created_date__lte=fy_end,
#         ).distinct().count()

#         # ── Month Achievement ────────────────────────────────────
#         month_achieved = float(
#             Opportunity.objects.filter(
#                 user=user,
#                 opportunity_stages__ranks='Rank A',
#                 acct_created_date__year=selected_month_year,
#                 acct_created_date__month=selected_month_num,
#             ).distinct().aggregate(s=Sum('total_amount'))['s'] or 0
#         )

#         month_deals = Opportunity.objects.filter(
#             user=user,
#             opportunity_stages__ranks='Rank A',
#             acct_created_date__year=selected_month_year,
#             acct_created_date__month=selected_month_num,
#         ).distinct().count()

#         # ── Rank B Pipeline ──────────────────────────────────────
#         fy_rank_b_count = Opportunity.objects.filter(
#             user=user,
#             opportunity_stages__ranks='Rank B',
#             acct_created_date__gte=fy_start,
#             acct_created_date__lte=fy_end,
#         ).distinct().count()

#         fy_rank_b_value = float(
#             Opportunity.objects.filter(
#                 user=user,
#                 opportunity_stages__ranks='Rank B',
#                 acct_created_date__gte=fy_start,
#                 acct_created_date__lte=fy_end,
#             ).distinct().aggregate(s=Sum('total_amount'))['s'] or 0
#         )

#         month_rank_b_count = Opportunity.objects.filter(
#             user=user,
#             opportunity_stages__ranks='Rank B',
#             acct_created_date__year=selected_month_year,
#             acct_created_date__month=selected_month_num,
#         ).distinct().count()

#         # ── Monthly breakdown ────────────────────────────────────
#         monthly_data = []
#         for month_name in FY_MONTHS:
#             m_num  = MONTH_NAME_TO_NUM[month_name]
#             m_year = selected_year + 1 if m_num in [1,2,3] else selected_year

#             m_target = float(
#                 user_entries.filter(month=month_name)
#                 .aggregate(t=Sum('allocated'))['t'] or 0
#             )

#             m_achieved = float(
#                 Opportunity.objects.filter(
#                     user=user,
#                     opportunity_stages__ranks='Rank A',
#                     acct_created_date__year=m_year,
#                     acct_created_date__month=m_num,
#                 ).distinct().aggregate(s=Sum('total_amount'))['s'] or 0
#             )

#             monthly_data.append({
#                 'month':    month_name,
#                 'target':   m_target,
#                 'achieved': m_achieved,
#                 'pct': round((m_achieved / m_target) * 100, 1) if m_target > 0 else 0,
#             })

#         # ── Category breakdown ───────────────────────────────────
#         categories_data = []
#         for cat in budget.categories.all().order_by('order', 'id'):
#             cat_entries = user_entries.filter(category=cat)
#             cat_fy_target = float(
#                 cat_entries.aggregate(t=Sum('allocated'))['t'] or 0
#             )
#             cat_month_target = float(
#                 cat_entries.filter(month=selected_month)
#                 .aggregate(t=Sum('allocated'))['t'] or 0
#             )

#             if cat_fy_target == 0 and cat_month_target == 0:
#                 continue

#             subcategories = []
#             for sub in cat.subcategories.all():
#                 sub_fy = float(
#                     cat_entries.filter(subcategory=sub)
#                     .aggregate(t=Sum('allocated'))['t'] or 0
#                 )
#                 sub_month = float(
#                     cat_entries.filter(subcategory=sub, month=selected_month)
#                     .aggregate(t=Sum('allocated'))['t'] or 0
#                 )
#                 if sub_fy > 0:
#                     subcategories.append({
#                         'id':              sub.id,
#                         'name':            sub.name,
#                         'fy_allocated':    sub_fy,
#                         'month_allocated': sub_month,
#                     })

#             categories_data.append({
#                 'id':              cat.id,
#                 'name':            cat.name,
#                 'fy_allocated':    cat_fy_target,
#                 'month_allocated': cat_month_target,
#                 'subcategories':   subcategories,
#             })

#         # ── Derived ──────────────────────────────────────────────
#         def safe_pct(ach, trg):
#             if not trg or float(trg) == 0: return 0.0
#             return round((float(ach) / float(trg)) * 100, 1)

#         fy_pct    = safe_pct(fy_achieved,    fy_target)
#         month_pct = safe_pct(month_achieved, month_target)

#         fy_remaining    = max(0, fy_target    - fy_achieved)
#         month_remaining = max(0, month_target - month_achieved)

#         days_in_month = calendar.monthrange(selected_month_year, selected_month_num)[1]
#         sel_date      = date(selected_month_year, selected_month_num, 1)
#         if selected_month_num == today.month and selected_month_year == today.year:
#             days_elapsed   = today.day
#             days_remaining = days_in_month - days_elapsed
#         elif sel_date < today:
#             days_elapsed   = days_in_month
#             days_remaining = 0
#         else:
#             days_elapsed   = 0
#             days_remaining = days_in_month

#         return Response({
#             'has_data':       True,
#             'budget_id':      budget.id,
#             'budget_title':   budget.title,
#             'currency':       budget.currency,
#             'fy_label':       f"{selected_year}–{str(selected_year + 1)[2:]}",
#             'current_month':  selected_month,
#             'quarter_label':  q_label,

#             'fy_target':       fy_target,
#             'month_target':    month_target,
#             'quarter_target':  quarter_target,

#             'fy_achieved':      fy_achieved,
#             'month_achieved':   month_achieved,
#             'fy_deals':         fy_deals,
#             'month_deals':      month_deals,

#             'fy_pct':           fy_pct,
#             'month_pct':        month_pct,

#             'fy_remaining':     fy_remaining,
#             'month_remaining':  month_remaining,

#             'fy_rank_b_count':    fy_rank_b_count,
#             'fy_rank_b_value':    fy_rank_b_value,
#             'month_rank_b_count': month_rank_b_count,

#             'monthly_data':  monthly_data,
#             'categories':    categories_data,

#             'days_elapsed':   days_elapsed,
#             'days_remaining': days_remaining,
#         })
    

# from django.db.models import Sum
# from rest_framework import viewsets, status, permissions
# from rest_framework.response import Response
# from rest_framework.decorators import action
# from .models import PerformanceTarget, Lead, Opportunity, User, Opportunity_Stage
# from .serializers import PerformanceTargetWriteSerializer, PerformanceAttainmentReportSerializer

# class IsAdminRole(permissions.BasePermission):
#     """Custom permission to only allow users with role='admin'."""
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and getattr(request.user, 'role', None) == 'admin'

# class PerformanceManagementViewSet(viewsets.ViewSet):
#     permission_classes = [IsAdminRole]

#     @action(detail=False, methods=['get'], url_path='attainment-report')
#     def attainment_report(self, request):
#         year = int(request.query_params.get('year', 2024))
        
#         # 1. Fetch only employees (role='user')
#         employees = User.objects.filter(role='user')
#         report_data = []

#         for emp in employees:
#             # 2. Get the Target set by Admin for this specific employee
#             target_obj = PerformanceTarget.objects.filter(user=emp, fiscal_year=year).first()
#             target_val = float(target_obj.sales_target) if target_obj else 0.0

#             # 3. Equation: Sales Success Rate = (Sum of Rank A Opportunities / Target) * 100
#             # Filter logic: User's opportunities where one of the stages is 'Rank A'
#             actual_sales_sum = Opportunity.objects.filter(
#                 user=emp, 
#                 opportunity_stages__ranks='Rank A'
#             ).distinct().aggregate(total=Sum('total_amount'))['total'] or 0

#             # 4. Equation: Funnel Conversion = (Leads with status 'oppurtunity' / Total Leads) * 100
#             total_leads_count = Lead.objects.filter(assign_to=emp).count()
#             # converted_leads_count = Lead.objects.filter(assign_to=emp, status='oppurtunity').count()
#             converted_leads_count = Lead.objects.filter(assign_to=emp,lead_stages__ranks='Rank A',).distinct().count()

#             # Perform Rate Calculations
#             sales_success_rate = (float(actual_sales_sum) / target_val * 100) if target_val > 0 else 0
#             funnel_conv_rate = (converted_leads_count / total_leads_count * 100) if total_leads_count > 0 else 0

#             report_data.append({
#                 'user_id': emp.id,
#                 'username': emp.username,
#                 'full_name': f"{emp.first_name} {emp.last_name}".strip() or emp.username,
#                 'target': target_val,
#                 'actual_sales': float(actual_sales_sum),
#                 'sales_success_rate': round(sales_success_rate, 2),
#                 'total_leads': total_leads_count,
#                 'converted_leads': converted_leads_count,
#                 'funnel_conv_rate': round(funnel_conv_rate, 2)
#             })

#         # Serialize and return
#         serializer = PerformanceAttainmentReportSerializer(report_data, many=True)
#         return Response(serializer.data)

#     @action(detail=False, methods=['post'], url_path='save-quota')
#     def save_quota(self, request):
#         # Expects: { "user_id": 1, "target_amount": 3000000, "year": 2024 }
#         user_id = request.data.get('user_id')
#         amount = request.data.get('target_amount')
#         year = request.data.get('year', 2024)

#         if not user_id or amount is None:
#             return Response({'error': 'User ID and Target Amount are required.'}, status=400)

#         # Update if target exists for that year, else create
#         target, created = PerformanceTarget.objects.update_or_create(
#             user_id=user_id,
#             fiscal_year=year,
#             defaults={'sales_target': amount}
#         )

#         return Response({
#             'message': 'Quota updated' if not created else 'Quota created',
#             'user': target.user.username,
#             'amount': float(target.sales_target)
#         }, status=status.HTTP_200_OK)

from datetime import date
from django.db.models import Count, Q, Sum
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import PerformanceTarget, Lead, Opportunity, User, Opportunity_Stage
from .serializers import PerformanceTargetWriteSerializer, PerformanceAttainmentReportSerializer

class IsAdminRole(permissions.BasePermission):
    """Custom permission to only allow users with role='admin'."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, 'role', None) == 'admin'

class PerformanceManagementViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminRole]

    @action(detail=False, methods=['get'], url_path='employees')
    def employees(self, request):
        """Fetch all sales employees (role='user')."""
        emps = User.objects.filter(role='user')
        data = [
            {'id': e.id, 'username': e.username, 'role': e.role}
            for e in emps
        ]
        return Response(data)

    # @action(detail=False, methods=['get'], url_path='attainment-report')
    # def attainment_report(self, request):
    #     # ── FY Year Filter (dynamic from query param) ───────────
    #     today         = date.today()
    #     current_month = today.month
    #     current_year  = today.year
    #     default_year  = current_year if current_month >= 4 else current_year - 1
    #     year          = int(request.query_params.get('year', default_year))

    #     # FY date range: April 1 → March 31
    #     fy_start  = date(year, 4, 1)
    #     fy_end    = date(year + 1, 3, 31)
    #     # If selected FY is current, limit to today; otherwise use full FY end
    #     fy_to_now = today if (fy_start <= today <= fy_end) else fy_end
        
    #     # 1. Fetch only employees (role='user')
    #     employees = User.objects.filter(role='user')
    #     report_data = []

    #     for emp in employees:
    #         # 2. Get the Target set by Admin for this specific employee for selected FY
    #         target_obj = PerformanceTarget.objects.filter(user=emp, fiscal_year=year).first()
    #         target_val = float(target_obj.sales_target) if target_obj else 0.0

    #         # 3. Equation: Sales Success Rate = (Sum of Rank A Opportunities / Target) * 100
    #         # ✅ Filter Opportunities by FY range (acct_created_date)
    #         actual_sales_sum = Opportunity.objects.filter(
    #             user=emp, 
    #             opportunity_stages__ranks='Rank A',
    #             acct_created_date__gte=fy_start,
    #             acct_created_date__lte=fy_to_now,
    #         ).distinct().aggregate(total=Sum('total_amount'))['total'] or 0

    #         # 4. Equation: Funnel Conversion = (Leads with Rank A stage / Total Leads) * 100
    #         # ✅ Filter Leads by FY range (acct_created_date)
    #         total_leads_count = Lead.objects.filter(
    #             assign_to=emp,
    #             acct_created_date__gte=fy_start,
    #             acct_created_date__lte=fy_to_now,
    #         ).count()
            
    #         converted_leads_count = Lead.objects.filter(
    #             assign_to=emp,
    #             lead_stages__ranks='Rank A',
    #             acct_created_date__gte=fy_start,
    #             acct_created_date__lte=fy_to_now,
    #         ).distinct().count()

    #         # Perform Rate Calculations
    #         sales_success_rate = (float(actual_sales_sum) / target_val * 100) if target_val > 0 else 0
    #         funnel_conv_rate = (converted_leads_count / total_leads_count * 100) if total_leads_count > 0 else 0

    #         report_data.append({
    #             'user_id': emp.id,
    #             'username': emp.username,
    #             'full_name': f"{emp.first_name} {emp.last_name}".strip() or emp.username,
    #             'target': target_val,
    #             'actual_sales': float(actual_sales_sum),
    #             'sales_success_rate': round(sales_success_rate, 2),
    #             'total_leads': total_leads_count,
    #             'converted_leads': converted_leads_count,
    #             'funnel_conv_rate': round(funnel_conv_rate, 2),
    #             'fy_year': year,
    #             'fy_label': f"FY {year}–{str(year + 1)[2:]}",
    #         })

    #     # Serialize and return
    #     serializer = PerformanceAttainmentReportSerializer(report_data, many=True)
    #     return Response(serializer.data)
    @action(detail=False, methods=['get'], url_path='attainment-report')
    def attainment_report(self, request):
        today         = date.today()
        current_month = today.month
        current_year  = today.year
        default_year  = current_year if current_month >= 4 else current_year - 1
        year          = int(request.query_params.get('year', default_year))

        fy_start  = date(year, 4, 1)
        fy_end    = date(year + 1, 3, 31)
        fy_to_now = today if (fy_start <= today <= fy_end) else fy_end
        
        employees   = User.objects.filter(role='user')
        report_data = []

        for emp in employees:
            # Target
            target_obj = PerformanceTarget.objects.filter(user=emp, fiscal_year=year).first()
            target_val = float(target_obj.sales_target) if target_obj else 0.0

            # ══════════════════════════════════════════════════════════
            # SALES — based on Rank A stages within FY (by stage's last_update)
            # ══════════════════════════════════════════════════════════
            unique_opp_ids = list(set(
                Opportunity_Stage.objects.filter(
                    ranks='Rank A',
                    add_opportunity__user=emp,
                    last_update__gte=fy_start,
                    last_update__lte=fy_to_now,
                ).values_list('add_opportunity_id', flat=True)
            ))

            actual_sales_sum = float(
                Opportunity.objects.filter(id__in=unique_opp_ids)
                .aggregate(total=Sum('total_amount'))['total'] or 0
            )

            # ══════════════════════════════════════════════════════════
            # LEADS — also by stage's last_update
            # ══════════════════════════════════════════════════════════
            # Total leads — count leads with ANY stage in FY
            from .models import Lead_Stage  # ensure import is available

            # Total leads assigned in FY (via lead's own date)
            total_leads_count = Lead.objects.filter(
                assign_to=emp,
                last_update__gte=fy_start,
                last_update__lte=fy_to_now,
            ).count()
            
            # Converted leads — leads that reached Rank A within FY
            converted_lead_ids = list(set(
                Lead_Stage.objects.filter(
                    ranks='Rank A',
                    add_lead__assign_to=emp,
                    # NOTE: Lead_Stage doesn't have last_update in your model
                    # If you need stage-based date, you'll need to add it
                    # For now, use lead's own last_update
                    add_lead__last_update__gte=fy_start,
                    add_lead__last_update__lte=fy_to_now,
                ).values_list('add_lead_id', flat=True)
            ))
            converted_leads_count = len(converted_lead_ids)

            # Calculate rates
            sales_success_rate = (actual_sales_sum / target_val * 100) if target_val > 0 else 0
            funnel_conv_rate   = (converted_leads_count / total_leads_count * 100) if total_leads_count > 0 else 0

            report_data.append({
                'user_id':            emp.id,
                'username':           emp.username,
                'full_name':          f"{emp.first_name} {emp.last_name}".strip() or emp.username,
                'target':             target_val,
                'actual_sales':       actual_sales_sum,
                'sales_success_rate': round(sales_success_rate, 2),
                'total_leads':        total_leads_count,
                'converted_leads':    converted_leads_count,
                'funnel_conv_rate':   round(funnel_conv_rate, 2),
                'fy_year':            year,
                'fy_label':           f"FY {year}–{str(year + 1)[2:]}",
            })

        serializer = PerformanceAttainmentReportSerializer(report_data, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='save-quota')
    def save_quota(self, request):
        # Expects: { "user_id": 1, "target_amount": 3000000, "year": 2024 }
        user_id = request.data.get('user_id')
        amount = request.data.get('target_amount')
        year = request.data.get('year', 2024)

        if not user_id or amount is None:
            return Response({'error': 'User ID and Target Amount are required.'}, status=400)

        # Update if target exists for that year, else create
        target, created = PerformanceTarget.objects.update_or_create(
            user_id=user_id,
            fiscal_year=year,
            defaults={'sales_target': amount}
        )

        return Response({
            'message': 'Quota updated' if not created else 'Quota created',
            'user': target.user.username,
            'amount': float(target.sales_target)
        }, status=status.HTTP_200_OK)


class ChatbotAskView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    @staticmethod
    def _clean_text(value, default="Not set"):
        if value is None:
            return default
        text = str(value).strip()
        return text or default

    @staticmethod
    def _format_currency(value):
        amount = float(value or 0)
        if amount.is_integer():
            return f"INR {amount:,.0f}"
        return f"INR {amount:,.2f}"

    @staticmethod
    def _format_date(value):
        if not value:
            return "Not set"
        if hasattr(value, "strftime"):
            return value.strftime("%Y-%m-%d")
        return str(value)

    @staticmethod
    def _status_breakdown(queryset, field_name="status"):
        breakdown = []
        for row in (
            queryset.values(field_name)
            .annotate(count=Count("id"))
            .order_by("-count", field_name)
        ):
            breakdown.append(
                {
                    "label": ChatbotAskView._clean_text(row.get(field_name), "Unspecified"),
                    "count": row["count"],
                }
            )
        return breakdown

    @staticmethod
    def _latest_stage_map(opportunity_ids):
        if not opportunity_ids:
            return {}

        latest_stage_by_opportunity = {}
        stage_rows = (
            Opportunity_Stage.objects.filter(add_opportunity_id__in=opportunity_ids)
            .order_by("add_opportunity_id", "-last_update", "-id")
            .values("add_opportunity_id", "stages", "ranks", "lost_reason", "last_update")
        )

        for row in stage_rows:
            latest_stage_by_opportunity.setdefault(row["add_opportunity_id"], row)

        return latest_stage_by_opportunity

    @classmethod
    def _serialize_opportunity(cls, opportunity, latest_stage_map):
        latest_stage = latest_stage_map.get(opportunity.id, {})
        return {
            "id": opportunity.id,
            "opportunity": cls._clean_text(opportunity.opportunity),
            "account_name": cls._clean_text(opportunity.account_name),
            "status": cls._clean_text(opportunity.status),
            "stage": cls._clean_text(latest_stage.get("stages")),
            "rank": cls._clean_text(latest_stage.get("ranks")),
            "lost_reason": cls._clean_text(latest_stage.get("lost_reason")),
            "description": cls._clean_text(opportunity.description),
            "total_amount": float(opportunity.total_amount or 0),
            "exp_closure_date": cls._format_date(opportunity.exp_closure_date),
            "last_update": cls._format_date(opportunity.last_update),
        }

    @classmethod
    def _task_line(cls, task):
        return (
            f"{cls._clean_text(task['task'])} | {cls._clean_text(task['status'])} | "
            f"priority {cls._clean_text(task['priority'])} | "
            f"due {cls._format_date(task['end_date'])}"
        )

    @classmethod
    def _opportunity_line(cls, item):
        line = (
            f"{cls._clean_text(item['opportunity'])} | account {cls._clean_text(item['account_name'])} | "
            f"status {cls._clean_text(item['status'])} | stage {cls._clean_text(item['stage'])} | "
            f"rank {cls._clean_text(item['rank'])} | value {cls._format_currency(item['total_amount'])} | "
            f"closure {cls._format_date(item['exp_closure_date'])}"
        )
        if item.get("description") and item["description"] != "Not set":
            line = f"{line} | description {item['description']}"
        return line

    @classmethod
    def _lead_line(cls, lead):
        return (
            f"{cls._clean_text(lead['lead'])} | account {cls._clean_text(lead['account_name'])} | "
            f"status {cls._clean_text(lead['status'])} | owner {cls._clean_text(lead['owner'])} | "
            f"value {cls._format_currency(lead['total_amount'])}"
        )

    @classmethod
    def _budget_line(cls, budget):
        period_bits = [cls._clean_text(budget["period"])]
        if budget.get("selected_month") and budget["selected_month"] != "Not set":
            period_bits.append(budget["selected_month"])
        return (
            f"{cls._clean_text(budget['title'])} | {' / '.join(period_bits)} | "
            f"target {cls._format_currency(budget['revenue_target'])} | "
            f"deals {budget['target_deal_count']}"
        )

    @staticmethod
    def _conversation_text(message, history):
        recent_user_messages = []
        for item in history[-8:]:
            if isinstance(item, dict) and item.get("role") == "user":
                content = item.get("content")
                if isinstance(content, str) and content.strip():
                    recent_user_messages.append(content.strip())

        recent_user_messages.append(message)
        return " ".join(recent_user_messages[-4:]).lower()

    @staticmethod
    def _detect_subject(text):
        if any(keyword in text for keyword in ("opportunit", "pipeline", "deal", "stage", "rank", "closure")):
            return "opportunity"
        if any(keyword in text for keyword in ("task", "todo", "priority", "priorit", "pending", "completed", "overdue")):
            return "task"
        if any(keyword in text for keyword in ("lead", "prospect", "conversion")):
            return "lead"
        if any(keyword in text for keyword in ("budget", "revenue", "target", "spend")):
            return "budget"
        return None

    @staticmethod
    def _format_breakdown(items):
        if not items:
            return "No recorded statuses yet."
        return ", ".join(f"{item['label']}: {item['count']}" for item in items)

    @classmethod
    def _build_summary(cls, user):
        from .models import AddTaskData, Budget, Lead_Stage

        today = date.today()

        if getattr(user, 'role', None) == 'admin':
            leads_qs = Lead.objects.select_related("assign_to").all()
            opp_qs = Opportunity.objects.all()
            task_qs = AddTaskData.objects.select_related("assignedto").all()
            budgets_qs = Budget.objects.all()
        else:
            leads_qs = Lead.objects.select_related("assign_to").filter(assign_to=user)
            opp_qs = Opportunity.objects.filter(user=user)
            task_qs = AddTaskData.objects.select_related("assignedto").filter(assignedto=user)
            budgets_qs = Budget.objects.filter(user=user)

        converted_lead_ids = list(
            Lead_Stage.objects.filter(
                add_lead__in=leads_qs,
                ranks="Rank A",
            )
            .values_list("add_lead_id", flat=True)
            .distinct()
        )
        won_opportunity_ids = list(
            Opportunity_Stage.objects.filter(
                add_opportunity__in=opp_qs,
                ranks="Rank A",
            )
            .values_list("add_opportunity_id", flat=True)
            .distinct()
        )

        pipeline_total = opp_qs.aggregate(total=Sum('total_amount'))['total'] or 0
        budget_total = budgets_qs.aggregate(total=Sum('revenue_target'))['total'] or 0

        recent_opportunity_objects = list(opp_qs.order_by("-last_update", "-id")[:8])
        recent_opportunity_ids = [opportunity.id for opportunity in recent_opportunity_objects]
        latest_stage_map = cls._latest_stage_map(recent_opportunity_ids)
        recent_opportunities = [
            cls._serialize_opportunity(opportunity, latest_stage_map)
            for opportunity in recent_opportunity_objects
        ]

        recent_tasks = [
            {
                "task": cls._clean_text(task.task),
                "description": cls._clean_text(task.description),
                "status": cls._clean_text(task.status),
                "priority": cls._clean_text(task.priority),
                "start_date": cls._format_date(task.start_date),
                "end_date": cls._format_date(task.end_date),
                "assigned_to": cls._clean_text(getattr(task.assignedto, "username", None)),
                "assigned_by": cls._clean_text(task.assigned_by),
            }
            for task in task_qs.order_by("end_date", "-id")[:8]
        ]
        pending_tasks = [
            {
                "task": cls._clean_text(task.task),
                "description": cls._clean_text(task.description),
                "status": cls._clean_text(task.status),
                "priority": cls._clean_text(task.priority),
                "start_date": cls._format_date(task.start_date),
                "end_date": cls._format_date(task.end_date),
            }
            for task in task_qs.exclude(status__iexact="Completed").order_by("end_date", "-id")[:5]
        ]
        today_tasks = [
            {
                "task": cls._clean_text(task.task),
                "description": cls._clean_text(task.description),
                "status": cls._clean_text(task.status),
                "priority": cls._clean_text(task.priority),
                "start_date": cls._format_date(task.start_date),
                "end_date": cls._format_date(task.end_date),
            }
            for task in task_qs.filter(Q(start_date=today) | Q(end_date=today)).order_by("end_date", "-id")[:5]
        ]
        recent_leads = [
            {
                "lead": cls._clean_text(lead.lead),
                "account_name": cls._clean_text(lead.account_name),
                "status": cls._clean_text(lead.status),
                "owner": cls._clean_text(getattr(lead.assign_to, "username", None)),
                "description": cls._clean_text(lead.description),
                "total_amount": float(lead.total_amount or 0),
                "last_update": cls._format_date(lead.last_update),
            }
            for lead in leads_qs.order_by("-last_update", "-id")[:8]
        ]
        recent_budgets = [
            {
                "title": cls._clean_text(budget.title),
                "period": cls._clean_text(budget.period),
                "selected_month": cls._clean_text(budget.selected_month),
                "revenue_target": float(budget.revenue_target or 0),
                "target_deal_count": budget.target_deal_count or 0,
                "currency": cls._clean_text(budget.currency),
            }
            for budget in budgets_qs.order_by("-updated_at", "-id")[:5]
        ]

        return {
            "total_leads": leads_qs.count(),
            "won_leads": len(converted_lead_ids),
            "total_opportunities": opp_qs.count(),
            "won_opportunities": len(won_opportunity_ids),
            "pipeline_total": float(pipeline_total),
            "total_tasks": task_qs.count(),
            "completed_tasks": task_qs.filter(status__iexact="Completed").count(),
            "pending_tasks_count": task_qs.exclude(status__iexact="Completed").count(),
            "today_tasks_count": task_qs.filter(Q(start_date=today) | Q(end_date=today)).count(),
            "total_budgets": budgets_qs.count(),
            "budget_total": float(budget_total),
            "task_status_breakdown": cls._status_breakdown(task_qs),
            "lead_status_breakdown": cls._status_breakdown(leads_qs),
            "opportunity_status_breakdown": cls._status_breakdown(opp_qs),
            "latest_tasks": recent_tasks,
            "pending_tasks": pending_tasks,
            "today_tasks": today_tasks,
            "latest_leads": recent_leads,
            "latest_opportunities": recent_opportunities,
            "latest_budgets": recent_budgets,
        }

    @staticmethod
    def _fallback_reply(message: str, summary: dict) -> str:
        text = (message or '').lower()
        if 'task' in text:
            return (
                f"Tasks overview: {summary['completed_tasks']} completed out of "
                f"{summary['total_tasks']} total tasks, with {summary['pending_tasks_count']} still open."
            )
        if 'lead' in text:
            conversion = 0 if summary['total_leads'] == 0 else round((summary['won_leads'] / summary['total_leads']) * 100, 2)
            return (
                f"Leads overview: {summary['won_leads']} converted out of {summary['total_leads']} "
                f"total leads (conversion {conversion}%)."
            )
        if 'budget' in text:
            return (
                f"Budget overview: {summary['total_budgets']} budgets with total planned amount "
                f"INR {summary['budget_total']:,.0f}."
            )
        if 'opportunit' in text or 'pipeline' in text:
            return (
                f"Opportunity overview: {summary['total_opportunities']} opportunities with "
                f"pipeline value INR {summary['pipeline_total']:,.0f}."
            )
        if 'hello' in text or 'hi' in text:
            return "Hello! Ask me anything about leads, tasks, opportunities, budgets, or general business questions."
        return (
            "I can answer CRM and general business questions. "
            "Try: 'show lead conversion', 'what are my latest tasks', or ask any work-related question."
        )

    @classmethod
    def _direct_crm_reply(cls, message, history, summary):
        text = cls._conversation_text(message, history)
        subject = cls._detect_subject(text)

        if subject == "task":
            if "today" in text or "priorit" in text:
                tasks = summary["today_tasks"] or summary["pending_tasks"]
                if not tasks:
                    return "I could not find any tasks scheduled for today in the CRM."
                lines = [
                    f"{task['task']} | {task['status']} | priority {task['priority']} | due {task['end_date']}"
                    for task in tasks[:5]
                ]
                return "Today's task priorities from CRM:\n" + "\n".join(
                    f"{index + 1}. {line}" for index, line in enumerate(lines)
                )

            if "pending" in text or "open" in text or "status" in text:
                tasks = summary["pending_tasks"]
                if not tasks:
                    if summary["latest_tasks"]:
                        return (
                            f"All current tasks are completed. Open tasks: {summary['pending_tasks_count']} out of {summary['total_tasks']} total tasks.\n"
                            "Recent task history:\n"
                            + "\n".join(
                                f"{index + 1}. {cls._task_line(task)}"
                                for index, task in enumerate(summary["latest_tasks"][:5])
                            )
                        )
                    return "I could not find any pending tasks in the CRM."
                return (
                    f"Pending task snapshot: {summary['pending_tasks_count']} open out of {summary['total_tasks']} total tasks.\n"
                    + "\n".join(
                        f"{index + 1}. {cls._task_line(task)}"
                        for index, task in enumerate(tasks[:5])
                    )
                )

            if summary["latest_tasks"]:
                return "Latest tasks from CRM:\n" + "\n".join(
                    f"{index + 1}. {cls._task_line(task)}"
                    for index, task in enumerate(summary["latest_tasks"][:5])
                )

        if subject == "opportunity":
            opportunities = summary["latest_opportunities"]
            if not opportunities:
                return "I could not find any opportunities in the CRM right now."

            matched = [
                item for item in opportunities
                if any(
                    candidate != "Not set" and candidate.lower() in text
                    for candidate in (item["opportunity"], item["account_name"])
                )
            ]
            if len(matched) == 1:
                item = matched[0]
                reply = (
                    f"Current opportunity status from CRM: {item['opportunity']} for {item['account_name']} is "
                    f"{item['status']}, stage {item['stage']}, rank {item['rank']}, "
                    f"value {cls._format_currency(item['total_amount'])}, expected closure {item['exp_closure_date']}."
                )
                if item.get("description") and item["description"] != "Not set":
                    reply += f" Description: {item['description']}."
                return reply

            return (
                f"Opportunity status snapshot: {cls._format_breakdown(summary['opportunity_status_breakdown'])}\n"
                + "\n".join(
                    f"{index + 1}. {cls._opportunity_line(item)}"
                    for index, item in enumerate(opportunities[:5])
                )
            )

        if subject == "lead":
            conversion = 0 if summary["total_leads"] == 0 else round((summary["won_leads"] / summary["total_leads"]) * 100, 2)
            leads = summary["latest_leads"]
            if "conversion" in text:
                response = (
                    f"Lead conversion from CRM: {summary['won_leads']} converted leads out of {summary['total_leads']} "
                    f"total leads ({conversion}%)."
                )
                if leads:
                    response += "\nLatest lead statuses:\n" + "\n".join(
                        f"{index + 1}. {cls._lead_line(lead)}"
                        for index, lead in enumerate(leads[:5])
                    )
                return response

            if leads:
                return (
                    f"Lead status snapshot: {cls._format_breakdown(summary['lead_status_breakdown'])}\n"
                    + "\n".join(
                        f"{index + 1}. {cls._lead_line(lead)}"
                        for index, lead in enumerate(leads[:5])
                    )
                )
            return "I could not find any leads in the CRM right now."

        if subject == "budget":
            budgets = summary["latest_budgets"]
            response = (
                f"Budget overview from CRM: {summary['total_budgets']} budgets, total planned amount "
                f"{cls._format_currency(summary['budget_total'])}."
            )
            if budgets:
                response += "\nLatest budgets:\n" + "\n".join(
                    f"{index + 1}. {cls._budget_line(budget)}"
                    for index, budget in enumerate(budgets[:5])
                )
            return response

        return None

    @classmethod
    def _context_block(cls, summary):
        return (
            f"CRM summary: total_leads={summary['total_leads']}, converted_leads={summary['won_leads']}, "
            f"total_opportunities={summary['total_opportunities']}, won_opportunities={summary['won_opportunities']}, "
            f"pipeline_total={summary['pipeline_total']}, total_tasks={summary['total_tasks']}, "
            f"completed_tasks={summary['completed_tasks']}, pending_tasks_count={summary['pending_tasks_count']}, "
            f"today_tasks_count={summary['today_tasks_count']}, total_budgets={summary['total_budgets']}, "
            f"budget_total={summary['budget_total']}. "
            f"Opportunity status breakdown={summary['opportunity_status_breakdown']}. "
            f"Lead status breakdown={summary['lead_status_breakdown']}. "
            f"Task status breakdown={summary['task_status_breakdown']}. "
            f"Latest opportunities={summary['latest_opportunities']}. "
            f"Latest leads={summary['latest_leads']}. "
            f"Latest tasks={summary['latest_tasks']}. "
            f"Latest budgets={summary['latest_budgets']}."
        )

    def post(self, request):
        message = (request.data.get('message') or '').strip()
        history = request.data.get('history') or []
        if not isinstance(history, list):
            history = []

        if not message:
            return Response({"reply": "Please type a message."}, status=status.HTTP_400_BAD_REQUEST)

        summary = self._build_summary(request.user)
        direct_reply = self._direct_crm_reply(message, history, summary)
        if direct_reply:
            return Response({"reply": direct_reply, "meta": {"summary": summary}})

        groq_key = getattr(settings, 'GROQ_API_KEY', None)

        if not groq_key:
            return Response({"reply": self._fallback_reply(message, summary)})

        try:
            from groq import Groq

            system_prompt = (
                "You are SalesPie assistant. Answer all user questions clearly and helpfully. "
                "Use CRM context for CRM questions (leads, tasks, opportunities, budgets). "
                "For general questions, provide best-effort useful answers. "
                "Do not invent exact CRM figures beyond the provided context. "
                "If CRM data is missing for a user request, say that clearly."
            )

            context_block = self._context_block(summary)

            prepared_messages = [{"role": "system", "content": system_prompt}]
            for h in history[-20:]:
                role = h.get('role') if isinstance(h, dict) else None
                content = h.get('content') if isinstance(h, dict) else None
                if role in ('user', 'assistant') and isinstance(content, str) and content.strip():
                    prepared_messages.append({"role": role, "content": content.strip()})
            prepared_messages.append({"role": "user", "content": f"{context_block}\n\nUser message: {message}"})

            client = Groq(api_key=groq_key)
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=prepared_messages,
                max_tokens=650,
                temperature=0.35,
            )
            reply = (completion.choices[0].message.content or '').strip()
            if not reply:
                reply = self._fallback_reply(message, summary)

            return Response({
                "reply": reply,
                "meta": {"summary": summary}
            })
        except Exception:
            return Response({"reply": self._fallback_reply(message, summary)})
