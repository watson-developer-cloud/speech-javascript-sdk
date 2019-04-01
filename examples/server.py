import os, json
from flask import Flask
from watson_developer_cloud import AuthorizationV1 as Authorization
from watson_developer_cloud import IAMTokenManager
from watson_developer_cloud import SpeechToTextV1 as SpeechToText
from watson_developer_cloud import TextToSpeechV1 as TextToSpeech
from dotenv import load_dotenv

# Set the username and password below or in a .env file for local development
load_dotenv('.env')

# Text to Speech
TTS_USERNAME = os.environ.get('TEXT_TO_SPEECH_USERNAME') 	# '<Text to Speech username>'
TTS_PASSWORD = os.environ.get('TEXT_TO_SPEECH_PASSWORD') 	# '<Text to Speech password'
TTS_APIKEY = os.environ.get('TEXT_TO_SPEECH_IAM_APIKEY') 	# '<Text to Speech IAM API key'
TTS_URL = os.environ.get('TEXT_TO_SPEECH_URL')	 			# '<Text to Speech URL>'

# Speech to Text
STT_USERNAME = os.environ.get('SPEECH_TO_TEXT_USERNAME') 	# '<Speech to Text username>'
STT_PASSWORD = os.environ.get('SPEECH_TO_TEXT_PASSWORD') 	# '<Speech to Text password>'
STT_APIKEY = os.environ.get('SPEECH_TO_TEXT_IAM_APIKEY') 	# '<Speech to Text IAM API key>'
STT_URL = os.environ.get('SPEECH_TO_TEXT_URL')	 			# '<Speech to Text URL>'

# on bluemix, automatically pull credentials from environment
if 'VCAP_SERVICES' in os.environ:
	stt = json.loads(os.environ['VCAP_SERVICES'])['speech_to_text'][0]
	STT_USERNAME = stt["credentials"]["username"]
	STT_PASSWORD = stt["credentials"]["password"]
	STT_APIKEY = stt["credentials"]["apikey"]
	STT_URL = stt["credentials"]["url"] if stt["credentials"]["url"] else SpeechToText.default_url
	tts = json.loads(os.environ['VCAP_SERVICES'])['text_to_speech'][0]
	TTS_USERNAME = tts["credentials"]["username"]
	TTS_PASSWORD = tts["credentials"]["password"]
	TTS_APIKEY = tts["credentials"]["apikey"]
	TTS_URL = tts["credentials"]["url"] if tts["credentials"]["url"] else TextToSpeech.default_url

app = Flask(__name__, static_url_path='')

@app.route('/')
def root():
  return app.send_static_file('index.html')

@app.route('/api/speech-to-text/token')
def getSttToken():
	if (STT_APIKEY):
		iamTokenManager = IAMTokenManager(iam_apikey=STT_APIKEY)
		token = iamTokenManager.get_token()
	else:
		authorization = Authorization(username=STT_USERNAME, password=STT_PASSWORD)
		token = authorization.get_token(url=STT_URL)
	return token

@app.route('/api/text-to-speech/token')
def getTtsToken():
	if (TTS_APIKEY):
		iamTokenManager = IAMTokenManager(iam_apikey=TTS_APIKEY)
		token = iamTokenManager.get_token()
	else:
		authorization = Authorization(username=TTS_USERNAME, password=TTS_PASSWORD)
		token = authorization.get_token(url=TTS_URL)
	return token

# NOTE: ssl_context='adhoc' fixes response encoding (Flask 400 BAD_REQUEST) errors over SSL
if __name__ == '__main__':
    app.run(ssl_context='adhoc', debug=True)