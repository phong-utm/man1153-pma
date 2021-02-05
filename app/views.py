import json
import joblib
from django.http import JsonResponse
from django.shortcuts import render

bladder_model = joblib.load('data/bladder_model.joblib')
nephritis_model = joblib.load('data/nephritis_model.joblib')
temperature_scaler = joblib.load('data/temperature_scaler.joblib')

def home(request):
    return render(request, 'home.html')

def predict(request):
    global bladder_model, nephritis_model

    input = parse_input(request.body)
    print(input)

    # predict if user suffers from the 2 diseases
    bladder_inflammation = int(bladder_model.predict([input])[0])
    nephritis = int(nephritis_model.predict([input])[0])

    # return data to client in JSON format
    return JsonResponse({
        'bladder_inflammation': bladder_inflammation,
        'nephritis': nephritis
    })

# parse data submitted by user
def parse_input(json_text):
    global temperature_scaler

    # parse JSON data
    data = json.loads(json_text)

    # get feature values
    nausea = data['nausea']
    lumbar_pain = data['lumbar_pain']
    urine_pushing = data['urine_pushing']
    micturition_pains = data['micturition_pains']
    urethra_burning = data['urethra_burning']

    # standardize the temperature value
    temperature = temperature_scaler.transform([[data['temperature']]])[0][0]

    return [temperature, nausea, lumbar_pain, urine_pushing, micturition_pains, urethra_burning]
