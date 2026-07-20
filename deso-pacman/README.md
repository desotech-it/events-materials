# DESO PACMAN - CodeMotion 2023 @Milano

Pac-Man the classic arcade game - deployment files for any Kubernetes distributions.

<img src="https://veducate.co.uk/wp-content/uploads/2021/09/Pac-Man-UI.jpg" width=45% height=45%>

## Pre-Reqs

ServiceType: LoadBalancer must be available for external connectivity to the Pac-Man front-end, otherwise you'll need to make some changes to the files in the "services" folder.

## Deployment

### Using a Script for installation
Clone repo and run ```chmod +X pacman-install.sh``` and then run file ```./pacman-install.sh```

or the following steps:

    kubectl create namespace pacman
    kubectl create -n pacman -f pacman/

#### Uninstall using a Script
Run file `./pacman-uninstall.sh`. This will delete all objects created by `./pacman-install.sh`
