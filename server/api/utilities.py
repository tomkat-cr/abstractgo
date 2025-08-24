import os
from uuid import uuid4

SERVER_DEBUG = os.environ.get("SERVER_DEBUG", "0") == "1"


def remove_temp_file(file_path: str) -> None:
    """ Remove the temp file """
    os.remove(file_path)


def get_mime_type(filename: str) -> str:
    """ Get the mime type of the file """
    file_extension = os.path.splitext(filename)[1]
    if file_extension == '.pdf':
        return 'application/pdf'
    elif file_extension == '.txt':
        return 'text/plain'
    elif file_extension == '.docx':
        return ('application/vnd.openxmlformats-officedocument.'
                'wordprocessingml.document')
    elif file_extension == '.doc':
        return 'application/msword'
    elif file_extension == '.rtf':
        return 'text/rtf'
    elif file_extension == '.csv':
        return 'text/csv'
    else:
        return 'application/octet-stream'


def get_file_content(file_path: str) -> bytes:
    """ Get the content of the file """
    with open(file_path, 'rb') as f:
        return f.read()


def get_temp_random_file_path(file_name: str) -> str:
    """ Get the temp random file path """
    return os.path.join(
        '/tmp',
        f"{os.urandom(8).hex()}{'.'+get_file_extension(file_name)}")


def get_non_empty_value(env_var_name: str, default_value: str = None) -> str:
    """ Get the non empty value from the environment variable """
    resolved_value = os.environ.get(env_var_name)
    if resolved_value is None or resolved_value == "":
        resolved_value = default_value
    return resolved_value


def get_file_extension(file_path: str) -> str:
    """ Get the file extension """
    return os.path.splitext(file_path)[1].lstrip('.')


def get_file_name(filename: str) -> str:
    """ Get the file name """
    return os.path.basename(filename)


def get_file_id(filename: str) -> str:
    """ Get the file id """
    return get_uuid() + "." + get_file_extension(filename)


def get_uuid() -> str:
    """ Get the uuid """
    return str(uuid4())
