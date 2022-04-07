# Secrets

Some secrets need to be created to run the app. Add the com

## Development secrets
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=*your_jwt_key*

kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=*your_stripe_secret*

## Production secrets
kubectl create secret generic mongo-secret --from-literal=*your_mongo_uri*

<span style="color:red">Your mongo url should <strong>NOT</strong> contain the database name. A database name will already be assigned to each microservice.</span>