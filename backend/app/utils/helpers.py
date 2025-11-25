from typing import Dict, Any

def format_error_response(message: str, details: Any = None) -> Dict[str, Any]:
    response = {"error": message}
    if details:
        response["details"] = details
    return response

def format_success_response(data: Any, message: str = None) -> Dict[str, Any]:
    response = {"data": data}
    if message:
        response["message"] = message
    return response
