import os, json
from flask import Flask
from watson_developer_cloud import AuthorizationV1 as Authorization
from watson_developer_cloud import SpeechToTextV1 as SpeechToText
from watson_developer_cloud import TextToSpeechV1 as TextToSpeech
from dotenv import load_dotenv

# Set the username and password below or in a .env file for local development
load_dotenv('.env')

# Text to Speech
TTS_USERNAME = os.environ.get('TTS_USERNAME'); # '<Text to Speech username>'
TTS_PASSWORD = os.environ.get('TTS_PASSWORD'); # '<Text to Speech password'

# Speech to Text
STT_USERNAME = os.environ.get('STT_USERNAME'); # '<Speech to Text username>'
STT_PASSWORD = os.environ.get('STT_PASSWORD'); # '<Speech to Text password>'

# on bluemix, automatically pull credentials from environment
if 'VCAP_SERVICES' in os.environ:
	stt = json.loads(os.environ['VCAP_SERVICES'])['speech_to_text'][0]
	STT_USERNAME = stt["credentials"]["username"]
	STT_PASSWORD = stt["credentials"]["password"]
	tts = json.loads(os.environ['VCAP_SERVICES'])['text_to_speech'][0]
	TTS_USERNAME = tts["credentials"]["username"]
	TTS_PASSWORD = tts["credentials"]["password"]

app = Flask(__name__, static_url_path='')

@app.route('/')
def root():
  return app.send_static_file('index.html')

@app.route('/api/speech-to-text/token')
def getSttToken():
	print(STT_USERNAME)
	authorization = Authorization(username=STT_USERNAME, password=STT_PASSWORD)
	return authorization.get_token(url=SpeechToText.default_url)

@app.route('/api/text-to-speech/token')
def getTtsToken():
	authorization = Authorization(username=TTS_USERNAME, password=TTS_PASSWORD)
	return authorization.get_token(url=TextToSpeech.default_url)

app.run(debug=True)
