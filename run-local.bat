docker build -t eventine -f Dockerfile-Dev .
kubectl apply -f .\kubernetes\development\db-volume.yaml
kubectl apply -f .\kubernetes\development\db-volume-claim.yaml
kubectl apply -f .\kubernetes\development\db-controller.yaml
kubectl apply -f .\kubernetes\development\db-service.yaml
timeout 60
kubectl apply -f .\kubernetes\development\web-controller.yaml
kubectl apply -f .\kubernetes\development\web-service.yaml
minikube service web