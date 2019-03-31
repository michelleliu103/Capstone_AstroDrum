# w210-capstone-astrodrum

## Concept

Incorporate a backend machine learning concept using GANs to generate a potentially unlimited supply of drum sounds which will can be utilized in a user friendly interface for music generation and beat mixing.

### Process

![alt text](frontend/images/overall_process.jpg)

The overall process flow:
* Obtain input training audio data (kick drum, snare drum, etc..) sounds.
* Manually (batch) process audio data for consistent bitrate and frequency (16bit, 41000MHz)
* Import training data to training cluster (acquired AWS GPU's)
* Train generative models using WaveGAN
* Use generative model to generate new audio files
* Apply low pass filter to clean up audio signal
* Apply moving average filter to clean up audio signal
* Use the generated sound in application

### Training Details


### Repo Structure

#### Basics
Introduction/Prototype code to capture the basics of wave file processing in Python.

#### Frontend
Code for our website, which includes our user interface for beat generation.

#### Code
Additional code artificats for generating our synthetic sound files from our trained GAN models.  Key file here is SoundGenerator.ipynb

#### Wavegan
Wavegan research repository  and content (references within) which we utilized and experimented with in our GAN model learning and generation of synthetic audio files

