from rest_framework.response import Response

class ResponseBase(dict):
    def __init__(self, state, message, data, status):
        self.state = state
        self.message = message
        self.data = data
        self.status = status

    def response(self):
        return Response({
            "state": self.state,
            "message": self.message,
            "data": self.data
        }, status=self.status)