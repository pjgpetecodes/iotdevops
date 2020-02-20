# Devops in IoT Sample Project

Create a security.json file with the following contents;

{"connectionString": "<Connection String>"}

If running locally place security.json in the project directory.

If running through Docker on a Linux based system, then create a diretory

/mnt/security

Place security.json in that directory.

For Docker on Linux, build the image using;

```
docker build . -t iotdevops:1
```

Then run the image using;

```
docker run -v /mnt/security:/mnt/security iotdevops:1
```