Some secrets need to be created to run the app in development mode. Run
the commands below (adding values to the keys)

kubectl create secret generic jwt-secret --from-literal=JWT_KEY=
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=
kubectl create secret generic mongo-secret --from-literal=