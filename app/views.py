import json
import joblib
import pandas as pd
from django.http import JsonResponse
from django.shortcuts import render

bladder_model = joblib.load('data/bladder_model.joblib') # for bladder inflammation prediction
nephritis_model = joblib.load('data/nephritis_model.joblib') # for nephritis prediction
temperature_scaler = joblib.load('data/temperature_scaler.joblib') # for temperature standardization

def home(request):
    return render(request, 'home.html')

def predict(request):
    global bladder_model, nephritis_model

    input = __parse_input(request.body)

    # predict if user suffers from the 2 diseases
    bladder_inflammation = int(bladder_model.predict([input])[0])
    nephritis = int(nephritis_model.predict([input])[0])

    # return data to client in JSON format
    return JsonResponse({
        'bladder_inflammation': bladder_inflammation,
        'nephritis': nephritis
    })

# return JSON data for the stacked bar chart on Home page
def symptoms(request):
    df = __read_src_dataset() # UCI acute inflammation dataset
    symptoms = ['nausea', 'lumbar_pain', 'urine_pushing', 'micturition_pain', 'urethra_burning']

    # count patients: who have the symptom and who don't?
    symptom_counts = [df[s].value_counts().to_dict() for s in symptoms]

    # add symptom name to the dictionary containing the count values
    result = [dict({ "symptom": s }, **counts) for (s, counts) in zip(symptoms, symptom_counts)]
    
    return JsonResponse(result, safe=False)

##### PRIVATE UTILITY FUNCTIONS #####

# read UCI acute inflammation dataset
def __read_src_dataset():
    # convert the first column (temparature) e.g. from text "15,9" to number value (15.9)
    converters = {
        0: lambda x: float(x.replace(',', '.')) 
    }
    df = pd.read_table('data/diagnosis.data', encoding='utf-16', header=None, converters=converters)
    df.columns = ['temperature', 'nausea', 'lumbar_pain', 'urine_pushing', 'micturition_pain', 'urethra_burning', 'bladder_inflammation', 'nephritis']
    return df

# parse data submitted by user
def __parse_input(json_text):
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
