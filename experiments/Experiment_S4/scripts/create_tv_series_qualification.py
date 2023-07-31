import boto3
import sys

aws_access_key_id = 'AKIAIBROCQSV6UZY53OA'
aws_secret_access_key = '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'

# set mode to either sandbox or 'live'
mode = sys.argv[1]

if mode == 'sandbox':
    endpoint_url = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com'
else:
    endpoint_url = 'https://mturk-requester.us-east-1.amazonaws.com'

client_kwargs = {
    'endpoint_url': endpoint_url
}

session_kwargs = {
    'region_name': 'us-east-1',
}

session_kwargs['aws_access_key_id'] = aws_access_key_id
session_kwargs['aws_secret_access_key'] = aws_secret_access_key
session = boto3.session.Session(**session_kwargs)
client = session.client('mturk', **client_kwargs)

questions = open('../qualifications/Test2.xml', mode='r').read()
answers = open('../qualifications/AnswerKey2.xml', mode='r').read()

response = client.create_qualification_type(
    Name='tv series qualification',
    Keywords='tv, series',
    Description='This is a test to see how well you remember various TV series',
    QualificationTypeStatus='Active',
    Test=questions,
    AnswerKey=answers,
    TestDurationInSeconds=180
)

with open('../qualifications/tv-series-qualification.txt', 'w') as f:
    print('Name: {}'.format(response['QualificationType']['Name']), file=f)
    print('Description: {}'.format(response['QualificationType']['Description']), file=f)
    print('QualificationTypeId: {}'.format(response['QualificationType']['QualificationTypeId']), file=f)
f.close()

print('Qualification Created at endpoint {}. Your Qualification Type ID is: {}'.format(endpoint_url, response['QualificationType']['QualificationTypeId']))
